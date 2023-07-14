import axios  from "axios";
import { App } from 'vue'

export const instance = axios.create({});

// 请求拦截器
instance.interceptors.request.use(config => {
  // config.headers.Authorization = window.sessionStorage.getItem('token')
  config.headers["Content-Type"] = "application/json"
  if (localStorage.getItem('token')) {
    config.headers["token"] = localStorage.getItem('token')
  }
  return config
})

// 响应拦截器
instance.interceptors.response.use(response => {
  console.log(response.data)
  if (response.data.code === -1) {
    window.location.href = '/#/login'
  }
  return response
})
const install = (app: App) => {
  app.config.globalProperties.$axios = instance;
};

export default install
