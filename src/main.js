import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
// 引入 element-plus 结构
import ElementPlus from 'element-plus'; 
// 引入 element-plus 样式
import 'element-plus/dist/index.css'; 

createApp(App).use(ElementPlus).mount('#app')
