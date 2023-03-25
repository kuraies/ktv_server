<template>
    <div class="login">
      <div class="form-box box">
        <div class="form-img">
          <img alt="" src="../assets/image/wallhaven-gjxp3q.png">
        </div>
        <el-form ref="loginForm" :inline-message="inline" :model="loginForm" :rules="loginRule" class="login-form"
                 label-position="top" size="medium" status-icon>
          <div class="title">
            KTV管理系统
          </div>
          <el-form-item label="邮箱" prop="email">
            <el-input v-model="loginForm.email" placeholder="请输入邮箱" type="text"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" placeholder="请输入密码" show-password type="password"></el-input>
          </el-form-item>
          <el-form-item label="验证码" prop="inputCaptcha">
            <div class="capture_code">
              <el-input v-model="loginForm.inputCaptcha" placeholder="验证码" style="width: 180px;"></el-input>
              <img :src="captureSrc" alt="" height="32" style="background: #EEE9E9;margin-left: 30px;"
                   width="80" @click="refreshCaptcha"/>
            </div>
          </el-form-item>
          <el-form-item class="login-btn">
            <el-button medium="medium" round style="width: 100%" type="danger" @click="submitForm('loginForm')">登录
            </el-button>
          </el-form-item>
        </el-form>
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
          inline: false,
          loginForm: {
            email: '279167901@qq.com',
            password: '123456',
            inputCaptcha: ''
          },
          loginRule: {
            email: [
              {required: false, message: '邮箱不能为空', trigger: 'change'},
              {type: 'email', message: '请输入正确的邮箱地址', trigger: 'change'}
            ],
            password: [
              {required: false, message: '密码不能为空', trigger: 'change'},
              {min: 6, max: 20, message: '密码长度在6-20之间', trigger: 'change'}
            ],
            inputCaptcha: [
              {required: false, validator: validateCapcha, trigger: 'change'}
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
          let name = cname + "=";
          let ca = document.cookie.split(';');
          for (const item of ca) {
            let c = item.trim();
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
  user-select: none;
  user-drag: none;
  width: 100%;
  height: 100%;
  cursor: default;
  background-color: #eeeeee;
  display: flex;
  justify-content: center;
  align-items: center;
  position: Relative;


  .form-box {
    width: 60em;
    height: 35em;
    background-color: #fff;
    margin: 0 auto;
    border-radius: 30px;
    overflow: hidden;
    display: flex;

    .form-img {
      position: absolute;
      //float:left;
      background-color: #FE899C;
      width: 60%;
      height: 100%;
      border-radius: 30px;
      overflow: hidden;
      z-index: 2;

      img {
        height: 100%;
        transform: translateX(9%);
        transition: all 0.5s;
        pointer-events: none;
      }

      //transition: width 0.5s, margin-left 1s;
      transition: all 0.5s;
    }

    .form-img:hover {
      width: 100%;

      img {
        transform: translateX(30%);
      }
    }

    .login-form {
      transition: all 0.5s;
      width: 40%;
      //height: 100%;
      z-index: 1;
      padding: 40px 40px 10px;
      margin-left: 60%;
      position: relative;
      //margin: 0 auto;
      //background-color: rgba(255, 255, 255, 0.9);
      //border: 1px solid #cdcdcd;
      //padding: 10px 15px;
      //border-radius: 5px;
      .title {
        font-style: normal;
        font-size: 1.9em;
        line-height: 24px;
        margin-top: 30px;
        margin-bottom: 30px;
        /* identical to box height, or 60% */
      }

      .login-btn {
        width: 100%;
        position: relative;
        bottom: -10px;
        //background: linear-gradient(to bottom, rgba(47, 228, 89, 0.9), #27a744); // 线性渐变
        font-weight: 600;
      }

      //
      //.login-btn:hover {
      //    background: rgb(94, 255, 132);
      //}

      // 验证码
      .capture_code {
        display: flex;
        align-items: center;
        justify-content: space-between;
        margin-bottom: 0px;

        input {
          //width: 160px;
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

  .box {
    position: relative;
    //display: inline-block;
    background-color: #fff;
    box-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
    -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .box::after {
    content: "";
    border-radius: 5px;
    position: absolute;
    z-index: -1;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    box-shadow: 0 5px 15px rgba(0, 0, 0, 0.3);
    opacity: 0;
    -webkit-transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
    transition: all 0.6s cubic-bezier(0.165, 0.84, 0.44, 1);
  }

  .box:hover {
    -webkit-transform: scale(1.03, 1.03);
    transform: scale(1.03, 1.03);
  }

  .box:hover::after {
    opacity: 1;
  }
}

/deep/ .el-form-item__label {
  font-size: 1.1em;
  font-weight: 700;
}
</style>
<!--<style>-->
<!--.el-form-item__label{-->
<!--  font-size: 1.4em;-->
<!--}-->
<!--</style>-->