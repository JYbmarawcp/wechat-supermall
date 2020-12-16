/*
  点击+出发选择图片api
  获取到图片路径
  把图片存到data中
  循环显示
*/
import {showToast} from "../../utils/asyncWx"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "体验问题",
        isActive: true
      },
      {
        id: 1,
        value: "商品、商家投诉",
        isActive: false
      }
    ],
    chooseImgs: [],
    // 文本域内容
    textVal: ""
  },
  UploadImgs: [],
  handleTabsItemChange(e) {
    const { index } = e.detail;
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index? v.isActive = true: v.isActive = false);
    this.setData({
      tabs
    });
  },
  // 点击“+”
  handleChooseImg() {
    wx.chooseImage({
      count: 9,
      sizeType: ['original', 'compressed'], // 原图 压缩过
      sourceType: ['album', 'camera'],
      success: (result) => {
        this.setData({
          chooseImgs: [...this.data.chooseImgs, ...result.tempFilePaths]
        })
      }
    });
      
  },
  handleRemoveImg(e) {
    const {index} = e.currentTarget.dataset;
    const {chooseImgs} = this.data;
    chooseImgs.splice(index, 1);
    this.setData({chooseImgs});
  },
  handleTextInput(e) {
    this.setData({textVal: e.detail.value});
  },
  // 提交
  async handleFormSubmit() {
    const {textVal, chooseImgs} = this.data;
    if (!textVal.trim()) {
      await showToast({title: "输入不合法"});
      return;
    }
    // 显示正在等待图片
    wx.showLoading({
      title: "正在上传中",
      mask: true
    });

    // 判断有无图片数组
    if (chooseImgs.length!==0) {
      chooseImgs.forEach((v,i) => {
        // 上传图片到服务器
        wx.uploadFile({
          url: 'https://imgurl.org/upload/ftp',
          filePath: v,
          name: "file",
          // 顺带的文本信息
          formData: {},
          success: (result) => {
            let url = result.url;
            this.UploadImgs.push(url);
  
            if (i === chooseImgs.length -1) {
              wx.hideLoading();
              console.log("把文本的内容和外网的图片数组都提交到后台");
              this.setData({
                textVal: "",
                chooseImgs: []
              })
              wx.navigateBack({
                delta: 1
              });
            }
          }
        });
      })
    } else {
      wx.hideLoading();
      console.log("只是提交了文本");
      this.setData({
        textVal: ""
      })
      wx.navigateBack({
        delta: 1
      });
    }
  }
})