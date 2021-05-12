import express from 'express';
import methodOverride from 'method-override';
import { read, add, edit } from './jsonFileStorage.js';

const app = express();

// Set view engine
app.set('view engine', 'ejs');

// Set up static directory
app.use(express.static('public'));

// Receive POST Requests in Express
app.use(express.urlencoded({ extended: false }));

// Override POST requests with query param ?_method=PUT to be PUT requests
app.use(methodOverride('_method'));

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

  add('contributions.json', 'contributions', req.body, (error, content) => {
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

  const i = Object.values(req.params)[0];
  // Request.param value = index for data.json array

  // Read data.json file -> callback(error,object)
  read('contributions.json', (err, content) => {
    if (err) {
      return console.error(err);
    }
    // Access jsonContentObj inside read
    const sightingObject = Object.values(content)[0][i];

    const outputContent = {
      index: i,
      date: sightingObject.date_time,
      shape: sightingObject.shape,
      observed: '',
      weather: '',
      summary: sightingObject.summary,
      text: sightingObject.text,
      duration: sightingObject.duration,
      city: sightingObject.city,
      state: sightingObject.state,
    };

    res.render('view-contribution', outputContent);
  });
});

app.get('/contribute/:index/edit', (req, res) => {
  res.render('edit-contribution', { index: req.params.index });
});

// Edit the data from submission
app.put('/contribute/:index', (req, res) => {
  const { index } = req.params;
  console.log(index);

  edit(
    'contributions.json',
    // Read callback
    (err, data) => {
      data.contributions[index] = req.body;
    },
    // Write callback
    (err) => {
      res.send('done!');
    },
  );
});
/*
// Delete the data from submission
app.delete();
*/
app.listen(3004);
