let mongoose = require('mongoose');

let issueSchema = new mongoose.Schema({
    project:{type:String,required:true, select:false},
    issue_title:{type:String,required:true},
    issue_text:{type:String,required:true},
    created_by:{type:String,required:true},
    assigned_to:String,
    status_text:String,
    created_on:{type:Date,default:Date.now()},
    updated_on: { type: Date, default: Date.now() },
    open: {type:Boolean, default:true}
})

module.exports = mongoose.model('Issue',issueSchema)