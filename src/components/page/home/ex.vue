<template>

      <div>
         <!-- 推荐区 -->
         <div class="recommend clearfix">
          <div v-if="JSON.stringify(symbolTop) == '{}'">
            <div v-for="item in 5" class="recomm-content borderbox"></div>
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
              <div class="chart_box" :id="'chart_'+ index"></div>
           </div>
         </div>
         <!--币对市场-->
         <div class="market front-color">
            <div class="header">
               <ul>
                 <li :class="{findactive:'myMarket' === markTitle}" @click="tabTog('myMarket')">
                  <span>
                    <i class="icon-store" v-if="'myMarket' === markTitle"></i>
                    <i class="icon-cor icon-store" v-else ></i>
                    {{$t('main.marketSet')}}
                  </span>
                  </li>
                 <li v-for="(value,key,index) in baseData._symbols"
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
                          <i :class="{findactive:myMarket.indexOf(item.symbol) > -1}" class="icon-store" v-if="myMarket.indexOf(item.symbol) > -1 "  @click="changeMysymbol(item.symbol)" ></i>
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
                   <tr class="noHover"><td colspan="8" class="no_data">{{contentText.nodeDataText}}</td></tr>
                 </tbody>
              </table>
            </div>
         </div>


        <div class="youshi">
          <h3>Wafcoin优势：</h3>
          <div class="iconlist">
            <ul id="icon">
              <li class="on" @mouseenter="youshi()" @mouseleave="youshi()"><div class="div1"></div><h2>{{this.$t('main.technology')}}</h2></li>
              <li @mouseenter="youshi()"><div class="div2"></div><h2>{{this.$t('main.Open')}}</h2></li>
              <li @mouseenter="youshi()"><div class="div3"></div><h2>{{this.$t('main.zzst')}}</h2></li>
              <li @mouseenter="youshi()"><div class="div4"></div><h2>{{this.$t('main.aq')}}</h2></li>
              <li @mouseenter="youshi()"><div class="div5"></div><h2>{{this.$t('main.rz')}}</h2></li>
            </ul>
          </div>
          <div class="icontext" id="icontext">
            <div class="on">
              <h4>{{this.$t('main.technology')}}</h4>
              <p>{{this.$t('main.jstext')}}</p>
            </div>
            <div>
              <h4>{{this.$t('main.Open')}}</h4>
              <p>{{this.$t('main.Opentext')}}</p>
            </div>
            <div>
              <h4>{{this.$t('main.zzst')}}</h4>
              <p>{{this.$t('main.zzsttext')}}</p>
            </div>
            <div>
              <h4>{{this.$t('main.aq')}}</h4>
              <p>{{this.$t('main.aqtext')}}</p>
            </div>
            <div>
              <h4>{{this.$t('main.rz')}}</h4>
              <p>{{this.$t('main.rztext')}}</p>
            </div>
          </div>

        </div>


        <div class="gunyuwomen">
          <h2>{{this.$t('main.gywm')}}</h2>
          <p>{{this.$t('main.jianjie')}}</p>
        </div>



        <p v-if="!public_info"></p>
        </div>
</template>
<script>
// import echarts from 'echarts'
import { mapState } from 'vuex'
import pako from 'pako'

export default {
  name: 'm-main',
  components: {},
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady && this.firstFlag) {
          this.baseData = baseData
          this.lang = baseData._lan
          this.creatWs()
          this.firstFlag = false
          return true
        } else {
          return true
        }
      }
    }),
    contentText () {
      return {
        nodeDataText: this.$t('main.loading_ing')
      }
    }
  },
  data () {
    return {
      flag: true,
      firstFlag: true,
      isArr: [], // 轮播图数据
      mack: 0,   // 图片索引
      time: null, // 定时器
      marketListWS: null,
      topMarket: null,
      symbolTop: {},
      skin: '',
      markTitle: localStorage.getItem('homeMarkTitle'),
      symbolListData: {},
      symbolListArr: [],
      lastSymbol: [],
      search: null,
      lang: localStorage.getItem('lan'),
      rate: '',
      baseData: {},
      aaa: '',
      frame: false,
      sortName: null,
      sortType: null,
      topMarketTrade: null,
      klineData: null,
      klineKey: null,
      myEcharts: {},
      theme: this.$store.state.baseData._theme,
      youshishow: false,
      myMarket: localStorage.getItem('myMarket')
        ? localStorage.getItem('myMarket').split(',')
        : []
    }
  },
  mounted () {
    this.youshi()
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
      if (arr.length < 1) {
        this.contentText.nodeDataText = this.$t('main.no_data')
      }
      this.symbolListArr = arr
    },
    //  监听皮肤切换
    '$store.state.baseData._theme' (val, old) {
      if (!val) return false

      this.theme = val
      if (old) {
        // console.log(old)
        // this.initEachart(this.klineData, this.klineKey)
        for (let item in this.myEcharts) {
          console.log(item)
          this.myEcharts[item].setOption({
            series: {
              lineStyle: {
                normal: {
                  color: this.$store.state.color.HomeChartColor[this.theme].lineStyle,
                  width: 1
                }
              },
              areaStyle: {
                normal: {
                  color: this.$store.state.color.HomeChartColor[this.theme].areaStyle
                }
              }
            }
          })
        }
      }
    }
  },
  methods: {
    // eachart (data, key) {
    //   this.myEcharts[key].resize()
    //   // console.log(this.myEcharts[key], data)
    //   this.myEcharts[key] && this.myEcharts[key].setOption({
    //     series: [
    //       {
    //         data: data
    //       }
    //     ]
    //   })
    // },
    // initEachart (data, key) {
    //   this.myEcharts[key] = echarts.init(document.getElementById('chart_' + key))
    //   // 绘制图表
    //   this.myEcharts[key] && this.myEcharts[key].setOption({
    //     grid: {
    //       left: 0,
    //       bottom: 0,
    //       top: 0,
    //       right: 0
    //     },
    //     xAxis: {
    //       show: false,
    //       type: 'category',
    //       min: 'dataMin',
    //       max: 'dataMax'
    //     },
    //     yAxis: {
    //       show: false,
    //       type: 'value',
    //       min: 'dataMin',
    //       max: 'dataMax'
    //     },
    //     series: [{
    //       data: data,
    //       type: 'line',
    //       symbol: 'none',
    //       // smooth: true,
    //       lineStyle: {
    //         normal: {
    //           color: this.$store.state.color.HomeChartColor[this.theme].lineStyle,
    //           width: 1
    //         }
    //       },
    //       areaStyle: {
    //         normal: {
    //           color: this.$store.state.color.HomeChartColor[this.theme].areaStyle
    //         }
    //       }
    //     }]
    //   })
    // },
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
      key !== 'myMarket' && localStorage.setItem('homeMarkTitle', key)
      this.markTitle = key
      this.markList()
    },

    creatWs () {
      // 创建ws
      this.marketListWS = new WebSocket(this.baseData._ws)
      this.marketListWS.binaryType = 'arraybuffer'
      this.topMarket = new WebSocket(this.baseData._ws)
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
            let symboList = this.baseData._symbols[this.markTitle]
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
      // this.topMarket.onmessage = evt => {
      //   var na = new Uint8Array(evt.data)
      //   if (na.length > 0) {
      //     let data = JSON.parse(pako.inflate(na, { to: 'string' }))
      //     if (data['ping']) {
      //       this.topMarket.send(JSON.stringify({ pong: data['ping'] }))
      //     } else if (data.event_rep && data.event_rep === 'rep' && data.data) { // 1分钟K线历史
      //       let key = data.channel.split('_')[1]
      //       if (!this.symbolTop[key]) return false
      //       this.myEcharts[key] = true
      //       if (data.data.length <= 0) return false
      //       this.symbolTop[key].kline = []
      //       for (let i = data.data.length - 1; i >= 0; i--) {
      //         if (i <= data.data.length - 100) break
      //         this.symbolTop[key].kline.push([data.data[i].id, data.data[i].close])
      //       }
      //       this.symbolTop[key].kline.reverse()
      //       // this.initEachart(this.symbolTop[key].kline, key)
      //     } else if (data.tick && data.channel.indexOf('_kline_') > -1) { // 1分钟K线
      //       let key = data.channel.split('_')[1]
      //       if (this.symbolTop[key] && this.symbolTop[key].kline !== null && this.myEcharts[key]) {
      //         this.symbolTop[key].kline.length > 100 && this.symbolTop[key].kline.shift()
      //         this.symbolTop[key].kline.push([data.tick.id, data.tick.close])
      //         this.klineData = this.symbolTop[key].kline
      //         this.klineKey = key
      //         // this.eachart(this.symbolTop[key].kline, key)
      //       }
      //     } else if (data.tick) { // 24小时行情
      //       let d = data.tick
      //       let key = data.channel.split('_')[1]
      //       let topMN = this.symbolTop[key].name.split('/')[1]  // 当前市场
      //       let j = this.baseData._symbols[topMN][this.symbolTop[key].name].price // 当前市场信息
      //       let oldClose = this.symbolTop[key].close.data // 上次价格
      //       let close = this._P.fixD(d.close, j)
      //       let rate = this._P.fixRate(d.close, this.baseData._rate, topMN)
      //       let Od = parseFloat(oldClose)
      //       let cs = parseFloat(close)
      //       let rs = ''
      //       if (Od + '' !== 'NaN') {
      //         cs > Od && (rs = 'c-fall')
      //         cs < Od && (rs = 'c-rise')
      //         cs === Od && (rs = '')
      //       }
      //       this.symbolTop[key].close = {
      //         class: rs,
      //         data: close + '/' + rate
      //       }
      //       let rose = Math.round(d.rose * 10000) / 100 + '%'
      //       let rc = ''
      //       if (rose.indexOf('NaN') < 0) {
      //         d.rose < 0 && (rc = 'c-fall')
      //         d.rose === 0 && (rc = '')
      //         if (d.rose > 0) {
      //           rose = '+' + rose
      //         }
      //         d.rose > 0 && (rc = 'c-rise')
      //       } else {
      //         rc = ''
      //         rose = '0.00%'
      //       }
      //       this.symbolTop[key].rose = {
      //         class: rc,
      //         data: rose
      //       }
      //       this.symbolTop[key].amount = this._P.fixD(d.amount, j)
      //       this.$forceUpdate()
      //     }
      //   }
      // }
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
          name: s,
          kline: null
        }
        this.$forceUpdate()
        if (this.$store.state.baseData._symbols[sMarket] && this.$store.state.baseData._symbols[sMarket][s]) {
          this.sendsymbolTop(key)
          this.myEcharts[key] = false
        }
      }
    },
    sendsymbolTop (symbol) {
      if (!this.topMarket) return
      this.topMarket.send(JSON.stringify({
        event: 'sub',
        params: {
          channel: 'market_' + symbol + '_ticker',
          cb_id: symbol
        }
      }))
      this.topMarket.send(JSON.stringify({
        event: 'req',
        params: {
          channel: 'market_' + symbol + '_kline_1min',
          cb_id: symbol
        }
      }))
      this.topMarket.send(JSON.stringify({
        event: 'sub',
        params: {
          channel: 'market_' + symbol + '_kline_1min',
          cb_id: symbol
        }
      }))
    },
    markList () {
      !this.markTitle && (this.markTitle = this.baseData._maket_index)
      let sList = this.baseData._symbols[this.markTitle]
      this.symbolListData = {}
      this.lastSymbol = []
      for (let item in sList) {
        let unit = sList[item].name.split('/')[1]
        if (this.baseData._symbols[unit][item]) {
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
      let thisMarket = this.baseData._symbols[name.split('/')[1]]
      // 最新价
      let oldClose = t.close.data
      let close = this._P.fixD(data.close, thisMarket[name].price)
      let rate = this._P.fixRate(data.close, this.baseData._rate, name.split('/')[1].toUpperCase())
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
      if (this.myMarket.indexOf(symbol) > -1) {
        this.myMarket = this.myMarket.filter(function (item, index, array) {
          return item !== symbol
        })
      } else {
        this.myMarket.push(symbol)
      }
      localStorage.setItem('myMarket', this.myMarket)
      let newMyMarket = {}
      for (let i = 0; i < this.myMarket.length; i++) {
        let tempSymbol = this.myMarket[i].split('/')
        newMyMarket[this.myMarket[i]] = {
          'name': this.myMarket[i],
          'symbol': tempSymbol[0].toLowerCase() + tempSymbol[1].toLowerCase()
        }
      }
      this.$store.commit('MYMARKET', newMyMarket)
      if (this.baseData.isLogin) {
        this.getoptional()
      }
      if (this.markTitle === 'myMarket') {
        for (let i = 0; i < this.symbolListArr.length; i++) {
          if (this.symbolListArr[i].symbol === symbol) {
            this.symbolListArr.splice(i, 1)
          }
        }
      }
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
      localStorage.setItem('sSymbolName', item)
      localStorage.setItem('markTitle', this.markTitle)
      this.$router.push({name: 'coinTran'})
    },
    youshi (){
      var icon=document.getElementById('icon');
      var icon_li=icon.getElementsByTagName('li');
      var icontext=document.getElementById('icontext');
      var icontext_li=icontext.getElementsByTagName('div');

      for(var i=0;i<icon_li.length;i++){
        icon_li[i].index = i;
        icon_li[i].onmouseover=function(){
          for(var j=0;j<icon_li.length;j++) {
            icon_li[j].className=" ";
            icontext_li[j].className=" ";
          }
          this.className="on";
          icontext_li[this.index].className="on";
        };


      }
    }
  }
}
</script>
<style>
  .youshi{ width: 100%; margin-top: 30px;}
  .youshi > h3{ font-size: 18px; color: #fff;}
  .iconlist{ width: 100%; overflow: hidden; overflow: hidden; margin-top: 20px;}
  .iconlist > ul{width:100%;}
  .iconlist > ul > li{ width:20%; float: left;cursor: pointer; list-style: none;}
  .iconlist > ul > li > div.div1{ width: 23%; margin: 0 auto; height: 63px; background-image: url("../../../assets/img/youshi.png"); background-repeat: no-repeat;background-position-y:-60px;}
  .iconlist > ul > li > div.div2{ width: 25%; margin: 0 auto; height: 63px; background-image: url("../../../assets/img/youshi.png"); background-repeat: no-repeat; background-position-x: 25%; background-position-y:-60px;}
  .iconlist > ul > li > div.div3{ width: 23.5%; margin: 0 auto; height: 63px; background-image: url("../../../assets/img/youshi.png"); background-repeat: no-repeat; background-position-x: 50.5%; background-position-y:-60px;}
  .iconlist > ul > li > div.div4{ width: 24%; margin: 0 auto; height: 63px; background-image: url("../../../assets/img/youshi.png"); background-repeat: no-repeat; background-position-x: 77%; background-position-y:-60px;}
  .iconlist > ul > li > div.div5{ width: 22%; margin: 0 auto; height: 63px; background-image: url("../../../assets/img/youshi.png"); background-repeat: no-repeat; background-position-x: 101%; background-position-y:-60px;}
  .iconlist > ul > li > h2{ width: 100%; font-size: 16px; color: #FFFFFF; text-align: center; margin-top: 10px; line-height: 24px;}
  .iconlist > ul > li.on > div.div1{background-position-y:0;}
  .iconlist > ul > li.on > div.div2{background-position-y:0;}
  .iconlist > ul > li.on > div.div3{background-position-y:0;}
  .iconlist > ul > li.on > div.div4{background-position-y:0;}
  .iconlist > ul > li.on > div.div5{background-position-y:0;}
  .iconlist > ul > li.on > h2{color: #00b17b;}
  .icontext{ width: 100%; margin-top: 20px; overflow: hidden;}
  .icontext > div{ width: 100%; height: 200px; background-color: #0a152d; display: none;}
  .icontext > div.on{ width: 100%; height: 200px; background-color: #0a152d; display: block;}
  .icontext > div > h4{ float: left; width: 20%; margin-top: 60px; color: #FFFFFF; margin-left: 5%; font-weight: 700; font-size: 22px;}
  .icontext > div > p{ width: 70%; float: left; color: #FFFFFF; margin-top: 60px; line-height: 28px; padding-right: 5%; font-size: 15px; line-height: 30px;}

  .gunyuwomen{width: 100%; margin-top: 50px;}
  .gunyuwomen h2{ width: 100%; text-align: center; font-size: 25px; font-weight: 600; margin-bottom: 20px;color: #FFFFFF;}
  .gunyuwomen p{ width: 100%; text-align: center; font-size: 15px; color: #FFFFFF;line-height: 30px;}
</style>
