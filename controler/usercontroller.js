const { log } = require("console")
const { response } = require('express');
const { doSignup, dologin, getUserDetails, doOtp, otpConfirm, getPricefilter, viewTotalProduct,AddtoCart,getCartproduct,getCartCount,changeProductQuantity,deleteFromCart,
    getTotalAmount,placeorder,getCartProductList,addToWishlist,getWishlistId,getWishlistProduct,deleteFromWishlist,getUserorders} = require("../helpers/user-helpers")
var productHelpers = require("../helpers/product-helpers");
const session = require("express-session");
var Handlebars = require('handlebars');


module.exports = {

    //------------login page----------------

    loginPage(req, res) {
        if (req.session.loggedIn) {

            console.log("callingggggggggggggggggggggggggggggggg");
            res.redirect('/')
        } else { 

            console.log("calledddddddddddddddddddddd");
            res.render('user/login', { 'loginErr': req.session.loginErr })
            req.session.loginErr = false
        }

    },
    loginSubmit(req, res) {
        
        dologin(req.body).then((response) => {
            
            req.session.loggedIn = true;
            req.session.users = response.user;
            res.redirect('/')
        }).catch((error) => {
            console.log(error);
            req.session.loginErr = true;
            res.render('user/login', { error: error.error })
        })
    },

    //-------login page End-----


    // homePage: async (req, res) => {
    //     let user = req.session.users
    //     let categories;
    //     let cartCount=await getCartCount(user._id)
    //     await productHelpers.getAllcategory().then((categoryList) => {

    //         categories = categoryList;
    //     })
    //     productHelpers.getAllproduct().then((product) => {

    //         console.log(product, "=======================");



    //         let totalProducts = product.length
    //         let limit = 4
    //         let products = product.slice(0, limit)
    //         let pages = []

    //         for (let i = 1; i <= Math.ceil(totalProducts / limit); i++) {
    //             pages.push(i)
    //         }
    //         if (req.session.users) {
    //             getWishlistId(req.session.users._id).then((data) => {
        
    //               for (let i = 0; i < products.length; i++) {
    //                 for (let j = 0; j < data.length; j++) {
        
    //                   if (products[i]._id.toString() == data[j].toString()) {
    //                     products[i].isWishlisted = true;
    //                     console.log(products[i], 'hai');
    //                   }
        
    //                 }
        
    //               }
            
        
                
    //         console.log(pages, "pppppppppprrrrrrrrroooooooooodddddddduuuuuuuuuuuucccccccccctttttt");
    //         res.render('user/homepage', { user: true, logged: true, userData: user, product, products, categories, pages,cartCount})
                
    //     })
    // }

    //     })
    // },

    //--------------home Page------
    homePage: async (req, res) => {
        let user = req.session.users
        let categories;
        let cartCount=await getCartCount(user._id)
        await productHelpers.getAllcategory().then((categoryList) => {

            categories = categoryList;
        })
         

           
            const perPage = 8;
            let pageNum;
            let skip;
            let productCount;
            let pages;
            pageNum = parseInt(req.query.page) >= 1 ? parseInt(req.query.page) : 1;
            console.log(typeof (pageNum))
            skip = (pageNum - 1) * perPage
            await productHelpers.getProductCount().then((count) => {
              productCount = count;
            })
            pages = Math.ceil(productCount / perPage)

            Handlebars.registerHelper('ifCond', function (v1, v2, options) {
                if (v1 === v2) {
                  return options.fn(this);
                }
                return options.inverse(this);
              });

            Handlebars.registerHelper('for', function (from, to, incr, block) {
                var accum = '';
                for (var i = from; i <= to; i += incr)
                  accum += block.fn(i);
                return accum;
              });

            if (req.session.users) {
                await  productHelpers.getPaginatedProducts(skip, perPage).then((products) => {
                    console.log(products,"thissoneeeeeee");
                getWishlistId(req.session.users._id).then((data) => {
        
                  for (let i = 0; i < products.length; i++) {
                    for (let j = 0; j < data.length; j++) {
        
                      if (products[i]._id.toString() == data[j].toString()) {
                        products[i].isWishlisted = true;
                        console.log(products[i], 'hai');
                      }
        
                    }
        
                  }
            
        
                
            console.log(pages, "pppppppppprrrrrrrrroooooooooodddddddduuuuuuuuuuuucccccccccctttttt");
            res.render('user/homepage', { user: true, logged: true, userData: user, products, categories,totalDoc: productCount, currentPage: pageNum, pages: pages,cartCount})
                
        })
    })
    }
 
    },

    //------------home Page end---------

    //------------singup page---------

    signupPage(req, res) {
        res.render('user/registration', { errMessage: req.flash('userExists') })
    },



   

    signupSubmit(req, res) {
        if (req.body.password === req.body.repassword) {
            delete req.body.repassword

            doSignup(req.body).then((userData) => {
                console.log(userData);
                req.session.loggedIn = true;
                req.session.users = userData;

                res.render('user/login', { user: true })
            }).catch((response) => {
                if (response.mobileExists) {
                    req.flash('userExists', 'This Mobile number is already registered with us!')
                    res.redirect('/signup')
                }
                if (response.emailExists) {
                    req.flash('userExists', 'This Email is  already registered with us! !')
                    res.redirect('/signup')
                }

            })


        }

    },

    //------------singup Page end---------


    userlogout(req, res) {

        req.session.destroy()
        res.redirect('/')
    },

    //------------single Product view---------

    clickProduct(req, res) {
        let user = req.session.users
        console.log(req.body.id);
        productHelpers.viewProduct(req.body.id).then((product) => {
            console.log(product);
            res.render('user/singleProduct', { product, user: true, userData: user })
        })
    },


    productDetail(req, res) {
        let user = req.session.users
        productHelpers.viewProduct(req.query.id).then((product) => {


            res.render('user/singleProduct', { product, user: true, userData: user })
        })
    },

    //------------single Product Page end---------


    //------------category Page ---------

    shopbyCategory(req, res) {

        let categories;
        productHelpers.getAllcategory().then((categoryList) => {
            categories = categoryList;
        })
        productHelpers.getProductByCategory(req.params.name).then((products) => {

            categoryName = products[0].category

            res.render('user/view-product-by-category', { products, categoryName, categories })
        })
    },

    categoryfilter(req, res) {

        let usere = req.session.users
        let users = req.session.users
        let name = req.body;


        productHelpers.filterByCategory(name).then((products) => {

            productHelpers.getAllcategory().then((getcategory) => {



                res.render('user/view-products', { user: true, products, userData: users, usere, users, getcategory })


            }).catch(() => {

                res.render('user/view-products', { user: true, products, users, usere, getcategory })
            })

        })
    },


    pricefilter(req, res) {

        console.log(req.body, "priceeeeeeeeeeeeeeeeeeeeeeeee");
        let user = req.session.users

        getPricefilter(req.body.minprice, req.body.maxprice).then((products) => {

            console.log(products, "produccccccccccccccccccc");

            res.render('user/view-products', { user: true, products, user })

        }).catch(() => {
            console.log("1111111111111111111111");
            let err = 'not found'

            res.render('user/view-products', { user: true, user, err })
        })


    },
//------------category Page end-----------------

//------------user profile---------

    // userprofile: async (req, res) => {

      
    //     let usere = await getUserDetails(req.session.users._id)
    //     console.log(usere);
    //     res.render('user/userprofile', { user: true, usere, userData: usere })
    // },
    async userprofile(req, res) {
        let user = req.session.users
        let userId = req.session.users._id
       
        const userProfile =await getUserDetails(userId)
        console.log(userProfile,'profileeeeeeeee');
       
        res.render('user/userprofile', { userProfile, user ,userId,userData: user})
    },
    //-----------user profile end---------


    //------------otp login---------

    loginOtp(req, res) {

        res.render('user/otp-login')
    },


    sendOtp: ((req, res) => {
        

        console.log("reesend,,,,,>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",req.body);
        doOtp(req.body).then((response) => {
            let number=req.body.mobile
            console.log(req.body.mobile,"joggggggggggggggggggg");
            if (response.status) {
                signupData = response.user
                res.render('user/otp-verify',{number})
               
            }
            else {
                res.render('user/otp-login', { error: 'invalid mobile number' })

            }
        })
    }),


    otpSubmit: ((req, res) => {
        otpConfirm(req.body, signupData).then((response) => {
            console.log(response);
            if (response.status) {
                req.session.loggedIn = true
                req.session.users = signupData;
                res.redirect('/')
            }
            else {
                res.render('user/otp-verify', { error: 'incorrect otp' })
            }
        })
    }),


//-----------otp login end---------


    productPagination: ((req, res) => {
        let user = req.session.users

        let pageCount = req.query.id || 1
        console.log(pageCount);
        let pageNum = parseInt(pageCount)
        let limit = 4

        viewTotalProduct(pageNum, limit).then((product) => {
            let pages = []
            productHelpers.getAllproduct().then((product) => {
                
                let totalProducts = product.length
                let limit = 4

                for (let i = 1; i <= Math.ceil(totalProducts / limit); i++) {
                    pages.push(i)
                }

            })
            res.redirect('/')
        })
    }),

    cart:(async(req,res)=>{
        let user = req.session.users
        let products= await getCartproduct(req.session.users._id)
        let totalprice= await getTotalAmount(req.session.users._id)
        console.log(products,"ivnnnnnnnnn=============");
        res.render('user/user-cart',{products,user,userData: user,totalprice})

    }),

    addtocart:((req,res)=>{
     
        AddtoCart(req.params.id,req.session.users._id).then(()=>{
           
            res.redirect('/cart')
        })

    }),
     changeQuantity(req, res, next) {
        
            changeProductQuantity(req.body).then(async (response) => {
                response.total = await getTotalAmount(req.session.users._id)
                res.json(response)
            })

    },
    async deleteFromCart(req,res,next){

       deleteFromCart(req.body).then((response) => {
        console.log(response);
            res.json(response )
          })
    },



    proceedtocheckout:(async(req,res)=>{
        let user = req.session.users
        let products= await getCartproduct(req.session.users._id)
        let total=await getTotalAmount(req.session.users._id)
        res.render('user/checkout',{total,products,user,userData: user})

    }),

    placeOrder:(async(req,res)=>{

        let products=await getCartProductList(req.session.users._id)
        let totalprice= await getTotalAmount(req.session.users._id)
        placeorder(req.body,products,totalprice).then((response)=>{
            res.json({status:true})

        })
        
    }),
    // --------------wishlist--------------------------//

    AddToWishlist:((req,res,next)=>{
        
        addToWishlist(req.params.id, req.session.users._id).then(() => {
            res.redirect("/wishlist")
          })

    }),
   wishlist:(async(req,res)=>{
    let user=req.session.users

        let products=await getWishlistProduct(req.session.users._id)

        res.render('user/wishlist',{products,user,userData: user})
    }),

    deleteWishlist:((req,res)=>{

       deleteFromWishlist(req.body).then(() => {
            res.json({ status: true })
          })
         
    }),

    userOrderview:(async(req,res)=>{
        let user=req.session.users
        let orders=await getUserorders(req.session.users._id)

        res.render('user/userOrderView',{orders,user,userData:user})
    })
        
    

   
    
    


}
