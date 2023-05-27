const mongoose = require('mongoose');


const productSchema = new mongoose.Schema({
    productName:{
        type: String,
        required: true
    },
    productImage:{
        type: String,
        required: true
    },
    productDescription:{
        type: String
    },
    productPrice:{
        type: Number,
        required: true
    }
},{versionKey:false});

const products = new mongoose.model('products',productSchema);

module.exports =products;
