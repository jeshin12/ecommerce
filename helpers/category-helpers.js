var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { resolve } = require('path')


module.exports={

    

    AddCategorys: (addcategory) => {
        console.log(addcategory);
        addcategory.date = new Date()
        return new Promise(async (resolve, reject) => {

            let adminWithcategory = await db.get().collection(collection.CATEGORY_COLLECTION).find({ name: addcategory.name }).toArray()

            let rejectResponse = {}

            if (adminWithcategory.length > 0) {
                rejectResponse.categoryExists = true
                reject(rejectResponse)
            }else{
                db.get().collection(collection.CATEGORY_COLLECTION).insertOne(addcategory).then((addcategory) => {

                    resolve(addcategory)
                })

            }
        })
    },

        

    getAllcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().sort({date:-1}).toArray()
            resolve(getcategory)
        })
    },

    
   
}