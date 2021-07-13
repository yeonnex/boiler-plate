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





app.listen(port, () => {
  console.log(`My app listening at http://localhost:${port}`)
})