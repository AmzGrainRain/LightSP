window.onload = () => {
  if (!localStorage.getItem('LightSP')) {
    localStorage.setItem('LightSP', JSON.stringify({
      wallpaper: {
        bing: false,
        local: true
      },
      weather: {
        location_id: 101010100
      }
    }))
  }
}

// 获取 localSotrage 内存储的 JSON 配置
const ori = JSON.parse(localStorage.getItem('LightSP'))

// 初始化必应壁纸状态
if (ori.wallpaper.bing === true) document.querySelector('input[name=bingWallpaper]').checked = true
else document.querySelector('input[name=bingWallpaper]').checked = false

// 必应壁纸API按钮点击事件
document.querySelector('input[name=bingWallpaper]').onclick = () => {
  if (document.querySelector('input[name=bingWallpaper]').checked) {
    ori.wallpaper.bing = true
    ori.wallpaper.local = false
  } else {
    ori.wallpaper.bing = false
    ori.wallpaper.local = true
  }
  localStorage.setItem('LightSP', JSON.stringify(ori))
}
