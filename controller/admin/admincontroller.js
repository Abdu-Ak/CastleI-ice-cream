const admindetails = require("../../model/adminLogin");
const productdetails = require("../../model/product");
const userdetails = require("../../model/signUp");
const category = require("../../model/category");
const path = require("path");


module.exports = {
  getAdmin: (req, res) => {
    if (req.session.admin) {
      res.render("admin/dash");
    } else {
      res.render("admin/adminLogin");
    }
  },

  postAdminLogin: async (req, res) => {
    try {
      let user = req.body.username;
      let password = req.body.password;
      const admin = await admindetails.findOne({ username: user });
      if (admin.password === password) {
        console.log(admin.password);
        req.session.admin = user;
        res.redirect("/admin");
      } else {
        res.render("admin/adminlogin", {
          err_msg: "invalid username or password....!",
        });
      }
    } catch (error) {
      res.render("admin/adminlogin", {
        err_msg: "invalid admin....!",
      });
      console.log(error);
    }
  },

  adminLogout: (req, res) => {
    req.session.destroy();
    res.redirect("/admin");
  },

  getusers: async (req, res) => {
    
      let user = await userdetails.find();
      res.render("admin/users", { user });
    
  },

 
  blockUser: async (req, res) => {
    let id = req.params.id;

    await userdetails
      .findOneAndUpdate({ _id: id }, { $set: { Status: false } })
      .then(() => {
        res.redirect("/admin/getusers");
      });
  },

  unblockUser: async (req, res) => {
    let id = req.params.id;

    await userdetails
      .findOneAndUpdate({ _id: id }, { $set: { Status: true } })
      .then(() => {
        res.redirect("/admin/getusers");
      });
  },

  getAddproduct: (req, res) => {
   
    category.find().then((category)=>{
      res.render("admin/addProduct",{ category });
      
    })
     
   
  },

  addProduct: async (req, res) => {
    const image = req.files.image;
    const Product = new productdetails({
      productName: req.body.productname,
      Category: req.body.category,
      details: req.body.details,
      stock: req.body.stock,
      price: req.body.price,
    });
       await Product.save().then((result) => {
      if (result) {
        console.log(Product);
        let imageName = result._id;
        image.mv( "./public/productIMG/"+imageName+ ".jpg",
          (err) => {
            if (!err) {
              console.log(Product);
              res.redirect("/admin/products");
            } else {
              console.log(err);
            }
          } )
        
      } else {
        console.error();
      }
    });
  },

  getproducts: async (req, res) => {
    
      let products = await productdetails.find();
      res.render("admin/products", { products });
    
  },

  deleteProduct : (req,res)=>{
    const id = req.params.id;
    
    productdetails.deleteOne({_id :id}).then(()=>{
      res.redirect('/admin/products');
    })
  },

  editProduct :async (req,res)=>{
    const id = req.params.id;

    const productData = await productdetails.findOne({_id : id});
    category.find().then((category)=>{
      if(productData && category){
      
        res.render('admin/editProduct',{ productData , category });
      }else{
        res.render('/admin/products');
      }

    })
    

   

  },

  doEditproduct : async(req,res)=>{
    const id = req.params.id;
    console.log(id);
   
    await productdetails.updateOne(
      {_id : id},
      {
        $set: {
          productName : req.body.productname,
          Category : req.body.category,
          details : req.body.details,
          stock :  req.body.stock,
          price : req.body.price,

        },
      }
    );
    if(req?.files?.image){
      const image = req.files.image;
      image.mv("./public/productIMG/" + id + ".jpg");
      res.redirect('/admin/products')

    }else{
      res.redirect('/admin/products')
    }

      
  },

  category : (req,res)=>{
   try {
       category.find().then((allCategory)=>{
      if(allCategory){
        console.log(allCategory);
        res.render('admin/category',{ allCategory })

      }else{
        console.log("not find");

      }
    })
    
   } catch (error) {
    console.log(error);
   }
  },

  addCategory : (req,res)=>{
    try {
    
      const newCategory = new category({ 
        Category : req.body.category,

      })
      newCategory.save().then((result)=>{
        console.log(result);
        res.redirect('/admin/category');
      })
      
    } catch (error) {
      console.log(error);
    }
  
  },

  deleteCategory : (req,res)=>{
    try {
      const id = req.params.id;
    
      category.deleteOne({_id :id}).then(()=>{
        res.redirect('/admin/category');
      })
      
    } catch (error) {
      console.log(error);
    }
  },

  editCategory : (req,res)=>{
    try {
      const id =req.params.id;

      category.updateOne(
        {_id :id},
        {
          $set: {
            Category : req.body.category,
          },
        }
      ).then(()=>{
        res.redirect('/admin/category')
      })
    } catch (error) {
      console.log(error);
    }
  },



};
