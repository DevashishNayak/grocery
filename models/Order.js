const mongoose=require('mongoose');
const OrderSchema=new mongoose.Schema({
   
    quantity:{type:Number,required:true,default:0},
   productId:{type:String,required:true},
   userId:{type:String,required:false}
   
   }); 

const Order=mongoose.model("Order",OrderSchema);
module.exports=Order;