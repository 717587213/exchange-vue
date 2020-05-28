<template>
      <div v-if="co_baseData">
         <!-- 推荐区 -->
         <div class="recommend clearfix">
          <div v-if="JSON.stringify(symbolTop) == '{}'">
            <div v-for="item in 5" :key="item" class="recomm-content borderbox"></div>
          </div>
           <div class="recomm-content borderbox" v-for="(item, index) in symbolTop" :key="index" v-else>
             <div class="content">
                <div class="symbol_buy clearfix">
                  <span>{{item.name}}</span> 
                  <b :class="item.rose.class">{{item.rose.data}}</b>
                </div>
                <p class="price" :class="item.close.class">{{item.close.data}}</p>
                <span class="turnover">{{$t('main.deal_forehead')}}：{{item.amount}}&nbsp;{{item.symbolname}} </span>
             </div>
           </div>
         </div>
         <!--币对市场-->
         <div class="market front-color">
            <div class="header" v-if="JSON.stringify(symbolTop) !== '{}'">
               <ul>
                 <li :class="{findactive:'myMarket' === markTitle}" @click="tabTog('myMarket')">
                  <span>
                    <i class="icon-store" v-if="'myMarket' === markTitle"></i> 
                    <i class="icon-cor icon-store" v-else ></i>
                    {{$t('main.marketSet')}}
                  </span>
                  </li>
                <li v-for="(value,key,index) in _symbols" 
                     v-if ="(key !== 'myMarket')" 
                     :key="index" @click="tabTog(key)"
                     :class='{findactive:key === markTitle}' 
                     class="coin_currency">
                  <span>
                    <template v-if="baseData._coinList[key]">
                      <img :src="baseData._coinList[key].icon" v-if="baseData._coinList[key].icon">
                    </template>
                    <img src="@/assets/img/coindef.png" v-else>
                    {{key}}
                  </span>
                </li>
              </ul>
              <div class="inputBox">
                <div class="search" :class="{active:frame}"><i class="sos icon-search"></i> <input type="text" v-model="search" @focus="issue" @blur="lose"> </div>
              </div>
            </div>
            <div class="mark-box">
            <!-- <p style="display: none">{{aaa}}</p> -->
            <table>
              <thead>
                <tr class="noHover">
                  <th class="market_title">{{this.$t('main.market')}}</th>
                  <th @click="marketSort('close')" class="new_price newprice_align">{{this.$t('main.close')}}
                    <span class="receet"> <i class="sorte up  iconNoFont-sup" :class="{cur: sortType === 'down'}"></i>   <i class="sorte down iconNoFont-sdow"  :class="{cur: sortType === 'up'}"></i></span></th>
                  <th>{{this.$t('main.height')}}</th>
                  <th>{{this.$t('main.low')}}</th>
                  <th @click="marketSor('rose')" class="rise">{{this.$t('main.rose')}} <span class="receet"> <i class="sorte up iconNoFont-sup" :class="{curr: sortType === 'dow'}"></i>   <i class="sorte down iconNoFont-sdow" :class="{curr: sortType === 'ups'}"></i></span></th>
                  <th>24H{{this.$t('main.vol')}}</th>
                  <th>24{{this.$t('main.amount')}}</th>
                </tr>
              </thead>
            <tbody v-if="symbolListArr.length > 0">
              <tr v-for="(item, index) in symbolListArr" v-if="item.isShow" :key="index" :class="{symboy_bgc: index % 2 === 0 }">
                  <td class="mark"> 
                    <i :class="{findactive:item.symbol && co_baseData._symbols.myMarket[item.symbol.toLowerCase()]}" class="icon-store" v-if="item.symbol && co_baseData._symbols.myMarket[item.symbol.toLowerCase()] "  @click="changeMysymbol(item.symbol)" ></i> 
                    <i class="icon-cor icon-store"  @click="changeMysymbol(item.symbol)"  v-else></i>
                    <span @click="transaction(item.symbol)">{{item.symbol}}</span></td>
                  <td :class="item.close.class" class="newprice_align">{{item.close.data}}</td>
                  <td>{{item.high}}&nbsp;{{item.coin}} </td>
                  <td>{{item.low}}&nbsp;{{item.coin}}</td>
                  <td :class="item.rose.class">{{item.rose.data}} </td>
                  <td>{{item.vol}}&nbsp;{{item.symbolname}}</td>
                  <td>{{item.amount}}&nbsp;{{item.coin}}</td>
              </tr>
            </tbody>
            <tbody v-else>
              <tr class="noHover"><td colspan="8" class="no_data">{{$t('main.no_data')}}</td></tr>
            </tbody>
          </table>
        </div>
      </div>
    <p v-if="!public_info"></p>
    </div>
</template>
<script>
import { mapState } from 'vuex'
import pako from 'pako'

export default {
  name: 'm-main',
  components: {},
  computed: {
    ...mapState({
      co_baseData ({coBaseData}) {
        if (coBaseData._symbols && coBaseData.isReady) {
          if (coBaseData._nowMarket !== 'myMarket') {
            this.markTitle = coBaseData._nowMarket.toUpperCase()
          } else {
            this.markTitle = 'myMarket'
          }
          this._symbols = {}
          for (let i in coBaseData._symbols) {
            if (i !== 'myMarket') {
              this._symbols[i.toUpperCase()] = {}
              for (let v in coBaseData._symbols[i]) {
                this._symbols[i.toUpperCase()][v.toUpperCase()] = {
                  depth: coBaseData._symbols[i][v].depth,
                  name: v.toUpperCase(),
                  price: coBaseData._symbols[i][v].price,
                  volume: coBaseData._symbols[i][v].volume,
                  symbol: v.split('/')[0].toLowerCase() + v.split('/')[1].toLowerCase()
                }
              }
            } else {
              this._symbols['myMarket'] = {}
              for (let i in coBaseData._symbols['myMarket']) {
                let arr = coBaseData._symbols['myMarket'][i].symbol.split('/')
                this._symbols['myMarket'][coBaseData._symbols['myMarket'][i].symbol] = {
                  depth: coBaseData._symbols['myMarket'][i].depth,
                  price: coBaseData._symbols['myMarket'][i].price,
                  volume: coBaseData._symbols['myMarket'][i].volume,
                  name: coBaseData._symbols['myMarket'][i].symbol,
                  symbol: arr[0].toLowerCase() + arr[1].toLowerCase()
                }
              }
            }
          }
          if (this.firstFlag) {
            this.firstFlag = false
            this.creatWs()
          }
        }
        return coBaseData
      },
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.baseData = baseData
          this.lang = baseData._lan
          return true
        } else {
          return true
        }
      }
    })
  },
  data () {
    return {
      firstFlag: true,
      marketListWS: null,
      topMarket: null,
      symbolTop: {},
      markTitle: '',
      symbolListData: {},
      symbolListArr: [],
      lastSymbol: [],
      search: null,
      lang: localStorage.getItem('lan'),
      rate: '',
      _symbols: {},
      baseData: {},
      frame: false,
      sortName: null,
      sortType: null
    }
  },
  mounted () {
    if (!this.$store.state.coBaseData.isReady) {
      this.axios({
        url: this.$store.state.coUrl.public_info,
        hostType: 'co'
      }).then((e) => { if (e.code === '0') { this.$store.dispatch('setCoPublicData', e.data) } })
    }
  },
  destroyed () {
    if (this.marketListWS) {
      this.marketListWS.onclose()
    }
    if (this.topMarket) {
      this.topMarket.onclose()
    }
  },
  watch: {
    // 监听货币对搜索
    search (val) {
      for (let i = 0; i < this.symbolListArr.length; i++) {
        this.symbolListArr[i].symbol.split('/')[0].indexOf(val.toUpperCase()) === -1
          ? (this.symbolListArr[i].isShow = false)
          : (this.symbolListArr[i].isShow = true)
      }
    },
    'symbolListData' (value) {
      let arr = []
      for (let item in value) {
        arr.push(value[item])
      }
      this.symbolListArr = arr
    }
  },
  methods: {
     // 市场切换
    tabTog (key) {
      if (key === 'myMarket') {
        if (this.baseData.isLogin) {
          this.getoptional()
        }
      }
      if (this.markTitle === key) {
        return
      }
      for (let i = 0; i < this.lastSymbol.length; i++) {
        this.sedWs(this.lastSymbol[i], 'unsub')
      }
      // key !== 'myMarket' && localStorage.setItem('homeMarkTitle', key)
      this.markTitle = key
      if (key !== 'myMarket') {
        key = key.toLowerCase()
      }
      this.$store.commit('SET_NOWMARKET', key)
      this.markList()
    },
    creatWs () {
      // 创建ws
      this.marketListWS = new WebSocket(this.co_baseData._ws)
      this.marketListWS.binaryType = 'arraybuffer'
      this.topMarket = new WebSocket(this.co_baseData._ws)
      this.topMarket.binaryType = 'arraybuffer'
      // 建立连接
      this.marketListWS.onopen = evt => {
        this.markList()
      }
      // 获取数据
      this.marketListWS.onmessage = evt => {
        var na = new Uint8Array(evt.data)
        if (na.length > 0) {
          let data = JSON.parse(pako.inflate(na, { to: 'string' }))
          if (data['ping']) {
            this.marketListWS.send(JSON.stringify({ pong: data['ping'] }))
          } else if (data.tick) {
            let symbol = data.channel.split('_')[1]
            let symboList = this._symbols[this.markTitle]
            for (let v in symboList) {
              if (symboList[v].symbol === symbol) {
                this.addWsListData(symboList[v].name, data.tick)
              }
            }
          }
        }
      }
      this.marketListWS.onclose = evt => {
        console.log('关闭', evt)
      }
      this.marketListWS.onerror = evt => {
        console.log('错误', evt)
      }
      // 建立连接
      this.topMarket.onopen = ev => {
        this.symbolTopList()
      }
      // 获取数据
      this.topMarket.onmessage = evt => {
        var na = new Uint8Array(evt.data)
        if (na.length > 0) {
          let data = JSON.parse(pako.inflate(na, { to: 'string' }))
          if (data['ping']) {
            this.topMarket.send(JSON.stringify({ pong: data['ping'] }))
          } else if (data.tick) {
            let d = data.tick
            let key = data.channel.split('_')[1]
            let topMN = this.symbolTop[key].name.split('/')[1]  // 当前市场
            let j = this._symbols[topMN][this.symbolTop[key].name].price // 当前市场信息
            let oldClose = this.symbolTop[key].close.data // 上次价格
            let close = this._P.fixD(d.close, j)
            let rate = this._P.fixRate(d.close, this.baseData._rate, topMN)
            let Od = parseFloat(oldClose)
            let cs = parseFloat(close)
            let rs = ''
            if (Od + '' !== 'NaN') {
              cs > Od && (rs = 'c-fall')
              cs < Od && (rs = 'c-rise')
              cs === Od && (rs = '')
            }
            this.symbolTop[key].close = {
              class: rs,
              data: close + '/' + rate
            }
            let rose = Math.round(d.rose * 10000) / 100 + '%'
            let rc = ''
            if (rose.indexOf('NaN') < 0) {
              d.rose < 0 && (rc = 'c-fall')
              d.rose === 0 && (rc = '')
              if (d.rose > 0) {
                rose = '+' + rose
              }
              d.rose > 0 && (rc = 'c-rise')
            } else {
              rc = ''
              rose = '0.00%'
            }
            this.symbolTop[key].rose = {
              class: rc,
              data: rose
            }
            this.symbolTop[key].amount = this._P.fixD(d.amount, j)
            this.$forceUpdate()
          }
        }
      }
      this.topMarket.onclose = evt => {
        console.log('关闭', evt)
      }
      this.topMarket.onerror = evt => {
        console.log('错误', evt)
      }
    },
    symbolTopList () {
      for (let i = 0; i < this.$store.state.baseData._topSymbol.length; i++) {
        let s = this.$store.state.baseData._topSymbol[i]
        let sMarket = s.split('/')[1]
        let sWs = s.toLowerCase().split('/')
        let key = sWs[0] + sWs[1]
        this.symbolTop[key] = {
          close: {
            class: '',
            data: '--'
          },
          rose: {
            class: '',
            data: '--'
          },
          amount: '--',
          name: s
        }
        this.$forceUpdate()
        if (this._symbols[sMarket] && this._symbols[sMarket][s]) {
          this.sendsymbolTop(key)
        }
      }
    },
    sendsymbolTop (symbol) {
      this.topMarket && this.topMarket.send(JSON.stringify({
        event: 'sub',
        params: {
          channel: 'market_' + symbol + '_ticker',
          cb_id: symbol
        }
      }))
    },
    markList () {
      !this.markTitle && (this.markTitle = this.baseData._maket_index)
      let sList = this._symbols[this.markTitle]
      this.symbolListData = {}
      this.lastSymbol = []
      for (let item in sList) {
        let unit = sList[item].name.split('/')[1]
        if (this._symbols[unit][item]) {
          this.symbolListData[sList[item].name] = {
            isShow: true,
            close: {
              class: '',
              data: '--'
            },
            rose: {
              class: '',
              data: '--'
            },
            high: '--',
            low: '--',
            vol: '--',
            amount: '--'
          }
          this.lastSymbol.push(sList[item].symbol)
          this.sedWs(sList[item].symbol, 'sub')
        }
      }
    },
    sedWs (symbol, type) {
      this.marketListWS.send(JSON.stringify({
        event: type,
        params: {
          channel: 'market_' + symbol + '_ticker',
          cb_id: symbol
        }
      }))
    },
    addWsListData (name, data) {
      let t = this.symbolListData[name]
      let thisMarket = this._symbols[name.split('/')[1]]
      // 最新价
      let oldClose = t.close.data
      let close = this._P.fixD(data.close, thisMarket[name].price)
      let rate = this._P.fixRate(data.close, this.baseData._rate, name.split('/')[1])
      let Od = parseFloat(oldClose)
      let cs = parseFloat(close)
      let rs = ''
      if (Od + '' !== 'NaN') {
        cs > Od && (rs = 'c-fall')
        cs < Od && (rs = 'c-rise')
        cs === Od && (rs = '')
      }
      t.close = {
        class: rs,
        data: close + '/' + rate
      }
      let symbolname = name.split('/')[0]
      let coin = name.split('/')[1]
      t.symbolname = symbolname
      t.coin = coin
      t.symbol = symbolname + '/' + coin
      // 涨跌
      let rose = Math.round(data.rose * 10000) / 100 + '%'
      let rc = ''
      if (rose.indexOf('NaN') < 0) {
        data.rose < 0 && (rc = 'c-fall')
        data.rose === 0 && (rc = '')
        if (data.rose > 0) {
          rose = '+' + rose
        }
        data.rose > 0 && (rc = 'c-rise')
      } else {
        rc = ''
        rose = '0.00%'
      }
      t.rose = {
        class: rc,
        data: rose
      }
      t.high = this._P.fixD(data.high, thisMarket[name].price)
      t.low = this._P.fixD(data.low, thisMarket[name].price)
      t.vol = this._P.fixD(data.vol, thisMarket[name].volume)
      t.amount = this._P.fixD(data.amount, thisMarket[name].price)
      // this.aaa = this._P.fixD(data.amount, thisMarket[name].price)
      this.$forceUpdate()
    },
    changeMysymbol (symbol) {
      let v = symbol.toLowerCase()
      if (!localStorage.coMyMarket) localStorage.coMyMarket = JSON.stringify([])
      let myMarketArr = JSON.parse(localStorage.coMyMarket)
      if (myMarketArr.indexOf(v) === -1) {
        myMarketArr.push(v)
      } else {
        myMarketArr.splice(myMarketArr.indexOf(v), 1)
      }
      localStorage.coMyMarket = JSON.stringify(myMarketArr)
      this.$store.commit('SET_MYMARKET', myMarketArr)
    },
    getoptional () {
      this.axios({
        url: this.$store.state.url.common.optional_symbol,
        headers: {},
        params: {
          optional_symbol: this.myMarket,
          time: new Date().getTime()
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    issue () {
      this.frame = true
    },
    lose () {
      this.frame = false
    },
    marketSor (val) {
      if (val !== this.sortName || this.sortType === 'ups') {
        this.symbolListArr = this.quickSort(this.symbolListArr, val).reverse()
        this.sortName = val
        this.sortType = 'dow'
      } else {
        this.symbolListArr = this.quickSort(this.symbolListArr, val)
        this.sortType = 'ups'
      }
    },
    marketSort (val) {
      if (val !== this.sortName || this.sortType === 'up') {
        this.symbolListArr = this.quickSort(this.symbolListArr, val).reverse()
        this.sortName = val
        this.sortType = 'down'
      } else {
        this.symbolListArr = this.quickSort(this.symbolListArr, val)
        this.sortType = 'up'
      }
    },
    quickSort (dataArrer, key) {
      if (dataArrer.length <= 1) {
        return dataArrer
      }
      let index = Math.floor(dataArrer.length / 2)
      let temp = dataArrer.splice(index, 1)
      let leftArr = []
      let rightArr = []
      for (let i = 0; i < dataArrer.length; i++) {
        if (parseFloat(dataArrer[i][key]['data']) < parseFloat(temp[0][key]['data']) || dataArrer[i][key]['data'] === '--') {
          leftArr.push(dataArrer[i])
        } else {
          rightArr.push(dataArrer[i])
        }
      }
      return this.quickSort(leftArr, key).concat(temp, this.quickSort(rightArr, key))
    },
    transaction (item) {
      item = item.toLowerCase()
      this.$store.commit('SET_NOWSYMBOL', item)
      this.$router.push('contract')
    }
  }
}
</script>