import { request } from "../../request/index"
import { login } from "../../utils/asyncWx"
Page({
  data: {

  },
  onLoad: function (options) {

  },
  async handleGetuserinfo(e) {
    try {
      const {encryptedData, rawData, iv, signature} = e.detail;
      const { code } = await login();
      const loginParams = {encryptedData, rawData, iv, signature, code};
      const res = await request({
        url: "/users/wxlogin",
        data: loginParams,
        method: 'post'
      });
      wx.setStorageSync("token", 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1aWQiOjIzLCJpYXQiOjE1NjQ3MzAwNzksImV4cCI6MTAwMTU2NDczMDA3OH0.YPt-XeLnjV-_1ITaXGY2FhxmCe4NvXuRnRB8OMCfnPo');
      wx.navigateBack({
        delta: 1
      });
    } catch (error) {
      console.error(error);
    }
  }
})