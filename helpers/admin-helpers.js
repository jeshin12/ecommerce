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

    }
}