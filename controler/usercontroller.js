const { log } = require("console")
const { doSignup, dologin,getUserDetails } = require("../helpers/user-helpers")
var productHelpers=require("../helpers/product-helpers")

module.exports = {

    loginPage(req, res) {
        if (req.session.loggedIn) {

            console.log("callingggggggggggggggggggggggggggggggg");
            res.redirect('/')
        } else {
            
            console.log("calledddddddddddddddddddddd");
            res.render('user/login',{'loginErr':req.session.loginErr})
            req.session.loginErr = false
        }

    },



    homePage(req, res) {

        let user = req.session.users
        
        productHelpers.getAllproduct().then((product)=>{
            
            if (req.session.users) {
                console.log(user)
                res.render('user/homepage', { user: true, logged: true, userData: user,product })
            }
            else {
                res.render('user/landingPage', { user: true, logged: false, user,product})
            }
            
        })
        
    },

    signupPage(req, res) {
        res.render('user/registration')
    },


    signupSubmit(req, res) {
        if (req.body.password === req.body.repassword) {
            delete req.body.repassword
            doSignup(req.body).then((userData) => {
                console.log(userData);
                req.session.loggedIn = true;
                req.session.users = userData;
            })
        }else{
            console.log('password mismatch')
           
        }
        res.render('user/login', { user: true })

    },

    
    

    loginSubmit(req, res) {

        dologin(req.body).then((response) => {
            console.log(response)
            req.session.loggedIn = true;
            req.session.users = response.user;
            res.redirect('/')
        }).catch((error) => {
            console.log(error);
            req.session.loginErr = true;
            res.render('user/login', { error: error.error })
        })
    },
    

    userlogout(req, res) {
       
        req.session.destroy()
        res.redirect('/')
    },
    clickProduct(req,res){
        let user = req.session.users
        console.log(req.body.id);
        productHelpers.viewProduct(req.body.id).then((product)=>{
            console.log(product);
            res.render('user/singleProduct',{product,user: true,userData: user})
        })       
    },

    productDetail (req , res){
        let user = req.session.user
        productHelpers.viewProduct(req.query.id).then((product) =>{

            
            res.render('user/singleProduct' , {product , user,userData: user})
        })
    },


    shopbyCategory(req,res){

        let categories;
        productHelpers. getAllcategory().then((categoryList) => {
         categories = categoryList;
         })
    },

    // userprofile(req,res){
    //     res.render('user/userProfile')
    // }
    userprofile: async (req, res) => {

        console.log("vanuuuuuuuuuuuuuuuuuuuuuuuuuuuuuuu");
        let usere = await getUserDetails(req.session.users._id)
        console.log(usere);
        res.render('user/userprofile', { user: true,usere,userData: usere})
      },

     
       
      
}
