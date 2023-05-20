var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
var objectId= require('mongodb'). ObjectId
const { log } = require('console')
const { resolve } = require('path')
const { rejects } = require('assert')
const { response } = require('express')

// const accountSid = process.env.TWILIO_ACCOUNT_SID;
// const authToken = process.env.TWILIO_AUTH_TOKEN;
// const serviceid= process.env.TWILIO_SERVICE_SID;
// const client = require("twilio")(accountSid, authToken);

require('dotenv').config()
const client = require("twilio")(process.env.TWILIO_ACCOUNT_SID,process.env.TWILIO_AUTH_TOKEN);



module.exports={

    

    doSignup:(userData)=>{
        userData.date=new Date()
        userData.address=[]
         userData.isBlocked=false 
        return new Promise(async (resolve, reject) => {

            let userWithMobile = await db.get().collection(collection.USER_COLLECTION).find({ mobile : userData.mobile }).toArray()
            let userWithEmail = await db.get().collection(collection.USER_COLLECTION).find({email : userData.email}).toArray()
            let rejectResponse={}
            if (userWithEmail.length > 0 && userWithEmail.length) {
                rejectResponse.emailExists=true
                reject(rejectResponse)
            }
            
            else if (userWithMobile.length > 0) {
                rejectResponse.mobileExists=true
                reject(rejectResponse)
            }
            else{
                userData.password = await bcrypt.hash(userData.password, 10)
                db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((userData) => {
                    resolve(userData)
                })
            }


    
           
        }) 
    
    
    },
// doSignup:(userData)=>{
//     userData.date=new Date()
//     userData.address=[]
//      userData.isBlocked=false 
//     return new Promise(async (resolve, reject) => {

//         userData.password = await bcrypt.hash(userData.password, 10)
//         db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((userData) => {
//             resolve(userData)
//         })
//     }) 


// },
dologin:(userData)=>{
    console.log(userData.email, '>>>');

    return new Promise(async (resolve, reject) => {
        let loginStatus = false
        let response = {}
        let user = await db.get().collection(collection.USER_COLLECTION).findOne({ email: userData.email })
        if (user) {
            if(user.isBlocked){
                reject({error:"user is blocked"})
            }else{
                bcrypt.compare(userData.password, user.password).then((status) => {
                if (status) {

                    console.log("login success");
                    response.user = user
                    response.status = true
                    resolve(response)
                } else {
                    
                    reject({ error:"invalid password" })
                }
            }).catch(()=>{
                    reject(error)
                })}
            
        }
        else {
            
            reject({ error:"invalid email" })

        }
    })
},

getAllUser: () => {
    return new Promise(async (resolve, reject) => {
        let AllUsers = await db.get().collection(collection.USER_COLLECTION).find().sort({date:-1}).toArray()
        resolve(AllUsers)
       
    })
},
getUserDetails: (userId) => {

    return new Promise(async (resolve, reject) => {
        try {
            let userProfile = await db.get().collection(collection.USER_COLLECTION).findOne({ _id: objectId(userId) })
            resolve(userProfile)
        } catch (error) {
            reject(error)
        }
    })
},
doOtp : (userData) => {
    console.log(userData,">>>>>>>>>>>>>>>>,,,,,,,,,,,,,,");
    let response = {}
    return new Promise(async(resolve , reject) => {
        let user =await db.get().collection(collection.USER_COLLECTION).findOne({mobile : userData.mobile})

        if(user){
            response.status = true
            response.user = user

            client.verify.services(process.env.TWILIO_SERVICE_SID)
            .verifications
            .create({ to: `+91${userData.mobile}`, channel: 'sms' })
            .then((data) => {

            })
            resolve(response)
        }
        else{
            response.status = false
            resolve(response)
        }
    })
},

otpConfirm : (confirmotp , userData) => {
    console.log(confirmotp, "aaaaaaaaaaaaaaaaaaaa");
    console.log(userData,"oooooooooooooooooooooooooo");
    let otp = confirmotp.digit1 +confirmotp .digit2 + confirmotp.digit3 + confirmotp.digit4 + confirmotp.digit5 + confirmotp.digit6;
    console.log(otp,"nnnnnnnnnnnnnnnnnnnnnnn");
    return new Promise((resolve , reject) => {

        client.verify.services(process.env.TWILIO_SERVICE_SID)
        .verificationChecks
        .create({
            to: `+91${userData.mobile}`,
            code: otp
        }).then((data) => {
            if(data.status == 'approved'){
                resolve({status : true})
            }
            else{
                resolve({status : false})
            }
        })
    })
},

getPricefilter:(min,max)=>{
    console.log(`Filtering products by price between ${min} and ${max}...`);
    let minimum=parseInt(min)
    let maximum=parseInt(max)

    
    return new Promise(async (resolve, reject) => {
      try {
        const priceFilter = await db.get().collection(collection.PRODUCT_COLLECTION).aggregate([
          {
            $match: {
                price: { $gte: minimum, $lte: maximum }
            }
          },
        ]).toArray();


        console.log(`Found ${priceFilter.length} products matching filter.`);
        if (priceFilter.length > 0) {
          resolve(priceFilter);
        } else {
          reject(new Error('No products found'));
        }
      } catch (error) {
        console.error('Error filtering products by price:', error);
        reject(new Error('Error filtering products by price'));
      }
    });

  },

  viewTotalProduct: (pageNum, limit) => {
   
    let skipNum = parseInt((pageNum - 1) * limit)

    console.log(skipNum,"++++++++++++++++++++++++++++++++++++++++++++++++++++");

    return new Promise(async (resolve, reject) => {
        let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().skip(skipNum).limit(limit).toArray()
        console.log(products,"llllllllllllllllllllllllll");
        resolve(products)
    })
},

AddtoCart:(prodId,userId)=>{
    let prodObj = {
        item: objectId(prodId),
        quantity: 1
    }
    
    return new Promise(async(resolve,reject)=>{

        let userCart= await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
        if(userCart){
            let proExist = userCart.products.findIndex(product => product.item == prodId)

            if (proExist != -1) {
                db.get().collection(collection.CART_COLLECTION).updateOne({ user: objectId(userId), 'products.item': objectId(prodId) },
                    {
                        $inc: { 'products.$.quantity': 1 }
                    }

                ).then(() => {
                    resolve()
                })

            }else{
                db.get().collection(collection.CART_COLLECTION)
            .updateOne({user:objectId(userId)},
            {
                
                    $push:{
                        products:prodObj
                    }

                
            }).then((response)=>{
                resolve()
            })
            }

            

        }else{
            let cartobj={
                user:objectId(userId),
                products: [prodObj]
               
            }
            db.get().collection(collection.CART_COLLECTION).insertOne(cartobj).then((response)=>{
                resolve()
            })
        }

    })

},
getCartproduct:(userId)=>{
    return new Promise(async(resolve,reject)=>{

        let cartItems=await db.get().collection(collection.CART_COLLECTION).aggregate([
            {
                $match:{user:objectId(userId)}
            },
            {
                $unwind: '$products'
            },
            {
                $project: {
                    item: '$products.item',
                    quantity: '$products.quantity',
                    user: 1
                }
            },
            {
                $lookup: {
                    from: collection.PRODUCT_COLLECTION,
                    localField: 'item',
                    foreignField: '_id',
                    as: 'product'
                }
            },
            {
                $project: {
                    item: 1,
                    quantity: 1,
                    user: 1,
                    product: {
                        $arrayElemAt: ['$product', 0]
                    }
                }
            }
            
        ]).toArray()
        resolve(cartItems)

    })
},

getCartCount:(userId)=>{
    return new Promise(async(resolve,reject)=>{
        let count=0
            let cart=await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            if(cart){
               count=cart.products.length
            }
            resolve(count)
    })
},
changeProductQuantity: (details) => {
    details.count = parseInt(details.count)
    details.quantity = parseInt(details.quantity)
    return new Promise((resolve, reject) => {
         

        if (details.count == -1 && details.quantity == 1) {
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({ _id: objectId(details.cart) },
                {
                    $pull: { products: { item: objectId(details.product) } }
                }
            ).then((response) => {
                resolve({ removeProduct: true })
            })
        }

        else {
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({ _id: objectId(details.cart), 'products.item': objectId(details.product) },
                {
                    $inc: { 'products.$.quantity': details.count }
                }

            ).then((response) => {
                resolve({ status: true })
            })
        }
    
})
},

    deleteFromCart: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.CART_COLLECTION)
            .updateOne({ _id: objectId(details.cart) }, {

                $pull: { products: { item: objectId(details.product) } }

            }).then((response) => {
                resolve({removeProduct: true}) // response of deleting cart Item
            })
        })
    },
    getTotalAmount:(userId)=>{
        return new Promise(async(resolve,reject)=>{

            let total=await db.get().collection(collection.CART_COLLECTION).aggregate([
                {
                    $match:{user:objectId(userId)}
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity',
                        user: 1
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1,
                        quantity: 1,
                        user: 1,
                        product: {
                            $arrayElemAt: ['$product', 0]
                        }
                    }
                },
                {
                    $group:{
                        _id:null,
                        total:{$sum:{$multiply:['$quantity','$product.price']}}
                    }
                }
               
                
            ]).toArray()
            
            
            resolve(total[0]?.total);
    
        })

    },
    placeorder:(order,products,total)=>{

        return new Promise((resolve,rejects)=>{
            console.log(order,products,total,"ooooooooooooooooooo");
            let status = order['payment-method'] === 'COD' ? 'placed' : 'pending'
            let orderObj = {
                deliveryDetails: {
                    name: order.uname,
                    phone: order.number,
                    email: order.email,
                    state: order.state,
                    homeNumber: order.houseNumber,
                    streetNumber: order.streetNumber,
                    Town: order.town,
                    zip: order.pincode
                },
                userId: objectId(order.userId),
                paymentMethod: order['payment-method'],
                totalAmount:total,
                products: products,
                date: new Date(),
                status: status,
                
                

            }
            db.get().collection(collection.ORDER_COLLECTION).insertOne(orderObj).then((response) => {
                db.get().collection(collection.CART_COLLECTION).deleteOne({ user: objectId(order.userId) })
                resolve()
            })
        })

    },
    getCartProductList:(userId)=>{
        return new Promise(async(resolve,rejects)=>{
            let cart = await db.get().collection(collection.CART_COLLECTION).findOne({user:objectId(userId)})
            resolve(cart.products)
            console.log(cart,"pppppppppppppppppppppp");
        })
    }
    ,

    addToWishlist: (productId, userId) => {
        let productObject = {
            item: objectId(productId),
            quantity: 1
        }
        return new Promise(async (resolve, reject) => {
            let userWishlist = await db.get().collection(collection.WISHLIST_COLLECTION).findOne({ user: objectId(userId) })
            if (userWishlist) {
                let productExists = userWishlist.products.findIndex(products => products.item == productId)
                if (productExists != -1) {
                    db.get().collection(collection.WISHLIST_COLLECTION).updateOne({ user: objectId(userId) }, {
                        $pull: { products: { item: objectId(productId) } }
                    }).then(() => {
                        resolve()
                    })
                } else {
                    db.get().collection(collection.WISHLIST_COLLECTION)
                        .updateOne({ user: objectId(userId) }, {

                            $push: { products: productObject }

                        }).then((response) => {
                            resolve(response)
                        })
                }

            }
            else {
                let wishlistObject = {
                    user: objectId(userId),
                    products: [productObject]
                }
                db.get().collection(collection.WISHLIST_COLLECTION).insertOne(wishlistObject).then((response) => {
                    resolve(response)
                })
            }
        })
    },
    getWishlistId: (user) => {
        return new Promise(async (resolve, reject) => {
            let wishListItems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                {
                    $match: { user: objectId(user) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        _id: 0

                    }
                },
                // {
                //     $project: {
                //         item: 1,
                //     }
                // }


            ]).toArray()

            finalArray = wishListItems.map(function (obj) {
                return obj.item;
            });
            resolve(finalArray)

        })
    },
     getWishlistProduct: (userId) => {
        return new Promise(async (resolve, reject) => {
            let wishListItems = await db.get().collection(collection.WISHLIST_COLLECTION).aggregate([
                {
                    $match: { user: objectId(userId) }
                },
                {
                    $unwind: '$products'
                },
                {
                    $project: {
                        item: '$products.item',
                        quantity: '$products.quantity'
                    }
                },
                {
                    $lookup: {
                        from: collection.PRODUCT_COLLECTION,
                        localField: 'item',
                        foreignField: '_id',
                        as: 'product'
                    }
                },
                {
                    $project: {
                        item: 1, quantity: 1, product: { $arrayElemAt: ['$product', 0] }
                    }
                }


            ]).toArray()
            resolve(wishListItems)
           
            console.log(wishListItems)
        })
    },
    deleteFromWishlist: (details) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.WISHLIST_COLLECTION).updateOne({ _id: objectId(details.wishlist) }, {
                $pull: { products: { item: objectId(details.product) } }
            }).then(() => {
                resolve() // response of deleting cart Item
            })
        })
    },
    getUserorders:(userId)=>{
        return new Promise(async(resolve,reject)=>{
           let orders= await db.get().collection(collection.ORDER_COLLECTION).findOne({userId:objectId(userId)})
           console.log(orders,'uuuuuuuuuuuu');
            resolve(orders)
        })
    }


}