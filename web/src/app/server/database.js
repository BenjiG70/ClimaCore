const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const port = 4202;

app.use(cors());
app.use(bodyParser.json());

// connect to database
const db = new sqlite3.Database('weather.sqlite');
/**
 * 
 */
db.serialize(() => {
    db.run(`
          CREATE TABLE IF NOT EXISTS HISTORY (
          ID INTEGER PRIMARY KEY,
          DATE_TIME TEXT,
          temperature NUMBER,
          humidity NUMBER,
          air_pressure NUMBER,
          sensor TEXT,
          regen INTEGER
          );
      `);
})

/**
 * 
 * @param {*} sql 
 * @param {*} res 
 */
function getData(sql, res) {
  db.all(sql, [], (err, rows) => {
    if (err) {
      res.status(400).send(err.message);
      return;
    }
    if (!rows || rows.length === 0) {
      res.status(404).send('No data found');
      return;
    }
    res.status(200).json(rows);
    }
  );
}

/**
 * 
 * @param {*} sql 
 * @param {*} res 
 */
function changeData(sql, res){
  db.run(sql, [], (err, rows) => {
      if (err) {
        res.status(400).send(err.message);
        return;
      }
      const result = {};
      rows.forEach((row) => {
        result[row.ID] = row;
      });
      res.status(200).json(result);
    }
  );
}

/**
 * getAllData
 */
app.get('/get/all/data', (req, res) => {
  const sql = `SELECT * FROM HISTORY`;
  getData(sql, res);
  }
);
/** 
 * getSensors
 */
app.get('/get/all/sensors', (req, res) => {
  const sql = `SELECT DISTINCT(sensor) FROM HISTORY`;
  getData(sql, res);
  }
);

/**
 * getWeatherDataBySensor
 */
app.get('/get/:sensor/data/all', (req, res) => {
  const sensor = req.params.sensor;
  const sql = `SELECT * FROM HISTORY WHERE sensor = "${sensor}"`;
  getData(sql, res)
  }
);
/**
 * getLastWeatherDataBySensor
 */
app.get('/get/:sensor/data/last', (req, res) => {
  const sensor = req.params.sensor;
  const sql = `SELECT * FROM HISTORY WHERE sensor = "${sensor}" ORDER BY DATE_TIME DESC LIMIT 1`;
  getData(sql, res)
  }
);
/**
 * @param sensor 
 * @param format
 * @param end YYYY-MM-DD
 */
app.get('/get/:sensor/data/:format/:start/:end', (req, res) => {
  const sensor = req.params.sensor;
  const enddate = req.params.end;
  const format = req.params.format;
  const startdate = req.params.start;
  var sql;
  switch(format){
    case('H'):
      sql = `SELECT
        strftime('%d.%m.%Y %H', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) || ' Uhr' AS time,
          AVG(temperature) AS temp,
          AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time;`
      break;
    case('W'):
      sql = `SELECT
          strftime('%Y-%m-%d', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) AS time,
          AVG(temperature) AS temp,
          AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time
        ORDER BY time;`
      break;
    case('M'):
      sql = `SELECT
          strftime('%Y-%m-%d', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) AS time,
          AVG(temperature) AS temp,
          AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time
        ORDER BY time;`
      break;
    case('Y'):
      sql = `SELECT
        strftime('%Y-%m', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) AS time,
        AVG(temperature) AS temp,
        AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time
        ORDER BY time;`
      break;
  }
  getData(sql, res);
  }
);

app.post('/insert/data', (req, res) => {
  const sqlInsert = `INSERT INTO HISTORY (temperature, humidity, air_pressure, sensor, date_time) VALUES (?, ?, ?, ?, ?)`;
  const values = [req.body.temperature, req.body.humidity, req.body.air_pressure, req.body.sensor, new Date()];

  db.run(sqlInsert, values, function (err) {
    if (err) {
      // Wenn ein Fehler auftritt, sende die Antwort und kehre zurück, um den Rest der Logik zu stoppen
      return res.status(500).json({ error: "Datenbankfehler: " + err.message });
    }

    // Wenn die Einfügung erfolgreich ist, sende die Antwort nur einmal
    res.status(200).json({ message: 'Daten erfolgreich eingefügt', id: this.lastID });
  });
});

/**
 * write listeningmessage
 */
app.listen(port, () => {    
  console.log(`Server läuft auf http://localhost:${port}`);
  }
);