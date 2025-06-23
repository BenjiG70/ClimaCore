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
 * Creates the HISTORY table if it does not exist.
 * The table stores weather data records.
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
});

/**
 * Executes a SELECT SQL query and sends the result as JSON.
 * Responds with an error status if the query fails or no data is found.
 * 
 * @param {string} sql - The SQL query string to execute.
 * @param {import('express').Response} res - The Express response object.
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
  });
}

/**
 * Executes a modifying SQL query (INSERT, UPDATE, DELETE) and sends the result.
 * Responds with an error status if the query fails.
 * 
 * Note: The current implementation attempts to iterate `rows` which is
 * not standard for db.run, might need adjustment.
 * 
 * @param {string} sql - The SQL query string to execute.
 * @param {import('express').Response} res - The Express response object.
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
 * GET endpoint to retrieve all weather data records.
 */
app.get('/get/all/data', (req, res) => {
  const sql = `SELECT * FROM HISTORY`;
  getData(sql, res);
});

/** 
 * GET endpoint to retrieve all distinct sensors.
 */
app.get('/get/all/sensors', (req, res) => {
  const sql = `SELECT DISTINCT(sensor) FROM HISTORY`;
  getData(sql, res);
});

/**
 * GET endpoint to retrieve all data for a specific sensor.
 */
app.get('/get/:sensor/data/all', (req, res) => {
  const sensor = req.params.sensor;
  const sql = `SELECT * FROM HISTORY WHERE sensor = "${sensor}"`;
  getData(sql, res);
});

/**
 * GET endpoint to retrieve the latest data record for a specific sensor.
 */
app.get('/get/:sensor/data/last', (req, res) => {
  const sensor = req.params.sensor;
  const sql = `SELECT * FROM HISTORY WHERE sensor = "${sensor}" ORDER BY DATE_TIME DESC LIMIT 1`;
  getData(sql, res);
});

/**
 * GET endpoint to retrieve aggregated weather data for a sensor
 * over a date range with a specified format (H, W, M, Y).
 * 
 * @param {string} sensor - Sensor identifier.
 * @param {string} format - Aggregation format: 'H' (hourly), 'W' (weekly), 'M' (monthly), 'Y' (yearly).
 * @param {string} start - Start timestamp or date.
 * @param {string} end - End timestamp or date.
 */
app.get('/get/:sensor/data/:format/:start/:end', (req, res) => {
  const sensor = req.params.sensor;
  const enddate = req.params.end;
  const format = req.params.format;
  const startdate = req.params.start;
  let sql;
  switch(format){
    case('H'):
      sql = `SELECT
        strftime('%d.%m.%Y %H', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) || ' Uhr' AS time,
        AVG(temperature) AS temp,
        AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time;`;
      break;
    case('W'):
    case('M'):
      sql = `SELECT
        strftime('%Y-%m-%d', datetime(DATE_TIME / 1000, 'unixepoch', 'localtime')) AS time,
        AVG(temperature) AS temp,
        AVG(humidity) AS hum
        FROM HISTORY
        WHERE sensor = '${sensor}'
        AND DATE_TIME BETWEEN ${startdate} AND ${enddate}
        GROUP BY time
        ORDER BY time;`;
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
        ORDER BY time;`;
      break;
  }
  getData(sql, res);
});

/**
 * POST endpoint to insert a new weather data record.
 * Expects JSON body with temperature, humidity, air_pressure, sensor.
 */
app.post('/insert/data', (req, res) => {
  const sqlInsert = `INSERT INTO HISTORY (temperature, humidity, air_pressure, sensor, date_time) VALUES (?, ?, ?, ?, ?)`;
  const values = [req.body.temperature, req.body.humidity, req.body.air_pressure, req.body.sensor, new Date()];

  db.run(sqlInsert, values, function (err) {
    if (err) {
      // If error occurs, respond with status 500 and error message
      return res.status(500).json({ error: "Database error: " + err.message });
    }

    // On successful insert, respond with success message and inserted row ID
    res.status(200).json({ message: 'Data inserted successfully', id: this.lastID });
  });
});

/**
 * Start the Express server and listen on the specified port.
 */
app.listen(port, () => {    
  console.log(`Server running at http://localhost:${port}`);
});
