const adminRouter = require('express').Router();
const adminController = require('../controller/admin');
const path = require('path');


const multer = require('multer');
//source of this code for uploader: https://www.youtube.com/watch?v=wIOpe8S2Mk8
const storage = multer.diskStorage({
    destination:(req,file,cb) =>{
        cb(null,"./img");
    },
    filename: (req,file,cb) =>{
        cb(null, Date.now() + path.extname(file.originalname) );
    },
});
const upload = multer({storage: storage});

//TODO don't allow user to reach here
adminRouter.get('/admin', adminController.dashboard);

adminRouter.get('/users', adminController.users);

adminRouter.get('/users/:id', adminController.deleteUser);

adminRouter.get('/role/:id', adminController.editRole);
adminRouter.put('/role/:id', adminController.updateRole);

adminRouter.get('/products', adminController.products);

adminRouter.get('/addProducts', adminController.addProducts);
adminRouter.post('/addProducts', upload.single("productImage"),adminController.addMeal);

adminRouter.get('/deleteProduct/:id',adminController.deleteProduct);

adminRouter.get('/editProduct/:id',adminController.editMeal);
adminRouter.put('/editProduct/:id',upload.single("productImage"), adminController.updateMeal);

adminRouter.get('/orderInfo/:id',adminController.orderInfo);

module.exports = adminRouter;