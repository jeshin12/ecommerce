var express = require('express');
var router = express.Router();
const userController = require('../controler/usercontroller')
/* GET home page. */

userController.homePage

router.get('/',homePage)




// router.get('/', function(req, res, next) {
//   res.render('user/login', { title: 'Express',user:true });
// });
// router.get('/signup', function(req, res, next) {
//   res.render('user/registration', { title: 'Express',user:true });
// });

module.exports = router;
