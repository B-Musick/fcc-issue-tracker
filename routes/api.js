/*
*
*
*       Complete the API routing below
*
*
*/

'use strict';

var expect = require('chai').expect;
var MongoClient = require('mongodb');
var ObjectId = require('mongodb').ObjectID;


const CONNECTION_STRING = process.env.DB; //MongoClient.connect(CONNECTION_STRING, function(err, db) {});

// Import model
let Issue = require('../models/Issue.js');
let Project = require('../models/Project')


module.exports = function (app) {
  app.route('/api/issues/:project')
    .get(function (req, res){
      var project = req.params.project;
      // Type in a url with any project name
      Project.findOne({name:project}).populate('issues').exec((err, data)=>{
        err ? console.log(err): res.json(data);
      })
    })
    
    .post(function (req, res){
      // Post form data issue_title,issue_text,created_by, optional(assigned_to,status_text)
      // Issue automatically starts as open      
      Project.findById(req.query.id,(err,project)=>{
        if(err){ console.log(err); res.redirect('/'); }
        else{
          // Find the project which issue is being submitted
          Issue.create(req.body, (err, issue) => {
            // Create the issue and push the id to the Project associated
            if (err) console.log('Couldnt create issue')
            else {
              // Push the issue created to associatd project
              project.issues.push(issue)
              project.save()
              res.redirect('/' + project.name)
            }
          })
        }
      })
    })
    
    .put(function (req, res){
      Issue.findByIdAndUpdate(req.body._id,req.body,(err,issUpdate)=>{
        err ? console.log(err) : res.redirect('/' + req.params.project)
      })
    })
    
    .delete((req, res) => {
        Project.findByIdAndRemove(req.query.id, (err, removedProject) => {
          err ? res.redirect('/') : res.redirect('/');
        });
    });
    
};
