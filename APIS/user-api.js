//create mini express app
const exp = require('express')
const userApi = exp.Router();
const expressErrorHandler = require("express-async-handler")
const bcryptjs = require("bcryptjs")
const jwt = require("jsonwebtoken")
// const otp=require('otp-generator')
// const mail=require('nodemailer')
require("dotenv").config()

const multerObj = require("./middlewares/multerCloudinary")

//add body parsing middleware
userApi.use(exp.json())


//http://localhost:3000/user/getusers
//get users
userApi.get("/getusers", expressErrorHandler(async (req, res) => {

    let userCollectionObj = req.app.get("userCollectionObj")

    let userList = await userCollectionObj.find().toArray()
    res.send({ message: userList })

}))


//get user by username
userApi.get("/getuser/:username", expressErrorHandler(async (req, res, next) => {


    let userCollectionObj = req.app.get("userCollectionObj")

    //get username from url
    let un = req.params.username;
    //search
    let userObj = await userCollectionObj.findOne({ username: un })

    if (userObj === null) {
        res.send({ message: "User not existed" })
    }
    else {
        res.send({ message: userObj })
    }
}))


//http://localhost:3000/user/createuser
//create user
userApi.post("/createuser", multerObj.single('photo'), expressErrorHandler(async (req, res, next) => {

    let userCollectionObj = req.app.get("userCollectionObj")

    //get user obj
    let newUser = JSON.parse(req.body.userObj)

    //search for existing user
    let user = await userCollectionObj.findOne({ username: newUser.username })
    //if user existed
    if (user !== null) {
        res.send({ message: "User already existed" });
    }
    else {
        //hash password
        let hashedPassword = await bcryptjs.hash(newUser.password, 7)
        //replace password
        newUser.password = hashedPassword;
        //add image url
        newUser.profileImage = req.file.path;
        delete newUser.photo;
        //insert
        await userCollectionObj.insertOne(newUser)
        res.send({ message: "User created" })
    }
}))

userApi.post("/insertBill",expressErrorHandler(async(req,res,next)=>{

    let details=req.body;
    let transactionObj=req.app.get("transcationCollectionObject")
    var rand = function() {
        return Math.random().toString(36).substr(2);
    };
    details['token']=rand();
    await transactionObj.insertOne(details);
    res.send({message:"sent",token: details['token']});

}))


//http://localhost:3000/user/updateuser/<username>
userApi.put("/updateuser/:username", expressErrorHandler(async (req, res, next) => {
    let userCollectionObj = req.app.get("userCollectionObj")

    //get modified user
    let modifiedUser = req.body;
    //update
    await userCollectionObj.updateOne({ username: modifiedUser.username }, { $set: { ...modifiedUser } })
    //send res
    res.send({ message: "User modified" })

}))


//delete user
userApi.delete("/deleteuser/:username", expressErrorHandler(async (req, res) => {
    let userCollectionObj = req.app.get("userCollectionObj")

    //get username from url
    let un = req.params.username;
    //find the user
    let user = await userCollectionObj.findOne({ username: un })

    if (user === null) {
        res.send({ message: "User not existed" })
    }
    else {
        await userCollectionObj.deleteOne({ username: un })
        res.send({ message: "user removed" })
    }
}))


//user login
userApi.post('/login', expressErrorHandler(async (req, res) => {
    let userCollectionObj = req.app.get("userCollectionObj")

    //get user credetials
    let credentials = req.body;
    //search user by username
    let user = await userCollectionObj.findOne({ username: credentials.username })
    //if user not found
    if (user === null) {
        res.send({ message: "invalid username" })
    }
    else {
        //compare the password
        let result = await bcryptjs.compare(credentials.password, user.password)
        //if not matched
        if (result === false) {
            res.send({ message: "Invalid password" })
        }
        else {
            //create a token
            let signedToken = jwt.sign({ username: credentials.username }, "1234567890", { expiresIn: 10 })
            //send token to client
            res.send({ message: "login success", token: signedToken, username: credentials.username, userObj: user })
        }

    }

}))


//add to cart
userApi.post("/add-to-cart", expressErrorHandler(async (req, res, next) => {

    let userCartCollectionObject = req.app.get("userCartCollectionObject")

    let newProdObject = req.body;

    //find usercartcollection 
    let userCartObj = await userCartCollectionObject.findOne({ username: newProdObject.username })

    //if userCartObj is not existed
    if (userCartObj === null) {

        //create new object
        let products = [];
        products.push(newProdObject.productObject)

        let newUserCartObject = { username: newProdObject.username, products }

        //insert it
        await userCartCollectionObject.insertOne(newUserCartObject)

        let latestCartObj = await userCartCollectionObject.findOne({ username: newProdObject.username })
        res.send({ message: "New product Added", latestCartObj: latestCartObj })

    }
    //if existed
    else {

        let bo=true;
        for(x in userCartObj.products){
            if(userCartObj.products[x]["_id"]===newProdObject.productObject["_id"])
            {
                bo=false;
                break
            }
        }
        //push productObject to products array
        if(bo){
            userCartObj.products.push(newProdObject.productObject);
        //update document
        await userCartCollectionObject.updateOne({ username: newProdObject.username }, { $set: { ...userCartObj } })
        let latestCartObj = await userCartCollectionObject.findOne({ username: newProdObject.username })
        res.send({ message: "New product Added", latestCartObj: latestCartObj })
        }
        else
        res.send({message:"Object already exist in cart"})
    }





}))


//get products from user cart
userApi.get("/getproducts/:username", expressErrorHandler(async (req, res, next) => {

    let userCartCollectionObject = req.app.get("userCartCollectionObject")

    let un = req.params.username;

    let userProdObj = await userCartCollectionObject.findOne({ username: un })

    if (userProdObj === null) {
        res.send({ message: "Cart-empty" })
    }
    else {
        res.send({ message: userProdObj })
    }


}))


userApi.delete("/delete-from-cart/:id",expressErrorHandler(async(req,res,next)=>{

    let userCartCollectionObject=req.app.get("userCartCollectionObject");
    let id=req.params.id;
    let details=id.split('-');
    console.log(details[0]+' '+details[1]);
    let userCartObj = await userCartCollectionObject.findOne({username: details[0]})
    if(userCartObj===null){
        res.send({message:"Cart-empty"});
    }
    else{
        await userCartCollectionObject.update({username:details[0]},{$pull: { 'products':userCartObj['products'][details[1]] }})
        let userCartObjects=await userCartCollectionObject.findOne({username: details[0]});
        res.send({message:"successfully deleted.....",data:userCartObjects})
    }
}))



//dummy route to create protected resource
// userApi.get("/testing", checkToken, (req, res) => {
//     res.send({ message: "This is protected data" })
// })

//delete cart items
userApi.delete("/deleteUserCart/:username", expressErrorHandler(async (req, res) => {
    let userCollectionObj = req.app.get("userCartCollectionObject")
    //get username from url
    let un = req.params.username;
    await userCollectionObj.deleteOne({ username: un })
    console.log(un)
    res.send({ message: "user cart removed" })
    
}))


//export
module.exports = userApi;