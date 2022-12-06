function validatingForm(form){
    productname =document.getElementById("productname");
    category =document.getElementById("category");
    details =document.getElementById("details");
    stock =document.getElementById("stock");
    price= document.getElementById("price")
    image = document.getElementById("customFile1") 



    if(productname.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        productname.focus();
        return false;
    }
    
    if(category.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        category.focus();
        return false;
    }

    if(details.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        details.focus();
        return false;
    }
    
    if(stock.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        stock.focus();
        return false;
    }
     
    if(price.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        price.focus();
        return false;
    }
     
    if(image.value == ""){
        document.getElementById('Error').innerHTML="Form field empty..! "
        image.focus();
        return false;
    }
   











  return true;

}