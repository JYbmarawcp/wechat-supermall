/*
  微信支付
  必须是企业账号
  企业账号的小程序后台中 必须给 开发者添加上白名单
*/
import { request } from "../../request/index"
import { requestPayment, showToast } from "../../utils/asyncWx"
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
  // 点击支付
  async handleOrderPay() {
    try {
      const token = wx.getStorageSync("token");
      if (!token) {
        wx.navigateTo({
          url: '/pages/auth/index'
        });
        return;
      }
      // 创建订单
      const header = {Authorization: token};
      const order_price = this.data.totalPrice;
      const consignee_addr = this.data.address.all;
      let goods = [];
      const cart = this.data.cart;
      cart.forEach(v => goods.push({
        goods_id: v.goods_id,
        goods_number: v.num,
        goods_price: v.goods_price
      }))
      const orderParams = {order_price, consignee_addr, goods};
      const {order_number} = await request({
        url: "/my/orders/create",
        method: "post",
        header,
        data: orderParams
      })
      const {pay} = await request({
        url: "/my/orders/req_unifiedorder",
        method: "post",
        header,
        data: {order_number}
      })
      // 发起微信支付
      await requestPayment(pay);
      // 查询后台订单状态
      await request({
        url: "/my/orders/chkOrder",
        method: "post",
        header,
        data: {order_number}
      })
      await showToast({title: "支付成功"})
    } catch (error) {
      await showToast({title: "支付失败"})
      console.log(error);
    }
  }
})