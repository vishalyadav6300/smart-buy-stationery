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
    let newProducts = req.body;
    // console.log(newProducts)
    for (const prodObj in newProducts) {
        // console.log(newProducts[prodObj].productname)
        let wa = await purchasedCollectionObject.find({ productname: newProducts[prodObj].productname }).toArray()
        if (wa.length) { 
            await purchasedCollectionObject.updateOne({productname: newProducts[prodObj].productname}, {$set:{quantity:newProducts[prodObj].quantity+wa[0].quantity}})
        }
        else {
             await purchasedCollectionObject.insert(newProducts[prodObj])
        }
    }

    res.send({ message: "Successful" })

}))

productApi.get("/getPurchasedItems", expressErrorHandler(async (req, res, next) => {

    let purchasedCollectionObject = req.app.get("purchasedCollectionObject")
    let productitems = await purchasedCollectionObject.find().toArray()
    console.log(productitems);
    res.send({ items: productitems ,message:'successful'})

}))

productApi.get("/recommendItems", expressErrorHandler(async (req, res, next) => {

    let purchasedCollectionObject = req.app.get("purchasedCollectionObject")
    let productitems = await purchasedCollectionObject.find().toArray()
    let dup=await purchasedCollectionObject.find().toArray()
    for (const prodObj of productitems) {
        prodObj['totalAmount']= prodObj['price']*prodObj['quantity']
    }
    for (const prodObj of dup) {
        prodObj['totalAmount']= prodObj['price']*prodObj['quantity']
    }
    let amountSort = productitems.sort((a, b) => b.totalAmount - a.totalAmount)
    console.log(amountSort)
    let quantitySort = dup.sort((a, b) => b.quantity - a.quantity)
    console.log(amountSort)
    res.send({ amount: amountSort, quantity: quantitySort,message:'successful' })
}))


module.exports = productApi;