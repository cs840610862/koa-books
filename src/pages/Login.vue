<template>
  <div class="login-container">
    <el-card class="login-card">
      <h2 class="login-title">图书管理系统</h2>
      <el-form ref="loginFormRef" :model="loginForm" :rules="loginRules">
        <el-form-item prop="username">
          <el-input v-model="loginForm.username" placeholder="请输入用户名"></el-input>
        </el-form-item>
        <el-form-item prop="password">
          <el-input type="password" v-model="loginForm.password" placeholder="请输入密码"></el-input>
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="register(loginFormRef)">注册</el-button>
          <el-button type="primary" @click="login(loginFormRef)">登录</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script setup lang="ts">
import { reactive, ref, getCurrentInstance } from 'vue'
import type { FormInstance } from 'element-plus'
import { ElMessage } from 'element-plus'
import {useRouter} from 'vue-router'

const axiosInstance = getCurrentInstance()?.appContext.config.globalProperties.$axios;
const router = useRouter()
let loginForm = reactive({
  username: 'admin',
  password: 'admin',
})
let loginRules = reactive({
  username: [
    { required: true, message: '请输入用户名', trigger: 'blur' },
  ],
  password: [
    { required: true, message: '请输入密码', trigger: 'blur' },
  ],
})
const loginFormRef = ref<FormInstance>()

const login = (formEl: FormInstance | undefined) => {
  if (formEl) {
    formEl.validate((valid) => {
      if (valid) {
        // 登录逻辑, 调用登录成功接口
        axiosInstance?.post('/api/login', loginForm).then(({ data }) => {
          if (data.code === 0) {
            console.log('login success')
            localStorage.setItem('token', data.token)
            router.push('/books')
          }
        })
      } else {
        console.log('校验失败');
        return false;
      }
    })
  }
}
const register = (formEl: FormInstance | undefined) => {
  if (formEl) {
    formEl.validate((valid) => {
      if (valid) {
        // 登录逻辑, 调用登录成功接口
        axiosInstance?.post('/api/register', loginForm).then(({ data }) => {
          if (data.code === 0) {
            localStorage.setItem('token', data.token)
            console.log('register success')
            ElMessage.success('注册成功, 立即登录吧!')
          }
        })
      } else {
        console.log('校验失败');
        return false;
      }
    })
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  background-color: rgb(32, 34, 42);
}

.login-card {
  width: 400px;
  padding: 20px;
}

.login-title {
  text-align: center;
  margin-bottom: 20px;
}
</style>
