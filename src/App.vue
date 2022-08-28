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
    readImge: function (file) {
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
        time_diff.innerHTML = '<h3 class="timeDiff">转换用时 ' + timeDiff + ' ms</h3><h4 class="timeDiff">Conversion time ' + timeDiff + ' ms</h4>';
      }
    },
    openFile: function () {
      document.getElementById('img_upload').click();
    },
    tirggerFile: function (event) {
      // (利用console.log输出看结构就知道如何处理档案资料)
      var file = event.target.files[0];
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
};
</script>

<template>
  <div ref="select_frame" class="box">
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
      <input type="file" id="img_upload" @change="tirggerFile($event)" style="display:none" />
    </nav>
    <p id="time_diff"></p>
  </div>
</template>