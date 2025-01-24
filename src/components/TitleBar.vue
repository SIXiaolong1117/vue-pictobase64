<script setup>
const { ipcRenderer } = require("electron");
import { ref } from 'vue';

// 关闭页面
function closeFrame() {
    ipcRenderer.send("closeFrame");
}

// 最小化窗口
function minimizeFrame() {
    ipcRenderer.send("minimizeFrame");
}

// 打开设置 dialog
const showSettingDialog = ref(false);
function openSettings() {
    showSettingDialog.value = true;
}
</script>

<template>
    <!-- 标题栏 -->
    <div id="title-bar">
        <div class="title">ℙ𝕚𝕔 𝕋𝕠 𝔹𝕒𝕤𝕖𝟞𝟜</div>
        <div class="bar">
            <el-button class="bar-button" id="mini-button" name="mini" value="关闭窗口" v-on:click="openSettings()">
                <font-awesome-icon :icon="['fas', 'gear']" size="1x" />
            </el-button>
            <el-button class="bar-button" id="mini-button" name="mini" value="关闭窗口" v-on:click="minimizeFrame()">
                <font-awesome-icon :icon="['fas', 'minus']" size="1x" />
            </el-button>
            <el-button class="bar-button" id="close-button" name="close" value="关闭窗口" v-on:click="closeFrame()">
                <font-awesome-icon :icon="['fas', 'xmark']" size="1x" />
            </el-button>
        </div>
        <!-- 设置界面 -->
        <el-dialog id="setting-dialog" v-model="showSettingDialog" width="25em" :close-on-click-modal="true"
            :destroy-on-close="true">
        </el-dialog>
    </div>
</template>

<style scoped>
#setting-dialog {
    z-index: 1000;
}

.title {
    color: #ffffff;
    margin-left: .5em;
    margin-top: 0em;
    font-size: 1.5em;
    user-select: none;
}

#title-bar {
    -webkit-app-region: drag;
    display: flex;
    flex-direction: column;
}

.bar {
    position: fixed;
    align-self: flex-end;
    margin: 0px 0px 0 0;
    z-index: 1000;
}

.bar-button {
    width: 2.5em;
    height: 2em;
    margin: 0;
    border-radius: 0px !important;
    background-color: #ffffff00;
    border-color: #ffffff00 !important;
}

#close-button,
#mini-button {
    -webkit-app-region: no-drag;
    margin: 0;
}

#close-button:hover {
    background-color: #c42b1c;
    color: white;
}

#mini-button:hover {
    background-color: hsla(0, 0%, 0%, 0.5);
    color: white;
}
</style>