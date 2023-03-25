var svgCaptcha = require('svg-captcha')

const router = require('express').Router()

router.get('/',(req,res)=>{
   const captcha = svgCaptcha.create({
        // 翻转
        inverse:false,
        fontSize:38,
        // 噪声线的条数
        noise:3,
        width:80,
        height:32
    })
    // console.log('captcha=>',captcha)
    // 获取验证码文本
    const captchaText = captcha.text
    // 通过cookie把验证码携带会前端
    res.cookie('captcha',captchaText)
    res.setHeader('Content-Type',"image/svg+xml")
    res.send(String(captcha.data))
})

module.exports = router