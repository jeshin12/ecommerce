var express = require('express');
var router = express.Router();
const { homePage,loginPage,signupPage,signupSubmit,loginSubmit,userlogout,clickProduct,shopbyCategory,userprofile,productDetail} = require('../controler/usercontroller')
const{sessionCheck,nocache}=require('../middlwares/user-middlwares')
/* GET home page. */


router.get('/', sessionCheck,homePage)

router.get('/login',nocache, loginPage);

router.get('/signup', nocache,signupPage);

router.post('/signupSubmit',nocache,signupSubmit);

router.post('/loginSubmit',nocache,loginSubmit);

router.get('/logout', userlogout);

router.post('/click',sessionCheck,clickProduct)

router.get('/shop-by-category/:name',sessionCheck,shopbyCategory)

router.get('/userprofile',sessionCheck,userprofile)

router.get('/product-detail' ,sessionCheck, productDetail)











// router.get('/', function(req, res, next) {
//   res.render('user/login', { title: 'Express',user:true });
// });
// router.get('/signup', function(req, res, next) {
//   res.render('user/registration', { title: 'Express',user:true });
// });

module.exports = router;
