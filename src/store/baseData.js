// 默认获取全站需要的数据

import axios from '@/apis/http/axios.js'
import router from '@/router/index.js'
import { changeLanguage } from '@/locale/index'
const MYMARKET = 'MYMARKET' // 自选的货币
// const ISLOGIN = 'ISLOGIN' // 是否登录
const LAN = 'LAN' // 语言

export default {
  state: {
    default_code: null,
    isReady: false,
    _lan: null,
    _lanList: null,
    _user: null,
    _ws: null,
    _symbols: {},
    _topSymbol: null,
    _rate: null,
    _coinList: null,
    _maket_index: null,
    _theme: null,
    isLogin: false,
    nc_appkey: null,
    nc_prefix: null,
    otcOpen: null,
    exOpen: null,
    agentOpen: null,
    contractOpen: null,
    klineColor: null,
    _footer: null,
    logo: null,
    indexHeaderTitle: null,
    marketSort: null, // 市场排序
    _webSiteInfo: window.HOST_API,
    _siteType: window.siteType,
    invitationCode: null,
    invite_open: null,
    return_open: null,
    defaultTheme: 'theme_default',
    verificationType: '1'
  },
  actions: {
    // public_info
    getCommonPublic_info ({ commit }) {
      axios({
        url: this.state.url.common.punlic_info,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          commit('GETCOMMONPUBLICINFO', data.data)
        }
      })
    },
    // user_info
    getCommonUser_info ({ commit }) {
      axios({
        url: this.state.url.common.user_info,
        method: 'post'
      }).then((data) => {
        if (data.code.toString() === '0') {
          commit('GETCOMMONUSERINFO', data.data)
        } else {
          commit('GETCOMMONUSERINFONOTLOGIN', data)
        }
      })
    },
    getRate_info ({commit}, isfals) {
      clearInterval(this.thisInterval)
      if (!isfals) return false
      this.thisInterval = setInterval(() => {
        axios({
          url: this.state.url.common.rate,
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            commit('RATE', data.data)
          }
        })
      }, 30000)
    }
  },
  mutations: {
    // public_info
    GETCOMMONPUBLICINFO (state, data) {
      // 设置 默认市场
      !localStorage.getItem('markTitle') && localStorage.setItem('markTitle', data.maket_index)
      if (localStorage.getItem('markTitle') && !data.market[localStorage.getItem('markTitle')]) {
        localStorage.setItem('markTitle', data.maket_index)
      }
      !localStorage.getItem('homeMarkTitle') && localStorage.setItem('homeMarkTitle', data.maket_index)
      // 设置 默认市场的第一个货币对 为默认 货币对
      if (!localStorage.getItem('sSymbolName') || !data.market[localStorage.getItem('markTitle')][localStorage.getItem('sSymbolName')]) {
        localStorage.setItem('sSymbolName', Object.keys(data.market[data.maket_index])[0])
        localStorage.setItem('markTitle', data.maket_index)
      }
      //  设置 默认语言
      if (!localStorage.getItem('lan')) {
        changeLanguage(data.lan.defLan)
        localStorage.setItem('lan', data.lan.defLan)
      }
      state._maket_index = data.maket_index
      state.default_code = data.default_country_code
      state.isReady = true // 是否有public数据
      state._rate = data.rate // 货币汇率
      state._ws = data.wsUrl // ws路径
      state._topSymbol = data.headerSymbol // 首页推荐货币
      state._lan = localStorage.getItem('lan') // 语言
      state._lanList = data.lan.lanList // 语言列表
      state._coinList = data.coinList // 币种列表
      state.nc_appkey = data.nc_appkey // 阿里云滑动验证码参数
      state.nc_prefix = data.nc_prefix
      state.otcOpen = data.otcOpen // 场外开关
      state.exOpen = data.exOpen || '1' // 现货开关
      state.contractOpen = data.contractOpen // 合约开关
      state.klineColor = data.klineColor // K线图色值
      state.logo = data.logoUrl
      state.indexHeaderTitle = data.indexHeaderTitle // 页面Title
      state.marketSort = data.marketSort // 市场排序
      state.agentOpen = data.agentUserOpen // 经济人开关
      state.invitationCode = data.is_invitationCode_required // 邀请码开关
      state.invite_open = data.is_invite_open
      state.return_open = data.is_return_open
      state.verificationType = data.verificationType || '1' // 滑动验证码类型
      state._footer = {
        name: data.company_name,
        email: data.contact_email,
        number: data.contact_number
      }
      for (let item in data.market) {
        state._symbols[item] = data.market[item]
      }
      var link = document.querySelector("link[rel*='icon']") || document.createElement('link')
      link.type = 'image/x-icon'
      link.rel = 'shortcut icon'
      link.href = data.iconUrl
      document.getElementsByTagName('head')[0].appendChild(link)
    },
    // user_info
    GETCOMMONUSERINFO (state, data) {
      state.isLogin = true
      state._user = data // user默认数据
      // 设置自选数据
      localStorage.setItem('myMarket', data.myMarket)
      state._symbols['myMarket'] = {}
      if (data.myMarket.length > 0) {
        for (var i = 0; i < data.myMarket.length; i++) {
          let tempSymbol = data.myMarket[i].split('/')
          state._symbols['myMarket'][data.myMarket[i]] = {
            'name': data.myMarket[i],
            'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
          }
        }
      }
    },
    // 未登录状态 从 localStorage 中获取自选货币
    GETCOMMONUSERINFONOTLOGIN (state, data) {
      let myMarket = localStorage.getItem('myMarket')
      if (!myMarket) return false
      myMarket = myMarket.split(',')
      state._symbols['myMarket'] = {}
      if (myMarket && myMarket.length > 0) {
        for (var i = 0; i < myMarket.length; i++) {
          let tempSymbol = myMarket[i].split('/')
          state._symbols['myMarket'][myMarket[i]] = {
            'name': myMarket[i],
            'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
          }
        }
      }
    },
    [MYMARKET] (state, data) {
      state._symbols.myMarket = data
    },
    ISLOGIN (state, data) {
      state.isLogin = data
      if (!data) {
        localStorage.removeItem('token')
        // document.cookie = 'token=;  expires=Thu, 01 Jan 1970 00:00:01 GMT;'
        let domain = '.' + location.host.split('.')[1] + '.' + location.host.split('.')[2]
        if (location.host.split('.')[2]) {
          document.cookie = 'token="";expires=Thu, 01 Jan 1970 00:00:01 GMT;domain=' + domain + ';path=/'
        } else {
          document.cookie = 'token="";expires=Thu, 01 Jan 1970 00:00:01 GMT;path=/'
          // document.cookie = name + '=' + escape(value) + ';expires=' + exp.toGMTString() + ';path=/'
        }
        let pathName = location.pathname.split('/')[1]
        // 未登录可以访问的页面
        let arr = ['index', 'cms', 'register', 'trade', 'help_center', 'forgetPassword', 'login', 'notice_info', 'otcIndex', 'otc_home', 'otc_ads_Hall', 'otc_personal', 'contract', 'mining']
        if (arr.indexOf(pathName) === -1 && pathName !== '') {
          router.push('/')
        }
      }
    },
    THEME (state, data) {
      state._theme = data
    },
    [LAN] (state, data) {
      state._lan = data
    },
    RATE: (state, data) => {
      state._rate = data.rate // 货币汇率
    }
  }
}
