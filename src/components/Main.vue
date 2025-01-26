<script setup>
const { ipcRenderer } = require("electron");
import { ref } from 'vue'

const base64code = ref('');
const copiedRef = ref(false);

// 监听主进程发送的事件
ipcRenderer.on('openPicture', (event, data) => {
    // readFile 读取文件，然后将返回的 Promise 送给 readImage 处理
    readFile(data).then(res => {
        readImage(res);
    });
});

// 读取文件
function readFile(filePath) {
    return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        var imageName = 'newImage'
        // 向 filePath 发送 HTTP GET 请求
        xhr.open("GET", filePath);
        // 请求头 客户端需要 image 类型图片（这里的类型随意，因为本地指定文件只有一种类型）
        xhr.setRequestHeader('Accept', 'image/png');
        // 期望返回二进制数据
        xhr.responseType = "blob";
        // 请求成功处理
        xhr.onload = () => {
            blob = xhr.response;
            let imgFile = new File([blob], imageName, { type: 'image/png' });
            // 生成的 File 对象作为 Promise 的返回值
            resolve(imgFile);
        };
        // 请求失败处理
        xhr.onerror = (e) => {
            reject(e)
        };
        // 发送请求
        xhr.send();
    });
}

// 有关 Store 的通信
// 获取存储内容
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

// 从剪贴板读取并解析图像为 Base64
async function readClipboard() {
    try {
        // 读取剪贴板内容
        const items = await navigator.clipboard.read();
        for (const item of items) {
            if (item.types.includes('image/png') || item.types.includes('image/jpeg')) {
                // 获取图像内容
                const blob = await item.getType('image/png');
                const reader = new FileReader();

                reader.onloadend = async function () {
                    // 将图像转为Base64并存储
                    base64code.value = reader.result;
                    const preview = document.querySelector('#img-preview');
                    preview.src = reader.result;

                    const autoCopy = await getStoreValue('autoCopy');
                    if (autoCopy === true) {
                        // 如果自动复制打开 调用复制函数
                        copyCode();
                    }
                };

                reader.readAsDataURL(blob);
                break;
            }
        }
    } catch (error) {
        console.error("读取剪贴板失败:", error);
        alert("无法读取剪贴板内容");
    }
}

// 复制 Base64 结果
// TODO：点击按钮复制最好别用系统的通知，页面内通知一下就完了。系统通知可以用在后台自动转换上。
async function copyCode() {
    var content = base64code.value;
    // const NOTIFICATION_TITLE = '复制成功'
    // var NOTIFICATION_BODY = ''
    // const CLICK_MESSAGE = 'Notification clicked!'
    const useMarkdown = await getStoreValue('useMarkdown');
    if (useMarkdown === true) {
        content = '![](' + content + ')';
        // NOTIFICATION_BODY = '复制Markdown语法成功！'
    }
    else {
        content = base64code.value;
        // NOTIFICATION_BODY = '复制Base64成功！'
    }
    navigator.clipboard.writeText(content)
        .then(() => {
            // new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () => base64code.value = CLICK_MESSAGE
            copiedRef.value = true;
            setTimeout(() => {
                copiedRef.value = false;
            }, 2000);
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
    let inputString = base64code.value;

    // 正则表达式匹配以 data:image/ 开头，后接任意英文字符，然后是 ;base64, 和 Base64 编码
    const base64Pattern = /data:image\/[a-zA-Z]+;base64,(?:[A-Za-z0-9+/]{4})*(?:[A-Za-z0-9+/]{2}==|[A-Za-z0-9+/]{3}=)?/;
    const match = inputString.match(base64Pattern);

    if (match) {
        let base64Decode = match[0]; // 获取完整的匹配结果
        base64code.value = base64Decode;
        var imgArea = document.querySelector('#img_area');
        imgArea.innerHTML = '<img id="img-preview" src="' + base64Decode + '" alt=""/>';
    } else {
        console.log("未找到有效的Base64编码");
    }
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
    <div class="display-main">
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
        <nav class="nav-button">
            <el-button id="input_button" @click="openFile()" round>打开图片</el-button>
            <el-button id="paste_button" @click="readClipboard()" round>从剪贴板</el-button>
            <el-button id="input_button" @click="base64Decode()" round>解码 Base64</el-button>
            <el-button id="copy_button" @click="copyCode()" round>复制 Base64</el-button>
            <el-button id="init_button" @click="initWindow()" round>清空内容</el-button>
            <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
        </nav>

        <div v-if="copiedRef" class="copy-success-message">
            <span>内容已复制！</span>
        </div>
    </div>
</template>

<style scoped>
.display-main {
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: stretch;
}

.nav-button {
    margin-top: auto;
}

.copy-success-message {
    position: fixed;
    bottom: 1em;
    left: 50%;
    transform: translateX(-50%);
    background-color: #4caf50;
    color: white;
    padding: 10px 20px;
    border-radius: 5px;
    font-size: 14px;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.2);
    opacity: 0;
    /* 初始设置为不可见 */
    animation: slideInOut 2s ease-in-out forwards;
}

.copy-success-message span {
    display: block;
    text-align: center;
}

@keyframes slideInOut {
    0% {
        bottom: 1em;
        /* 初始位置在下方 */
        opacity: 0;
        /* 初始不可见 */
    }

    15% {
        bottom: 8.5em;
        /* 顶端偏移，显示出来 */
        opacity: 1;
        /* 完全显示 */
    }

    20% {
        bottom: 8em;
        /* 顶端偏移，显示出来 */
        opacity: 1;
        /* 完全显示 */
    }

    80% {
        bottom: 8em;
        /* 保持在显示位置 */
        opacity: 1;
        /* 保持可见 */
    }

    100% {
        bottom: 1em;
        /* 向上飘出 */
        opacity: 0;
        /* 最终消失 */
    }
}
</style>