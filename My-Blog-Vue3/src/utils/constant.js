export default {
  // ==================== 后端API配置 ====================
  // 开发环境
  baseURL: "http://localhost:8000/api",
  webURL: "http://localhost:8000",
  // 生产环境请修改为您的后端域名
  // baseURL: "http://your-backend-domain.com/api",
  // webURL: "http://your-backend-domain.com",

  // ==================== 公共API（无需修改） ====================
  hitokoto: "https://v1.hitokoto.cn",
  shehui: "https://api.oick.cn/yulu/api.php",
  jinrishici: "https://v1.jinrishici.com/all.json",

  // ==================== 图片上传配置 ====================
  // 开发环境
  qiniuUploadImages: "http://localhost:8000/api/resource/updateImage/",
  // 生产环境请修改为您的后端域名
  // qiniuUploadImages: "http://your-backend-domain.com/api/resource/updateImage/",

  // ==================== 七牛云/图床配置 ====================
  // 请配置您自己的七牛云或图床地址
  qiniuUploadEntrance: "http://your-qiniu-domain.com/",

  // ==================== 视频资源配置 ====================
  // 请配置您自己的视频资源地址
  favoriteVideo: "https://your-video-url.com/video.mp4",
  // 按钮颜色
  before_color_1: "var(--blue13)",
  after_color_1: "linear-gradient(45deg, var(--red), var(--purple1))",
  // 评论分页颜色 微言分页颜色
  commentPageColor: "var(--green6)",
  userId: 9, // 博客主人的用户id
  // emoji含义
  emojiList: [
    "衰",
    "鄙视",
    "再见",
    "捂嘴",
    "摸鱼",
    "奋斗",
    "白眼",
    "可怜",
    "皱眉",
    "鼓掌",
    "烦恼",
    "吐舌",
    "挖鼻",
    "委屈",
    "滑稽",
    "啊这",
    "生气",
    "害羞",
    "晕",
    "好色",
    "流泪",
    "吐血",
    "微笑",
    "酷",
    "坏笑",
    "吓",
    "大兵",
    "哭笑",
    "困",
    "呲牙",
  ],
  // 纯色
  SolidColor: [
    "#f7f9fe",
    "#30303c",
    "#7a7374",
    "#eea6b7",
    "#918072",
    "#fbecde",
    "#a4aca7",
    "#a4cab6",
    "#83a78d",
    "#70887d",
    "#57c3c2",
    "#10aec2",
    "#93d5dc",
    "#3b818c",
    "#5cb3cc",
    "#93b5cf",
  ],
  // 渐变
  gradient: [
    "55deg, #0095c2 21%, #64E1C8 100%",
    "90deg, #ffd7e4 0%, #c8f1ff 100%",
    "45deg, #e5737b, #c6999e, #96b9c2, #00d6e8",
    "25deg, #31354b, #38536c, #3b738e, #3995b2",
    "26deg, #0e6183, #387ea6, #599dcb, #7abdf1",
    "25deg, #0583bf, #159bc5, #16b4cb, #0aced0",
    "25deg, #3e47d1, #8b5fb8, #ba7b9d, #df9980",
    "25deg, #0e5c71, #15828f, #19a9ae, #1ad3ce",
  ],
  // ==================== 关于页面配置 ====================
  // 请配置您自己的图片和内容
  about: [
    {
      img: "https://your-image-url.com/image1.jpg",
      tit: "标题1",
      sub: "描述1",
    },
    {
      img: "https://your-image-url.com/image2.jpg",
      tit: "标题2",
      sub: "描述2",
    },
  ],
  themeMapConfig: [
    {
      title: "1. 图片（电脑）",
      collapseTitle: "查看适配电脑端背景",
      handleVal: "pc",
      class: "box",
      dataList: [],
      style: "img",
    },
    {
      title: "2. 图片（移动端）",
      collapseTitle: "查看适配移动端背景",
      handleVal: "mobile",
      class: "box mobileBox",
      dataList: [],
      style: "img",
    },
    {
      title: "3. 渐变色",
      collapseTitle: "查看渐变色背景",
      handleVal: "gradient",
      class: "box",
      dataList: [],
      style: "gradient",
    },
    {
      title: "4. 纯色",
      collapseTitle: "查看纯色背景",
      handleVal: "solid",
      class: "box",
      dataList: [],
      style: "solid",
    },
  ],
  // 随机 微言颜色 标签颜色
  tree_hole_color: (function () {
    function getRandomColor() {
      return `rgb(${Math.random() * 255}, ${Math.random() * 255}, ${
        Math.random() * 255
      })`;
    }
    const colors = [];
    for (let i = 0; i < 6; i++) {
      colors.push(getRandomColor());
    }
    return colors;
  })(),
};
