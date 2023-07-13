import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueJsx from '@vitejs/plugin-vue-jsx'

// https://vitejs.dev/config/
export default defineConfig({
	base: "/",
	plugins: [
		vue(),
		vueJsx(),
	],

	resolve: {
		alias: {
			'@': '/src'
		},
	},
	server: {
		port: 4568,
		open: true,
		proxy: {
			'/api': {
				target: 'http://localhost:9000/',
				changeOrigin: true,//是否允许跨域
				// rewrite: path => path.replace(/^\/downhole/, '')
			},
		}
	}
})