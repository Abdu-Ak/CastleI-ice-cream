const express = require("express");
const multer = require("multer");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller");
const {  verifyAdmin } = require("../middleware/session");
const { storage , cloudinary } = require('../middleware/cloudinary');
const upload = multer({storage});


router.get("/", adminController.getAdmin);

router.post("/adminlogin", adminController.postAdminLogin);

router.get("/adminlogout", adminController.adminLogout);

router.get("/getusers", verifyAdmin, adminController.getusers);

router.get("/blockUser/:id", adminController.blockUser);

router.get("/unblockUser/:id", adminController.unblockUser);

router.get("/getAddproduct",verifyAdmin, adminController.getAddproduct);

router.post("/addproduct", upload.array('image') ,adminController.addProduct);

router.get("/products",verifyAdmin, adminController.getproducts);

router.get("/deleteProduct/:id",adminController.deleteProduct);

router.get("/editProduct/:id",verifyAdmin,adminController.editProduct);

router.post('/doEditproduct/:id', upload.array('image') ,adminController.doEditproduct);

router.get('/category',verifyAdmin,adminController.category);

router.post('/addCategory',adminController.addCategory);

router.get('/deleteCategory/:id',adminController.deleteCategory);

router.post('/editCategory/:id',adminController.editCategory);

router.get('/orders',verifyAdmin,adminController.getOrders)

router.post('/changeStatus/:id',verifyAdmin,adminController.changeStatus)




module.exports = router;
