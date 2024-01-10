var express = require('express');
var router = express.Router();
const mysql  = require('mysql2/promise');
const pool = require('../db/db');
const session = require('express-session');



router.get('/', async function (req,res,next) {
  res.render('index',{title : 'index'});
})

router.post('/parametri', async function(req, res, next) {
  const startDate = req.body.startDate;
  const endDate = req.body.endDate;
  const startDate2 = req.body.startDate2
  const endDate2 = req.body.endDate2;
  console.log('Parametri:', startDate, endDate, startDate2, endDate2);

  res.redirect(`/izvjestaj?startDate=${startDate}&endDate=${endDate}&startDate2=${startDate2}&endDate2=${endDate2}`);
});

router.get('/izvjestaj', async function(req, res, next) {
  const startDate = req.query.startDate;
  const endDate = req.query.endDate;
  const startDate2 = req.query.startDate2;
  const endDate2 = req.query.endDate2;
  const connection = await pool.getConnection();


  try {
    const [rows,fields] = await connection.execute('CALL broj_polazaka_za_period1_period2(?, ?, ?, ?)', [startDate, endDate, startDate2, endDate2]);
    connection.release();
    res.render('izvjestaj', { title: 'Broj polazaka za 2 perioda', izvjestaj: rows });
  } catch (error) {
    console.error('Error calling stored procedure:', error);
  }
});


module.exports = router;
