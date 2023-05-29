var express = require('express');
var router = express.Router();
const { homePage,loginPage,signupPage,signupSubmit,loginSubmit,userlogout,clickProduct,shopbyCategory,userprofile,productDetail,loginOtp,sendOtp,otpSubmit,categoryfilter,pricefilter,productPagination,addtocart,cart,changeQuantity,deleteFromCart,proceedtocheckout,placeOrder,AddToWishlist,
    wishlist,deleteWishlist,userOrderview,userOrderAddress,usereditprofile,orders,viewOrderProducts,verifyPayment,orderInfo
    ,Viewoffers,coupenVerify} = require('../controler/usercontroller')
const{sessionCheck,nocache,verifyLogin}=require('../middlwares/user-middlwares')
/* GET home page. */

const multer = require('multer');
const storage = multer.diskStorage({
  
    destination: function (req, file, cb) {
      cb(null, './public/product-pictures')
    },
    filename: function (req, files, cb) {
      cb(null, Date.now() + '-' + files.originalname)
    }
  })
const upload = multer({ storage: storage });


router.get('/',sessionCheck,homePage)

router.get('/login',nocache, loginPage);

router.get('/signup', nocache,signupPage);

router.post('/signupSubmit',nocache,signupSubmit);

router.post('/loginSubmit',nocache,loginSubmit);

router.get('/logout', userlogout);

router.post('/click',verifyLogin,clickProduct)

router.get('/shop-by-category/:name',sessionCheck,shopbyCategory)



router.get('/userprofile',sessionCheck,userprofile)



router.get('/orderInfo/:id',orderInfo)

// router.post('/user-edit-profile',upload.fields( [ { name : 'productImage1' , maxCount : 1 }]),usereditprofile);

router.post('/user-edit-profile',usereditprofile);

router.get('/userOrderAddress/:id',sessionCheck,userOrderAddress);



router.get('/product-detail' ,verifyLogin, productDetail)

router.get('/login-otp',loginOtp)

router.post('/send-otp',sendOtp)

router.post('/otp-Submit',otpSubmit)

router.post('/filter-product',sessionCheck, categoryfilter);

router.post('/priceFilter',sessionCheck,pricefilter)

// router.get('/resend-otp',resendotp)

router.get('/productPagination', productPagination)

router.get('/add-to-cart/:id', verifyLogin,addtocart)

router.get('/cart',verifyLogin,cart)

router.post('/changeProductQuantity',verifyLogin,changeQuantity)

router.post("/delete-from-cart",deleteFromCart)

router.get("/proceed-to-checkout",verifyLogin,proceedtocheckout)

router.post('/place-order',verifyLogin,placeOrder)

router.get('/orders',sessionCheck,orders)

router.get("/view-order-products/:id",sessionCheck,viewOrderProducts)

router.post('/verify-payment' , verifyPayment)



router.get('/add-to-wishlist/:id',verifyLogin,AddToWishlist)

router.get("/wishlist",verifyLogin,wishlist)

router.post('/delete-from-wishlist',sessionCheck,deleteWishlist)

router.get('/userOrderview',sessionCheck,userOrderview)


router.get('/Viewoffers',sessionCheck,Viewoffers)

router.post('/coupen-verify' ,sessionCheck, coupenVerify)















// router.get('/', function(req, res, next) {
//   res.render('user/login', { title: 'Express',user:true });
// });
// router.get('/signup', function(req, res, next) {
//   res.render('user/registration', { title: 'Express',user:true });
// });

module.exports = router;
