import axios from '@/apis/http/axios.js'
// http://jenkins.365os.com/view/0-chainup-qa-contract/job/contract-vue-public/10/console
export default {
  state: {
    isReady: false,
    _symbols: {},
    _rate: null,
    _ws: null, // ws路径
    _nowMarket: null, // 默认市场
    _nowSymbol: 'btc/usdt',  // 默认币对
    _nowMarketData: null, // 当前币对的ws数据
    _co_ID: null, // 合约id
    _co_time: '--', // 当前合约交割时间
    _co_leverageLevel: '--', // 合约杠杆倍数
    _co_doBalance: '--', // 可用保证金
    _co_canOrder: '--', // 可开
    _co_haveOrder: [], // 当前持有仓位
    _co_nowOrder: [], // 当前委托
    riskRate: 0, // 风险率
    _co_status: 0 // 当前合约状态
  },
  actions: {
    setCoPublicData ({commit}, data) {
      commit('SET_SYMBOLS', data)
      commit('SET_MYMARKET')
      commit('SET_CO_PUBLICDATA', data)
    },
    // 获取可用保证金 和 可用btc 用于交易页面
    get_init_take_order ({commit, state}) {
      axios({
        url: 'init_take_order',
        hostType: 'co',
        params: { contractId: state._co_ID } // 例如 btcusdt
      }).then((e) => {
        if (e.code === '0') { commit('GETINITTAKEORDER', e) }
      })
    }
  },
  mutations: {
    // 获取可用保证金 和 可用btc 用于交易页面
    GETINITTAKEORDER (state, e) {
      if (e.data.doBalance < 0) { e.data.doBalance = 0 }
      if (e.data.canOrder < 0) { e.data.canOrder = 0 }
      state._co_doBalance = e.data.doBalance // 可用保证金
      state._co_canOrder = e.data.canOrder // 可开
    },
    // 更新自选
    'SET_MYMARKET' (state) {
      if (!localStorage.coMyMarket) localStorage.coMyMarket = JSON.stringify([])
      let data = JSON.parse(localStorage.coMyMarket)
      let obj = {}
      data.forEach((e) => {
        let market = e.split('/')[1]
        obj[e] = state._symbols[market][e]
      })
      state._symbols.myMarket = obj
    },
    // 将marke中的数据格式化
    'SET_SYMBOLS' (state, data) {
      for (let i in data.maket) {
        if (i !== 'myMarket') {
          let obj = {}
          data.maket[i].forEach((e) => {
            obj[e.name.toLowerCase()] = {
              symbol: e.name,
              price: e.priceFix,
              volume: e.volumeFix,
              depth: e.baseDepth
            }
          })
          data.maket[i] = obj
        }
      }
      state._symbols = data.maket
    },
    // public
    'SET_CO_PUBLICDATA' (state, data) {
      state.isReady = true
      state._ws = data.wsUrl
      state._rate = data.rate
      // 1 localStorage中存在  2 有此市场 3 有此币对 (此时默认市场为上次选择币对的市场)
      if (localStorage.coNowSymbol && state._symbols[localStorage.coNowSymbol.split('/')[1]] && state._symbols[localStorage.coNowSymbol.split('/')[1]][localStorage.coNowSymbol]) {
        state._nowMarket = localStorage.coNowSymbol.split('/')[1]
        state._nowSymbol = localStorage.coNowSymbol
      } else {
      // 此时默认市场为后端传入 币对为当前市场第一个值
        state._nowMarket = data.maket_index
        let obj = state._symbols[data.maket_index]
        state._nowSymbol = obj[Object.keys(obj)[0]].symbol.toLowerCase()
      }
    },
    // 更新当前市场
    'SET_NOWMARKET' (state, data) {
      state._nowMarket = data
      localStorage.coNowMarket = data
    },
    // 更新当前市场
    'SET_NOWSYMBOL' (state, data) {
      state._nowSymbol = data
      localStorage.coNowSymbol = data
    }
  }
}
