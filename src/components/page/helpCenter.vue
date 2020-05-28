<template>
  <section class="help-center">
    <div class="help-main clearfix" style="padding-top: 80px;">
      <div class="let-side">
         <ul>
           <li  v-for="(item,index) in helpList" :key="index" @click="changeli(item, index)" class="abroad">{{item.articleTypeName}}<b v-if="item.show" class="icon-down"></b> <b v-else class="icon-right"></b>
              <ul v-show ="item.show" class="help_list">
                <li v-for="(v,k) in item.cmsArticleList" :key="k" :class="{active: v.fileName === helpCon.fileName}" @click.stop="doThis(v)" class="within">{{v.title}}</li>
              </ul>
           </li>
         </ul>
      </div>
      <div class="help-content">
          <p class="title">{{helpCon.ctimeLong}}</p>
          <h2>{{helpCon.title}}</h2>
          <div v-html="helpCon.content"></div>
      </div>
    </div>
  </section>
</template>

<script lang="js">
import { mapState } from 'vuex'

export default {
  name: 'help-center',
  props: [],
  data () {
    return {
      helpList: '',
      helpCon: '',
      file: ''
    }
  },
  mounted () {
    this.gethelp()
  },
  computed: {
    ...mapState({
      symbols ({baseData}) {
        if (baseData.isReady) {
          return baseData
        } else {
          return false
        }
      }
    })
  },
  watch: {
    '$store.state.baseData._lan' (val) {
      this.gethelp()
      this.getfile(this.file)
    }
  },

  methods: {
    changeli (v, k) {
      this.helpList.forEach(i => {
        if (v.show !== this.helpList[k].show) {
          i.show = false
        }
      })
      v.show = !v.show
    },
    doThis (i) {
      this.getfile(i.fileName)
    },
    gethelp () {
      this.axios({
        url: this.$store.state.url.common.helpList,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          let help = data.data
          for (let i in help) {
            help[i].show = false
            if (help[0].cmsArticleList && help[0].cmsArticleList.length > 0) {
              this.file = help[0].cmsArticleList[0].fileName
            }
          }
          if (data.data) {
            this.getfile(this.file)
          }
          this.helpList = help
        } else {
          // console.log(data.msg)
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    getfile (i) {
      this.axios({
        url: this.$store.state.url.common.info,
        headers: {},
        params: {
          fileName: i
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.helpCon = data.data
          this.helpCon.ctimeLong = this._P.formatTime(data.data.ctimeLong)
        } else {
          console.log(data.msg)
          // this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    }

  }
}
</script>