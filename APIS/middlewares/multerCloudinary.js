//import cloudinary modules
const cloudinary = require("cloudinary").v2;
const multer = require("multer")
const { CloudinaryStorage } = require("multer-storage-cloudinary")

//configure cloudinary
cloudinary.config({
    cloud_name: 'mogalamohnivishal',
    api_key: '913125216547184',
    api_secret: '-buEd72983pclaadfO_mo_AkXN4'
})


//configure multjer-storage-cloudinary
const clStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: async (req, file) => {
        return {
            folder: "stationery",
            public_id: file.fieldname + '-' + Date.now()
        }
    }
})


//configure multer
const multerObj = multer({ storage: clStorage })

module.exports=multerObj;