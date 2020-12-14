import { showModal, showToast } from "../../utils/asyncWx"
Page({
  data: {
    address: {},
    cart: [],
    allChecked: false,
    totalPrice: 0,
    totalNum: 0
  },
  onShow() {
    const address = wx.getStorageSync("address");
    const cart = wx.getStorageSync("cart") || [];
    this.setData({address});
    this.setCart(cart);
  },
  handleChooseAddress() {
    wx.chooseAddress({
      success: (result) => {
        wx.setStorageSync("address", result);
      }
    });
  },
  // 商品的选中
  handleItemChange(e) {
    const goods_id = e.currentTarget.dataset.id;
    let {cart} = this.data;
    let index = cart.findIndex(v => v.goods_id === goods_id);
    cart[index].checked = !cart[index].checked;
    this.setCart(cart);
  },
  // 商品全选
  handleAllChange() {
    let {cart, allChecked} = this.data;
    allChecked = !allChecked;
    cart.forEach(v => v.checked = allChecked);
    this.setCart(cart);
  },
  async handleItemNumEdit(e) {
    const {operation, id} = e.currentTarget.dataset;
    let {cart} = this.data;
    const index = cart.findIndex(v => v.goods_id === id);
    // 判断是否要执行删除
    if (cart[index].num === 1 && operation === -1) {
      // 弹窗提示
      const res = await showModal({content: "您是否要删除？"});
      if (res.confirm) {
        cart.splice(index, 1);
        this.setCart(cart);
      }
    } else {
      cart[index].num += operation;
      this.setCart(cart);
    }
  },
  // 点击结算
  async handlePay() {
    // 判断收获地址 有无选购商品
    const {address, totalNum} = this.data;
    if (!address.userName) {
      await showToast({title: "您还没有选择收货地址"});
      return;
    }
    if (totalNum === 0) {
      await showToast({title: "您还没有选购商品"});
      return;
    }
    wx.navigateTo({
      url: '/pages/pay/index'
    });
  },
  // 设置购物车状态同时 重新计算底部工具栏数据
  setCart(cart) {
    // 空数组 调用every 返回的就是true
    let allChecked = true;
    let totalPrice = 0;
    let totalNum = 0;
    cart.forEach(v => {
      if (v.checked) {
        totalPrice += v.num * v.goods_price;
        totalNum += v.num
      } else {
        allChecked = false
      }
    });
    // 判断数组是否为空
    allChecked = cart.length ? allChecked : false;
    this.setData({
      cart,
      allChecked,
      totalPrice,
      totalNum
    })
    wx.setStorageSync("cart", cart);
  }
})