<template>
  <section class="VuePage"   v-on:dblclick="ondblclick" @click="onclickfun">
    <tip />
    <router-view></router-view>
      <transition name="fade">
      <div id="page-loading" v-show="isshowLoading">
        <div class="bar">
          <loading-model></loading-model>
        </div>
        </div>
    </transition>
    <i style="display: none">{{indexTitle}}</i>
  </section>
</template>
<script>
import tip from './components/common/tip'
import changeTheme from './utils/changeTheme.js'
import bus from './apis/bus.js'
import loadingModel from '@/components/common/loadingModel'
export default {
  name: 'app',
  components: {
    tip,
    loadingModel
  },
  data () {
    return {
      lan: null,
      coverKlineBox: null,
      isshowLoading: false,
      startTimestamp: null,
      indexHeaderTitle: null,
      routeMeta: this.$route.name,
      defaultTheme: this.$store.state.baseData.defaultTheme,
      rateArr: ['index', 'coinTran', 'funds']
    }
  },
  mounted () {
    let self = this
    // public_info 请求
    this.$store.dispatch('getCommonPublic_info')
    // user_info
    this.$store.dispatch('getCommonUser_info')
    // otc public_info
    if (window.siteType.indexOf('otc') !== -1) {
      this.$store.dispatch('otcPublic_info')
    }
    // otc public_info
    if (window.siteType.indexOf('co') !== -1) {
      this.axios({
        url: this.$store.state.coUrl.public_info,
        hostType: 'co'
      }).then((e) => {
        if (e.code === '0') {
          this.$store.dispatch('setCoPublicData', e.data)
        }
      })
    }
    bus.$on('loginOut', (e) => {
      self.$store.commit('ISLOGIN', false)
    })
    // 加载默认皮肤
    if (!localStorage.getItem('theme-type') || localStorage.getItem('theme-type').split('-')[1]) {
      localStorage.setItem('theme-type', this.defaultTheme)
    }
    let theme = localStorage.getItem('theme-type')
    this.$nextTick(() => {
      changeTheme(theme)
      self.$store.commit('THEME', theme)
    })
    let routeName = {title: this.$route.name}
    document.title = this.$t('pageTitle.' + routeName.title)
    // 设置汇率
    if (this.rateArr.indexOf(this.$route.name) === -1) {
      this.$store.dispatch('getRate_info', false)
    } else {
      this.$store.dispatch('getRate_info', true)
    }
  },
  watch: {
    // 在首页，币币交易，资金管理页面 长轮询汇率接口的请求
    '$route.name' (val) {
      if (this.rateArr.indexOf(val) === -1) {
        this.$store.dispatch('getRate_info', false)
      } else {
        this.$store.dispatch('getRate_info', true)
      }
    },
    // 设置页面的title
    '$route.meta' (val) {
      if (val.title) {
        this.routeMeta = val.title
      }
    },
    '$store.state.baseData._lan' (val) {
      this.lan = val
    },
    '$store.state.baseData.indexHeaderTitle' (val) {
      this.indexHeaderTitle = val
    },

    '$store.state.options.isshowLoading' (val) {
      if (val) {
        this.startTimestamp = Date.parse(new Date())
        this.isshowLoading = true
      } else {
        let endTimestamp = Date.parse(new Date())
        let difference = endTimestamp - this.startTimestamp
        let number = 0
        if (difference < 1000) {
          number = 1000 - difference
        }
        setTimeout(() => {
          this.isshowLoading = false
        }, number)
      }
    }
  },
  computed: {
    indexTitle () {
      if (!this.indexHeaderTitle) {
        document.title = this.$t('pageTitle.' + this.routeMeta)
        return false
      }
      let baseTitle = ''
      this.indexHeaderTitle.map(item => {
        if (item.langKey === this.lan) {
          baseTitle = item.content + ' - '
        }
        document.title = baseTitle + this.$t('pageTitle.' + this.routeMeta)
        return false
      })
    }
  },
  methods: {
    ondblclick () {
      return false
    },
    onclickfun (e) {
      // 显示和隐藏币币交易页面 TradingView 的遮罩
      if (e.target.className === 'coverKlineBox') {
        this.coverKlineBox = e.target
        this.coverKlineBox.style.display = 'none'
      } else if (this.coverKlineBox) {
        this.coverKlineBox.style.display = 'block'
        this.coverKlineBox = null
      }
    }
  }
}
</script>
<style>
  .VuePage {
    display: none;
  }
</style>
