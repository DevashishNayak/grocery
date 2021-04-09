const express=require('express');
const app=express();
const jwt = require('jsonwebtoken');
const mysql=require('mysql');
const PORT =  process.env.PORT || 3000;
const ejs=require("ejs");
const dotenv = require("dotenv");
const bodyParser=require('body-parser');
const cookieParser =require('cookie-parser');
const datarouter=require('./routes/productRoute');
const config =require("./config/config");
const mongoose=require('mongoose');
const authRouter=require('./routes/authRoute');
const mailRouter=require("./routes/mailRoute").router;
const Admin=require("./models/Admin");
const requireAuth=require('./middleware/authmiddleware').requireAuth;
dotenv.config();
const Category = require('./models/product').Category;
const Product = require('./models/product').Product;
const mongoUrl=config.MONGODB_URL;
// const mongoUrl="";
mongoose.connect(mongoUrl,{
  useNewUrlParser:true,
  useCreateIndex:true,
  useUnifiedTopology:true
  
}).then((res)=>{app.listen(PORT,()=>{console.log("connected to the",PORT)}) ; })
.catch(error=>console.log(error));


app.use(bodyParser.json())
app.use(cookieParser());
app.use(express.static('public'))
app.use(express.json());
app.set('view engine','ejs');

app.use(function(req, res, next) {
  res.set('Cache-Control', 'no-cache, private, no-store, must-revalidate, max-stale=0, post-check=0, pre-check=0');
  next();
});

app.use(authRouter);
app.use(mailRouter);
app.get("/api/categories", async (req, res) => {
  const categories = await Category.find();

  res.json({ title: "Categories", categories: categories })
});
app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({ title: "Products", products: products })
});
app.get('*',requireAuth);
app.use(datarouter);
app.get('/',(req,res)=>{
  const token = req.cookies.jwt;
    jwt.verify(token, 'rahulk', async (err, decodedToken) => {
     let admin = await Admin.findById(decodedToken.id);

  res.render('index',{admin:admin,title:"Dashboard"})
}); });




app.get('/forget',(req,res)=>{
  res.render('forget',{admin:admin,title:"forget password"})
});

