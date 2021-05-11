import express from 'express';
import { read, add } from './jsonFileStorage.js';

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Set up static directory
app.use(express.static('public'));

// Receive POST Requests in Express
app.use(express.urlencoded({ extended: false }));

/* -------- MAIN PAGE -------- */

// Renders the homepage, list of all sightings
app.get('/', (req, res) => {
  read('data.json', (err, content) => {
    if (err) {
      return console.error(err);
    }
    res.render('index', content);
  });
});

// Renders sighting page
app.get('/sighting/:index', (req, res) => {
  // console.log(req.params)
  // Request.params { index: '0' }

  const index = Object.values(req.params)[0];
  // Request.param value = index for data.json array

  // Read data.json file -> callback(error,object)
  read('data.json', (err, content) => {
    if (err) {
      return console.error(err);
    }

    // Access jsonContentObj inside read
    const sightingObject = Object.values(content)[0][index];

    const outputContent = {
      date: sightingObject.date_time,
      shape: sightingObject.shape,
      summary: sightingObject.summary,
      text: sightingObject.text,
      duration: sightingObject.duration,
      city: sightingObject.city,
      state: sightingObject.state,
    };
    res.render('sighting', outputContent);
  });
});

/* -------- COMMUNITY CONTRIBUTIONS -------- */
// Renders form to add new sighting
app.get('/contribute', (req, res) => {
  res.render('contribute', {});
});

/**
 * After form has been submitted in /contribute
 * Stores data in submission.json
 */
app.post('/contribute', (req, res) => {
  // Get the last object in the array in submission.json
  let i;

  add('submission.json', 'contributions', req.body, (error, content) => {
    if (error) {
      return res.send('Sorry, we couldn\'t submit this form! ');
    }
    const contentObj = JSON.parse(content);
    const contentArr = contentObj.contributions;
    i = contentArr.length - 1;

    const contribution = {
      index: i,
      date: req.body.date,
    };

    res.render('submitted', contribution);
  });
});

// contribute/720
// Renders contribution page
app.get('/contribute/:index', (req, res) => {
  console.log(req.params);
  // Request.params { index: '0' }

  const index = Object.values(req.params)[0];
  // Request.param value = index for data.json array

  // Read data.json file -> callback(error,object)
  read('submission.json', (err, content) => {
    if (err) {
      return console.error(err);
    }
    console.log('index', index);
    console.log(content);

    // Access jsonContentObj inside read
    // const sightingObject = Object.values(content)[0][index]

    // const outputContent = {
    //   index:
    //   date: sightingObject['date_time'],
    //   shape: sightingObject.shape,
    //   summary: sightingObject.summary,
    //   text: sightingObject.text,
    //   duration: sightingObject.duration,
    //   city: sightingObject.city,
    //   state: sightingObject.state
    // }
    res.render('view-contribution', {});
  });
});

// Edit the data from submission
// app.put('/contribute/:index/edit', (req, res) => {
// })

// Delete the data from submission

app.listen(3004);
