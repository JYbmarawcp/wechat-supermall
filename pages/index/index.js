import { request } from "../../request/index"
//Page Object
Page({
  data: {
    bannerList: [], // 轮播图数组
    cateList: [], // 导航
    floorList: [], // 楼层
  },
  // 页面开始加载就会触发
  onLoad: function(options) {
    // 发送请求 优化的手段为promise
    this.getBannerList();
    this.getCateList();
    this.getFloorList();
  },
  getBannerList() {
    request({
      url: '/home/swiperdata',
    }).then(result => {
      this.setData({
        bannerList: result
      })
    })
  },
  getCateList() {
    request({
      url: '/home/catitems',
    }).then(result => {
      this.setData({
        cateList: result
      })
    })
  },
  getFloorList() {
    request({
      url: '/home/floordata',
    }).then(result => {
      this.setData({
        floorList: result
      })
    })
  },
  onReady: function() {
    
  },
  onShow: function() {
    
  },
  onHide: function() {

  },
  onUnload: function() {

  },
  onPullDownRefresh: function() {

  },
  onReachBottom: function() {

  },
  onShareAppMessage: function() {

  },
  onPageScroll: function() {

  },
  //item(index,pagePath,text)
  onTabItemTap:function(item) {

  }
});
  