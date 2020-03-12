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
      if(req.query){
        // This allows you to retreive data based on any query passed in
        Project.findOne({ name: project }).populate('issues').exec((err, data) => {
          Issue.find(req.query,(err,issues)=>{
            err ? console.log(err) : res.json({ name: data.name, issues:issues });
          })
        })
      }
      else{
        // Type in a url with any project name
        Project.findOne({ name: project }).populate('issues').exec((err, data) => {
          err ? console.log(err) : res.json(data);
        })
      }

    })
    
    .post(function (req, res){
      // Post form data issue_title,issue_text,created_by, optional(assigned_to,status_text)
      // Issue automatically starts as open  
      let query;  
      if (req.query.id) query = { _id: req.query.id}  
      else query = {name:req.params.project}
      Project.findOne(query,(err,project)=>{
        if(err){ console.log(err); res.redirect('/'); }
        else{
          // Find the project which issue is being submitted

          Issue.create(req.body, (err, issue) => {
            // Create the issue and push the id to the Project associated
            if (err) res.json('Couldnt create issue')
            else {
              // Push the issue created to associatd project
              console.log(issue+' new issue')
              project.issues.push(issue)
              project.save()
              res.json(issue)
              // res.redirect('/' + project.name)
            }
          })
        }
      })
    })
    
    .put(function (req, res){
      Issue.findByIdAndUpdate(req.body._id,req.body,(err,issUpdate)=>{ 
        // Determine if anything updated or not
        let unChanged = Object.keys(req.body).every(key=>{
          if (key !== 'updated_on'){
            return req.body[key] + "" == issUpdate[key] + ""
          }
          else {return true}
        }) 
        if(unChanged)res.json('no updated field sent')
        else if (err) res.json('could not update '+req.body._id)   
        else res.json('successfully updated') //res.redirect('/' + req.params.project)
      })
    })
    
    .delete((req, res) => {
      if(req.query.issueId){
        Issue.findByIdAndRemove(req.query.issueId, (err,removedIssue)=>{
          err ? res.json('could not delete ' + _id):res.json('deleted '+req.query.issueId); 
        })
      }else if(req.query.id){
        //  If deleting project
        Project.findByIdAndRemove(req.query.id, (err, removedProject) => {
          err ? res.redirect('/') : res.redirect('/');
        });
      } else res.json('_id error');
    });
};
