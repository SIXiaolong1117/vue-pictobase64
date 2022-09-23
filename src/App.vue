<script>
const { ipcRenderer } = require("electron");
const fs = require('fs')

export default {
  name: 'patchCheck',
  data() {
    return {
      infoshow: false,
      fileList: [],
      // 复制markdown语法开关
      mdSwitch: true,
      // textarea的内容
      textdata: ''
    };
  },
  mounted() {
    window.readFile = this.readFile;
    window.readImge = this.readImge;
    window.copyCode = this.copyCode;
    window.InitEditor = this.InitEditor;
    window.readFile = this.readFile;

    // 主进程托盘 打开图片
    ipcRenderer.on("openPicture", (event, data) => {
      readFile(data).then(res => {
        console.log(res);
        readImge(res);
      });
    })

    //阻止离开时的浏览器默认行为
    this.$refs.select_frame.ondragleave = (e) => {
      e.preventDefault();
    };
    //阻止拖放后的浏览器默认行为
    this.$refs.select_frame.ondrop = (e) => {
      e.preventDefault();
      // 获取文件对象
      const data = e.dataTransfer.files;
      // 检测是否有文件拖拽到页面    
      if (data.length < 1) {
        return;
      }
      // console.log('1'+e.dataTransfer.files);
      const formData = new FormData();
      for (let i = 0; i < e.dataTransfer.files.length; i++) {
        formData.append('uploadfile', e.dataTransfer.files[i], e.dataTransfer.files[i].name);
      }
      this.fileList = this.fileList.concat(e.dataTransfer.files[0]);
      // console.log(formData, this.fileList, e.dataTransfer.files[0]);
      // console.log(e.dataTransfer.files[0]);
      readImge(e.dataTransfer.files[0])
    };
    //阻止拖入时的浏览器默认行为
    this.$refs.select_frame.ondragenter = (e) => {
      e.preventDefault();
      this.$refs.select_frame.border = '2px dashed red';
    };
    //阻止拖来拖去的浏览器默认行为
    this.$refs.select_frame.ondragover = (e) => {
      e.preventDefault();
    };
  },
  methods: {
    // readFile
    readFile(filePath) {
      return new Promise((resolve, reject) => {
        var blob = null;
        var xhr = new XMLHttpRequest();
        var imageName = 'newImage'
        xhr.open("GET", filePath);
        xhr.setRequestHeader('Accept', 'image/jpeg');
        xhr.responseType = "blob";
        xhr.onload = () => {
          blob = xhr.response;
          let imgFile = new File([blob], imageName, { type: 'image/jpeg' });
          resolve(imgFile);
        };
        xhr.onerror = (e) => {
          reject(e)
        };
        xhr.send();
      });
    },
    // 打开文件，调用img_upload的click事件
    openFile: function () {
      document.getElementById('img_upload').click();
    },
    tirggerFile: function (event) {
      // 利用console.log输出看结构就知道如何处理档案资料
      var file = event.target.files[0];
      // 调用读取图像函数
      readImge(file);
    },
    // 读取图片，函数运行时间计算
    readImge: function (file) {
      // console.log(file)
      if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
      }

      var preview = document.querySelector('img');
      var reader = new FileReader();
      var _that = this

      reader.addEventListener("load", function () {
        // console.log("结果："+this.result);
        preview.src = '';
        preview.src = this.result;
        _that.textdata = this.result;
        // 调用拷贝
        copyCode();
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }
    },
    // Base64解码
    base64Decode: function () {
      // var base64Decode = base64_input.innerHTML;
      var base64Decode = this.textdata;
      img_area.innerHTML = '<img src="' + base64Decode + '" alt=""/>';
    },
    // 复制生成的Base64
    copyCode: function () {
      var content = this.textdata;
      const NOTIFICATION_TITLE = '复制成功'
      var NOTIFICATION_BODY = ''
      const CLICK_MESSAGE = 'Notification clicked!'
      if (this.mdSwitch == true) {
        content = '![](' + content + ')';
        NOTIFICATION_BODY = '复制Markdown语法成功！'
      }
      else {
        content = this.textdata;
        NOTIFICATION_BODY = '复制Base64成功！'
      }
      navigator.clipboard.writeText(content)
        .then(() => {
          // console.log("使用Markdown语法拷贝成功！")
          new Notification(NOTIFICATION_TITLE, { body: NOTIFICATION_BODY }).onclick = () => this.textdata = CLICK_MESSAGE
        })
        .catch(err => {
          console.log('出现问题：', err);
        })
    },
    // 清空内容
    InitWindow: function () {
      location.reload()
      // document.querySelector('img').src = '';
      // this.textdata = '';
    },
    // 关闭页面
    closeFrame: function () {
      // window.close();
      ipcRenderer.send("closeFrame");
    }
  },
};
</script>

<template>
  <div ref="select_frame" class="box">
    <div class="bar">
      <input type="button" id="close_button" name="close" value="关闭窗口" v-on:click="closeFrame()" />
    </div>
    <h1>Pic To Base64</h1>
    <div class="display">
      <div class="code_div">
        <h2>BASE64</h2>
        <h3>Base64</h3>
        <hr>
        <textarea id="base64_code" v-model="textdata"></textarea>
      </div>
      <div class="img_div">
        <h2>图片预览</h2>
        <h3>Preview</h3>
        <hr>
        <p id="img_area"><img src="" alt="Image preview..."></p>
      </div>
    </div>
    <nav>
      <el-button id="input_button" type="primary" v-on:click="openFile()" round>打开图片</el-button>
      <el-button id="input_button" type="primary" v-on:click="base64Decode()" round>解码 Base64</el-button>
      <el-button id="copy_button" type="primary" v-on:click="copyCode()" round>复制 Base64</el-button>
      <el-button id="init_button" type="primary" v-on:click="InitWindow()" round>清空内容</el-button>
      <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
    </nav>
    <nav>
      <el-switch id="md_switch" v-model="mdSwitch" active-color="#13ce66" inactive-color="#ff4949"
        active-text="使用Makedown语法" inactive-text="关闭Makedown语法"></el-switch>
    </nav>
  </div>
</template>