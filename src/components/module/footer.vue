<template>
  <div id="footer-box" class="foot">
    <p style="display: none" v-if="public_info"></p>
     <div class="foot-min">
        <div class="user_case">

        </div>
        <div class="foot-min-top clearfix">
            <div class="foot-min-left clearfix">
              <ul class="get_data">
                <li v-for="(item,index) in fotdata" :key="index" v-if="fotdata.length > 0" class="uside">
                  <router-link tag="span" :to= "{path:'/cms',query: {id: item.fileName}}">{{item.title}}</router-link>
                </li>
                <!--<li class="uside">-->
                  <!--<router-link tag="span" :to= "{path:'/cms',query: {id: item.fileName}}">{{item.title}}</router-link>-->
                <!--</li>-->
                <li class="uside"><router-link  tag="span" to="/help_center">{{$t('public.ft.help')}}</router-link></li>
              </ul>
              <ul class="get_data">

                <li class="uside">
                  <a @click="see('#')">白皮书</a>
                </li>

              </ul>
            </div>
            <div class="foot-min-right">
              <div class="logo">
                <img :src="logo" alt="">
              </div>
              <div class="phone">
               <!-- <i class="icon-phone"></i> -->
                <!--<span>{{number}}</span>-->
                <span><img src="@/assets/img/lianxi_10.png"  @click="see('#')"> </span>
                <span><img src="@/assets/img/lianxi_03.png"  @click="see('#')"> </span>
                <span><img src="@/assets/img/lianxi_05.png"  @click="see('#')"> </span>
                <span><img src="@/assets/img/lianxi_13.png"  @click="see('#')"> </span>
                <span><img src="@/assets/img/lianxi_15.png"  @click="see('#')"> </span>
                <span><img src="@/assets/img/lianxi_13.png"  @click="see('#')"> </span><br/>
                <div></div>
                <span @click.stop="lanClick('en_US')"><img src="@/assets/img/lianxi_24.png">&nbsp;English </span><br/>
                <div></div>
                <span @click.stop="lanClick('zh_CN')"><img src="@/assets/img/lianxi_24.png">&nbsp;中文 </span>
              </div>
              <div class="email clearfix">
                <!-- <i class="icon-letters"></i>  -->
                <div>
                  <span>{{email}}</span>
                </div>
              </div>
            <div class="foot-right-btm" v-if="chaindown !== -1">
              <ul>
                <li><a href="javascript(0)"><img src="@/assets/img/footer/F.png" alt=""></a></li>
                <li><a href="javascript(0)"><img src="@/assets/img/footer/T.png" alt=""></a></li>
                <li><a href="javascript(0)"><img src="@/assets/img/footer/wechat.png" alt=""></a></li>
                <li><a href="javascript(0)"><img src="@/assets/img/footer/xl.png" alt=""></a></li>
                <li> <a href="javascript(0)"><img src="@/assets/img/footer/by.png" alt=""></a></li>
              </ul>
            </div>
            </div>
              </div>
              <div class="foot-min-bottom">
                <p>Copyright © 2018 {{name}}. All rights reserved</p>
              </div>
          </div>
  </div>
</template>
<script>
import { mapState } from 'vuex'
import { changeLanguage } from '@/locale'
import changeTheme from '../../utils/changeTheme.js'
import elDialog from '@/components/common/dialog'
import InlineInput from '@/components/common/inlineInput'
export default {
  name: 'foot',
  data () {
    return {
      islogin: false,
      lanMarkFlag: false,
      fotdata: '',
      logo: null,
      chaindown: location.host.indexOf('chaindown')
    }
  },
  mounted () {
    this.getData()
  },
  computed: {
    ...mapState({
      public_info ({baseData}) {
        if (baseData.isReady) {
          this.logo = baseData.logo
          return baseData
        } else {
          return false
        }
      }

    }),
    number () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.number
      }
      return null
    },
    email () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.email
      }
      return null
    },
    name () {
      if (this.$store.state.baseData._footer) {
        return this.$store.state.baseData._footer.name
      }
      return null
    }
  },
  watch: {
    '$store.state.baseData._lan' (val, old) {
      if (old) {
        this.getData()
      }
    }
  },
  methods: {
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
    see (e) {
      this.xiazai=false;
      window.location.href = e
    },
    getData () {
      this.axios({
        url: this.$store.state.url.common.footer,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.fotdata = data.data
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }
  }
}
</script>
<style lang="stylus" scoped >
.phone span{ margin-right:10px; cursor pointer;}
.phone div{height:10px;}
</style>

