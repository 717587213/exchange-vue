<template>
    <div class="m-header" style="position: absolute;top: 0;left: 0; width: 100%;">
        <p style="display: none" v-if="public_info"></p>
        <div class="header clearfix">
          <div class="logo">
            <router-link to="/" ><img :src="logo" alt=""></router-link>
          </div>
          <!-- 线上代码 -->
          <template v-if="siteType.length === 1">
            <ul class="header-ul clearfix">
              <!-- 当前是币币交易 -->
              <template v-if="siteType.indexOf('ex') !== -1">
                <li>
                  <!-- 交易首页 -->
                  <router-link to="/index">{{ Internationalization.currency }}<span></span></router-link>
                </li>
                <li v-if="public_info.contractOpen === '1'">
                  <!-- OTC交易首页 -->
                  <a :href="http + webSiteInfo.co_pc_url + '/index'" target="_blank">{{ Internationalization.co }}</a>
                </li>
                <li v-if="public_info.otcOpen === '1'">
                   <!-- 场外交易首页 -->
                  <a :href="http + webSiteInfo.otc_pc_url + '/index'" target="_blank">{{ Internationalization.transaction }}</a>
                </li>
                <li>|</li>
                <li>
                  <router-link to="/trade">{{ Internationalization.currencyMall }}<span></span></router-link>
                </li>
                <!-- 挖矿 -->
                  <li v-if="public_info.return_open === '1'">
                  <router-link to="/mining">{{$t('public.hd.mining')}}<span></span></router-link>
                </li>
                  <!-- 邀请-->
                <li v-if="public_info.invite_open === '1'">
                  <router-link to="/invitation">{{$t('public.hd.invitation')}}<span></span></router-link>
                </li>
              </template>
              <!-- 当前是合约交易 -->
              <template v-if="siteType.indexOf('co') !== -1">
                <li v-if="public_info.exOpen === '1'">
                  <!-- 币币交易首页 -->
                  <a :href="http + webSiteInfo.ex_pc_url + '/index'" target="_blank">{{ Internationalization.currency }}<span></span></a>
                </li>
                <li>
                  <!-- 合约交易首页 -->
                  <router-link to="/index">{{ Internationalization.co }}<span></span></router-link>
                </li>
                <li v-if="public_info.otcOpen === '1'">
                   <!-- 场外交易首页 -->
                  <a :href="http + webSiteInfo.otc_pc_url + '/index'" target="_blank">{{ Internationalization.transaction }}<span></span></a>
                </li>
                <li>|</li>
                <li>
                  <router-link to="/contract">{{ Internationalization.coCenter }}<span></span></router-link>
                </li>
              </template>
              <!-- 当前是场外交易 -->
              <template v-if="siteType.indexOf('otc') !== -1">
                <li v-if="public_info.exOpen === '1'">
                  <!-- 币币交易首页 -->
                  <a :href="http + webSiteInfo.ex_pc_url + '/index'" target="_blank">{{ Internationalization.currency }}<span></span></a>
                </li>
                <li v-if="public_info.contractOpen === '1'">
                  <!-- 合约交易首页 -->
                  <a :href="http + webSiteInfo.co_pc_url + '/index'" target="_blank">{{ Internationalization.co }}<span></span></a>
                </li>
                <li>
                   <!-- 场外交易首页 -->
                  <router-link to="/index">{{ Internationalization.transaction }}<span></span></router-link>
                </li>
                <li>|</li>
                <li>
                  <router-link to="/adsHall">{{ Internationalization.adcenter }}<span></span></router-link>
                </li>
              </template>
            </ul>
          </template>
        <template v-else>
          <!-- 本地调试 -->
            <ul class="header-ul clearfix">
              <li>
                <router-link to="/index" >{{ Internationalization.home }}<span></span></router-link>
              </li>
              <li v-if="public_info.exOpen === '1'">
                  <router-link to="/trade">{{ Internationalization.currency }}<span></span></router-link>
                </li>
              <li v-if="public_info.contractOpen === '1'">
                <!-- 合约交易 -->
                <router-link to="/contract">{{ Internationalization.co }}<span></span></router-link>
              </li>
              <li v-if="public_info.otcOpen === '1'">
                 <!-- 场外交易大厅 -->
                <router-link to="/adsHall">{{ Internationalization.adcenter }}<span></span></router-link>
              </li>
              <li v-if="public_info.otcOpen === '1'">
                <!-- 场外交易大厅 -->
                <router-link to="/adsHall">{{ Internationalization.mining }}<span></span></router-link>
              </li>
              <li v-if="public_info.otcOpen === '1'">
                <!-- 场外交易大厅 -->
                <router-link to="/adsHall">{{ Internationalization.invitation }}<span></span></router-link>
              </li>
               <!-- 挖矿 -->
                  <li v-if="public_info.return_open === '1'">
                  <router-link to="/mining">{{$t('public.hd.mining')}}<span></span></router-link>
                </li>
                  <!-- 邀请-->
                <li v-if="public_info.invite_open === '1'">
                  <router-link to="/invitation">{{$t('public.hd.invitation')}}<span></span></router-link>
                </li>
            </ul>
          </template>
          <!-- 本地调试结束 -->
          <div class="header-right">
            <ul class="rightNav">
              <template v-if="islogin">
                <template v-if="siteType.indexOf('otc') !== -1">
                  <li class="rightNav_item">
                    <router-link to="/publishAds" class="creatButton">{{ Internationalization.publish }}</router-link>
                  </li>
                  <li class="rightNav_item">
                    <router-link to="/otc_personal"><i class=" icon-user"></i> {{ Internationalization.my }}</router-link>
                  </li>
                  <li class="rightNav_item">|</li>
                </template>
                <li class="rightNav_item">
                  <router-link to="/funds/funds_manage">
                    <i class="icon-money"></i>
                    <span>{{ Internationalization.capital }}</span>
                  </router-link>
                </li>
                <li class="rightNav_item"  v-if="siteType.indexOf('co') === -1">
                  <router-link to="/order">
                    <i class="icon-order"></i>
                    <span>{{$t('public.hd.orderManage')}}</span>
                  </router-link>
                </li>
              </template>
              <li class="rightNav_item mase">
                <router-link to="/mesage">{{$t('public.hd.sbsq')}}</router-link>
              </li>
              <li class="rightNav_item mase" style="position: relative">
                <a  @click="see('#')" @mouseenter="enter()" @mouseleave="leave()">{{$t('public.hd.appd')}}</a>
                <div class="xiazai" v-if="xiazai">
                  <div>
                    <div><img src="@/assets/img/xiazai.png"></div>
                    <p>Android版本下载</p>
                  </div>
                  <div>
                    <div><img src="@/assets/img/xiazai.png"></div>
                    <p>IOS版本下载</p>
                  </div>
                </div>
              </li>
              <li class="rightNav_item">
                <div class="personal_menu select_menu" v-if='islogin'>
                  <i class=" icon-user"></i>
                  <span>{{userInfor.nickName}}</span>
                  <i class="icon-down"></i>
                  <ul>
                    <li>
                      <router-link to="/personal"><i class=" icon-user"></i>{{$t('public.hd.userCenter')}}</router-link>
                    </li>
                    <li>
                      <router-link to="/api"><i class="icon-api"></i>{{$t('public.hd.apiManage')}}</router-link>
                    </li>
                     <li>
                      <router-link to="/questions"><i class="icon-questuin"></i>{{$t('public.hd.ask')}}</router-link>
                      </li>
                      <li v-if="$store.state.baseData.agentOpen === '1'">
                        <router-link  to="/agent_list"><i class="icon-user"></i>{{$t('public.hd.economic')}}</router-link>
                      </li>
                    <li @click="logout"><i class="icon-logout"></i>{{$t('public.hd.logout')}}</li>

                  </ul>
                </div>
                <span v-else>
                  <a  class="login" @click="login()"></a>
                  <router-link class="login" to="/login">{{ Internationalization.login }}</router-link>
                  <em>|</em>
                  <router-link class="register" to="/register">{{ Internationalization.register }}</router-link>
                </span>
              </li>
              <li class="rightNav_item mase" v-if='islogin'>
                 <router-link to="/mesage">  <i class="msages icon-info"></i> <b v-if="no_read > 0"></b></router-link>
              </li>
              <!-- 皮肤切换 -->
              <!-- <li class="rightNav_item">
                <a href="javascript:;" v-if="themeType === 'theme_white'" @click="changetheme('theme_default')">
                     <i class="icon-moon"></i>

                </a>
                <a href="javascript:;" v-else @click="changetheme('theme_white')">
                    <i class="icon-sun"></i>
                </a>
              </li> -->
              <li class="rightNav_item" @click="isShowDialog = true"><a href="javascript:;"><i class="icon-setting"></i></a></li>
       <!--   <li class="rightNav_item">
                <div class="select_menu">
                  <a href="javascript:;">{{$t('main.theme')}}</a>
                  <i class="icon-down"></i>
                  <ul class="themeList">
                    <template v-for="(item, index) in themeFormData.optionList">
                      <li :key='index'
                        @click="changetheme(item.code)"
                        :class="{selected: themeType === item.code}">
                          {{item.value}}
                      </li>
                    </template>
                  </ul>
                </div>
              </li> -->
              <li class="rightNav_item" :class="{right_active:appdown}" @mouseover="over" @mouseout="out" v-if="downurl.app_page_url">
                    <span>{{$t('main.app_download')}}</span>
                    <div class="qr_code" v-if="appdown">
                        <img :src="downurl.app_page_url " alt="">
                        <i>{{$t('main.sweep_download')}}</i>
                    </div>
                </li>
              <li class="rightNav_item">
                <div class="lang select_menu" @click='lanMarkShow'>
                  <span>
                    <i class="flag_icon" :class="lanId"></i>
                    {{ lan }}</span>
                  <ul class="langMark">
                    <template v-for='(v, i) in lanList'>

                    <li v-if="i !== 2" :key='i' @click.stop='lanClick(v.id)'>
                      <i class="flag_icon" :class="v.id"></i>
                      {{ v.id }}
                    </li>
                    </template>
                  </ul>
                  <i class="icon-down"></i>
                </div>
              </li>

            </ul>
          </div>
        </div>
        <el-dialog
          :title='tiptlText'
          :flag='isShowDialog'
          name= 'isShowDialog'
          :width='450'
          :dialogClose='closeDialog'>
          <div class="setThemePop" slot="content">
            <!--<div v-if="legalTender">
              <inline-input
                :property = "legalTender"
                v-model="legalTender.value"
                v-on:onevents="somethings" >
              </inline-input>
            </div>
            <div v-if="themeForm">
              <inline-input
                :property = "themeForm"
                v-model="themeForm.value"
                v-on:onevents="somethings" >
              </inline-input>
            </div>
            <br >  <br ><br ><br ><br ><br ><br > -->

            <div class="setTheme">
              <div class="inlint-title">
                {{$t('main.theme')}}
              </div>
              <div class="radioLine">
                <span class="tadioTd">
                  <input type="radio" id="one" name="theme" value="theme_default" v-model="themeType">
                  <label for="one">{{$t('main.blueTheme')}}</label>
                </span>
                <span class="tadioTd">
                  <input type="radio" id="two" name="theme" value="theme_white" v-model="themeType">
                  <label for="two">{{$t('main.whiteTheme')}}</label>
                </span>
                <span class="tadioTd">
                  <input type="radio" id="two" name="theme" value="theme_black" v-model="themeType">
                  <label for="two">{{$t('main.blackTheme')}}</label>
                </span>
              </div>
            </div>
          </div>
          <div slot="options">
              <button @click="setTheme">{{$t('trade.confirm')}}</button>
          </div>
        </el-dialog >
    </div>
</template>
<script>
import { mapState } from 'vuex'
import { changeLanguage } from '@/locale'
import changeTheme from '../../utils/changeTheme.js'
import elDialog from '@/components/common/dialog'
import InlineInput from '@/components/common/inlineInput'
export default {
  name: 'm-header',
  components: {elDialog, InlineInput},
  data () {
    return {
      islogin: false,
      isShowDialog: false,
      userInfor: null,
      lanList: [],
      lan: '',
      lanId: '',
      lanMarkFlag: false,
      no_read: '',
      logo: null,
      host: this.$store.state.baseData._webSiteInfo,
      otcSubLink: false,
      legalTender: {},
      themeForm: {},
      themeType: localStorage.getItem('theme-type'),
      rate: null,
      otcOpen: null,
      coOpen: null,
      siteType: [],
      webSiteInfo: null,
      logoutFla: true,
      http: location.protocol + '//',
      appdown: false,
      downurl: '',
      xiazai:false
    }
  },
  mounted () {
    this.legalTender = this.legalTenderFormObj
    this.themeForm = this.themeFormData
    this.getApp()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData._lanList) {
          this.lanList = baseData._lanList
          this.islogin = baseData.isLogin
          this.logo = baseData.logo
          this.userInfor = baseData._user
          this.rate = baseData._rate
          this.otcOpen = baseData.otcOpen
          this.coOpen = baseData.contractOpen
          this.siteType = baseData._siteType
          this.webSiteInfo = baseData._webSiteInfo
          baseData._lanList.forEach(element => {
            if (element.id === baseData._lan) {
              this.lan = element.name
              this.lanId = element.id
            }
          })
          return baseData
        } else {
          return false
        }
      }

    }),
    legalTenderFormObj () {
      return {
        title: '法币计价单位',
        formType: 'select',
        placeholder: this.$t('personal.placeholder_2'),
        name: 'legalTender',
        value: '1',
        optionList: [
          {value: '$ USD', code: '1'},
          {value: '￥CNY', code: '2'},
          {value: '₩ KRW', code: '3'}
        ]
      }
    },
    themeFormData () {
      return {
        title: this.$t('main.theme'),
        formType: 'select',
        placeholder: '',
        name: 'themeFormData',
        value: this.themeType,
        optionList: [
          {value: this.$t('main.blueTheme'), code: 'theme_default'},
          {value: this.$t('main.whiteTheme'), code: 'theme_white'},
          {value: this.$t('main.blackTheme'), code: 'theme_black'}
        ]
      }
    },
    tiptlText () {
      return '设置'
    },
    // 国际化
    Internationalization () {
      return {
        login: this.$t('public.hd.login'), // 登陆
        register: this.$t('public.hd.register'), // 注册
        co: this.$t('public.hd.co'), // 合约交易
        coCenter: this.$t('public.hd.coCenter'), // 合约大厅
        capital: this.$t('public.hd.capital'), // 资金管理
        transaction: this.$t('public.hd.transaction'), // 场外交易
        currency: this.$t('public.hd.currency'), // 币币交易
        currencyMall: this.$t('public.hd.currencyMall'), // 币币交易大厅
        home: this.$t('public.hd.home'), // 首页
        my: this.$t('otc.index.my'), // 我的
        publish: this.$t('otc.index.publish'), // '发布广告',
        adcenter: this.$t('public.hd.adcenter'), // '场外大厅',
        mining: this.$t('public.hd.mining'), // '挖矿交易',
        invitation: this.$t('public.hd.invitation'),// '邀请分红',
        sbsq: this.$t('public.hd.sbsq'), // '上币申请',
        appd: this.$t('public.hd.appd') // 'app下载',
      }
    }
  },
  watch: {
    'legalTenderFormObj' (val) {
      this.legalTender = val
    },
    '$store.state.mesage.mesg' (val) {
      this.getRead()
    },
    'public_info.isLogin' (val) {
      let that = this
      if (val === true) {
        this.getRead()
        setInterval(function () {
          that.getRead()
        }, 30000)
      }
    }
  },
  methods: {
    enter(){
      this.xiazai=true;
    },
    leave(){
      this.xiazai=false;
    },

    see (e) {
      this.xiazai=false;
      window.location.href = e
    },
    gotoEx () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.ex_pc_url + '/trade'
    },
    gotoHall () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/adsHall'
    },
    gotopublish () {
      window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/publishAds'
    },
    // input组件 返回事件
    somethings (data) {
      console.log(data)
      if (data.handleType === 'selected' && data.name === 'themeFormData') {
        this.themeType = data.value.code
      }
      if (data.handleType === 'selected' && data.name === 'legalTender') {
        this.selected(data)
      }
    },
    // 选择
    selected (data) {
      this.$forceUpdate(() => {
        this.legalTender.value = data.value.code
      })
    },
    setTheme () {
      changeTheme(this.themeType)
      localStorage.setItem('theme-type', this.themeType)
      this.$store.commit('THEME', this.themeType)
      this.isShowDialog = false
    },
    changetheme (type) {
      changeTheme(type)
      localStorage.setItem('theme-type', type)
      this.themeType = type
      this.$store.commit('THEME', type)
    },
    // 关闭弹窗
    closeDialog (e) {
      this[e] = false
    },
    // 跳转至移动端

    goMobile () {
      window.open(location.protocol + '//' + window.HOST_API.h5_url)
    },
    getUid (isOpen) {
      if (isOpen === 0) {
        window.location.href = location.protocol + '//' + this.webSiteInfo.otc_pc_url + '/otc_personal'
      } else {
        location.pathname.indexOf('otc_personal') > -1 && window.location.reload()
        this.$router.push('/otc_personal')
      }
    },
    swithchotcSubLink () {
      this.otcSubLink && (this.otcSubLink = false)
      !this.otcSubLink && (this.otcSubLink = true)
    },
    login () {
      this.$router.push({ name: 'login' })
    },
    regs () {
      this.$router.push({ name: 'register' })
    },
    // 退出登录
    logout () {
      if (!this.logoutFla) return false
      this.logoutFla = false
      this.axios({
        url: this.$store.state.url.user.login_out,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.$store.commit('ISLOGIN', false)
          this.logoutFla = true
        } else {
          this.logoutFla = true
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    message () {
      this.$router.push({ name: 'mesage' })
    },
    // 切换语言
    lanClick (lan) {
      if (this.islogin) {
        this.axios({
          url: this.$store.state.url.common.language,
          headers: {},
          params: {language: lan},
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            localStorage.lan = lan
            this.$store.commit('LAN', lan)
            this.public_info._lanList.forEach(element => {
              if (element.id === lan) {
                this.lan = element.name
                this.lanId = lan
              }
            })
            changeLanguage(lan)
            this.lanMarkFlag = false
          } else {
            this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      } else {
        localStorage.lan = lan
        this.$store.commit('LAN', lan)
        this.public_info._lanList.forEach(element => {
          if (element.id === lan) {
            this.lan = element.name
            this.lanId = lan
          }
        })
        changeLanguage(lan)
        this.lanMarkFlag = false
      }
    },
    lanMarkShow () {
      this.lanMarkFlag = true
    },
    getRead () {
      this.axios({
        url: this.$store.state.url.mesage.message_count,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.no_read = data.data.noReadMsgCount
        }
      })
    },
    over () {
      this.appdown = true
    },
    out () {
      this.appdown = false
    },
    getApp () {
      this.axios({
        url: this.$store.state.url.common.download,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.downurl = data.data
        }
      })
    }
  }
}
</script>
<style>
  .m-header {
    display: none;
  }
  .xiazai{width:280px;background-color: #fff; overflow: hidden; position: absolute;top: 60px;left:-200px; overflow: hidden;}
  .xiazai > div:first-child{ float: left;}
  .xiazai > div:first-child > div{ width: 50%; text-align: center; margin-top: 10px; height: 85px;}
  .xiazai > div:first-child > div > img{ margin-left: 20px;}
  .xiazai > div:first-child > p{ width: 105px; line-height: 23px; background-color: #a4c539; margin-bottom: 10px; text-align: center; margin-left: 10px;font-size: 10px;color: #fff;}
  .xiazai > div:last-child{ float: right;}
  .xiazai > div:last-child > div{ width: 50%; text-align: center; margin-top: 10px; height: 85px;}
  .xiazai > div:last-child > p{ width: 105px; line-height: 23px; background-color: #fd9800; text-align: center; margin-right: 10px;font-size: 10px;color: #fff;}
  .xiazai > div:last-child > div > img{ margin-left: 10px;}
</style>





