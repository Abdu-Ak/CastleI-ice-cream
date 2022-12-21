module.exports={

    verifyAdmin : (req,res,next)=>{
        if(req.session.admin){
            next();

        }else{
            res.render('admin/adminLogin');
        }
    },

    verifyUser : (req,res,next)=>{
        if(req.session.user){
            next();
        }else{
            res.redirect('/');
        }
    }


    
}