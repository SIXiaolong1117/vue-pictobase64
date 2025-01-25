<script setup>
const { ipcRenderer } = require("electron");
import { ref } from 'vue'

const base64code = ref('');

async function getStoreValue(key) {
    const value = await ipcRenderer.invoke('get-store', key);
    console.log(`Value for "${key}":`, value);
    return value;
}

// el-button 打开图片按钮
function openFile() {
    // 触发一个隐藏的 input
    document.getElementById('img_upload').click();
}

// 捕获文件
function tirggerFile(event) {
    // 利用console.log输出看结构就知道如何处理档案资料
    var file = event.target.files[0];
    // 调用读取图像函数
    readImage(file);
}

// 读取图像
function readImage(file) {
    // 类型判断
    if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
    }

    // 获取用于预览图像的元素
    var preview = document.querySelector('#img-preview');
    // 创建 FileReader 对象
    var reader = new FileReader();

    reader.addEventListener("load", async function () {
        // 清空元素
        preview.src = '';
        base64code.value = '';  // 注意：要使用 .value 赋值，更新响应式变量

        // 赋值元素
        preview.src = this.result;
        base64code.value = this.result;

        const autoCopy = await getStoreValue('autoCopy');
        if (autoCopy === true) {
            // 如果自动复制打开 调用复制函数
            copyCode();
        }
    }, false);

    // 以 Base64 编码渲染图像
    if (file) {
        reader.readAsDataURL(file);
    }
}

// 复制 Base64 结果
// TODO：点击按钮复制最好别用系统的通知，页面内通知一下就完了。系统通知可以用在后台自动转换上。
async function copyCode() {
    var content = base64code.value;
    const NOTIFICATION_TITLE = '复制成功'
    var NOTIFICATION_BODY = ''
    const CLICK_MESSAGE = 'Notification clicked!'
    const useMarkdown = await getStoreValue('useMarkdown');
    if (useMarkdown === true) {
        content = '![](' + content + ')';
        NOTIFICATION_BODY = '复制Markdown语法成功！'
    }
    else {
        content = base64code.value;
        NOTIFICATION_BODY = '复制Base64成功！'
    }
    navigator.clipboard.writeText(content)
        .then(() => {
            new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () => base64code.value = CLICK_MESSAGE
        })
        .catch(err => {
            console.log('出现问题：', err);
        })
}

// 清空内容（重载页面）
function initWindow() {
    location.reload()
}

// 解码 Base64
function base64Decode() {
    console.log("解码 Base64");
    let base64Decode = base64code.value;
    // 处理 Markdown 语法
    if (base64Decode.startsWith('![](') && base64Decode.endsWith(')')) {
        // 去掉开头的 '![](' 和结尾的 ')'
        base64Decode = base64Decode.substring(4, base64Decode.length - 1);
        base64code.value = base64Decode;
    }
    var imgArea = document.querySelector('#img_area');
    imgArea.innerHTML = '<img id="img-preview" src="' + base64Decode + '" alt=""/>';
}

// 处理拖拽文件
function handleDrop(event) {
    // 防止默认事件
    event.preventDefault();
    // 获取拖拽的文件
    const file = event.dataTransfer.files[0];
    readImage(file);
}

// 阻止拖拽事件默认行为
function handleDragOver(event) {
    // 防止默认事件，允许拖拽放置
    event.preventDefault();
}
</script>

<template>
    <div class="display" @dragover="handleDragOver" @drop="handleDrop">
        <el-space direction="vertical">
            <div class="head-text">
                <h2>𝔹𝔸𝕊𝔼𝟞𝟜</h2>
                <h3>Base64</h3>
            </div>
            <textarea id="base64_code" v-model="base64code" spellcheck="false"></textarea>
        </el-space> <el-space direction="vertical">
            <div class="head-text">
                <h2>图片</h2>
                <h3>Image</h3>
            </div>
            <p id="img_area"><img id="img-preview" src=""></p>
        </el-space>
    </div>
    <nav>
        <el-button id="input_button" @click="openFile()" round>打开图片</el-button>
        <el-button id="input_button" @click="base64Decode()" round>解码 Base64</el-button>
        <el-button id="copy_button" @click="copyCode()" round>复制 Base64</el-button>
        <el-button id="init_button" @click="initWindow()" round>清空内容</el-button>
        <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
    </nav>
</template>

<style scoped></style>