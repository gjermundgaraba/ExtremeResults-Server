var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var reflectionModel = new Schema({
    typeName: {
        type: String,
        required: true
    },
    firstThingThatWentWell: {
        type: String,
        required: true
    },
    secondThingThatWentWell: {
        type: String,
        required: true
    },
    thirdThingThatWentWell: {
        type: String,
        required: true
    },
    firstThingToImprove: {
        type: String,
        required: true
    },
    secondThingToImprove: {
        type: String,
        required: true
    },
    thirdThingToImprove: {
        type: String,
        required: true
    },
    effectiveDate: {
        type: Date,
        required: true
    }
});

module.exports = mongoose.model('Reflection', reflectionModel);