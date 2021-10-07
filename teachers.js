// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getTeachers(res, mysql, context, complete){
        mysql.pool.query("SELECT teacher_id AS id, first_name, last_name, office_id FROM Teachers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teachers = results;
            complete();
        });
    }

    function getOffice(res, mysql, context, complete){
        mysql.pool.query("SELECT office_id AS id FROM Offices", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.office  = results;
            complete();
        });
    }

    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT teacher_id AS id, first_name, last_name, office_id FROM Teachers WHERE teacher_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teacher = results[0];
            complete();
        });
    }


    /*Display all teachers Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getTeachers(res, mysql, context, complete);
        getOffice(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('teachers', context);
            }

        }
    });


    /* Adds a teacher, redirects to the teacher page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Teachers (first_name, last_name, office_id) VALUES (?,?,?)";
        var inserts = [req.body.first_name, req.body.last_name, req.body.office_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/teachers');
            }
        });
    });

    /* Display one teacher for updating the info */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["select.js","update.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        getOffice(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-teacher', context);
            }

        }
    });

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Teachers SET first_name=?, last_name=?, office_id=? WHERE teacher_id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.body.office_id, req.params.id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.status(200);
                res.end();
            }
        });
    });


    /* Route to delete a teacher */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Teachers WHERE teacher_id = ?";
        var inserts = [req.params.id];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(error)
                res.write(JSON.stringify(error));
                res.status(400);
                res.end();
            }else{
                res.status(202).end();
            }
        })
    })

    return router;
}();
    