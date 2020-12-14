/**
 * promise 形式 showModal
 * @param {boject} param0 
 */
export const showModal = ({content}) => {
  return new Promise((resolve, reject) => {
    wx.showModal({
      title: '提示',
      content: content,
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err);
      }
    });
  })
}

/**
 * promise 形式 showToast
 * @param {boject} param0 
 */
export const showToast = ({title}) => {
  return new Promise((resolve, reject) => {
    wx.showToast({
      title: title,
      icon: 'none',
      success: (result) => {
        resolve(result);
      },
      fail: (err) => {
        reject(err)
      }
    });
  })
}