// CS340 Project
// Section    : 401
// Team Member: Alice Li & Chang Li

var express = require('express');
var mysql = require('./dbcon.js');
var bodyParser = require('body-parser');

var app = express();
var handlebars = require('express-handlebars').create({defaultLayout:'main'});

app.engine('handlebars', handlebars.engine);
app.use(bodyParser.urlencoded({extended:true}));
app.use('/static', express.static('public'));
app.set('view engine', 'handlebars');
app.set('port', 63620);
app.set('mysql', mysql);
app.use('/students', require('./students.js'));
app.use('/classstudents', require('./classstudents.js'));
app.use('/classes', require('./classes.js'));
app.use('/exams', require('./exams.js'));
app.use('/teachers', require('./teachers.js'));
app.use('/offices', require('./offices.js'));
app.use('/search', require('./search.js'));
app.use('/', express.static('public'));

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.type('plain/text');
  res.status(500);
  res.render('500');
});

app.listen(app.get('port'), function(){
  console.log('Express started on http://flip1.engr.oregonstate.edu:' + app.get('port') + '; press Ctrl-C to terminate.');
});