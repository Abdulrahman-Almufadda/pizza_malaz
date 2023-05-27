const users= require('../models/users');
const products= require('../models/products');
const history = require('../models/history');

module.exports = {
    dashboard: (req,res)=>{
    let role = req.session.user.role ;
        
        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
            history.find({},(err,history)=>{
                if(err) console.log(err)
                else{
            res.render('adminDashboard',{
                title:'admin Dashboard',
                user: req.session.user,
                role: role,
                Orders:history
            })
          }
        })
        }else{
           res.send('error') 
        }
        
    },
    users: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        users.find({},(err,users)=>{
            if(err) console.log(err)
            else {
                res.render('users',{
                title:'users info',
                user: req.session.user,
                role: role,
                Users: users
            })
        }
        })}else{
            res.redirect('/');
        }
        
    },
    editRole: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        const id = req.params.id;
        users.find({},(err,users)=>{

                res.render('usersEdit',{
                title:'users info',
                user: req.session.user,
                role: role,
                Users: users,
                userId: id,
            })
        })}else{
            res.redirect('/');
        }
     
    },
    updateRole:(req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        const id = req.params.id;
        users.findByIdAndUpdate(id,{role: req.body.role},err=>{
            if (err) return res.send(500,err);
            else res.redirect('/users')
        });
    }else{
        res.redirect('/');
    }
    },
    deleteUser: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        users.deleteOne({_id:req.params.id}, (error =>{
            if (error) console.log(error);
            else res.redirect('/users')
           
        }))
    }else{
        res.redirect('/');
    }
    },
    products: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        products.find({},(err,products)=>{
            if(err) console.log(err)
            else{
            res.render('products',{
            title:"products page",
            user: req.session.user,
            role: role,
            Products: products,
        })
            }
        })
    }else{
        res.redirect('/');
    }
     
    },
    addProducts: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        res.render('addProducts',{
            title:"add products page",
            user: req.session.user,
            role: role,
        })
    }else{
        res.redirect('/');
    }
    },
    addMeal: async (req,res) =>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
       const product = {
            productName: req.body.productName,
            productImage: "img/"+req.file.filename,
            productDescription: req.body.productDescription,
            productPrice: req.body.productPrice,
        }

        await products.insertMany([product]);

        res.redirect('/products')

        // products.find({},(err,products)=>{
        //     if(err) console.log(err)
        //     else{
        //     res.render('products',{
        //     title:"products page",
        //     user: req.session.user,
        //     role: role,
        //     Products: products,
        // })
        //     }
        // })
    }else{
        res.redirect('/');
    }   
    },
    
    deleteProduct: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        products.deleteOne({_id:req.params.id}, (error =>{
            if (error) console.log(error);
            else res.redirect('/Products')
           
        }))
    }else{
        res.redirect('/');
    }
    },

    editMeal: (req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        const id = req.params.id;
        products.find({},(err,products)=>{

                res.render('EditProducts',{
                title:'Edit product',
                user: req.session.user,
                role: role,
                Products: products,
                PID: id,
            })
        })
    }else{
        res.redirect('/');
    }
    },
    updateMeal:(req,res)=>{
        let role = req.session.user.role ;

        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
        const id = req.params.id;
        const product = {
            productName: req.body.productName,
            productImage: "img/"+req.file.filename,
            productDescription: req.body.productDescription,
            productPrice: req.body.productPrice,
        }
        products.findByIdAndUpdate(id,product,err=>{
            if (err) return res.send(500,err);
            else res.redirect('/Products')
        });
      }else{
        res.redirect('/');
      }
    },
    orderInfo: async (req,res) => {
        let role = req.session.user.role ;
        if(req.session.authorized && (role == 'admin' || role == 'super admin')){
            let id = req.params.id;
            let order = await history.findById({_id:id});
            let user = await users.findById({_id:order.userId});
            
            res.render('orderInfo',{
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