/*
  加入购物车
  1.绑定点击事件
  2.获取缓存中的购物车数据
  3.先判断 当前商品是否在购物车内
  4.已经存在 修改商品数据 执行购物车数量++ 重新填入缓存中
  5.不存在，直接在购物车数组添加一个新元素  重新填入缓存中
  6.弹窗提示
商品收藏
*/
import { request } from "../../request/index"
Page({
  data: {
    goodsObj: {},
    isCollect: false
  },
  // 商品对象
  GoodInfo: {},
  onShow: function () {
    let pages =  getCurrentPages();
    let currentPages = pages[pages.length -1];
    let options = currentPages.options;
    const {goods_id} = options;
    this.getGoodsDetail(goods_id);

  },
  async getGoodsDetail(goods_id) {
    const goodsObj = await request({url: "/goods/detail", data: {goods_id}});
    this.GoodInfo = goodsObj;
    // 获取缓存中的收藏
    let collect =  wx.getStorageSync("collect")|| [];
    // 判断此商品是否被收藏
    let isCollect = collect.some(v => v.goods_id === this.GoodInfo.goods_id);
    this.setData({
      goodsObj: {
        goods_name: goodsObj.goods_name,
        goods_price: goodsObj.goods_price,
        goods_introduce: goodsObj.goods_introduce.replace(/\.webp/g, '.jpg'),
        pics: goodsObj.pics
      },
      isCollect
    });

  },
  // 点击轮播图 放大预览
  handlePreviewImage(e) {
    const urls = this.GoodInfo.pics.map(v => v.pics_mid);
    const current = e.currentTarget.dataset.url;
    wx.previewImage({
      current: current, // 当前显示图片的http链接
      urls: urls // 需要预览的图片http链接列表
    })
  },
  handleCartAdd(e) {
    let cart = wx.getStorageSync("cart") || [];
    let index = cart.findIndex(v => v.goods_id === this.GoodInfo.goods_id)
    if (index === -1) {
      // 不存在 第一次添加
      this.GoodInfo.num = 1;
      this.GoodInfo.checked = true;
      cart.push(this.GoodInfo);
    } else {
      cart[index].num++;
    }
    // 重新添加回缓存
    wx.setStorageSync("cart", cart);
    wx.showToast({
      title: '加入成功',
      icon: 'success',
      mask: true
    });
  },
  // 点击 商品收藏图标
  handleCollect() {
    let isCollect = false;
    // 1 获取缓存中的 商品收藏数组
    let collect =  wx.getStorageSync("collect")|| [];
    // 判断
    let index = collect.findIndex(v => v.goods_id === this.GoodInfo.goods_id);
    if (index !== -1) {
       // 已经收藏过 要删除
       collect.splice(index, 1);
       isCollect = false;
       wx.showToast({
         title: '取消成功',
         icon: 'success',
         mask: true
       });
    } else {
      collect.push(this.GoodInfo);
      isCollect = true;
      wx.showToast({
        title: '收藏成功',
        icon: 'success',
        mask: true
      });
    }
    wx.setStorageSync("collect", collect);
    this.setData({
      isCollect
    })
  }
})