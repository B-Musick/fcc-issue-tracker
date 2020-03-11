
let Project = require('../models/Project');
let Issue = require('../models/Issue');

module.exports = (app)=>{
    /***************************** Index page (static HTML) ************************/
    app.get('/', (req, res) => { Project.find({}, (err, projects) => { res.render('index', { projects }); }) });

    // Create new project, submit a name, instantiated with empty array of 'issues'
    app.post('/', (req, res) => {
        let project = { name: req.body.name } // Get the project name from the form
        Project.create(project, (err, newProject) => { err ? console.log(err) : res.redirect('/'); })
    })

    // This will load the form for submitting an issue
    // User submits issue, the api.js routes handle it and AJAX will get the data and print it to screen
    app.get('/:project', (req, res) => {
        let update = false; // Set to true if ?form=update sent through query
        let issueID = ''; // Id used to get issue to update
        if (req.query.form === 'update') {
            update = true; // This will determine that update form used
            issueID = req.query.updateId;
        }
        Project.findOne({name:req.params.project}).populate('issues').exec((err, showProject) => {
            if (err) console.log(err);
            else if(update){ 
                Issue.findById(issueID , (err, issue) => {
                    console.log(issue + ' issue')
                    // Find the issue from the id passed in through query
                    res.render('issue', { project: showProject, update, name: showProject.name, issues: showProject.issues, issueToUpdate: issue });           
                })
            }else{
                res.render('issue', { project: showProject, update, name: showProject.name, issues: showProject.issues });           
            };
        });
    });
}

