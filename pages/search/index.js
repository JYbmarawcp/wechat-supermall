import { request } from "../../request/index"
import {debounce} from "../../utils/common"
Page({
  data: {
    goods: [],
    isFocus: false,
    inputValue: ""
  },
  onShow() {
  },
  handleInput: debounce(function(e) {
    const {value} = e.detail;
    // 检验合法性
    if (!value.trim()) {
      this.setData({
        goods: [],
        isFocus: false
      })
      return;
    }
    this.setData({isFocus: true, inputValue: value});
    this.qsearch(value);
  }, 500),
  async qsearch(query) {
    const goods = await request({
      url: "/goods/qsearch",
      data: {query}
    })
    this.setData({goods});
  },
  handleCancel() {
    this.setData({
      inputValue: "",
      isFocus: false,
      goods: []
    });
  }
})