const users= require('../models/users');
const products= require('../models/products');
const cart = require('../models/cart');
const history = require('../models/history');
const bcrypt = require('bcrypt');

module.exports = {
    index:(req,res)=>{
        if(req.session.authorized){
            products.find({},(err,products)=>{
                if(err) console.log(err)
                else{
                    res.render('index',{
                    title:'Home page',
                    user: req.session.user,
                    role: req.session.user.role,
                    Products:products
            })}})
           
        }else{
            products.find({},(err,products)=>{
                if(err) console.log(err)
                else{
                    res.render('index',{
                    title:'Home page',
                    role: "guest",
                    Products:products
            })}})
        }
       
    },
    
    login: (req,res)=>{
        if(!req.session.authorized){
          res.render('login.ejs',{
          title:'Login page',
          role:"guest",
          errors: []
        })  
        }else{
            products.find({},(err,products)=>{
                if(err) console.log(err)
                else{
                    res.redirect('/')
        }})
        }
    },
    loginPost: async (req,res)=>{
        let errors = [];
        const email = req.body.email;
    
       let user = await users.findOne({email:email})
    
        let match = await bcrypt.compare(req.body.password,user.password)
    
        if(match){
            console.log('login success')
            req.session.user = user;
            req.session.authorized = true;
            res.redirect('/');
        }else{
            errors.push({error:'something wrong with email or password'});
        }
    
        if(errors.length > 0){
            res.render('login',{
                errors: errors,
                title: 'login page',
                role:"guest"
            })
        }
    },

    register: (req,res)=>{
        if(!req.session.authorized){
          res.render('register',{
            title:'register page',
            role:"guest",
            errors: []
        })  
        }else{
            products.find({},(err,products)=>{
                if(err) console.log(err)
                else{
                    res.redirect('/')
            }}) 
        }
        
    },
   

    registerPost: async (req,res)=>{
        try{
        let errors = [];
    
        if(req.body.password !== req.body.password2){
            errors.push({error: "passwords does not match"})
        }
        if(req.body.password.length < 8){
            errors.push({error: "passwords must be at least 8 characters long"})
        }
        if(errors.length > 0){
            res.render('register',{
                errors: errors,
                title: 'register page',
                role:"guest"
            })
        }else{
            users.findOne({email:req.body.email})
            .then(async(user)=>{
            if(user){
                errors.push({error:"Email already exisit"});
                res.render('register',{
                    title:'register',
                    errors:errors,
                    role:"guest"
                    
                })
            }else{
                let newName =req.body.name;
                let newEmail = req.body.email
                let hashedPassword = await bcrypt.hash(req.body.password,10);  
    
                const info = {
                    name: newName,
                    email: newEmail,
                    password: hashedPassword
                }
                console.log(info);
                await users.insertMany([info]);
                res.redirect('/login'); 
            }
        })
        }
        
        }catch(err){
            console.log(err.message)
        }
        
    },
    logout: (req,res) =>{
        req.session.destroy();
        res.redirect('/');
    },
    cart:(req,res)=>{
        if(req.session.authorized){
            cart.find({},(err,cart)=>{
                if(err) console.log(err)
                else{
                     res.render('cart',{
                     title:'cart',
                     user: req.session.user,
                     role: req.session.user.role,
                     items: cart,
                         })
                    }
            })
          
          }else{
            res.redirect('/login')
       }
    },
    addCart:(req,res)=>{
        let alert=[];
         
        
    },
    addToCart: async (req,res) => {
       
        if(req.session.authorized){
            let id = req.params.id;
            let alert=[]; 
        const product = await products.findById(id);
                     

        const draftCartInfo = {
            userId: req.session.user._id,
            productId: id,
            productName:product.productName,
            productImage:product.productImage,
            productPrice:product.productPrice,
        }
        
        let quantity = await cart.countDocuments({productId:draftCartInfo.productId,userId: draftCartInfo.userId});
        let price = product.productPrice;

        if(quantity == 0){
            const cartInfo = {
                userId: req.session.user._id,
                productId: product.id,
                productName:product.productName,
                productImage:product.productImage,
                quantity:1,
                productPrice:product.productPrice,
                }
              
                await cart.insertMany([cartInfo]);
            }else{
              
               let meal = await cart.findOne({userId: req.session.user._id,productId: product.id})
    
               quantity = meal.quantity
               parseInt(quantity);
               quantity++;
               inCartPrice = meal.productPrice;
               parseInt(inCartPrice);

                inCartPrice += price;

                console.log(quantity,inCartPrice);

                cart.findOneAndUpdate({productId:id,userId: req.session.user._id},{$set:{quantity:quantity,productPrice:inCartPrice}}, {new: true}, (err, doc) => {
                    if (err) {
                        console.log("Something wrong when updating data!");
                    }
                
                    console.log(doc);
            })}
            
        res.redirect('/');
        }else{
            res.redirect('/login')
        }
        
    },
    deleteItem: async (req,res) =>{
        cart.deleteOne({_id:req.params.id}, (error =>{
            if (error) console.log(error);
            else res.redirect('/cart')
           
        }))
    },
    buyItems: async (req,res) =>{
        const id = req.params.id;
        const location = req.body.location;
        const phone = req.body.phone;
        const totalPrice = parseInt(req.body.totalPrice);
        let productNames = [];
        let quantities = [];
       let items = await cart.find({userId:id});

       items.forEach(item =>{
        productNames.push(item.productName);
        quantities.push(item.quantity);
       })

       const log = {
        userId: id,
        phone: phone,
        location: location,
        receiptNumber: Date.now(),
        productName: productNames,
        quantity: quantities,
        totalPrice: totalPrice,

       }

      await history.insertMany([log]);

      await cart.deleteMany({userId:id});
       res.redirect('/');
    },
    history: async (req,res) => {
     
        if(req.session.authorized){
            history.find({},(err,history)=>{
                if(err) console.log(err)
                else{
            res.render('orderHistory',{
                title:'Order History',
                user: req.session.user,
                role: req.session.role,
                Orders:history
            })
        }})
        }else{
            res.redirect('/');
          }
    },
    userOrder: async (req,res) => {
        let role = req.session.user.role ;
        if(req.session.authorized){
            let id = req.params.id;
            let order = await history.findById({_id:id});
            let user = await users.findById({_id:order.userId});
            
            res.render('customerOrder',{
                title:"Order Information",
                user: req.session.user,
                role:role,
                Order:order,
                User:user,
            })
        }else{
            res.redirect('/');
          }
    }

}