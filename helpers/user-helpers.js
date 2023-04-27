var db = require('../dbconfig/connection')
var collection = require('../dbconfig/collection')
const bcrypt = require('bcrypt')
const { ObjectId } = require('mongodb')

module.exports={

doSignup:(userData)=>{
    userData.date=new Date()
    userData.address=[]
     userData.isBlocked=false 
    return new Promise(async (resolve, reject) => {
        userData.password = await bcrypt.hash(userData.password, 10)
        db.get().collection(collection.USER_COLLECTION).insertOne(userData).then((userData) => {
            resolve(userData)
        })
    }) 


},
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

    console.log(userId);
    return new Promise((resolve, reject) => {

        let user = db.get().collection(collection.USER_COLLECTION).findOne({ _id: ObjectId(userId) })
        resolve(user)
    })
}

}