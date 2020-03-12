/*
*
*
*       FILL IN EACH FUNCTIONAL TEST BELOW COMPLETELY
*       -----[Keep the tests in the same order!]-----
*       (if additional are added, keep them at the very end!)
*/

var chaiHttp = require('chai-http');
var chai = require('chai');
var assert = chai.assert;
var server = require('../server');
var Project = require('../models/Project');
var Issue = require('../models/Issue');
var should = chai.should;

var mongoose = require('mongoose')
chai.use(chaiHttp);
// Project.collection.drop(); // Drop all current values from the database
let id1;
// Create the new project
before(function (done) {
  var newProject = new Project({
    name: 'test',
  });

  newProject.save(function (err) {
    done();
  });
});
suite('Functional Tests', function() {

    suite('POST /api/issues/{project} => object with issue data', function() {
      test('Every field filled in', function(done) {
       chai.request(server)
        .post('/api/issues/test')
        .send({
          project: 'test',
          issue_title: 'Title',
          issue_text: 'text',
          created_by: 'Functional Test - Every field filled in',
          assigned_to: 'Chai and Mocha',
          status_text: 'In QA'
        })
        .end(function(err, res){
          id1 = res.body._id
          assert.equal(res.status, 200);
          assert.isDefined(res.body.issue_title)
          assert.isDefined(res.body.project)
          assert.isDefined(res.body.issue_text)
          assert.isDefined(res.body.created_by)
          assert.isDefined(res.body.assigned_to)
          assert.isDefined(res.body.status_text)
          done();
        });
      });
      
      test('Required fields filled in', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            project: 'test',
            issue_title: 'Required fields filled',
            issue_text: 'text',
            created_by: 'Functional Test - Required field filled in',
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isDefined(res.body.issue_title)
            assert.isDefined(res.body.project)
            assert.isDefined(res.body.issue_text)
            assert.isDefined(res.body.created_by)
            done();
          });
      });
      
      test('Missing required fields', function(done) {
        chai.request(server)
          .post('/api/issues/test')
          .send({
            project:'test',
            issue_title: 'Missing req fields',
            issue_text: '',
            created_by: ''
          })
          .end(function (err, res) {
            // Wont be able to create issue if required fields not filled
            assert.equal(res.body,'Couldnt create issue')
            done();
          });
      });
      
    });
    
    suite('PUT /api/issues/{project} => text', function() {
      
      test('No body', function (done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: id1
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body)
            assert.equal(res.body, 'no updated field sent');
            done();
          });
        })
      
      test('One field to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: id1,
            created_by: 'Brendan_update'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body)
            assert.equal(res.body, 'successfully updated');
            done();
          });
      });
      
      test('Multiple fields to update', function(done) {
        chai.request(server)
          .put('/api/issues/test')
          .send({
            _id: id1,
            created_by: 'Brendan_updated_again',
            issue_text: 'New text'
          })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body)
            assert.equal(res.body, 'successfully updated');
            done();
          });
      });
      
    });
    
    suite('GET /api/issues/{project} => Array of objects with issue data', function() {
      
      test('No filter', function(done) {
        chai.request(server)
        .get('/api/issues/test')
        .query({})
        .end(function(err, res){
          assert.equal(res.status, 200);
          assert.isArray(res.body.issues);
          assert.property(res.body.issues[0], 'issue_title');
          assert.property(res.body.issues[0], 'issue_text');
          assert.property(res.body.issues[0], 'created_on');
          assert.property(res.body.issues[0], 'updated_on');
          assert.property(res.body.issues[0], 'created_by');
          assert.property(res.body.issues[0], 'assigned_to');
          assert.property(res.body.issues[0], 'open');
          assert.property(res.body.issues[0], 'status_text');
          assert.property(res.body.issues[0], '_id');
          done();
        });
      });
      
      test('One filter', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'Title', issue_text: 'text'})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.issues);
            assert.equal(res.body.issues[0].issue_title, 'Title')
            assert.equal(res.body.issues[0].issue_text, 'text')
            assert.property(res.body.issues[0], 'issue_title');
            assert.property(res.body.issues[0], 'issue_text');
            assert.property(res.body.issues[0], 'created_on');
            assert.property(res.body.issues[0], 'updated_on');
            assert.property(res.body.issues[0], 'created_by');
            assert.property(res.body.issues[0], 'assigned_to');
            assert.property(res.body.issues[0], 'open');
            assert.property(res.body.issues[0], 'status_text');
            assert.property(res.body.issues[0], '_id');
            done();
          });
      });
      
      test('Multiple filters (test for multiple fields you know will be in the db for a return)', function(done) {
        chai.request(server)
          .get('/api/issues/test')
          .query({ issue_title: 'Title', })
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.isArray(res.body.issues);
            assert.equal(res.body.issues[0].issue_title, 'Title')
            assert.property(res.body.issues[0], 'issue_title');
            assert.property(res.body.issues[0], 'issue_text');
            assert.property(res.body.issues[0], 'created_on');
            assert.property(res.body.issues[0], 'updated_on');
            assert.property(res.body.issues[0], 'created_by');
            assert.property(res.body.issues[0], 'assigned_to');
            assert.property(res.body.issues[0], 'open');
            assert.property(res.body.issues[0], 'status_text');
            assert.property(res.body.issues[0], '_id');
            done();
          });
      });
    });
    
    suite('DELETE /api/issues/{project} => text', function() {
      
      test('No _id', function(done) {
        chai.request(server)
          .delete('/api/issues/test')
          .query({})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            console.log(res.body)
            assert.equal(res.body, '_id error')
            done();
          });
      });
      
      test('Valid _id', function(done) {
        // issueId
        chai.request(server)
          .delete('/api/issues/test')
          .query({issueId:id1})
          .end(function (err, res) {
            assert.equal(res.status, 200);
            assert.equal(res.body, 'deleted ' + id1)
            done();
          });
      });
      
    });

});
