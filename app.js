var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const session = require('express-session');



var indexRouter = require('./routes/index');
var pregledVozacaRouter = require('./routes/pregled-vozaca');
var putniNalogRouter = require('./routes/putni-nalog');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/pregled-vozaca', pregledVozacaRouter);
app.use('/putni-nalog', putniNalogRouter);

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
const sessionSecret = process.env.SESSION_SECRET || 'moj_tajni_kljuc';

app.use(session({ secret: sessionSecret, resave: true, saveUninitialized: true }));


module.exports = app;
