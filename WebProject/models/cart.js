const mongoose = require('mongoose');


const cartSchema = new mongoose.Schema({

    userId:{
        type: String,
        required: true
    },
    productId:{
        type: String,
        required: true
    },
    productName:{
        type: String,
        required: true
    }, 
    productImage:{
        type: String,
        required: true
    },
    quantity:{
        type: Number,
        required:true
    },
    productPrice:{
        type: Number,
        required: true
    }
},{versionKey:false})

const cart = new mongoose.model('cart',cartSchema);

module.exports = cart;