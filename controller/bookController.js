const books = require("../model/bookModel");
const stripe = require('stripe')(process.env.STRIPESECRETKEY);

exports.addBookController = async (req, res) => {
    console.log(`Inside Add Book Controller`);
    const { title, author, publisher, languages, noofpages, isbn, imgUrl, category, price, dPrice, abstract } = req.body
    console.log(title, author, publisher, languages, noofpages, isbn, imgUrl, category, price, dPrice, abstract);

    console.log(req.files);
    console.log(req.payload);

    try {
        const existingBook = await books.findOne({ title, userMail: req.payload })
        if (existingBook) {
            res.status(401).json("Book Already Exists")
        } else {
            const newBook = new books({
                title, author, publisher, languages, noofpages, isbn, imgUrl, category, price, dPrice, abstract, uploadImages: req.files, userMail: req.payload
            })

            await newBook.save()
            res.status(200).json(newBook)
        }

    } catch (error) {
        res.status(500).json(error)
    }
}

// get home book
exports.homeBookController = async (req, res) => {
    try {
        const allHomeBooks = await books.find().sort({ _id: -1 }).limit(4)
        res.status(200).json(allHomeBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all book - userside
exports.getAllUsersBookController = async (req, res) => {
    const { search } = req.query
    const userMail = req.payload
    // console.log(search);

    try {
        const query = {
            title: {
                $regex: search, $options: "i"
            },
            userMail: {
                $ne: userMail
            }

        }
        const allUsersBooks = await books.find(query)
        res.status(200).json(allUsersBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get a particular book
exports.getABookController = async (req, res) => {
    const { id } = req.params
    console.log(id);

    try {
        const specificBook = await books.findOne({ _id: id })
        res.status(200).json(specificBook)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get all user added book
exports.getAllUserAddedBookController = async (req, res) => {
    const userMail = req.payload
    try {
        const allUserBooks = await books.find({ userMail })
        res.status(200).json(allUserBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// get aa user brought book
exports.getAllUserBroughtBookController = async (req, res) => {
    const userMail = req.payload
    try {
        const allUserBroughtBooks = await books.find({ broughtBy: userMail })
        res.status(200).json(allUserBroughtBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// to delete a particular book
exports.deleteABookController = async (req, res) => {
    const { id } = req.params
    try {
        await books.findByIdAndDelete({ _id: id })
        res.status(200).json("Book Deleted")
    } catch (error) {
        res.status(500).json(error)
    }
}

// ------------ admin ---------------

// get all books

exports.getAllBookController = async (req, res) => {

    try {
        const allBooks = await books.find()
        res.status(200).json(allBooks)
    } catch (error) {
        res.status(500).json(error)
    }
}

// approve book
exports.approveBookController = async (req, res) => {
    const { id } = req.params
    try {
        const updateBook = await books.findByIdAndUpdate({ _id: id }, { status: "Approved" }, { new: true })
        res.status(200).json(updateBook)

    } catch (error) {
        res.status(500).json(error)
    }
}

// Payment

exports.paymentController = async (req, res) => {
    const email = req.payload
    console.log(email);

    const { bookDetails } = req.body
    // console.log(bookDetails);

    try {
        console.log("inside stripe");

        const existingBook = await books.findByIdAndUpdate({ _id: bookDetails._id }, {
            title: bookDetails.title,
            author: bookDetails.author,
            publisher: bookDetails.publisher,
            languages: bookDetails.languages,
            noofpages: bookDetails.noofpages,
            isbn: bookDetails.isbn,
            imgUrl: bookDetails.imgUrl,
            category: bookDetails.category,
            price: bookDetails.price,
            dPrice: bookDetails.dPrice,
            abstract: bookDetails.abstract,
            uploadImages: bookDetails.uploadImages,
            userMail: bookDetails.userMail,
            status: "Sold",
            broughtBy: email
        }, { new: true })
        console.log(existingBook);

        const line_item = [{
            price_data: {
                currency: "usd", // dollars
                product_data: {
                    name: bookDetails.title,
                    description: `${bookDetails.author} | ${bookDetails.publisher}`,
                    images: [bookDetails.imgUrl],
                    metadata: {
                        title: bookDetails.title,
                        author: bookDetails.author,
                        publisher: bookDetails.publisher,
                        languages: bookDetails.languages,
                        noofpages: bookDetails.noofpages,
                        isbn: bookDetails.isbn,
                        imgUrl: bookDetails.imgUrl,
                        category: bookDetails.category,
                        price: `${bookDetails.price}`,
                        dPrice: `${bookDetails.dPrice}`,
                        abstract: bookDetails.abstract.slice(0, 20),
                        userMail: bookDetails.userMail,
                        status: "Sold",
                        broughtBy: email
                    }
                },
                unit_amount: Math.round(bookDetails.dPrice * 100) // cent purchase amount
            },
            quantity: 1
        }]

        // create a checkout session for stripe
        const session = await stripe.checkout.sessions.create({
            // payment type
            payment_method_types: ["card"],
            // details of the product that we are purchasing
            line_items: line_item,
            // mode of payment
            mode: 'payment',
            // local dev
            // // payment is successfull
            // success_url: `http://localhost:5173/payment-success`,
            // // payment is cancelled or failed
            // cancel_url: `http://localhost:5173/payment-error`

            // server
             // payment is successfull
            success_url: `https://bookstore-frontend-april25.vercel.app/payment-success`,
            // payment is cancelled or failed
            cancel_url: `https://bookstore-frontend-april25.vercel.app/payment-error`
        });



        console.log(session);
        // res.status(200).json({ sessionId: session.id })
        res.status(200).json({ sessionURL: session.url  })


    } catch (error) {
        res.status(500).json(error)
    }
}