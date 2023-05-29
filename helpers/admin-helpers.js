var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { resolve } = require('path')



module.exports = {

    doadminLoged: (adminData) => {
        return new Promise(async (resolve, reject) => {
            let loginStatus = false;
            let response = {}
            let admin = await db.get().collection(collection.ADMIN_COLLECTION).findOne({ email: adminData.email })

            if (admin) {
                bcrypt.compare(adminData.password, admin.password).then((status) => {

                    if (status) {
                        response.admin = admin
                        response.status = true
                        resolve(response);
                    } else {
                        console.log('Login failedddddd');
                        reject({ status: false })
                    }
                }).catch(() => {
                    reject(error)
                })
            }
            else {
                console.log('Login failed');
                reject({ status: false })
            }
        })
    },


    blockUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $set: {
                    isBlocked: true
                }
            }).then((response) => {

                resolve()
            })
        })

    },


    unblockUser: (userId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.USER_COLLECTION).updateOne({ _id: ObjectId(userId) }, {
                $set: {
                    isBlocked: false
                }
            }).then((response) => {
                resolve()
            })
        })

    },
    

    // addCoupen: (coupenDetails, code) => {
    //     return new Promise(async (resolve, reject) => {
    //         let response = {}
    //         let coupenExist = await db.get().collection(collection.COUPON_COLLECTION).findOne({ code: coupenDetails.code })

    //         if (coupenExist) {
    //             response.status = true
    //             response.message = "Coupen with this code is already exists"
    //             resolve(response)
    //         }
    //         else {
    //             db.get().collection(collection.COUPON_COLLECTION).insertOne(
    //                 {
    //                     name: coupenDetails.name,
    //                     code: code,
    //                     startDate: coupenDetails.startdate,
    //                     endingDate: coupenDetails.endingdate,
    //                     value: coupenDetails.discount,
    //                     minAmount: coupenDetails.minAmount,
    //                     maxAmount: coupenDetails.maxAmount,
    //                     status: true
    //                 }
    //             ).then((response) => {
    //                 response.status = false
    //                 response.message = "Coupen added successfully"
    //                 resolve(response)
    //             })
    //         }

    //     })
    // },

    addCoupen: (couponDetails, code) => {
        return new Promise(async (resolve, reject) => {
            let response = {};
            let couponExist = await db.get().collection(collection.COUPON_COLLECTION).findOne({ code: couponDetails.code });
    
            if (couponExist) {
                response.status = true;
                response.message = "Coupon with this code already exists";
                resolve(response);
            } else {
                db.get().collection(collection.COUPON_COLLECTION).insertOne({
                    name: couponDetails.name,
                    code: code,
                    startDate: couponDetails.startdate,
                    endingDate: couponDetails.endingdate,
                    value: couponDetails.discount,
                    minAmount: couponDetails.minAmount,
                    maxAmount: couponDetails.maxAmount,
                    status: true
                }).then((response) => {
                    response.status = false;
                    response.message = "Coupon added successfully";
                    resolve(response);
                });
            }
        });
    },

    viewCoupens: () => {
        return new Promise((resolve, reject) => {
            let coupen = db.get().collection(collection.COUPON_COLLECTION).find().toArray()
            resolve(coupen)
        })
    },

    
    deleteCoupen: (coupenId) => {
        return new Promise((resolve, reject) => {
            db.get().collection(collection.COUPON_COLLECTION).deleteOne({ _id: ObjectId(coupenId) }).then((response) => {
                resolve(response)
            })
        })
    },
}