const mongoose = require('mongoose')

mongoose.connect("mongodb://localhost:27017/music-system")
.then(()=>{
    console.log(`Mongodb has been connected.Please have a greate coding.`)
})