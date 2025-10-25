// 10 import dotenv module
require("dotenv").config() // to load environment

// const dotenv = require("dotenv")
// dotenv.config()

// 1. import express
const express = require("express")

// 5. import cors
const cors = require("cors")

// 8. import routes
const routes = require("./router")

// 11 import connection
require("./connection")

// import application specific middleware
// const appMiddleware = require("./middleware/applicationSpecificMiddleware")

// 2. create server
const bookStoreServer = express()

// 6. use cors to connect with frontend
bookStoreServer.use(cors())

// 7. parse the json data - middleware - 
bookStoreServer.use(express.json())

// use appMiddleware
// bookStoreServer.use(appMiddleware)

// 9. tell server to use router
bookStoreServer.use(routes)

// export imageUploads 
bookStoreServer.use("/upload", express.static("./imgUploads"))

// export pdfuploads
bookStoreServer.use("/pdfUpload", express.static("pdfUploads"))

// 3. set port 
const PORT = 4000 || process.env.PORT

// 4. tell server to listen the port
bookStoreServer.listen(PORT, ()=>{
    console.log(`Server Running Successfull at port Number : ${PORT}`);
    
})

