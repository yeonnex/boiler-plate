const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
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

// 유저 모델에 유저 정보를 저장하기 전에, 암호화!
// next() 하면 index.js에서 save() 하는 곳으로 점프한다.
userSchema.pre('save', function(next){
    var user = this;
    // 비밀번호를 바꿀때만 비밀번호를 암호화시킨다
    if(user.isModified('password')){

        bcrypt.genSalt(saltRounds, function(err, salt){
            if(err) return next(err)
    
            bcrypt.hash(user.password,salt, function(err,hash){
                if(err) return next(err)
                user.password = hash
                next()
    
            } )
        })
    }else{
        next()
    }


})





const User = mongoose.model('User', userSchema)
module.exports = { User }