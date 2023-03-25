const router = require('express').Router()
const bcrypt = require('bcrypt')
const path = require('path')

const uploadMusic = require('../config/uploadMusic')
const uploadImg = require('../config/uploadImg')

// token相关
const jwt = require('jsonwebtoken')
const jwt_key = require('../secret/jwtkey').KEYORSECRET

// 引入Date日期格式化原型方法
require('../config/Date')

// 数据库模型
const Admin = require('../dbModel/admin')
const Music = require('../dbModel/music')

// 管理员登录
router.post('/account/login', (req, res) => {
    // 获取邮箱
    const email = req.body.email
    // 从数据库中验证邮箱
    Admin.findOne({
        email: email
    }).then(admin => {
        console.log('admin=>', admin)
        if (!admin) { // 不存在邮箱
            res.status(406).json({ status: '406', result: '用户名或者密码错误' })
        } else { // 存在邮箱
            const password = req.body.password // 前端传递过来的
            const dbPassword = admin.password // 数据库中查询出来的
            const isValidPassword = bcrypt.compareSync(password, dbPassword) // password === dbPassword
            if (!isValidPassword) { // 密码不匹配
                res.status(406).json({ status: '406', result: '用户名或者密码错误' })
            } else { // 登录成功
                // 颁发token jsonwebtoken 携带用户信息
                const rule = {
                    id: String(admin._id),
                    email: admin.email,
                    username: admin.username,
                    date: admin.date,
                    identity: admin.identity
                }
                jwt.sign(rule, jwt_key, { expiresIn: 3600 }, (err, token) => {
                    if (err) {
                        console.log('jwt.sign error=>', err)
                        res.status(500).json({ status: '500', result: '未知错误' })
                    } else {
                        res.status(200).json({ status: "200", result: '登录成功', token: 'Bearer ' + token })
                    }
                })
            }
        }
    })
})

// 管理员注册
router.post('/account/register', (req, res) => {
    const email = req.body.email
    // 邮箱不能重复
    Admin.findOne({
        email
    }).then(hasOne => {
        if (hasOne) {// 已存在相同的邮箱
            res.status(422).json({
                status: 422,
                result: '邮箱已存在'
            })
        } else { // 不存在相同的邮箱
            const username = req.body.username
            const password = req.body.password
            const identity = req.body.identity ? req.body.identity : null
            const date = new Date().format("yyyy/MM/dd HH:mm:ss")

            const newAdmin = new Admin({
                email,
                username,
                password,
                identity,
                date
            }) // 新增一个文档

            newAdmin.save().then(() => {
                res.status(200).json({
                    status: 200,
                    result: '注册成功'
                })
            }).catch(err => {
                console.log('管理员注册err=>', err.message)
                res.status(500).json({
                    status: '500',
                    result: '服务器内部错误，注册失败!'
                })
            })
        }
    })


})

// 管理员添加歌曲
router.post('/music/add', (req, res) => {
    const songName = req.body.songName
    const artist = req.body.artist
    const poster = req.body.poster
    const src = req.body.src
    const language = req.body.language ? req.body.language : null
    const style = req.body.style ? req.body.style : null

    // 判断歌曲是否在数据库中
    Music.findOne({ songName })
        .then(hasOne => {
            if (hasOne) {// 歌曲名称已经存在
                // 是否存在该歌曲的不同翻唱的歌手
              const flag =  hasOne.artist === req.body.artist
              if(flag){
                res.status(200).json({status:'200',result:"歌曲已经存在，请勿重复添加"})
              }else{
                // todo 简化重复的代码
                const song = {
                    songName,
                    artist,
                    poster,
                    src,
                    language,
                    style,
                    playCount: '0',
                    date: new Date().format("yyyy/MM/dd HH:mm:ss")
                }

                const newSong = new Music(song)
                newSong.save().then(() => {
                    res.status(200).json({
                        status: 200,
                        result: '添加成功'
                    })
                }).catch(err => {
                    console.log('添加歌曲 err=>', err.message)
                    res.status(500).json({
                        status: '500',
                        result: '服务器内部错误，添加歌曲失败!'
                    })
                })
              }
            } else { // 歌曲名称不存在
                // 歌曲信息添加到数据库中
                const song = {
                    songName,
                    artist,
                    poster,
                    src,
                    language,
                    style,
                    playCount: '0',
                    date: new Date().format("yyyy/MM/dd HH:mm:ss")
                }

                const newSong = new Music(song)
                newSong.save().then(() => {
                    res.status(200).json({
                        status: 200,
                        result: '添加成功'
                    })
                }).catch(err => {
                    console.log('添加歌曲 err=>', err.message)
                    res.status(500).json({
                        status: '500',
                        result: '服务器内部错误，添加歌曲失败!'
                    })
                })
            }
        })
})

// 验证合法身份
router.post('/islegal',(req,res)=>{
    const email = req.body.email
    Admin.findOne({email}).then(islegal=>{
        if(!islegal){
            res.status(416).json({status:'416',result:'身份不合法'})
        }else{
            const password = req.body.password
            const isValidPassword = bcrypt.compareSync(password,islegal.password)
            if(!isValidPassword){
                res.status(416).json({status:'416',result:'未授权'})
            }else{
                res.send("true")
            }
        }
    })
})

// 上传歌曲
router.post('/upload/music',(req,res)=>{
    uploadMusic(req,res)
})

// 上传海报
router.post('/upload/poster',(req,res)=>{
    uploadImg(req,res)
})

// 返回歌曲的海报封面
router.get('/poster',(req,res)=>{
    // todo 判断这个海报是否存在 
    // fs.existsSync()
    res.sendFile(path.resolve(__dirname,"../static/poster/" + req.query.img))
})

// 根据歌曲id获取某一首歌曲
// ?id=xxx
router.get('/musicById',(req,res)=>{
    const _id = req.query.id
    Music.findOne({_id})
    .then(music=>{
        if(music){
            res.sendFile(path.resolve(__dirname,"../static/music/" + music.src))
        }
    }).catch(err=>{
        console.log('获取歌曲失败err=>',err)
        res.status(500).json({status:500,result:'获取歌曲失败，服务器内部错误'})
    })
})

// 获取所有歌曲
router.get('/allmusics',(req,res)=>{
    Music.find().then(musics=>{
        if(musics.length >0 ){
            res.send({status:200,result:musics})
        }else{
            res.json({status:200,result:'音乐列表为空'})
        }
        
    })
})

// 根据歌曲名称搜索
router.post('/searchByName',(req,res)=>{
    const songName = req.body.searchName.trim()
    // todo 加上or的判断 歌手的名称
    Music.find({songName:{$regex:songName,$options:'i'}})
    .then(musics=>{
        if(musics.length >0 ){
            res.send({status:200,result:musics})
        }else{
            res.json({status:200,result:'音乐列表为空'})
        }
    })
})

// 根据歌曲删除 _id
router.post('/music/delete',(req,res)=>{
    const _id = req.body._id
    Music.findByIdAndRemove({_id})
    .then(()=>{
        res.json({status:200,result:'删除成功'})
    })
    .catch(err=>{
        console.log('删除歌曲err=>',err)
        res.status(500).json({status:500,result:'删除失败，服务器内部错误'})
    })
})

// 编辑歌曲
router.post('/music/edit',(req,res)=>{
    // 获取前端传递的歌曲id
    const _id = req.body._id

    const newSong = {}
    newSong.songName = req.body.songName
    newSong.artist = req.body.artist
    newSong.src = req.body.src
    newSong.poster = req.body.poster
    newSong.language = req.body.language
    newSong.style = req.body.style

    Music.findOneAndUpdate({_id:_id},{$set:newSong},{new:true})
    .then(song=>{
        res.status(200).json({status:'200',result:'歌曲更新成功'})
    }).catch(err=>{
        console.log('编辑歌曲 err=>',err)
        res.status(500).json({status:500,result:'更新失败，服务器内部错误'})
    })
})

module.exports = router
















