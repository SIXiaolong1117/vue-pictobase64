<script>
export default {
  mounted() {
    window.readFile = this.readFile;
    var img_upload = document.getElementById("img_upload");
    // 添加功能出发监听事件
    img_upload.addEventListener('change', readFile, false);
  },
  methods: {
    openFile: function () {
      document.getElementById('img_upload').click();
    },
    tirggerFile: function (event) {
      var file = event.target.files[0]; // (利用console.log输出看结构就知道如何处理档案资料)
      console.log(file);
      if (!/image\/\w+/.test(file.type)) {
        alert("请确保文件为图像类型");
        return false;
      }
      var reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function () {
        var timeStart = Date.now()
        // this.result里的这个result是FileReader.readAsDataURL()接口当中转换完图片输出的base64结果存放在result当中
        base64_code.innerHTML = this.result;
        img_area.innerHTML = '<img src="' + this.result + '" alt=""/>';
        var timeEnd = Date.now()
        var timeDiff = timeEnd - timeStart
        console.log("Conversion time: ", timeDiff, " ms");
        time_diff.innerHTML = '<h3 class="timeDiff">转换用时 ' + timeDiff + ' ms</h3><h4>Conversion time ' + timeDiff + ' ms</h4>';
      }
      // 监听元素变动，一旦有变动便运行readFile
      img_upload.addEventListener('change', readFile, false);
    },
    base64Decode: function () {
      var base64Decode = base64_input.innerHTML;
      img_area.innerHTML = '<img src="' + base64Decode + '" alt=""/>';
    },
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
  },
}
</script>

<template>
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
      <p id="img_area"></p>
    </div>
  </div>
  <nav>
    <el-button id="input_button" type="primary" v-on:click="openFile()" round>打开文件</el-button>
    <el-button id="copy_button" type="primary" v-on:click="copyCode()" round>复制 Base64</el-button>
    <el-button id="copy_button" type="primary" v-on:click="InitEditor()" round>清空内容</el-button>
    <!-- 原生input -->
    <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
  </nav>
  <p id="time_diff"></p>
</template>