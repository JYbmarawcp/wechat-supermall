/*
  微信支付
  必须是企业账号
  企业账号的小程序后台中 必须给 开发者添加上白名单
*/
import { showModal, showToast } from "../../utils/asyncWx"
Page({
  data: {
    address: {},
    cart: [],
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync("address");
    let cart = wx.getStorageSync("cart") || [];
    // 过滤后的购物车数组
    cart = cart.filter(v => v.checked);
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      totalPrice += v.num * v.goods_price;
      totalNum += v.num;
    });
    this.setData({
      address,
      cart,
      totalPrice,
      totalNum
    })
  },
})