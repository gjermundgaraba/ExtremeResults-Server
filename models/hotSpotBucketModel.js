var mongoose = require('mongoose'),
    Schema = mongoose.Schema;

var hotSpotBucketModel = new Schema({
    name: {
        type: String,
        required: true
    },
    hotSpots: [{
        type: String,
        required: true
    }],
    user: {
    type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
}
});

module.exports = mongoose.model('HotSpotBucket', hotSpotBucketModel);