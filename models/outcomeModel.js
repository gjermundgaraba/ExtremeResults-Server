var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var outcomeModel = new Schema({
    typeName: {
        type: String,
        required: true
    },
    firstStory: {
        type: String,
        required: true
    },
    secondStory: {
        type: String,
        required: true
    },
    thirdStory: {
        type: String,
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Outcome', outcomeModel);