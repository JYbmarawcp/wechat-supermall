// 同时发送异步代码的次数
let ajaxTimes = 0;
export const request = (params) => {
    // 判断url是否含有my 来带上token
    let header = {...params.header};
    if (params.url.includes("/my/")) {
        header["Authorization"] = wx.getStorageSync("token");
    }

    ajaxTimes++;
    // 显示加载中
    wx.showLoading({
        title: "加载中",
        mask: true
    });
      
    // 公共url
    const baseUrl = "https://api-hmugo-web.itheima.net/api/public/v1";
    return new Promise((resolve, reject) => {
        wx.request({
            ...params,
            header: header,
            url: baseUrl + params.url,
            success: (result) => {
                resolve(result.data.message)
            },
            fail: (err) => {
                reject(err)
            },
            complete: () => {
                ajaxTimes--;
                if (ajaxTimes === 0) {
                    wx.hideLoading();
                }
            }
        });
    })
}