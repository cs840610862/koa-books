import { createApp } from 'vue'
//全量引入
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './style.scss'

export let menus = [
	{ 
		path: '/books', 
		meta: {name: "图书管理"},
		component: () => import('/src/pages/Books.vue'), 
	},
	{ 
		path: '/users', 
		meta: {name: "用户管理"},
		component: () => import('/src/pages/Users.vue'), 
	},
	{ 
		path: '/publishers', 
		meta: {name: "出版社管理"},
		component: () => import('/src/pages/Publishers.vue'), 
	},
	{ 
		path: '/authors', 
		meta: {name: "作者管理"},
		component: () => import('/src/pages/Authors.vue'), 
	},
	{ 
		path: '/booktypes', 
		meta: {name: "图书类型管理"},
		component: () => import('/src/pages/BookType.vue'), 
	},
]

let routerList = [
	{
		path: '/', component: () => import('/src/Dashboard.vue'),
		children: menus
	},
	{ 
		path: '/login', 
		meta: {name: "登录"},
		component: () => import('/src/pages/Login.vue'), 
	},
]

let router = createRouter({
	history: createWebHashHistory(),
	routes: routerList
})

import App from './App.vue'
import { createRouter, createWebHashHistory } from 'vue-router'

let app = createApp(App)
app.use(router)
app.use(ElementPlus)
app.mount('#app')

// new Vue({
// 	router,
// 	store,
// 	render: (h) => h(App)
// }).$mount('#app')
