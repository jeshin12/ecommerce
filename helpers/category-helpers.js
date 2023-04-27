var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')
const { resolve } = require('path')


module.exports={

    // AddCategorys:(addcategory)=>{

    //     console.log(category);

    //     return new Promise((resolve,reject)=>{
    //         db.get().collection(collection.CATEGORY_COLLECTION).insertOne(category).then((res)=>{
    //             resolve({id:res.insertedId})
    //         })
    //     })

    // },

    AddCategorys:(addcategory)=>{
        console.log(addcategory);
        addcategory.date=new Date()
        return new Promise(async(resolve,reject)=>{
         
     db.get().collection(collection.CATEGORY_COLLECTION).insertOne(addcategory).then((addcategory)=>{
        
            resolve(addcategory)
        })
    
        })
           
    
        },

    getAllcategory:()=>{

        return new Promise(async(resolve,reject)=>{

            let getcategory=await db.get().collection(collection.CATEGORY_COLLECTION).find().sort({date:-1}).toArray()
            resolve(getcategory)
        })
    }
   
}