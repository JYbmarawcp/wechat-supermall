import { request } from "../../request/index"
Page({
  data: {
    leftMenuList: [], // 左侧菜单数据
    rightContent: [], // 右侧商品数据
    currentIndex: 0, // 左侧菜单被点击的index
    scrollTop: 0 // 右侧滚动条
  },
  Cates: [], // 临时
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    /*
    1.获取本地存储
     */
    const Cates = wx.getStorageSync("cates");
    if (!Cates) {
      this.getCategory();
    } else {
      // 判断旧数据是否过期
      if (Date.now()-Cates.time > 1000*10) {
        this.getCategory();
      } else {
        this.Cates = Cates.data;
        const leftMenuList = this.Cates.map(v => v.cat_name);
        const rightContent = this.Cates[0].children;
        this.setData({
          leftMenuList,
          rightContent
        })
      }
    }
    
  },
  // 获取分类数据
  async getCategory() {
    const res = await request({url: "/categories"});
    this.Cates = res;
    // 本地存储格式{time: Date.now(), data:[...]}
    // 小程序  不存在类型转化的操作,存入对象获取的也是对象
    wx.setStorageSync("cates", {time: Date.now(), data: this.Cates});
    // 筛数据
    const leftMenuList = this.Cates.map(v => v.cat_name);
    const rightContent = this.Cates[0].children;
    this.setData({
      leftMenuList,
      rightContent
    })
  },
  handleItemTap(e) {
    // 获取被点击的标题身上的index
    const {index} = e.currentTarget.dataset;
    const rightContent = this.Cates[index].children;
    this.setData({
      currentIndex: index,
      rightContent,
      scrollTop: 0
    })
  }
})