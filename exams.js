// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getExams(res, mysql, context, complete){
        mysql.pool.query("SELECT e.exam_id AS id, e.exam_type, c.class_name, DATE_FORMAT(e.exam_date, '%m/%d/%Y') AS exam_date FROM Classes AS c INNER JOIN Exams AS e ON c.class_id = e.class_id", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.exams = results;
            complete();
        });
    }

    function getClass(res, mysql, context, complete){
        mysql.pool.query("SELECT class_id AS id, class_name FROM Classes", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.class  = results;
            complete();
        });
    }

    function getExam(res, mysql, context, id, complete){
        var sql = "SELECT exam_id AS id, exam_type, class_id, DATE_FORMAT(exam_date, '%m/%d/%Y') AS exam_date FROM Exams WHERE exam_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.exam = results[0];
            complete();
        });
    }


    /*Display all exams */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getExams(res, mysql, context, complete);
        getClass(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('exams', context);
            }

        }
    });


    /* Adds an exam, redirects to the exam page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Exams (exam_type, class_id, exam_date) VALUES (?,?,?)";
        var inserts = [req.body.type, req.body.class_id, req.body.date];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/exams');
            }
        });
    });


    /* Display one exam for updating the info */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["select.js","update.js"];
        var mysql = req.app.get('mysql');
        getExam(res, mysql, context, req.params.id, complete);
        getClass(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('update-exam', context);
            }

        }
    });

    /* The URI that update data is sent to in order to update a exam */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Exams SET exam_type=?, class_id=?, exam_date=? WHERE exam_id=?";
        var inserts = [req.body.exam_type, req.body.class_id, req.body.exam_date, req.params.id];
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


    /* Route to delete an exam */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Exams WHERE exam_id = ?";
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
    