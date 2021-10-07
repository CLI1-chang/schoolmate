// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

var mysql = require('mysql');
var pool = mysql.createPool({
  connectionLimit : 10,
  host            : 'classmysql.engr.oregonstate.edu',
  user            : 'cs340_lic7',
  password        : '3986',
  database        : 'cs340_lic7'
});
module.exports.pool = pool;
