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

module.exports = adminApi;