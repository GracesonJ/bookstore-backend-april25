// import express
const express = require("express")

// const { registerController } = require("./controller/userController")

const userController = require("./controller/userController")
const { addBookController, homeBookController, getAllUsersBookController, getABookController, getAllUserAddedBookController, getAllUserBroughtBookController, deleteABookController, getAllBookController, approveBookController, paymentController } = require("./controller/bookController")
const jwtMIddleware = require('./middleware/jwtMiddleware')
const multerConfig = require("./middleware/multerMiddleware")
const { addJobController, getAllJobsController, deleteJobController } = require("./controller/jobController")
const { addApplicationController, getAllApplicationController } = require("./controller/applicationController")
const pdfMulterConfig = require("./middleware/pdfMulterMiddleware")
const jwtAdminMiddleware = require("./middleware/adminJwtMiddleware")

// instance
const routes = new express.Router()

// path to register a user
routes.post("/register", userController.registerController)
// routes.post("/register", registerController)

// login 
routes.post("/login", userController.loginController)

// GOOGLE login 
routes.post("/google-login", userController.googleLoginController)

// get Home Books - 4books
routes.get("/home-books", homeBookController)

// ------------------------ USER -------------------------------------
routes.post("/add-book", jwtMIddleware, multerConfig.array("uploadImages", 3), addBookController)

// get all book - user
routes.get("/all-users-book", jwtMIddleware, getAllUsersBookController)

// get a specific book
routes.get("/view-book/:id", getABookController)

// path to get all user added book
routes.get("/all-user-added-books", jwtMIddleware, getAllUserAddedBookController)

// path to get all user brought book
routes.get("/all-user-brought-books", jwtMIddleware, getAllUserBroughtBookController)

// delete a book
routes.delete("/delete-book/:id", deleteABookController)

// path to add job application
routes.post("/add-application", jwtMIddleware, pdfMulterConfig.single("resume"), addApplicationController)

// payment
routes.put("/make-payment", jwtMIddleware, paymentController)

// ---------- admin -----------------
// get all books
routes.get("/all-books", getAllBookController)

// approve book
routes.put("/approve-book/:id", approveBookController)

// get all users
routes.get("/all-users",  userController.getAllUsersController)

// add job
routes.post("/add-job", jwtAdminMiddleware, addJobController)

// get all jobs
routes.get("/all-jobs", getAllJobsController)

// delete job
routes.delete("/delete-job/:id", deleteJobController)

// get all job application
routes.get("/all-application", getAllApplicationController)

// update profile
routes.put("/edit-profile", jwtMIddleware, multerConfig.single("profile"), userController.updateProfileController)

// export 
module.exports = routes