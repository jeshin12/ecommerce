const { getUserDetails } = require('../helpers/user-helpers')
var productHelpers = require("../helpers/product-helpers");


module.exports = {
    sessionCheck: (req, res, next) => {

        if (req.session.users) {
            getUserDetails(req.session.users._id).then((user) => {
                if (user.isBlocked) {
                    req.session.loggedIn = false
                    req.session.users = null
                    res.redirect('/login');

                } else {
                    next()
                }

            })

        } else {

            productHelpers.getAllproduct().then((product) => {
                
                
                res.render('user/landingPage', { logged: false,product})

            })
        }
    },

    verifyLogin(req, res, next) {
        if (req.session.loggedIn) {
            
            next()
        } else {
           
            res.redirect('/login')
           
            
        }
    },

  

    nocache: (req, res, next) => {
        res.header('Cache-Control', 'private, no-cache, no-store, must-revalidate');
        res.header('Expires', '-3');
        res.header('Pragma', 'no-cache');
        next();
    }

}