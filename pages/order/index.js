/*
  onShow
  (onShow无法在形参上接收options参数)
  获取url上的参数type
  决定tabs哪个被激活 发请求
*/
import { request } from "../../request/index"
Page({
  data: {
    tabs: [
      {
        id: 0,
        value: "全部",
        isActive: true
      },
      {
        id: 1,
        value: "待付款",
        isActive: false
      },
      {
        id: 2,
        value: "代发货",
        isActive: false
      },
      {
        id: 3,
        value: "退货/退款",
        isActive: false
      },
    ],
    orders: []
  },
  onShow() {
    const token = wx.getStorageSync("token");
    if (!token) {
      wx.navigateTo({
        url: '/pages/auth/index'
      });
      return;
    }
    // 获取当前小程序的页面栈 长度最大是10页面
    let pages = getCurrentPages();
    let currentPages = pages[pages.length-1];
    const {type} = currentPages.options;
    // 激活选中的页面
    this.changeTitleByIndex(type-1);
    this.getOrders(type);
  },
  // 获取订单列表
  async getOrders(type) {
    const res = await request({
      url: "/my/orders/all",
      data: {type}
    });
    this.setData({
      orders: res.orders.map(v => ({
        ...v,
        create_time_cn: new Date(v.create_time * 1000).toLocaleString()
      }))
    })
  },
  changeTitleByIndex(index) {
    let {tabs} = this.data;
    tabs.forEach((v,i) => i===index? v.isActive = true: v.isActive = false);
    this.setData({
      tabs
    })
  },
  handleTabsItemChange(e) {
    const { index } = e.detail;
    this.changeTitleByIndex(index);
    // 重新发请求 type = 1; index = 0
    this.getOrders(index+1);
  },
})