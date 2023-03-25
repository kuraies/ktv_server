<template>
    <div class="login">
<!--        <div class="login-title">-->
<!--            <span>ktv点歌管理系统</span>-->
<!--        </div>-->
<!--        <div class="form-box">-->
<!--            <el-form class="login-form" label-position="top" size="small" :inline-message="inline" :model="loginForm"-->
<!--                status-icon :rules="loginRule" ref="loginForm">-->
<!--                <el-form-item label="邮箱" prop="email">-->
<!--                    <el-input type="text" v-model="loginForm.email" placeholder="请输入邮箱"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="密码" prop="password">-->
<!--                    <el-input type="password" v-model="loginForm.password" show-password placeholder="请输入密码"></el-input>-->
<!--                </el-form-item>-->
<!--                <el-form-item label="验证码" prop="inputCaptcha">-->
<!--                    <div class="capture_code">-->
<!--                        <el-input style="width: 150px;" v-model="loginForm.inputCaptcha" placeholder="验证码"></el-input>-->
<!--                        <img width="80" style="background: #EEE9E9;margin-left: 30px;" height="32" :src="captureSrc"-->
<!--                            @click="refreshCaptcha" />-->
<!--                    </div>-->
<!--                </el-form-item>-->
<!--                <el-form-item>-->
<!--                    <el-button class="login-btn" type="primary" @click="submitForm('loginForm')">登录</el-button>-->
<!--                </el-form-item>-->
<!--            </el-form>-->
<!--        </div>-->
      <div class="form-box">
        <div class="form-img">
dd
        </div>
      </div>
    </div>
</template>

<script>
import jwt_decode from 'jwt-decode'
import wsmLoading from '@/plugins/wsmLoading'

export default {
    name: 'Login',
    data() {
        // 校验验证码的输入
        const validateCapcha = (rule, value, callback) => {
            console.log('this.loginForm.inputCaptcha=>', typeof this.loginForm.inputCaptcha)
            if (!this.loginForm.inputCaptcha.trim()) { // 验证码为空或者用户没有输入，需要注意：用户有可能会输入几个空格之后再输入验证码
                callback(new Error("请输入验证码~"))
            } else {
                callback()  // 校验通过的情况，要开发callback的出口
            }
        }

        return {
            inline: true,
            loginForm: {
                email: '279167901@qq.com',
                password: '123456',
                inputCaptcha: ''
            },
            loginRule: {
                email: [
                    { required: true, message: '邮箱不能为空', trigger: 'blur' },
                    { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
                ],
                password: [
                    { required: true, message: '密码不能为空', trigger: 'blur' },
                    { min: 6, max: 20, message: '密码长度在6-20之间', trigger: 'blur' }
                ],
                inputCaptcha: [
                    { required: true, validator: validateCapcha, trigger: 'blur' }
                ]
            },
            captureSrc: ''
        };
    },
    mounted() {
        this.refreshCaptcha()
    },
    methods: {
        // 登录
        submitForm(formName) {
            this.$refs[formName].validate((valid) => {
                if (valid) {
                    wsmLoading.start('正在登录，请稍候...')

                    setTimeout(() => {
                        // 验证验证码
                        // 获取到cookie中的验证码
                        const captChaValue = this.getCaptchaFromCookie('captcha')
                        console.log('captChaValue=>', captChaValue)
                        if (captChaValue === this.loginForm.inputCaptcha) {// 验证码是否相等

                            // 调用接口，发送登录数据到后端
                            // console.log('验证码相等')
                            this.$axios.post('http://localhost:3000/api/admin/account/login', this.loginForm)
                                .then(res => {
                                    console.log('跳转到首页')
                                    if (res) {
                                        console.log('login res=>', res)
                                        const { token } = res.data
                                        // 解析token 保存token 到本地缓存 vuex
                                        // token保存到本地缓存
                                        localStorage.setItem('adminToken', token)

                                        // 解析token，获取信息
                                        const decoded = jwt_decode(token)
                                        // 存储到vuex中
                                        this.$store.dispatch('setAdminInfo', decoded)
                                        // 关闭loading
                                        wsmLoading.end()
                                        // 登录成功的提示框
                                        this.$Message.success({
                                            content: decoded.username + '登录成功',
                                            onClose: () => {
                                                // 使用js进行路由跳转
                                                this.$router.push('/')
                                            }
                                        })
                                    }
                                })
                                .catch(error => {
                                    // 关闭loading
                                    wsmLoading.end()
                                    console.error(error)
                                })
                        } else {
                            wsmLoading.end()
                        }
                    }, 1000)
                } else {
                    console.log('error submit!!');
                    return false;
                }
            });
        },
        getCaptchaFromCookie(cname) {
            var name = cname + "=";
            var ca = document.cookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i].trim();
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length)
                }
            }
            return "";
        },
        resetForm(formName) {
            this.$refs[formName].resetFields();
        },
        // 刷新验证码
        refreshCaptcha() {
            this.captureSrc = "http://localhost:3000/api/safecode?d=" + Math.random()
        }
    }

}
</script>

<style lang="less" scoped>
.login {
    width: 100%;
    height: 100%;
    cursor: default;
    padding: 40px 0px;
    //color: red;
    //background-image: url("../assets/image/login-bg.jpg");
    //background-size: 100% 100%;
    background-color: #eeeeee;
    display: flex;
    flex-direction: column;
  justify-content: center;
  align-items: center;


    .form-box {
        width: 70%;
        height:80%;
        background-color: #fff;
        margin: 0 auto;
        border-radius: 30px;



      .login-form {
            width: 300px;
            margin: 0 auto;
            background-color: rgba(255, 255, 255, 0.9);
            border: 1px solid #cdcdcd;
            padding: 10px 15px;
            border-radius: 5px;

            .login-btn {
                width: 100%;
                background: linear-gradient(to bottom, rgba(47, 228, 89, 0.9), #27a744); // 线性渐变
                font-weight: 600;
            }

            .login-btn:hover {
                background: rgb(94, 255, 132);
            }

            // 验证码
            .capture_code {
                display: flex;
                align-items: center;
                justify-content: space-between;

                input {
                    // width: 160px;
                    height: 32px;
                    outline: none;
                    border: 1px solid #eee;
                    padding: 2px 15px;
                    border-radius: 5px;
                    font-size: 13px;
                }
            }
        }
    }
}
</style>