const mongoose = require('mongoose'), Schema = mongoose.Schema

const tds = Schema({
    iUserId: {
        type: Schema.Types.ObjectId,
        ref: 'users',
        required: [true, 'Enter userId']
    }, 
    nAmount: {
        type: Number,
        required: [true, 'Enter Amount']
    },
    nOriginalAmount: {
        type: Number,
        required: [true, 'Enter amount']
    },
    eStatus: {
        type: String,
        enum: ['S', 'F'],
        default: 'S',
        require: [true, 'Enter Status']
    },
    nPercentage: {
        type: Number,
        require: [true, 'Enter Percentage'],
        default: 30
    }
}, { timestamps: false })

const TDS = mongoose.model('TDS', tds)

module.exports = TDS