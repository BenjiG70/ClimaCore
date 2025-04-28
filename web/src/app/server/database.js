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
  const sql = `SELECT * FROM HISTORY WHERE sensor = "${sensor}" ORDER BY ID DESC LIMIT 1`;
  getData(sql, res)
  }
);
/**
 * getWeatherDataSince
 * WIP
 */
app.get('/get/all/data/since/:startDate', (req, res) => {
    const startDate = req.params.startDate;
    // work in progress
    const sql = `SELECT COUNT(regen) FROM HISTORY WHERE date_time like ${startDate}`;
    getData(sql, res);
  }
);
/**
 * getWeatherDataSinceBySensor
 * TBD
 */
app.get('/get/:sensor/data/since/:startDate', (req, res) => {
  const sensor = req.params.sensor;
  const startDate = req.params.startDate;
  // work in progress
  const sql = `SELECT COUNT(regen) FROM HISTORY WHERE date_time like ${startDate}`;
  getData(sql, res);
  }
);

/**
 * getDataOrderedByMonth
 * @params year Das Jahr, welches abgefragt werden soll
 * TBD
 */
app.get('/get/all/data/:year', (req, res) => {
    const year = req.params.year;
  }
);

/**
 * getDataOrderedByMonthBySensor
 * @params year das Jahr, welches abgefragt werden soll
 * TBD
 */
app.get('/get/:sensor/data/:year', (req, res) => {
  const year = req.params.year;
  const sensor = req.params.sensor;
  }
);

/**
 * getMonthlyDataBySensor
 * @params sensor Sensor, für den die Monatiliche Statistik erstellt werden soll
 * TBD
 */
app.get('/get/:sensor/data/monthly/log', (req, res) => {
  const month = new Date().getMonth;
  const sensor = req.params.sensor;
  }
);
/**
 * getMonthlyData
 * TBD
 */
app.get('/get/all/data/monthly/log', (req, res) => {
  const month = new Date().getMonth;
  console.log(month);
  }
);

/**
 * getStatisticDataByYear
 */
/**
 * getStatisticDataByYearBySensor
 */
/**
 * getStatisticDataByMonth
 */
/**
 * getStatisticDataByMonthBySensor
 */
/**
 * getStatisticDataByStartDate
 */
/**
 * getStatisticDataByStartDateBySensor
 */

/**
 * insertWeatherData
 * @params 
 */
// app.post('/insert/data', (req, res) => {
//   const id = getData("SELECT MAX(ID) FROM HISTORY", res) + 1;
//   const temperature = req.body.temperature;
//   const humidity = req.body.humidity;
//   const air_pressure = req.body.air_pressure;
//   const sensor = req.body.sensor;
//   const datetime = new Date();

//   const sql = `INSERT INTO HISTORY(ID, temperature, humidity, air_pressure, sensor, date_time) 
//               VALUES(${id}, ${temperature}, ${humidity}, ${air_pressure}, "${sensor}", "${datetime}");`
//   changeData(sql, res)
//   console.log("es passiert was")
//   }
// );

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