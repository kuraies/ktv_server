const express = require('express')
const bodyParser = require('body-parser')

const app = express()


// 配置
require('./mongodb/mongodb') // 数据库连接
require('./config/http')(app) // 解决跨域

// 中间件
app.use(express.json())
app.use(bodyParser.urlencoded({extended: false}))
app.use(bodyParser.json())

// 路由
const safeCode = require('./api/safeCode')
const adminRouter = require('./api/admin')


// 注册路由
app.use("/api/safecode", safeCode) // 验证码相关的路由
app.use('/api/admin', adminRouter) // 管理员相关的路由

app.listen(3000, err => {
    if (err) {
        throw err
    }

    console.log(`Server is running at http://localhost:3000`)
})