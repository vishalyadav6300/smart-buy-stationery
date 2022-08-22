const exp = require("express")
const adminApi = exp.Router()
const expressErrorHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
const nodemailer = require('nodemailer');
const multerCloudinary = require("./middlewares/multerCloudinary")
adminApi.use(exp.json())

//login
adminApi.post("/login", expressErrorHandler(async (req, res, next) => {

    let credentials = req.body;
    if (req.body.username !== 'admin') {
        res.send({ message: "Invalid username" })
    }
    else if (req.body.password !== 'admin') {
        res.send({ message: "Invalid password" })
    } else {
        //create a token
        let signedToken = jwt.sign({ username: credentials.username }, 'abcdef', { expiresIn: 10 })
        //send token to client
        res.send({ message: "login success", token: signedToken, username: credentials.username })
    }
}))
//get products
adminApi.get("/getproducts", expressErrorHandler(async (req, res, next) => {

    let productCollectionObj = req.app.get("productCollectionObj")

    let products = await productCollectionObj.find().toArray()
    res.send({ message: products })


}))
//add product
adminApi.post("/addproduct", multerCloudinary.single('photo'), expressErrorHandler(async (req, res, next) => {

    let productCollectionObj = req.app.get("productCollectionObj")
    let newProduct = JSON.parse(req.body.productObj)
    newProduct.productImage = req.file.path;
    await productCollectionObj.insertOne(newProduct)
    res.send({ message: "New Product added" })

}))


adminApi.get("/transactiondetails",expressErrorHandler(async (req,res,next)=>{
    let transactionObj=req.app.get("transcationCollectionObject");
    let details=await transactionObj.find().toArray();
    if(details===null)
    res.send({message:"Not data"});
    else
    res.send({message:"sent",data:details});
}))

adminApi.put('/updateTrans',expressErrorHandler(async (req,res)=>{
    let obj = req.body;
    let transactionObj = req.app.get("transcationCollectionObject");

    await transactionObj.updateOne({ "token": obj.token }, { $set: { status: obj['status'] } });
    try {
        if (obj["status"] == "Rejected") {
            let productCollectionObject = req.app.get("productCollectionObject");
            let products = await productCollectionObject.find().toArray();
            for (const x in products) {
                for (const y in obj["purchased"]) {

                if (products[x]["productname"]==obj["purchased"][y]["productname"]){
                    products[x]["quantity"]+=obj["purchased"][y]["quantity"];
                await productCollectionObject.updateOne({productname:obj["purchased"][y]["productname"]},{$set:{quantity:products[x]['quantity']}})
                }
                }
            }
        }
    }
    catch(err) {
        console.log(err)
    }
    res.send({message:"Successfully Updated!!!"});
}))

adminApi.delete('/delete-product/:product',expressErrorHandler(async (req,res)=>{
    let obj=req.params.product;
    let productCollectionObject=req.app.get("productCollectionObject");
    await productCollectionObject.deleteOne({"productname":obj});
    res.send({message:"Successfully Deleted!!!"});
}))

adminApi.get("/getStatusCount",expressErrorHandler(async (req,res,next)=>{
    let transactionObj=req.app.get("transcationCollectionObject");
    let details=await transactionObj.find().toArray();
    let  onprogress= 0, Delivered = 0, Rejected = 0;
    for (let x in details) {
        if (details[x]['status'] === 'on progress') { onprogress++; }
        else if (details[x]['status'] === 'Delivered') { Delivered++; }
        else { Rejected++; }
    }
    let statuscount = { 'OnProgress': onprogress, 'Delivered':Delivered,'Rejected': Rejected }
    
    if(details===null)
    res.send({message:"No data"});
    else
    res.send({message:"successful",data:details,statusCount:statuscount});
}))

adminApi.get("/getProductUsers",expressErrorHandler(async (req,res,next)=>{
    let productsObj=req.app.get("productCollectionObject");
    let products = await productsObj.find().toArray();
    productObjects = {};
    for (const x in products) {
        productObjects[products[x]['productname']]=0
    }
    let purchasedCollectionObject = req.app.get("transcationCollectionObject")
    let purchased = await purchasedCollectionObject.find().toArray();
    for (const x in purchased) {
        for (const k in purchased[x]['purchased']) {
            productObjects[purchased[x]['purchased'][k]['productname']] += 1
        }
    }
    res.send({ products: productObjects,message:'sent' })
}))

adminApi.post("/send-email",expressErrorHandler(async (req,res,next)=>{
    let obj=req.body;
    let userCollectionObj=req.app.get("userCollectionObj");
    let userobj=await userCollectionObj.findOne({username:obj.username});
    let transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
            user: 'viralbuddy420@gmail.com',
            pass: 'jjgwielnjewcrmuq'
        }
      });
      
      let mailOptions = {
        from: 'viralbuddy420@gmail.com',
        to: userobj.email,
        subject: 'Now!! you can collect your items',
        text: obj.token
      };
      
      transporter.sendMail(mailOptions, function(error, info){
        if (error) {
          console.log(error);
        } else {
          console.log('Email sent: ' + info.response);
        }
      });
    res.send({message:"successfully email sent"});
}))

module.exports = adminApi;