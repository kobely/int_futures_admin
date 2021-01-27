/**
 * 设置页面标题
 * @param title {String} 页面标题
 */
export const setDocumentTitle = function(title) {
  document.title = title
  const ua = navigator.userAgent
  // eslint-disable-next-line
  const regex = /\bMicroMessenger\/([\d\.]+)/
  if (regex.test(ua) && /ip(hone|od|ad)/i.test(ua)) {
    const i = document.createElement('iframe')
    i.src = '/favicon.ico'
    i.style.display = 'none'
    i.onload = function() {
      setTimeout(function() {
        i.remove()
      }, 9)
    }
    document.body.appendChild(i)
  }
}

/**
 * 根据当前时间获取不同的问候
 */
export function timeFix() {
  const time = new Date()
  const hour = time.getHours()
  return hour < 9 ? '早上好' : hour <= 11 ? '上午好' : hour <= 13 ? '中午好' : hour < 20 ? '下午好' : '晚上好'
}

/**
 * 获取上传图片地址最后的图片名称
 * @param str {String} 图片地址的字符串
 */
export function getImageName(str) {
  if (str) {
    return str.match(/[^/]+(?!.*\/)/g)[0]
  }
}

/**
 * 获取oss图片地址图片名称
 * @param str {String} 图片地址的字符串
 */
export function getOssImageName(str) {
  if (str) {
    const _str = getImageName(str)
    return _str.replace(/\?.*$/, '')
  }
}

/**
 * 只能输入数字，最多两位小数
 * @param number {Number}
 */
export function pointNum(number, n) {
  n = n ? n : 2;
  number = number
    .replace(/[^\d\.]/g, '')
    .replace(eval('/(\\d+)(\\.)(\\d{1,'+ n +'})(.*)$/'), '$1$2$3')
    .replace(/^\./, '')
    .replace(/\.{2,}/g, '.')
    .replace(/^([0])(\d)$/, '$2')
  return number
}

/**
 * 请求loading
 */
export const loading = {
  show: () => {
    let loadingEl = document.getElementsByClassName('loading-mask')[0]
    // loading.hide()

    if (loadingEl) {
      loadingEl.style.display = 'block'
    } else {
      let loadingHtml = document.createElement('div')
      loadingHtml.className = 'loading-mask'
      loadingHtml.innerHTML = '<div class="loading-wrapper"><span class="loading-dot loading-dot-spin"><i></i><i></i><i></i><i></i></span></div>'
      document.getElementsByClassName('ant-layout-content')[0].appendChild(loadingHtml)
    }
  },
  hide: () => {
    let loadingEl = document.getElementsByClassName('loading-mask')[0]
    setTimeout(() => {
      if (loadingEl) {
        loadingEl.style.display = 'none'
      }
    }, 200)
  }
}

/**
 * 请求结果toast
 */
export const toast = {
  parentEl: document.createElement('div'),
  className: 'toast-wrapper',
  timer: null,
  appendEl: (type, msg) => {
    clearTimeout(toast.timer)

    let toastHtml = toast.parentEl
    toastHtml.className = toast.className
    if (type == 'success') {
      toastHtml.innerHTML =
        '<i class="anticon anticon-check-circle"><svg viewBox="64 64 896 896" width="1em" height="1em" fill="currentColor" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292a31.8 31.8 0 0 1-51.7 0L318.5 484.9c-3.8-5.3 0-12.7 6.5-12.7h46.9c10.2 0 19.9 4.9 25.9 13.3l71.2 98.8 157.2-218c6-8.3 15.6-13.3 25.9-13.3H699c6.5 0 10.3 7.4 6.5 12.7z"></path></svg></i>' +
        '<div class="toast-tip">' +
        msg +
        '</div>'
    } else {
      toastHtml.innerHTML =
        '<i class="anticon anticon-close-circle"><svg viewBox="64 64 896 896"  width="1em" height="1em" fill="currentColor" focusable="false"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm165.4 618.2l-66-.3L512 563.4l-99.3 118.4-66.1.3c-4.4 0-8-3.5-8-8 0-1.9.7-3.7 1.9-5.2l130.1-155L340.5 359a8.32 8.32 0 0 1-1.9-5.2c0-4.4 3.6-8 8-8l66.1.3L512 464.6l99.3-118.4 66-.3c4.4 0 8 3.5 8 8 0 1.9-.7 3.7-1.9 5.2L553.5 514l130 155c1.2 1.5 1.9 3.3 1.9 5.2 0 4.4-3.6 8-8 8z"></path></svg></i>' +
        '<div class="toast-tip">' +
        msg +
        '</div>'
    }
    document.body.appendChild(toastHtml)
  },
  removeEl: () => {
    toast.timer = setTimeout(() => {
      let el = document.getElementsByClassName('toast-wrapper')[0]
      document.body.removeChild(el)
    }, 1500)
  },
  success: msg => {
    if (!msg) return

    toast.appendEl('success', msg)

    toast.removeEl()
  },
  fail: msg => {
    if (!msg) return

    toast.appendEl('fail', msg)

    toast.removeEl()
  }
}

// 加法函数，用来得到精确的加法结果
// 说明：javascript的加法结果会有误差，在两个浮点数相加的时候会比较明显。这个函数返回较为精确的加法结果。
// 调用：accAdd(arg1,arg2)
// 返回值：arg1加上arg2的精确结果
export function accAdd(arg1, arg2) {
  var r1, r2, m
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  return (arg1 * m + arg2 * m) / m
}
//给Number类型增加一个add方法，调用起来更加方便。
Number.prototype.add = function(arg) {
  return accAdd(arg, this)
}

// 减法函数，用来得到精确的减法结果
// 说明：javascript的减法结果会有误差，在两个浮点数相减的时候会比较明显。这个函数返回较为精确的减法结果。
// accSub(arg1,arg2)
// 返回值：arg1减arg2的精确结果
export function accSub(arg1, arg2) {
  var r1, r2, m, n
  try {
    r1 = arg1.toString().split('.')[1].length
  } catch (e) {
    r1 = 0
  }
  try {
    r2 = arg2.toString().split('.')[1].length
  } catch (e) {
    r2 = 0
  }
  m = Math.pow(10, Math.max(r1, r2))
  //last modify by deeka
  //动态控制精度长度
  n = r1 >= r2 ? r1 : r2
  return ((arg1 * m - arg2 * m) / m).toFixed(n)
}

// 上传文件转base64
export function getBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.readAsDataURL(file)
    reader.onload = () => resolve(reader.result)
    reader.onerror = error => reject(error)
  })
}

// pdf文件流转blob类型下载
export function pdfDown(fileStream, pdfName){
  const blob = new Blob([fileStream], {
    // 如何后端没返回下载文件类型，则需要手动设置：type: 'application/pdf;chartset=UTF-8' 表示下载文档为pdf，如果是word则设置为msword，excel为excel
    type: 'application/pdf;chartset=UTF-8'
  })
  const a = document.createElement('a')
  // 兼容webkix浏览器，处理webkit浏览器中href自动添加blob前缀，默认在浏览器打开而不是下载
  const URL = window.URL || window.webkitURL
  // 根据解析后的blob对象创建URL 对象
  const herf = URL.createObjectURL(blob)
  // 下载链接
  a.href = herf
  // 下载文件名,如果后端没有返回，可以自己写a.download = '文件.pdf'
  a.download = pdfName;
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // 在内存中移除URL 对象
  window.URL.revokeObjectURL(herf)
}
