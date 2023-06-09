var createError = require('http-errors');
var express = require('express');

var path = require('path');
var cookieParser = require('cookie-parser');
const bodyParser= require("body-parser")

var logger = require('morgan');
var hbs = require('express-handlebars');
var multer=require('multer')
var userRouter = require('./routes/user');
var adminRouter = require('./routes/admin');
var flash=require('connect-flash')
var session= require('express-session')
var app = express();
const upload=multer({dest:'uploads/'})
var db = require('./dbconfig/connection');
require("dotenv").config();
// const multer = require('multer');

// view engine setup


app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.use(session({secret:"key",cookie:{maxAge:600000}}))
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use(session({
  secret:"Key",
  cookie:{maxAge:6000000}
}));
app.use(flash());

 
db.connect((err) => {
  if (err) console.log('Connection Error' + err);
  else console.log('Database connected'); 
})



app.use('/', userRouter);
app.use('/admin', adminRouter);
app.engine('hbs', hbs.engine({ extname: 'hbs', defaultLayout: "layout", layoutsDir: "views/layout/", partialsDir: __dirname + '/views/partials/' }))
// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
