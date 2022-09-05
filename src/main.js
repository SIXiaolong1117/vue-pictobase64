import { createApp } from 'vue'
import App from './App.vue'
// 引入 element-plus 结构
import ElementPlus from 'element-plus'; 
// 引入 element-plus 样式
import 'element-plus/dist/index.css'; 
// 自定义的css要在Element后面引入，这样才能保证样式覆盖。
import './style.css'

createApp(App).use(ElementPlus).mount('#app')
