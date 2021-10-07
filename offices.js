// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

module.exports = function(){
    var express = require('express');
    var router = express.Router();

    function getOffices(res, mysql, context, complete){
        mysql.pool.query("SELECT office_id AS id, building_name, zipcode FROM Offices", function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.offices = results;
            complete();
        });
    }

    function getOffice(res, mysql, context, id, complete){
        var sql = "SELECT office_id AS id, building_name, zipcode FROM Offices WHERE office_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.office = results[0];
            complete();
        });
    }

    function getRelatedDelete(res, mysql, context, id, complete){
        var sql = "SELECT CONCAT(first_name,' ',last_name) AS teacher_name FROM Teachers WHERE office_id = ?";
        var inserts = [id];
        mysql.pool.query(sql, inserts, function(error, results, fields){
            if(error){
                res.write(JSON.stringify(error));
                res.end();
            }
            context.delete = results;
            complete();
        });
    }

    /*Display all offices */

    router.get('/', function(req, res){
        var callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getOffices(res, mysql, context, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('offices', context);
            }

        }
    });


    /* Adds an office, redirects to the offices page after adding */

    router.post('/', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "INSERT INTO Offices (office_id, building_name, zipcode) VALUES (?,?,?)";
        var inserts = [req.body.office_id, req.body.build_name, req.body.zipcode];
        sql = mysql.pool.query(sql,inserts,function(error, results, fields){
            if(error){
                console.log(JSON.stringify(error))
                res.write(JSON.stringify(error));
                res.end();
            }else{
                res.redirect('/offices');
            }
        });
    });


    /* Display one office for updating the info */

    router.get('/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["update.js"];
        var mysql = req.app.get('mysql');
        getOffice(res, mysql, context, req.params.id, complete);
        function complete(){
            callbackCount++;
            if(callbackCount >= 1){
                res.render('update-office', context);
            }

        }
    });


    /* The URI that update data is sent to in order to update an office */

    router.put('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "UPDATE Offices SET building_name=?, zipcode=? WHERE office_id=?";
        var inserts = [req.body.building_name, req.body.zipcode, req.params.id];
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

    
    /* Display the office want to delete 

    router.get('/delete/:id', function(req, res){
        callbackCount = 0;
        var context = {};
        context.jsscripts = ["delete.js"];
        var mysql = req.app.get('mysql');
        getOffice(res, mysql, context, req.params.id, complete);
        getRelatedDelete(res, mysql, context, req.params.id, complete)
        function complete(){
            callbackCount++;
            if(callbackCount >= 2){
                res.render('delete-office', context);
            }

        }
    });*/

    /* Route to delete an office */

    router.delete('/:id', function(req, res){
        var mysql = req.app.get('mysql');
        var sql = "DELETE FROM Offices WHERE office_id = ?";
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
    