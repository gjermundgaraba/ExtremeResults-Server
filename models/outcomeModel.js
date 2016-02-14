var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var outcomeModel = new Schema({
    typeName: {
        type: String
    },
    firstStory: {
        type: String
    },
    secondStory: {
        type: String
    },
    thirdStory: {
        type: String
    },
    effectiveDate: {
        type: Date
    }
});

module.exports = mongoose.model('Outcome', outcomeModel);