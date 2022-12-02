const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/admincontroller");
const session = require ("../middleware/session")

router.get("/", adminController.getAdmin);

router.post("/adminlogin", adminController.postAdminLogin);

router.get("/adminlogout", adminController.adminLogout);

router.get("/getusers", session.verifyAdmin, adminController.getusers);

router.get("/blockUser/:id", adminController.blockUser);

router.get("/unblockUser/:id", adminController.unblockUser);

router.get("/getAddproduct",session.verifyAdmin, adminController.getAddproduct);

router.post("/addproduct", adminController.addProduct);

router.get("/products",session.verifyAdmin, adminController.getproducts);

router.get("/deleteProduct/:id",adminController.deleteProduct);

router.get("/editProduct/:id",adminController.editProduct);

router.post('/doEditproduct/:id',adminController.doEditproduct);

router.get('/category',session.verifyAdmin,adminController.category);

router.post('/addCategory',adminController.addCategory);

router.get('/deleteCategory/:id',adminController.deleteCategory);

router.post('/editCategory/:id',adminController.editCategory);

module.exports = router;
