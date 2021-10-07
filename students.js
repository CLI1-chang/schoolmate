// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStudents(res, mysql, context, complete){
        mysql.pool.query("SELECT student_id as id, first_name, last_name FROM Students", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.students = results;
            complete();
        });
    }


    function getPerson(res, mysql, context, id, complete){
        var sql = "SELECT student_id AS id, first_name, last_name FROM Students WHERE student_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.person = results[0];
            complete();
        });
    }


    /*Display all students Requires web based javascript to delete users with AJAX*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getStudents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('students', context);
            }

        }
    });

    /* Adds a student, redirects to the students page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Students (first_name, last_name) VALUES (?,?)";
        var inserts = [req.body.first_name, req.body.last_name];
        sql = mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/students');
            }
        });
    });    


    /* Display one student for updating the info */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js"];
        var mysql = req.app.get('mysql');
        getPerson(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-student', context);
            }

        }
    });

    /* The URI that update data is sent to in order to update a student */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Students SET first_name=?, last_name=? WHERE student_id=?";
        var inserts = [req.body.first_name, req.body.last_name, req.params.id];
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


    /* Route to delete a student */

    router.delete('/:id', function(req, res){
        console.log("DELETE Student");
        console.log(req.params.id);
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Students WHERE student_id = ?";
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
    