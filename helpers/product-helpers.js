var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const { ObjectId } = require('mongodb');
const { resolve } = require('path');




module.exports={

    addProduct: (product) => {
        console.log(product);
        return new Promise((resolve, reject) => {

            db.get().collection(collection.PRODUCT_COLLECTION).insertOne(product).then((res) => {
                resolve({ id: res.insertedId })
            })
        })

    },
   

    getAllproduct: () => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).find().toArray()
            resolve(product)
        })
    },

    deleteProduct: (prodId) => {
        console.log(prodId , "mmmmmmmmmm");
        return new Promise((resolve, reject) => {
            db.get().collection(collection.PRODUCT_COLLECTION).deleteOne({ _id: ObjectId(prodId) }).then((response) => {
                resolve(response)
            })
        })
    },
    getProductDetails:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    getProductByCategory: (categoryName) => {
        return new Promise((resolve, reject) => {
            let products = db.get().collection(collection.PRODUCT_COLLECTION).find({ category: categoryName }).toArray()
            resolve(products)
        })
    },
    updateProduct:(prodId, proDetails)=>{

        console.log(prodId, proDetails, 'fffffffffffffffffffffffffffffffffffffffffffffffffffffff');
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION). 
            updateOne({_id:ObjectId(prodId)},{
                $set: {
                    name:proDetails.name,
                    size:proDetails.size,
                   categoryid:proDetails.categoryid,
                    price:proDetails.price,
                    color:proDetails.color,
                    description: proDetails.description
                }
            }).then((response)=>{
                resolve(response)
            })
        })
    },
    viewProduct:(prodId)=>{
        return new Promise((resolve,reject)=>{
            db.get().collection(collection.PRODUCT_COLLECTION).findOne({_id:ObjectId(prodId)}).then((product)=>{
                resolve(product)
            })
        })
    },
    getAllcategory:()=>{
        return new Promise(async(resolve,reject)=>{
            let category=await db.get().collection(collection.CATEGORY_COLLECTION).find().toArray()
            resolve(category)
        })
    }
    
   

}