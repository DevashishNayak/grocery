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
const Banner = require('./models/product').Banner;
const Order = require('./models/Order').Order;
const { Adress } = require('./models/Order');
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

app.get("/api/categories/:id", async (req, res) => {
  const id=req.params.id;
  const productscat = await Product.find({category_id:id});
  res.json({ productscat });
});


app.get("/api/products", async (req, res) => {
  const products = await Product.find();
  res.json({products })
});

app.get("/api/search/products", async (req, res) => {
  const search=req.query.search;
  const regex = new RegExp(search, 'i') 
  const searchproducts = await Product.find(
    {name:{$regex: regex}  } 
);
  res.json({searchproducts })
});

app.get("/api/product/:id", async (req, res) => {
  const id=req.params.id;
  const product = await Product.findById(id);
  res.json({product});
});
app.get("/api/banner", async (req, res) => {

    const banner = await Banner.find();
    res.json({ title: " Banners", banner: banner });

});

app.get("/api/banner", async (req, res) => {
  const token = req.cookies.jwt;

    const All = await Banner.find();
    res.json( {All});
 
});

// ####################### authenticate ###########
// / handle errors
const handleErrors = (err) => {
  console.log(err.message, err.code);
  let errors = { email: '', password: '' };

  // incorrect email
  if (err.message === 'incorrect email') {
    errors.email = 'That email is not registered';
    return errors;
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    errors.password = 'That password is incorrect';
    return errors;

  }

  // duplicate email error
  if (err.code === 11000) {
    errors.email = 'that email is already registered';
    return errors;
  }

  // validation errors
  if (err.message.includes('user validation failed')) {
    // console.log(err);
    Object.values(err.errors).forEach(({ properties }) => {
      // console.log(val);
      // console.log(properties);
      errors[properties.path] = properties.message;
    });
  }
}

app.post('/api/login',async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await Admin.login(email, password);
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    
    res.send({msg:"logged in"});
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.send({ msg:errors.email || errors.password});
  }

});
const maxAge = 2* 60 * 60;
const createToken = (id) => {
  return jwt.sign({ id }, 'rahulk', {
    expiresIn: maxAge
  });
};
app.post('/api/signup',async (req, res) => {
  const { email, password ,mobile,address,fullname,pincode } = req.body;
  console.log(req.body);
  
  try {
    const user = await Admin.create({ email, password,mobile,address,fullname,pincode });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true, maxAge: maxAge * 1000 });
    res.status(201).json({ user: user._id,msg:"registered succesfull" });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.send({ msg:errors.email || errors.password});
  }
 
});
app.post('/api/orders',async(req,res)=>{
const {adress,city,pincode,state,userId}=req.body;
const newAdress=await Order.create({adress:adress,city:city,pincode:pincode,state:state,userId:userId});

if(newAdress){
  res.json({adressId:newAdress._id});
}
   
  res.json("unable to add the adress");
});

app.get('/api/adress',async(req,res)=>{
const adress=await Adress.find();
res.json(adress);
});




app.post('/api/adress',async(req,res)=>{
  const {userId,productId,quantity,adressId}=req.body;
  const newOrder=await Order.create({userId:userId,productId:productId,quantity:quantity,adressId:adressId});
  
  if(newOrder){
    res.json({orderId:newOrder._id});
  }
     
    res.json("unable to place th order")
  });
  
  app.get('/api/orders',async(req,res)=>{
  const orders=await Order.find();
  res.json(orders);
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

