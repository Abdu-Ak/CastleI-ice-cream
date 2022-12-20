const admindetails = require("../../model/adminLogin");
const productdetails = require("../../model/product");
const userdetails = require("../../model/signUp");
const category = require("../../model/category");
const order = require("../../model/order");
const { default: mongoose } = require("mongoose");
const cart = require("../../model/cart");
const favorite = require("../../model/favorite");
const coupon = require("../../model/coupon");



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
   try {
   
    const Product = new productdetails({
      productName: req.body.productname,
      Category: req.body.category,
      details: req.body.details,
      stock: req.body.stock,
      price: req.body.price,
    });
    Product.image = req.files.map((f)=>({url:f.path, filename:f.filename}))
       await Product.save().then((result) => {
      if (result) {
        console.log(Product);
        
      
       
              res.redirect("/admin/products");
            
        
      } else {
        console.error();
      }
    });
   } catch (error) {
    console.error();
   }
  },

  getproducts: async (req, res) => {
    
      let products = await productdetails.find();
      res.render("admin/products", { products });
    
  },

  deleteProduct : (req,res)=>{
    const id = req.params.id;
    const objId = mongoose.Types.ObjectId(id)
    productdetails.deleteOne({_id :id}).then(()=>{

        cart.updateMany(
          {"product.productId" : objId},
          {$pull : {product : { productId : objId}}},
          ).then(()=>{

            favorite.updateMany(
              {"product.productId" : objId},
              {$pull : {product : { productId : objId}}},
            ).then(()=>{
              
              res.redirect('/admin/products');
            })
          })
     
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
      
    const photos = req.files.map((f)=>({
      url:f.path,
      filename: f.filename,
    }));
   
   const product = await productdetails.updateOne(
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
    console.log(photos);
    if(photos.length){
      const product = await productdetails.updateOne(
        {_id : id},
        {
          $set : {image : photos },
        }
     ).then(()=>{
      res.redirect('/admin/products')
     })

    }else{
      res.redirect('/admin/products')
    }

      
  },

  category : (req,res)=>{
   try {
       category.find().then((allCategory)=>{
      if(allCategory){
        
        res.render('admin/category',{ allCategory })

      }else{
        console.log("not find");

      }
    })
    
   } catch (error) {
    console.log(error);
   }
  },

  addCategory :  async (req,res)=>{
    try {
     newCategory = req.body.category
    let  allCategory  = await category.find();
      category.find({ Category : newCategory}).then((result)=>{
        if (result.length) {
          res.render('admin/category',{
            err_msg : 'Category already existed...!', allCategory
          })
        } else {
          const newcategory = new category({ 
            Category : req.body.category,
    
          })
          newcategory.save().then((result)=>{
           
            res.redirect('/admin/category');
          })
        }
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

  editCategory : async (req,res)=>{
    try {
      const id =req.params.id;
      newCategory = req.body.category
      let  allCategory  = await category.find();
      let oldCat = await category.find({_id  : id })
    
      category.find({ Category : newCategory }).then((result)=>{
        if (result.length) {
          res.render('admin/category',{
            err_msg : 'Category already existed...!', allCategory
          })
        } else {
          category.updateOne(
            {_id :id},
            {
              $set: {
                Category : newCategory,
              },
            }
          ).then(()=>{
            
            productdetails.updateMany(
              {Category : oldCat[0].Category},
              {
                $set: {
                  Category : newCategory,
                }
              }
              ).then(()=>{
                
                res.redirect('/admin/category')
              })
           
          })
        }
      })
        

     
    } catch (error) {
      console.log(error);
    }
  },

   getOrders :  (req,res)=> {
    try {
      order.aggregate([
       
        {
          $lookup : {
            from : "productdetails",
            localField : "orderItem.productId",
            foreignField : "_id",
            as : "productDetail",
          },
        },
        
  
      ]).then((orders)=>{
        res.render('admin/orders',{ orders })
        
      })
   
       
    } catch (error) {
      
    }

   },

   changeStatus : (req,res)=>{
      try {
        const id = req.params.id;
        const data = req.body;

        order.updateOne({_id : id},{$set : {orderStatus: data.orderStatus , paymentStatus : data.paymentStatus}}).then(()=>{
          res.redirect('/admin/orders')
         })
        
      } catch (error) {
        
      }
   },
   getCoupon : (req,res)=>{
     try {
      coupon.find().then((coupons)=>{
         console.log(coupons);
        res.render('admin/coupon',{
          coupons
        });

      })
     } catch (error) {
      
     }
    
   },
   addCoupon : (req,res)=>{
    try {
      const data = req.body;
      const dis = parseInt(data.discount);
      const max = parseInt(data.maxlimit);
      const discount = dis / 100;
      
      coupon.create({
        couponName : data.coupon,
        discount : discount,
        maxLimit : max,
        expiryDate : data.expirydate
      }).then(()=>{
        res.redirect("/admin/coupon")
      })
     

    } catch (error) {
      
    }
      
   },
   deleteCoupon  : (req,res)=>{
        try {
          let id = req.params.id
          coupon.deleteOne({_id : id }).then(()=>{
            res.redirect("/admin/coupon")
          })
        } catch (error) {
          
        }


   },
   editCoupon : (req,res)=>{
     try {
      const id = req.params.id;
      const data = req.body;
      console.log(data);
      coupon
        .updateOne(
          { _id: id },
          {
            couponName: data.coupon,
            discount: data.discount,
            maxLimit: data.maxlimit,
            expiryDate: data.expirydate,
          }
        )
        .then(() => {
          res.redirect("/admin/coupon");
        });
     } catch (error) {
      
     }
   },
};
