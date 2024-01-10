var express = require('express');
var router = express.Router();
const mysql  = require('mysql2/promise');
const pool = require('../db/db');
const session = require('express-session');
const moment = require("moment/moment");


router.get('/', async function(req, res, next){
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('select * from putni_nalog');
        const [sifreNaloga] = await connection.query('SELECT sifra_naloga FROM putni_nalog');
        connection.release();
        console.log(rows[0]);
        return res.render('putni-nalog', { title: 'Putni_nalog',relacijePN: '', podaci: '', voznoOsoblje:'', sifreNaloga: sifreNaloga });
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/', async function(req, res, next) {
    const selectedSifraNaloga = req.body.sifreNaloga;
    console.log(selectedSifraNaloga);
    try {
        const connection = await pool.getConnection();
        const [sifreNaloga] = await connection.query('select * from putni_nalog');
        const [details] = await connection.query('SELECT * FROM putni_nalog WHERE sifra_naloga = ?', [selectedSifraNaloga]);
        const [voznoOsoblje] = await connection.query('select * from vozno_osoblje where putni_nalog_id = ?', [selectedSifraNaloga]);
        const [relacijePN] = await connection.query('select * from relacije_putni_nalog where putni_nalog_id = ?', [selectedSifraNaloga]);
        connection.release();
    console.log(voznoOsoblje);
        details.forEach(details => {
            details.datum = moment(details.datum).format('DD-MM-YYYY');
        });

        return res.render('putni-nalog', { title: 'Detalji putnog naloga', relacijePN: relacijePN, sifreNaloga: sifreNaloga, voznoOsoblje: voznoOsoblje ,odabranaSifraNaloga: selectedSifraNaloga, podaci: details[0] });
    } catch (err) {
        res.send(err.message);
    }
});



module.exports = router;
