var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const { ObjectId } = require('mongodb');
var objectId= require('mongodb'). ObjectId
const { resolve } = require('path');




module.exports={

    addProduct: (product) => {
        console.log(product);
        product.price = parseInt(product.price);
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
        console.log(proDetails,"&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&&");
        proDetails.price = parseInt(proDetails.price);
       
        return new Promise((resolve,reject)=>{
            
            db.get().collection(collection.PRODUCT_COLLECTION). 
            updateOne({_id:ObjectId(prodId)},{
                $set: {
                    name:proDetails.name,
                    size:proDetails.size,
                   categoryid:proDetails.categoryid,
                    price:proDetails.price,
                    color:proDetails.color,
                    description: proDetails.description,
                    img1: proDetails.img1,
                    img2 : proDetails.img2,
                    img3 : proDetails.img3
                   
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
    },

    filterByCategory:(proCategory)=>{
       
        return new Promise(async(resolve,reject)=>{

            let ShowProducts=await db.get().collection(collection.PRODUCT_COLLECTION).find({categoryid:proCategory.name}).toArray()
            
            resolve(ShowProducts)
        }).catch((error)=>{

            reject()
        })
    },
    getProductQuantity: (details) => {
        return new Promise(async (resolve, reject) => {
            let product = await db.get().collection(collection.PRODUCT_COLLECTION).findOne({ _id: objectId(details.product) })
            let availableQty = product.quantity
            resolve(availableQty)
        })
    },
    getProductCount: () => {
        return new Promise(async (resolve, reject) => {
            let count = await db.get().collection(collection.PRODUCT_COLLECTION).countDocuments()
            resolve(count)
        })
    },
    getPaginatedProducts: (skip, limit) => {
        return new Promise(async (resolve, reject) => {
            let products = await db.get().collection(collection.PRODUCT_COLLECTION).find().skip(skip).limit(limit).toArray()
            resolve(products)
        })
    },
    getAllOrders: () => {
        return new Promise(async (resolve, reject) => {
          try {
            let order = await db.get().collection(collection.ORDER_COLLECTION).find().sort({ _id: -1 }).toArray();
            resolve(order);
          } catch (error) {
            reject(error);
          }
        });
      },

      getOrderProduct: (oneProId) => {
        return new Promise(async (resolve, reject) => {
            let orderProduct = await db.get().collection(collection.ORDER_COLLECTION).aggregate([
                {
                    $match: { _id: objectId(oneProId) }
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
                        item: 1,
                        quantity: 1,
                        product: { $arrayElemAt: ['$product', 0] }
                    }
                }

            ]).toArray()
            console.log(orderProduct,'llllllllllllll');
            resolve(orderProduct)
        })
    },
    
   

}