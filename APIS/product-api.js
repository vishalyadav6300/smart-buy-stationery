const exp = require("express")
const productApi = exp.Router();
const expressErrorHandler = require("express-async-handler")
productApi.use(exp.json())
const multerObj = require("./middlewares/multerCloudinary")


//adding new product

productApi.post('/add-product', multerObj.single('photo'), expressErrorHandler(async (req, res, next) => {



    let productCollectionObject = req.app.get("productCollectionObject")

    let newProduct = JSON.parse(req.body.prodObj);

    //search
    let product = await productCollectionObject.findOne({ model: newProduct.productname })

    //if proudct is existed
    if (product !== null) {
        res.send({ message: "Product already existed" })
    }
    else {
        newProduct.productImage = req.file.path;
        delete newProduct.photo;
        await productCollectionObject.insertOne(newProduct)
        res.send({ message: "New product added" })
    }


}))


//to read all products
productApi.get("/getproducts", expressErrorHandler(async (req, res, next) => {

    let productCollectionObject = req.app.get("productCollectionObject")

    let products = await productCollectionObject.find().toArray()

    res.send({ message: products })

}))


productApi.post("/sendPurchasedItems", expressErrorHandler(async (req, res, next) => {

    let purchasedCollectionObject = req.app.get("purchasedCollectionObject")

    let products = await purchasedCollectionObject.find().toArray()

    let newProducts = req.body;

    for (const prodObj of newProducts) {
        const search = products.find(element => {
        if (element.prodname === prodObj.prodname) {
            return true;
        }
        return false;
        });
console.log(search)
   search[]
    }
    await purchasedCollectionObject.(newProducts)
    res.send({ message: newProducts })

}))


module.exports = productApi;