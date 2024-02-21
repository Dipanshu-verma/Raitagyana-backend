const mongoose =  require("mongoose");


const NewsSchema  = mongoose.Schema({
    email:{type:String, required:true},
    createdAt:{type:Date, default:Date.now}
})

const NewsModel = mongoose.model("newsEmails", NewsSchema);

module.exports = {NewsModel}