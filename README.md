<p align="center">
  <h1 align="center">图片转 Base64（Pic to Base64）</h1>
  <p align="center">一个基于 Vue 的图片转 Base64 客户端。</p>
  <p align="center">
    <a href="https://github.com/SIXiaolong1117/vue-pictobase64/blob/master/LICENSE">
      <img src="https://img.shields.io/github/license/SIXiaolong1117/vue-pictobase64"/>
    </a>
    <a href="https://github.com/SIXiaolong1117/vue-pictobase64/releases">
      <img src="https://img.shields.io/github/v/release/SIXiaolong1117/vue-pictobase64?display_name=tag"/>
    </a>
  </p>
  <p align="center">
    <a href="https://twitter.com/SI_Xiaolong">
      <img src="https://img.shields.io/badge/follow-SI_Xiaolong-blue?style=flat&logo=Twitter"/>
    </a>
  </p>
</p>
<p align="center">
    <img src="./README/2022-09-21-114416.png" width="50%"/>
</p>

## ⬇下载/Download

### 从 Microsoft Store 获取

[<img src="https://get.microsoft.com/images/zh-cn%20light.svg"  width="30%" height="30%">](https://apps.microsoft.com/store/detail/%E5%9B%BE%E7%89%87%E8%BD%ACbase64%EF%BC%88pic-to-base64%EF%BC%89/9NBF4FCR4T0G)

### 从 Releases 获取

您可以直接到[Releases · SIXiaolong1117/vue-pictobase64](https://github.com/SIXiaolong1117/vue-PicToBase64/releases)下载已经打包好的软件。

## 🛠️构建/Build

想要构建此项目，您需要：

```sh
git clone https://github.com/SIXiaolong1117/vue-pictobase64.git
cd vue-pictobase64
yarn
```

> 此外，本项目使用了 [electron-acrylic-window](https://github.com/Seo-Rii/electron-acrylic-window)，需要 `msvc` 的支持。您需要安装 Visual Studio，并安装“使用 C++ 的桌面开发”。
> 
> 在非 Windows 10/11 的PC上，您可以忽略这一点。

运行：

```sh
yarn electron:serve
```

## 📦︎打包/Package

想要打包此项目，您需要在项目根目录运行：

```sh
yarn electron:build
```

## ⚖️License

[MIT license](https://github.com/SIXiaolong1117/vue-PicToBase64/blob/main/LICENSE)

## 依赖/Dependencies

[Seo-Rii/electron-acrylic-window](https://github.com/Seo-Rii/electron-acrylic-window)