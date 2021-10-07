// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    
    /*Display all search results*/

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.class_id = req.query.class_id;
        var mysql = req.app.get('mysql');
        
        getClassStudents(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('search', context);
            }
        }
    });

    function getClassStudents(res, mysql, context, complete){
        var query = "SELECT s.student_id, s.first_name, s.last_name FROM Students AS s INNER JOIN Class_Students AS cs ON s.student_id = cs.student_id WHERE cs.class_id = ?";
        var inserts = [context.class_id];
        
        mysql.pool.query(query, inserts, function(error, rows, fields){
              if(error){
                  res.write(JSON.stringify(error));
                  res.end();
              }
              context.students = rows;
              complete();
        });
    }
    

    return router;
}();
    