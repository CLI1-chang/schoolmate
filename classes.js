// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getClasses(res, mysql, context, complete){
        mysql.pool.query("SELECT c.class_id AS id, c.class_name, c.department, CONCAT(t.first_name,' ',t.last_name) AS teacher_name FROM Classes AS c INNER JOIN Teachers AS t ON c.teacher_id = t.teacher_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.classes = results;
            complete();
        });
    }

    function getTeacher(res, mysql, context, complete){
        mysql.pool.query("SELECT teacher_id as id, CONCAT(first_name,' ',last_name) AS teacher_name FROM Teachers", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.teacher  = results;
            complete();
        });
    }

    function getClass(res, mysql, context, id, complete){
        var sql = "SELECT class_id AS id, class_name, department, teacher_id FROM Classes WHERE class_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class = results[0];
            complete();
        });
    }


    /*Display all classes Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getClasses(res, mysql, context, complete);
        getTeacher(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('classes', context);
            }

        }
    });


    /* Adds a class, redirects to the class page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Classes (class_name, department, teacher_id) VALUES (?,?,?)";
        var inserts = [req.body.class_name, req.body.department, req.body.teacher_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/classes');
            }
        });
    });


    /* Display one class for updating the info */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["select.js", "update.js"];
        var mysql = req.app.get('mysql');
        getClass(res, mysql, context, req.params.id, complete);
        getTeacher(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-class', context);
            }

        }
    });


    /* The URI that update data is sent to in order to update a class */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Classes SET class_name=?, department=?, teacher_id=? WHERE class_id=?";
        var inserts = [req.body.class_name, req.body.department, req.body.teacher_id, req.params.id];
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



    /* Route to delete a person, simply returns a 202 upon success. Ajax will handle this. */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Classes WHERE class_id = ?";
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
    