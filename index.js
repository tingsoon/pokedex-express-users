/**
 * To-do for homework on 28 Jun 2018
 * =================================
 * 1. Create the relevant tables.sql file
 * 2. New routes for user-creation
 * 3. Change the pokemon form to add an input for user id such that the pokemon belongs to the user with that id
 * 4. (FURTHER) Add a drop-down menu of all users on the pokemon form
 * 5. (FURTHER) Add a types table and a pokemon-types table in your database, and create a seed.sql file inserting relevant data for these 2 tables. Note that a pokemon can have many types, and a type can have many pokemons.
 */

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const pg = require('pg');
const cookieParser = require('cookie-parser');
const sha256 = require('js-sha256');

// Initialise postgres client
const configs = {
  user: 'angtingsoon',
  host: '127.0.0.1',
  database: 'pokemons',
  port: 5432,
}

const pool = new pg.Pool(configs);

pool.on('error', function (err) {
  console.log('idle client error', err.message, err.stack);
});

/**
 * ===================================
 * Configurations and set up
 * ===================================
 */

// Init express app
const app = express();

// public folder to access static files
// store image files here
app.use(express.static('public'));

app.use(bodyParser.urlencoded({ extended: true }));
app.use(methodOverride('_method'));


// Set react-views to be the default view engine
const reactEngine = require('express-react-views').createEngine();
app.set('views', __dirname + '/views');
app.set('view engine', 'jsx');
app.engine('jsx', reactEngine);

// using cookies
app.use(cookieParser());

/**
 * ===================================
 * Route Handler Functions
 * ===================================
 */

// creating users

app.get('/users/new', (request, response) => {

  response.render('newUser');

});

app.post('/users/new', (request, response) => {

  let password_hash = sha256(request.body.password);

  let queryString = 'INSERT INTO users (email, password_hash) VALUES ($1, $2) RETURNING *';

  const values = [request.body.email, password_hash];

  pool.query(queryString, values, (err, queryResult) => {

    if (err) {
      response.send('Database error 1:' + err.message);
    } else {
      let user_id = queryResult.rows[0].id;

      response.send('Created user with id: ' + user_id);
    }
  });
});

// login

app.get('/users/login', (request, response) => {

  response.render('login');

});

app.post('/users/login', (request, response) => {

  let queryString = 'SELECT * FROM users WHERE email = $1';

  const values = [request.body.email];

  pool.query(queryString, values, (err, queryResult) => {

    if (err) {
      response.send('Database error 2: ' + err.message);
    } else {
      const queryRows = queryResult.rows;

      if (queryRows.length < 1) {
        response.status(401).send('Wrong email or password. Try again.');
      } else {

          let db_pass_hash = queryRows[0].password_hash;

          let request_pass_hash = sha256(request.body.password);

          if (db_pass_hash === request_pass_hash) {

            response.cookie('logged_in', 'true');
            response.cookie('user_id', queryRows[0].id);

            response.redirect('/pokemon');
          } else {
            response.status(401).send('Wrong email or password. Try again.')
          }
      }
    }
  })

});



// Sort by name
app.put('/pokemon/sortName', (request, response) => {

  let queryString = 'SELECT * FROM pokemon ORDER BY name ASC';

  pool.query(queryString, (err, queryResult) => {

    if (err) {
      response.status(500).send('error 3: ' + err.message);
    } else {
      // redirect to home page
      response.redirect('/pokemon/name');
    }
  });
});

// Sort by id
app.put('/pokemon/sortId', (request, response) => {

  let queryString = 'SELECT * FROM pokemon ORDER BY id ASC';

  pool.query(queryString, (err, queryResult) => {

    if (err) {
      response.status(500).send('error 4: ' + err.message);
    } else {
      // redirect to home page
      response.redirect('/pokemon');
    } 
  });
});

// display all pokemon by name
app.get('/pokemon/name', (request, response) => {

  if( request.cookies['logged_in'] !== 'true' ){
    response.send('Not authorized to enter without logging in.')
  };

  let userId = request.cookies['user_id'];

  let userId0 = 0;
  // respond with HTML page displaying all pokemon

  let queryString = 'SELECT * FROM pokemon WHERE (user_id = $1 OR user_id = $2) ORDER BY name ASC';

  const values = [userId, userId0];

  // gather data from postgres
  pool.query(queryString, values, (err, result) => {

    let pokeData = result.rows;

    if (err) {
      console.error('query error 5:', err.stack);
    } else {

      const data = {
        all_pokemon: pokeData
      };

      // redirect to home page
      response.render('Home', data);
    }
  });

});

// logout 
app.delete('/users/logout', (req, response) => {

  response.clearCookie('user_id');
  response.clearCookie('logged_in');
  response.redirect('/users/login');

});


// add new pokemon
app.get('/pokemon/new', (request, response) => {

  if( request.cookies['logged_in'] !== 'true' ){
    response.send('Not authorized to enter without logging in.')
  } else {
  // respond with HTML page with form to create new pokemon
  response.render('addPokemon');
  ;}
});

app.post('/pokemon/new', (request, response) => {

  let userId = request.cookies['user_id'];
  let input = request.body;
  input.id = parseInt(input.id);
  input.height += ' m';
  input.weight += ' kg';

  const queryString = 'INSERT INTO pokemon (id, num, name, img, weight, height, user_id) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *';

  let values = [input.id, input.num, input.name, input.img, input.weight, input.height, userId];

  // insert data into postgres
  pool.query(queryString, values, (err, result) => {
    if (err) {
      console.log('query error 6', err.message);
    } else {
      // go back to home page
      response.redirect('/pokemon');
    }
  });

});

// display pokemon (type in address)
app.get('/pokemon/:id', (request, response) => {

  if( request.cookies['logged_in'] !== 'true' ){
    response.send('Not authorized to enter without logging in.')
  };

  let inputId = request.params.id;

  let userId = request.cookies['user_id'];

  let userId0 = 0;

  const queryString = 'SELECT * FROM pokemon WHERE id = $1 AND (user_id = $2 OR user_id = $3)';

  let values = [inputId, userId, userId0];

  pool.query(queryString, values, (err, queryResult) => {

    if (err) {
      response.status(500).send('error 7: ' + err.message);
    } else {
      if (queryResult.rows.length > 0) {

        const pokemon = queryResult.rows[0];

          response.render('showPokemon', pokemon)
      } else {
          response.send("Pokemon Not Found.")
      }
    }

  });
});

// display pokemon (from button)
app.put('/pokemon/:id', (request, response) => {

  response.send("hello");

});

// app.post('/pokemon/:id', (request, response) => {

//   response.redirect('/pokemon')

// });

// edit pokemon
app.get('/pokemon/:id/edit', (request, response) => {

  let pokemonIndex = parseInt(request.params.id);

  if( request.cookies['logged_in'] !== 'true' ){
    response.send('Not authorized to enter without logging in.')
  };

  response.render('editPokemon', {id: pokemonIndex});

});

app.put('/pokemon/:id/edit', (request, response) => {

  let originalId = parseInt(request.params.id);

  let newValue = request.body;
  newValue.id = parseInt(newValue.id);
  newValue.height += ' m';
  newValue.weight += ' kg'; 

  // update pokemon
  const queryString = 'UPDATE pokemon SET (id = $2, num = $3, name = $4, img = $5, weight = $6, height = $7) WHERE id = $1' ;

  let values = [originalId, newValue.id, newValue.num, newValue.name, newValue.img, newValue.weight, newValue.height];

  pool.query(queryString, values, (err, queryResult) => {

    if (err) {
      response.status(500).send('error 8: ' + err.message);
    } else {
      // go back to home page
      response.redirect('/pokemon');
    }

  });

});


// Delete pokemon
app.delete('/pokemon/:id/delete', (request, response) => {

  let pokeId = parseInt(request.params.id)

  const queryString = 'DELETE from pokemon WHERE id = $1';

  let values = [pokeId];

  pool.query(queryString, values, (err, queryResult) => {

    if (err) {
      response.status(500).send('error 9: ' + err.message);
    } else {
      // go back to home page
      response.redirect('/pokemon');
    }

  });

});


// display all pokemon by id
app.get('/pokemon', (request, response) => {
  // query database for all pokemon

  let userId = request.cookies['user_id'];

  let userId0 = 0;

  if( request.cookies['logged_in'] !== 'true' ){
    response.send('Not authorized to enter without logging in.')
  };

  let queryString = 'SELECT * FROM pokemon WHERE (user_id = $1 OR user_id = $2)';

  const values = [userId, userId0];

  // gather data from postgres
  pool.query(queryString, values, (err, result) => {

    let pokeData = result.rows;

    if (err) {
      console.error('query error: 10', err.stack);
    } else {

      const data = {
        all_pokemon: pokeData
      };

      // redirect to home page
      response.render('Home', data);
    }
  });

});


// first page to user login page
app.get('', (request, response) => {

  response.redirect('/users/login')

});


/**
 * ===================================
 * Listen to requests on port 3000
 * ===================================
 */
const server = app.listen(3000, () => console.log('~~~ Ahoy we go from the port of 3000!!!'));



// Handles CTRL-C shutdown
function shutDown() {
  console.log('Recalling all ships to harbour...');
  server.close(() => {
    console.log('... all ships returned...');
    pool.end(() => {
      console.log('... all loot turned in!');
      process.exit(0);
    });
  });
};

process.on('SIGTERM', shutDown);
process.on('SIGINT', shutDown);


