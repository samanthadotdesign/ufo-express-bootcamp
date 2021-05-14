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
    
    // If the key sort is in req.query
    // inspect value of the sort 
    // content.sightings.sort() – does not manipualte the original data.json bc we're not writing in it - manipulating the array in the program 
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
      date: sightingObject.date,
      time: sightingObject.time,
      location: sightingObject.location,
      shape: sightingObject.shape,
      duration: sightingObject.duration,
      summary: sightingObject.summary,
      text: sightingObject.text,
    };

    res.render('view-contribution', outputContent);
  });
});

// Render Current Data in Edit Form
app.get('/contribute/:index/edit', (req, res) => {
  const { index } = req.params;
  // Retrieve current data and render it
  read('contributions.json', (err, content) => {
    const contribution = content.contributions[index];
    // Pass the index to the edit form for the PUT request URL.
    contribution.index = index;
    const ejsData = { contribution };
    res.render('edit-contribution', ejsData);
  });
});

// Edit the data from submission
app.put('/contribute/:index/edit', (req, res) => {
  // Object destructuring on req.params, extracting the index key, index is the actual number
  // const index = req.params.index
  const { index } = req.params;

  edit(
    'contributions.json',
    (err, data) => {
      if (err) {
        console.log(err);
      }
      console.log(req.body);
      // Modifying contents of the file inside the data variable
      data.contributions[index] = req.body;
    },
    (err) => {
      if (err) {
        console.log(err);
      }
      res.redirect(303, `/submitted/${index}`);
    },
  );
});

app.get('/submitted/:index', (req, res) => {
  const { index } = req.params;
  res.render('submitted', { index });
});

// Delete the data from submission
app.delete('/contribute/:index', (req, res) => {
  const { index } = req.params;

  edit(
    'contributions.json',
    // Read callback
    (err, data) => {
      data.contributions.splice(index, 1);
      console.log('this was deleted');
    },

    // Write callback
    (err) => {
      res.redirect(303, '/deleted');
    },
  );
});

app.get('/deleted', (req, res) => {
  res.render('deleted', {});
});



app.listen(3004);
