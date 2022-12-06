function addCart(productId) {
    $.ajax({
        url: "/addcart/" + productId,
        method : "get",
        success : (response)=>{
            if(response.status){
                let count = $('#cartCount').html()
                count=parseInt(count)+1
                $("#cartCount").html(count)
                
            }
        }
    })
    
 }
  
 function addFavorite(proId, btn){
  $.ajax({
    url : "/addFavorite/" + proId,
    method : "get",
    success : (res)=>{
      if(res.result){
  
        let count = $('#favCount').html()
        count = parseInt(count)+1
        $("#favCount").html(count)

    
    
     
      }else{
        let count = $('#favCount').html()
        count=parseInt(count)-1
        $("#favCount").html(count)
       
          
        
    
      }
    }
  })
}

 
 
 function changeQuantity (cartId,proId,count){
   let quantity = parseInt(document.getElementById("quantity").innerHTML);
   $.ajax({
      url : '/changeQuantity',
      data : {
           cart : cartId,
           product : proId,
           count : count
      },
      method : 'post',
      success: (respose)=>{
       document.getElementById("quantity").innerHTML = quantity + count;
   location.reload();
      }
   })
 }

 function removeProduct(cartId, productId) {
    $.ajax({
      url: "/removeProduct",
      data: {
        cart: cartId,
        product: productId,
      },
      method: "post",
      success: () => {
        location.reload();
      },
    });
  }
 
  function removeFavorite(favId,productId) {
    $.ajax({
      url: "/removeFavorite",
      data: {
        fav: favId,
        product: productId,
      },
      method: "post",
      success: () => {
        location.reload();
      },
    });
  }
 
  // $('#adcard').on('click',function (){
  //   $(this).toggleClass('selected');
  // });

  $("#checkout").submit((e)=>{
    e.preventDefault();
    $.ajax({
      url:'/checkout',
      method:'post',
      data:$('#checkout').serialize(),
      success:(resposnse)=>{
        if(resposnse.status){
         location.href ='/orderSuccess'
        }
      }
    })
  })