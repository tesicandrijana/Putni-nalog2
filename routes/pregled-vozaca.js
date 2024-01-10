var express = require('express');
var router = express.Router();
const mysql  = require('mysql2/promise');
const pool = require('../db/db');
const moment = require('moment');

router.get('/', async function(req, res, next){
    try {
        const connection = await pool.getConnection();
        const [rows] = await connection.query('select * from registar_vozaca');
        connection.release();

        rows.forEach(vozac => {
            vozac.datum_isteka_licence = moment(vozac.datum_isteka_licence).format('DD-MM-YYYY');
            vozac.datum_isteka_dozvole = moment(vozac.datum_isteka_dozvole).format('DD-MM-YYYY');
        });
        res.render('pregled-vozaca', { title: 'Pregled vozača', vozaci: rows });
    } catch (err) {
        res.send(err.message);
    }
});

router.post('/dodaj-vozaca', async function(req, res, next) {

    const vozacInput = {
        ime: req.body.ime,
        prezime: req.body.prezime,
        datum_isteka_licence: req.body.datum_isteka_licence,
        datum_isteka_dozvole: req.body.datum_isteka_dozvole,
        aktivnost: req.body.aktivnost
    }
    console.log('Zahtjev primljen na /dodaj-vozaca', vozacInput);


    try {
        const [results] = await pool.query('INSERT INTO registar_vozaca (ime, prezime, datum_isteka_licence, datum_isteka_dozvole, aktivnost) VALUES (?, ?, ?, ?, ?)',
            [vozacInput.ime, vozacInput.prezime, vozacInput.datum_isteka_licence, vozacInput.datum_isteka_dozvole, vozacInput.aktivnost]);

        console.log('New driver added to the database:', results);
        return res.redirect('/pregled-vozaca');
    } catch (error) {
        console.error('Error inserting data into MySQL:', error);
        res.status(500).send('Error inserting data into MySQL');
    }

    });

router.delete('/obrisi-vozaca/:sifra_vozaca', async function (req, res, next) {
    const sifraVozaca = req.params.sifra_vozaca;

    try {
        const [results] = await pool.query('DELETE FROM registar_vozaca WHERE sifra_vozaca = ?', [sifraVozaca]);

        console.log('Driver deleted from the database:', results);
        return res.sendStatus(204);
    } catch (error) {
        console.error('Error deleting data from MySQL:', error);
        res.status(500).send('Error deleting data from MySQL');
    }
});



module.exports = router;

