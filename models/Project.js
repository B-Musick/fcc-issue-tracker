let mongoose = require('mongoose');

let projectSchema = new mongoose.Schema({
    name: {type:String, default:'No name provided'},
    issues: [
        {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Issue' 
    }]
})

module.exports = mongoose.model('Project',projectSchema)