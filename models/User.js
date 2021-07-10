const mongoose = require('mongoose')

// userSchema 에다 하나하나의 필드 작성! 
const userSchema = mongoose.Schema({
    name:{
        type:String,
        maxlength: 50
    },
    email:{
        type:String,
        trim:true, // 유저가 이메일 작성시 실수로 공백 넣었을 경우 없애는 역할
        unique: 1
    },
    password:{
        type:String,
        minlength: 5
    },
    lastname:{
        type:String,
        maxlength:50
    },
    role:{
        type:Number,
        default:0
    },
    image:String,
    token:{
        type:String
    },

    
})

const User = mongoose.model('User', userSchema)
module.exports = { User }