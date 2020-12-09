import { request } from "../../request/index"
Page({
  data: {
    leftMenuList: [], // 左侧菜单数据
    rightContent: [], // 右侧商品数据

  },
  Cates: [], // 临时
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.getCategory();
  },
  // 获取分类数据
  getCategory() {
    request({
      url: "https://api-hmugo-web.itheima.net/api/public/v1/categories"
    }).then(res => {
      this.Cates = res.data.message;
      // 筛数据
      const leftMenuList = this.Cates.map(v => v.cat_name);
      const rightContent = this.Cates[0].children
      this.setData({
        leftMenuList,
        rightContent
      })
    })
  }
})