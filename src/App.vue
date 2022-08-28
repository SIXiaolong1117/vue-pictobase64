<script>
export default {
  name: 'patchCheck',
  data() {
    return {
      infoshow: false,
      fileList: [],
    };
  },
  mounted() {
    window.readImge = this.readImge;

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
      console.log(e.dataTransfer.files[0]);
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
    // 读取图片，函数运行时间计算
    readImge: function (file) {
      if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
      }

      var preview = document.querySelector('img');
      var reader = new FileReader();

      reader.addEventListener("load", function () {
        // 执行前计时
        var timeStart = Date.now()
        preview.src = this.result;
        base64_code.innerHTML = this.result;
        // 执行后计时
        var timeEnd = Date.now()
        // 计算时间差
        var timeDiff = timeEnd - timeStart
        // 输出时间差
        console.log("Conversion time: ", timeDiff, " ms");
        time_diff.innerHTML = '<h3 class="timeDiff">转换用时 ' + timeDiff + ' ms</h3><h4 class="timeDiff">Conversion time ' + timeDiff + ' ms</h4>';
      }, false);

      if (file) {
        reader.readAsDataURL(file);
      }

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
    // Base64解码
    base64Decode: function () {
      var base64Decode = base64_input.innerHTML;
      img_area.innerHTML = '<img src="' + base64Decode + '" alt=""/>';
    },
    // 复制生成的Base64
    copyCode: function () {
      var copyText = base64_code.innerHTML;
      console.log(copyText);
      var content = document.getElementById('base64_code').innerHTML;

      navigator.clipboard.writeText(content)
        .then(() => {
          console.log("Text copied to clipboard...")
        })
        .catch(err => {
          console.log('Something went wrong', err);
        })
    },
    // 刷新页面
    InitEditor: function () {
      location.reload()
    },
    // 关闭页面
    close: function () {
      window.close();
    }
  },
};
</script>

<template>
  <div ref="select_frame" class="box">
    <div class="bar">
      <input type="button" id="close_button" name="close" value="关闭窗口" onclick="window.close();" />
      <!-- <el-button id="close_button" type="primary" v-on:click="close()" round>X</el-button> -->
    </div>
    <h1>Pic To Base64</h1>
    <div class="display">
      <div class="code_div">
        <h2>BASE64</h2>
        <h3>Base64</h3>
        <hr>
        <textarea id="base64_code"></textarea>
      </div>
      <div class="img_div">
        <h2>图片预览</h2>
        <h3>Preview</h3>
        <hr>
        <p id="img_area"><img src="" alt="Image preview..."></p>
      </div>
    </div>
    <nav>
      <el-button id="input_button" type="primary" v-on:click="openFile()" round>打开文件</el-button>
      <el-button id="copy_button" type="primary" v-on:click="copyCode()" round>复制 Base64</el-button>
      <el-button id="init_button" type="primary" v-on:click="InitEditor()" round>清空内容</el-button>
      <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
    </nav>
    <p id="time_diff"></p>
  </div>
</template>