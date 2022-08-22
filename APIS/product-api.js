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
    let dup = await purchasedCollectionObject.find().toArray()
    let pricesArr=await purchasedCollectionObject.find().toArray()
    for (const prodObj of productitems) {
        prodObj['totalAmount']= prodObj['price']*prodObj['quantity']
    }
    for (const prodObj of dup) {
        prodObj['totalAmount']= prodObj['price']*prodObj['quantity']
    }
    for (const prodObj of pricesArr) {
        prodObj['totalAmount']= prodObj['price']*prodObj['quantity']
    }
    let amountSort = productitems.sort((a, b) => b.totalAmount - a.totalAmount)

    let quantitySort = dup.sort((a, b) => b.quantity - a.quantity)

    let pricesSort = pricesArr.sort((a,b)=>b.price -a.price)

    res.send({ amount: amountSort, quantity: quantitySort, price: pricesSort,message:'successful' })
}))

productApi.put("/decrement-quantity", expressErrorHandler(async (req, res, next) => {
    let productCollectionObject = req.app.get("productCollectionObject")

    let products = await productCollectionObject.find().toArray()

    let cartProducts=req.body;
   // console.log(cartProducts);
    let flag=0;
    let v;
    for(let i in cartProducts){
        //console.log(cartProducts[i]['productname']);
        for(let j in products){
            if(cartProducts[i]['productname']==products[j]['productname']){
                //console.log(products[j]['quantity']-cartProducts[i]['quantity'])
                if((products[j]['quantity']-cartProducts[i]['quantity'])>=0){
                    products[j]['quantity']-=cartProducts[i]['quantity'];
                }
                else{
                flag=1;
                v=cartProducts[i]['productname'];
                break
                }
            }
        }
        if(flag)
        break
    }
    if(flag)
    res.send({message:"Insuccifent quantity of"+v});
    else{
      for(let i in products){
        await productCollectionObject.updateOne({productname:products[i]['productname']},{$set:{quantity:products[i]['quantity']}});
      }
      res.send({message:"okay"});
    }
    

}))



module.exports = productApi;