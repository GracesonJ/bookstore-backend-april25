const multer = require("multer")

const storage = multer.diskStorage({
    destination : (req, file, callback)=>{
        callback(null, "./imgUploads" )
    },
    filename : (req, file, callback)=>{
        callback(null, `Image - ${file.originalname}`)
    }
})

const fileFilter = (req, file, callback)=>{
    if(file.mimetype == "image/jpeg" || file.mimetype == "image/jpg" || file.mimetype == "image/png"){
        callback(null, true)
    }else{
        callback(null, false)
        return callback(new Error("Only Accepts png, jpg &n jpeg files"))
    }
}

const multerConfig = multer({
    storage,
    fileFilter
})

module.exports = multerConfig