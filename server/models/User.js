const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const saltRounds = 10
const jwt = require('jsonwebtoken')

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
// next() 하면 index.js의 save() 하는 곳으로 점프한다.
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


userSchema.methods.comparePassword = function(plainPassword, cb){
    // plainPassword: abcd1234 암호화된비밀번호: $2b$10$7E3DTpylqPGvAjdHN1c9WeldQ36BtUfGMKa2381HOCHYavzdL.ISS
    bcrypt.compare(plainPassword, this.password, function(err, isMatch){
        if(err) return cb(err); // 비번이 같지 않다면 에러!
            cb(null, isMatch) // 같다면, 콜백을 주는데, 에러는 없고(null), isMatch(True) 를 준다
    })
}

userSchema.methods.generateToken = function(cb){

    // es5문법
    var user = this;

    // jsonwebtoken을 이용해서 token을 생성하기
    var token = jwt.sign(user._id.toHexString(), 'secretToken')
    // user._id + 'secretToken' = Token
    // -> 'secretToken' -> user._id
    // 토큰을 가지고 이사람이 누구인지 알 수 있게됨

    user.token = token // userSchema에 "token"이라는 속성 있음. 거기다 저장!
    user.save(function(err, user){
        if(err) return cb(err) // 에러가 있다면 콜백으로 에러를 전달
        cb(null, user) // 에러 없이 save가 잘 되었다면, user 정보만 다시 전달! 여기에는 토큰에 대한 정보도 들어있음
    })
}


userSchema.statics.findByToken = function(token, cb){
    var user = this;

    // 토큰을 decode한다
    jwt.verify(token, 'secretToken', function(err,decoded){
        // 유저 아이디를 이용해서 유저를 찾은 다음에
        // 클라언트에서 가져온 token과 DB에 보관된 토큰이 일치하는지 확인

        user.findOne({"_id": decoded, "token": token}, function(err, user){
            if(err) return cb(err);
            cb(null, user)
        })
    })

}

const User = mongoose.model('User', userSchema)
module.exports = { User }