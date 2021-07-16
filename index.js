const express = require('express')
const app = express()
const port = 5000
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser')

const config = require('./config/key')

const { User } = require("./models/User")
const { auth } = require('./middlelware/auth');

// application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({extended:true}));

// application/json
app.use(bodyParser.json());
app.use(cookieParser());

const mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
mongoose.connect(config.mongoURI,{
    useNewUrlParser: true, useUnifiedTopology: true,useUnifiedTopology: true 
}).then(()=>console.log("MongoDB connected..."))
    .catch(err => console.log(err))


app.get('/', (req, res) => {
  res.send('엔젤리너스 반미불고기 바게트 JMT!')
})



app.post('/api/users/register', (req,res)=>{
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

app.post('/api/users/login', (req, res)=>{
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
                // 여기의 user에는 generateToken()이 있는 User.js에서 생성된 유저의 토큰정보도 포함되어있음
                if(err) return res.status(400).send(err);

                // 토큰을 저장해서 보관해야 하는데... 어디에? 쿠키나, 로컬 스토리지 등... 쿠키에 하자!
                res.cookie("x_auth", user.token)
                .status(200)
                .json({loginSuccess:true, userId: user._id})
            })

        })
    })

})



// role 0 -> 일반유저 role이 0이 아니면 관리자
app.get('/api/users/auth',auth,(req,res)=>{
    // 여기까지 미들웨어를 통과해왔다는 것은, Authentication이 True라는 말.
    res.status(200).json({
        _id: req.user._id,
        isAdmin: req.user.role === 0 ? false : true,
        isAuth: true,
        email: req.user.email,
        name: req.user.name,
        lastname: req.user.lastname,
        role: req.user.role,
        image: req.user.image
    })
})

app.get('/api/users/logout', auth,(req, res)=>{
    User.findOneAndUpdate({_id:req.user._id},
        {token: ""}
        , (err, user)=>{
            if(err) return res.json({success:false, err});
            return res.status(200).send({
                success:true
            })
        })
})

app.listen(port, () => {
  console.log(`My app listening at http://localhost:${port}`)
})