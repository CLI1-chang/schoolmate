// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getStudent(res, mysql, context, complete){
        mysql.pool.query("SELECT student_id AS id, CONCAT(first_name,' ',last_name) AS name FROM Students", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.student  = results;
            complete();
        });
    }

    function getClass(res, mysql, context, complete){
        mysql.pool.query("SELECT class_id AS id, class_name AS name FROM Classes", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class  = results;
            complete();
        });
    }

    function getEnrolls(res, mysql, context, complete){
        mysql.pool.query("SELECT cs.student_id AS sid, CONCAT(s.first_name,' ',s.last_name) AS student_name, cs.class_id AS cid, c.class_name FROM Class_Students AS cs INNER JOIN Students AS s ON cs.student_id = s.student_id INNER JOIN Classes AS c ON cs.class_id = c.class_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.classstudents = results;
            complete();
        });
    }


    /*Display all enrollments */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getStudent(res, mysql, context, complete);
        getClass(res, mysql, context, complete);
        getEnrolls(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 3){
                res.render('classstudents', context);
            }

        }
    });


    /* Adds an enrollment, redirects to the students page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Class_Students (student_id, class_id) VALUES (?,?)";
        var inserts = [req.body.student_id, req.body.class_id];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/classstudents');
            }
        });
    });



    /* Route to delete an enrollment */

    router.delete('/sid/:sid/cid/:cid', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Class_Students WHERE student_id = ? AND class_id = ?";
        var inserts = [req.params.sid, req.params.cid];
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
    