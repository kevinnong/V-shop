<template>
  <div class='login_container'>
    <div class='login_box'>
      <div class='avatar_box'>
        <img src='../assets/logo.png' alt />
      </div>
      <!-- 登录表单区域 -->
      <el-form
        ref='loginFormRef'
        :model='loginForm'
        label-width='0px'
        class='login_form'
        :rules='loginFormRules'
      >
        <!-- 用户名 -->
        <el-form-item prop='username'>
          <el-input v-model='loginForm.username' prefix-icon='iconfont icon-user'></el-input>
        </el-form-item>
        <!-- 密码 -->
        <el-form-item prop='password'>
          <el-input
            v-model='loginForm.password'
            prefix-icon='iconfont icon-lock_fill'
            type='password'
          ></el-input>
        </el-form-item>
        <el-form-item class='btns'>
          <el-button type='primary' @click='login'>登录</el-button>
          <el-button type='info' @click='resetLoginForm'>重置</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      loginForm: {
        username: 'admin',
        password: '123456'
      },
      loginFormRules: {
        username: [
          { required: true, message: '请输入活动名称', trigger: 'blur' },
          {
            min: 3,
            max: 10,
            message: '长度在 3 到 10 个字符',
            trigger: 'blur'
          }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          {
            min: 6,
            max: 16,
            message: '长度在 6 到 16 个字符',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  methods: {
    resetLoginForm() {
      this.$refs.loginFormRef.resetFields()
    },
    login() {
      this.$refs.loginFormRef.validate(async (valid) => {
        if (!valid) return
        const { data: res } = await this.$http.post('login', this.loginForm) //解构得到data,并重命名为res
        if (res.meta.status !== 200) return this.$message.error('登录失败')
        this.$message.success('登录成功')

        //登录成功后的行为
        // 1、将登录成功之后的token保存到客户端的sessionStorage（会话中的存储机制）中
        window.sessionStorage.setItem('token', res.data.token)
        // 2、通过编程式导航跳转到后台主页
        this.$router.push('/home')
      })
    }
  }
}
</script>

<style lang="less" scoped>
//scoped只在该单文件生效
.login_container {
  background-color: #2b4b6b;
  height: 100%;
}
.login_box {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 450px;
  height: 300px;
  background-color: #fff;
  border-radius: 3px;

  .avatar_box {
    height: 130px;
    width: 130px;
    border: 1px solid #eee;
    border-radius: 50%;
    padding: 10px;
    box-shadow: 0 0 10px #ddd;
    position: absolute;
    left: 50%;
    transform: translate(-50%, -50%);
    background-color: #fff;
    img {
      width: 100%;
      height: 100%;
      border-radius: 50%;
      background-color: #eee;
    }
  }
}
.btns {
  display: flex;
  justify-content: flex-end;
}
.login_form {
  position: absolute;
  bottom: 0;
  width: 100%;
  padding: 0 20px;
  box-sizing: border-box;
}
</style>