const mongoose = require('mongoose');


const historySchema = new mongoose.Schema({

    userId:{
        type: String,
        required: true
    },
    phone:{
        type: Number,
        required: true
    },
    location:{
        type: String,
        required: true
    },
    receiptNumber:{
        type: String,
        required: true
    },
    productName:{
        type: Array,
        required: true
    }, 
    quantity:{
        type: Array,
        required:true
    },
    totalPrice:{
        type:Number,
        required:true
    }
},{versionKey:false})

const history = new mongoose.model('OrderHistory',historySchema);

module.exports = history;