const express = require('express');
const mysql = require('mysql');

const app = express();

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    // database: 'licellae_licencebd'
    database: 'start'
});

// Connect
db.connect((err) => {
    if (err) {
        throw err;
    }
    console.log('MySql Connected...');
});

// create db
app.get('/createdb', (req, res) => {
    let sql = 'CREATE DATABASE start';
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Database created...');
    });
});

// create table
app.get('/createmytable', (req, res) => {
    let sql = `CREATE TABLE licencebd(id int AUTO_INCREMENT,
            shop_name VARCHAR(255), shop_address VARCHAR(255), 
            shop_type VARCHAR(255), licence_no VARCHAR(255), 
            propiter_name VARCHAR(255), phone_no VARCHAR(255),
            last_renew VARCHAR(255),isAvailable VARCHAR(255),
            comment VARCHAR(255), PRIMARY KEY(id))`;
    db.query(sql, (err, result) => {
        if (err) throw err;
        console.log(result);
        res.send('Post table created...');
    });
});
// add single post 1
// app.get('/addpost1', (req, res) => {
//     let post = { title: 'Post One', body: 'This is post number one' };
//     let sql = 'INSERT INTO posts SET ?';
//     let query = db.query(sql, post, (err, result) => {
//         if (err) throw err;
//         console.log(result);
//         res.send('Post 1 added...');
//     });
// });

// get all posts
app.get('/getposts', (req, res) => {
    let sql = 'SELECT * FROM licencebd';
    let query = db.query
        (sql, (err, results) => {
            if (err) throw err;
            console.log(results);
            res.send('Posts fetched...');
        });
});
// add csv file
app.get('/addcsv', (req, res) => {
    const csv = require('csv-parser');
    const fs = require('fs');
    const results = [];
    fs.createReadStream('data.csv')
        .pipe(csv())
        .on('data', (data) => results.push(data)) // push data to array
        .on('end', () => {
            console.log(results);
            for (let i = 0; i < results.length; i++) {
                // console.log(results[i].shop_name);
                // console.log(results[i].shop_address);
                // console.log(results[i].shop_type);
                // console.log(results[i].licence_no);
                // console.log(results[i].propiter_name);
                // console.log(results[i].phone_no);
                // console.log(results[i].last_renew);
                // console.log(results[i].isAvailable);
                // console.log(results[i].comment);

                var sql = "INSERT INTO licencebd (shop_name, shop_address, shop_type, licence_no, propiter_name, phone_no, last_renew, isAvailable, comment) VALUES ('" + results[i].shop_name + "', '" + results[i].shop_address + "', '" + results[i].shop_type + "', '" + results[i].licence_no + "', '" + results[i].propiter_name + "', '" + results[i].phone_no + "', '" + results[i].last_renew + "', '" + results[i].isAvailable + "', '" + results[i].comment + "')";
                db.query(sql, [results], (err, result) => { // [results] is array of array
                    if (err) throw err;
                    console.log(result);
                });
            }
            res.send('CSV file added...');
        });
});
// add csv file in mariadb


app.listen('5000', () => {
    console.log('Server started on port 5000');
});