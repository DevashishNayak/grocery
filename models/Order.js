const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
   
    quantity:{type:Number,required:true,default:0},
   productId:{type:String,required:true},
   userId:{type:String,required:false},
   adressId:{type:String,required:false}
   
   }); 

   const AddressSchema=new mongoose.Schema({
   
pincode:{type:Number,required:true,default:0},
   city:{type:String,required:true},
   destrict:{type:String,required:true},
   adress:{type:String,required:true},
   userId:{type:String,required:false}
   
   }); 
const Order=mongoose.model("Order",OrderSchema);
const Adress=mongoose.model("Adress",AddressSchema);
module.exports={Order,Adress};