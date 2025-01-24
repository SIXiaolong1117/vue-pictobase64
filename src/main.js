import { createApp } from 'vue'
import App from './App.vue'
// 引入 element-plus 结构
import ElementPlus from 'element-plus'; 
// 引入 element-plus 样式
import 'element-plus/dist/index.css'; 
// 自定义的css要在Element后面引入，这样才能保证样式覆盖。
import './style.css'
import { library } from '@fortawesome/fontawesome-svg-core';
import { fab } from '@fortawesome/free-brands-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import * as Icons from '@element-plus/icons-vue'

library.add(fab);
library.add(fas);

const app = createApp(App)

app.component('font-awesome-icon', FontAwesomeIcon);
app.use(ElementPlus)
for (const [key, component] of Object.entries(Icons)) {
    app.component(key, component)
  }
app.mount('#app')