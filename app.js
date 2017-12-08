const express = require('express');
const app = express();
const path = require('path');
const pg = require('pg');
const format = require('pg-format');
const PGUSER = 'kylechen';
const PGDATABASE = 'taptap';
const PORT = 8000;
const bodyParser = require('body-parser');

const config = {
  user: PGUSER,
  database: PGDATABASE,
  max: 10,
  idleTimeoutMillis: 30000
};

const pool = new pg.Pool(config);
let myClient;

app.use(express.static('frontend'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, './frontend/index.html'));
});

pool.connect((err, client, done) => {
  if (err) {
    console.log(err);
  }
  console.log(client);
  app.listen(process.env.PORT || PORT, () => {
    console.log(__dirname);
    console.log(`listening on ${PORT}`);
  });

  myClient = client;


  app.get('/scores', (req, res) => {
    const scoresQuery = format('SELECT * FROM scores ORDER BY score DESC LIMIT 15');
    myClient.query(scoresQuery, (errors, results) => {
      if (errors) {
        console.log(errors);
      }
      res.send(results.rows);
    });
  });

  //
  // app.post('/scores', (req, res) => {
  //   const { name, score } = req.body;
  //   const data = [name, score];
  //   const postQuery = format("INSERT INTO scores VALUES (%L)", data);
  //   myClient.query(postQuery, (errors, results) => {
  //     if (errors) {
  //       console.log(errors);
  //     }
  //     res.send(results);
  //   });
  // });
});

pool.connect()
  .then(client => {
    // if (err) {
    //   console.log(err);
    // }
    // console.log(client);
    app.listen(process.env.PORT || PORT, () => {
      console.log(__dirname);
      console.log(`listening on ${PORT}`);
    });

    myClient = client;


    app.get('/scores', (req, res) => {
      const scoresQuery = format('SELECT * FROM scores ORDER BY score DESC LIMIT 15');
      myClient.query(scoresQuery, (errors, results) => {
        if (errors) {
          console.log(errors);
        }
        res.send(results.rows);
      });
    });

    app.get('/scores', (req, res) => {
      const scoresQuery = format('SELECT * FROM scores ORDER BY score DESC LIMIT 15');
      client.query(scoresQuery, (errors, results) => {
        if (errors) {
          console.log(errors);
        }
        res.send(results.rows);
      });
    });
  });
