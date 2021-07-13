const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const config = require('./config/key')

const mongoose = require('mongoose')
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true,useUnifiedTopology: true 
}).then(()=>console.log("MongoDB connected..."))
    .catch(err => console.log(err))

const { User } = require("./models/User")

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());



app.get('/', (req, res) => {
  res.send('엔젤리너스 반미불고기 바게트 JMT!')
})



app.post('/register', (req,res)=>{
    // 클라이언트에서 보내온 회원가입시의 정보들을
    // 데이터베이스에 넣어준다

    const user = new User(req.body) // 바디파서때문에 가능!

    // save 하기 전에 비밀번호를 암호화시켜주어야 함. models/User.js에서 pre()라는 몽구스의 기능을 이용하자
    user.save((err,userInfo)=>{// save()메서드는 몽고디비에서 오는 메서드임!
        if(err) return res.json({success:false,err })
        return res.status(200).json({
            success:true
        })    
    })
}) 

app.listen('/login', (req, res)=>{
    // 요청된 이메일이 데이터베이스에 있는지 찾는다
    User.findOne({email: req.body.email}, (err,user)=>{
        if(!user){
            return res.json({
                loginSuccess: false,
                message: "제공된 이메일에 해당하는 유저가 없습니다."
            })
        }
    // 요청된 이메일이 데이터베이스에 있다면 비밀번호가 맞는 비밀번호인지 확인
        user.comparePassword(req.body.password, (err, isMatch)=>{
            if(!isMatch)
            return res.json({loginSuccess: false, message: "비밀번호가 틀렸습니다"})
        // 비밀번호까지 맞다면 그 유저를 위한 토큰을 생성하기
        user.generateToken((err, user)=>{
            
        })

        })
    })

})



app.listen(port, () => {
  console.log(`My app listening at http://localhost:${port}`)
})