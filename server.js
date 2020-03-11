'use strict';

var express     = require('express');

var bodyParser  = require('body-parser');
var expect      = require('chai').expect;
var cors        = require('cors');
let dotenv = require('dotenv'); // .env file

// This is needed for the PUT request of update
let methodOverride = require('method-override');

// Import routes, they are modules so access apiRoutes(app)
var apiRoutes         = require('./routes/api.js');
var fccTestingRoutes  = require('./routes/fcctesting.js');
var indexRoutes       = require('./routes/index.js');
var runner            = require('./test-runner');

// Security package
let helmet = require('helmet');
var app = express();
var mongoose = require('mongoose');
app.set('view engine', 'ejs'); // Dont have to add .ejs to files

var favicon = require('serve-favicon');
const path = require('path');

// Import project model
let Project = require('./models/Project');
let Issue = require('./models/Issue');
mongoose.connect('mongodb://localhost:27017/issue_tracker', { useNewUrlParser: true, useUnifiedTopology: true }); 

// So .env variables can be accessed process.env.VAR
dotenv.config();

/**************** PREVENTS ANY BACKLASH FROM DIRECTORY CHANGES *****************
- Allows stylesheets to be imported to header accessing '/stylesheets'
- Serve static assets
- express.static() is used to serve static assets (directories containing stylesheets, scripts, images, etc)
- So now all pages can access the stylesheets folder in /public by calling src="/stylesheets/.."
- The parameter is the absolute path to folder containing static assets
*/
app.use(express.static(__dirname + "/public"));
app.use(helmet.xssFilter()); // Added this to protect against XSS
app.use(cors({origin: '*'})); //For FCC testing purposes only

// Used on the anchor which is calling the PUT route '?_method=PUT'
app.use(methodOverride("_method")); // For PUT method

// So can access req.body to get the form data submitted
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/favicon.ico', (req, res) => res.status(204));

/******************************* IMPORTED ROUTES *******************************/
// Index routes
indexRoutes(app);

//For FCC testing purposes
fccTestingRoutes(app);

//Routing for API 
apiRoutes(app);  
    
//404 Not Found Middleware
app.use(function(req, res, next) {
  res.status(404)
    .type('text')
    .send('Not Found');
});

//Start our server and tests!
app.listen(process.env.PORT || 3000, function () {
  console.log("Listening on port " + process.env.PORT);
  if(process.env.NODE_ENV==='test') {
    console.log('Running Tests...');
    setTimeout(function () {
      try {
        runner.run();
      } catch(e) {
        var error = e;
          console.log('Tests are not valid:');
          console.log(error);
      }
    }, 3500);
  }
});

module.exports = app; //for testing
