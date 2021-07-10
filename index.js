const express = require('express')
const app = express()
const port = 5000
const mongoose = require('mongoose')
mongoose.connect('mongodb+srv://seoyeon:abcd1234@boilerplate.zk8a9.mongodb.net/myFirstDatabase?retryWrites=true&w=majority',{
    useNewUrlParser: true, useUnifiedTopology: true,useUnifiedTopology: true 
}).then(()=>console.log("MongoDB connected..."))
    .catch(err => console.log(err))
app.get('/', (req, res) => {
  res.send('엔젤리너스 반미불고기 바게트 개꿀맛!')
})

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`)
})