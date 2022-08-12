const exp = require("express")
const adminApi = exp.Router()
const expressErrorHandler = require("express-async-handler")
const jwt = require("jsonwebtoken")
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
    // console.log(details);
    if(details===null)
    res.send({message:"Not data"});
    else
    res.send({message:"sent",data:details});
}))

adminApi.put('/updateTrans',expressErrorHandler(async (req,res)=>{
    let obj=req.body;
    console.log(obj);
    let transactionObj=req.app.get("transcationCollectionObject");
    await transactionObj.updateOne({"_id":obj._id},{$set:{status:obj['status']}});
    res.send({message:"Successfully Updated!!!"});
}))

adminApi.delete('/delete-product/:product',expressErrorHandler(async (req,res)=>{
    let obj=req.params.product;
    // console.log(obj);
    let productCollectionObject=req.app.get("productCollectionObject");
    await productCollectionObject.deleteOne({"productname":obj});
    res.send({message:"Successfully Deleted!!!"});
}))


module.exports = adminApi;