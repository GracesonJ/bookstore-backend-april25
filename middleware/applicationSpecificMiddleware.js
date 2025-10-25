// application specific

const applicationSpecificMiddleware = (req, res, next)=>{
    console.log(`Inside application Specific Middleware`);
    next()
}

module.exports = applicationSpecificMiddleware