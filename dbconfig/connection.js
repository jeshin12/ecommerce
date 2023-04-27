

const  MongoClient  = require("mongodb").MongoClient
const state={ 
    db:null
} 

module.exports.connect=function(done){
    const url="mongodb+srv://mohammedjeshin12:mohammedjeshin12@cluster0.taspngy.mongodb.net/?retryWrites=true&w=majority"
    const dbname='userInfo'

    MongoClient.connect(url,(err,data)=>{
        if(err)return done(err)
        state.db=data.db(dbname)
        done()
    })
    
}

module.exports.get=function(){
    return state.db
}