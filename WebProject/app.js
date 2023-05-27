const express = require('express');
const session = require('express-session');
const router = require('./routes/router');
const adminRouter = require('./routes/adminRouter');
const methodOverride = require('method-override');
const mongoose = require('mongoose');
const users= require('./models/users');
const bcrypt = require('bcrypt');

const app = express();


let server = "127.0.0.1:27017"
let DB = 'malaz_pizza';

mongoose.set('strictQuery',false);

mongoose.connect(`mongodb://${server}/${DB}`,{useNewUrlParser : true, useUnifiedTopology : true})
.then(()=>{
    console.log("database connected")
    checkAdmin();

})
.catch(()=>{
    console.log('error faild to connect');
})

async function checkAdmin(){
    try {
       const isSuperAdmin = await users.findOne({role:'super admin'})

       if(!isSuperAdmin){
        const sAdmin = {
            name:'admin',
            email:'admin@admin.com',
            password: await bcrypt.hash('12345678',10),
            role:'super admin'
        }
        await users.insertMany([sAdmin]);
        console.log('super admin created')
       }

       
    } catch (error) {
        console.log(error);
    }
}

app.use(express.urlencoded({extended:true}));
app.use(express.json());

app.set('view engine','ejs');
app.use(methodOverride('_method',{methods: ['POST','GET']}));
//this line for enableing the pictures,js,css
app.use(express.static(__dirname + '/public'));
app.use('/img',express.static('img'));
app.use('/css',express.static('/css/'));
app.use('/js',express.static('/js/'));


app.use(session({
    secret: "this_secert_for_the_website",
    resave:false,
    saveUninitialized:false
}))


app.use('/', router);

app.use('/',adminRouter);



app.listen(3000,()=>{
    console.log('port is open');
})