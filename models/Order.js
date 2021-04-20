const mongoose=require('mongoose');
const ProductSchema=new mongoose.Schema({
   
    quantity:{type:Number,required:true,default:0},
   product:{type:String,required:true},
   user:{type:String,required:false}
   
   }); 