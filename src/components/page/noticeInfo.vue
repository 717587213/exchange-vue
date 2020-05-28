<template>

  <div class="notieInfo">
    <div class="notie-main clearfix" style=" padding-top: 80px;">
      <div class="notie-content" >
        <p class="time">{{notieContent.ctime}}</p>
        <h2>{{notieContent.title}}</h2>
        <div v-html="notieContent.content" class="const"></div>
      </div>
      <div class="notie-side">
          <div class="article-head">
           {{$t('main.notice')}}
          </div>
          <ul class="notice-list">
            <li v-for="(item,index) in sideList" :key="index" @click="writing(item.id)" :class="{active:isactive === item.id}">{{item.title}}</li>
          </ul>
          <Vpagination v-if="(sidetion.count/sidetion.pageSize) > 1"
                              :total="sidetion.count"
                              :current-page='sidetion.page'
                              :display='sidetion.pageSize'
                              @pagechange="sidechage($event)"
                              class="page">
          </Vpagination>
      </div>
      
    </div>
  </div>

</template>

<script lang="js">
import Vpagination from '@/components/common/pagination'

export default {
  name: 'notieinfo',
  mounted () {
    this.side_list()
    this.notice_content()
  },
  data () {
    return {
      sideList: '',
      notieContent: '',
      sidetion: {
        count: '',
        page: 1,
        pageSize: 10
      },
      isactive: parseFloat(localStorage.getItem('ntId')) || null
    }
  },
  components: {
    Vpagination
  },
  watch: {
    // 切换语言
    '$store.state.baseData._lan' (val) {
      this.side_list('lan')
    }
  },
  methods: {
    // 公告列表
    side_list (source) {
      this.axios({
        url: this.$store.state.url.notice.notice_list,
        headers: {},
        params: {
          page: this.sidetion.page,
          pageSize: this.sidetion.pageSize
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.sidetion.count = data.data.count
          this.sideList = data.data.noticeInfoList
          // 如果是切换语言过来的需要重新设置显示详情的ID
          if (source === 'lan') {
            this.writing(data.data.noticeInfoList[0].id)
          }
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    writing (i) {
      localStorage.setItem('ntId', i)
      this.isactive = i
      this.notice_content()
    },
    // 公告详情
    notice_content () {
      this.axios({
        url: this.$store.state.url.notice.notice_info,
        headers: {},
        params: {
          id: localStorage.ntId
        },
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.notieContent = data.data.noticeInfo
          this.notieContent.ctime = this._P.formatTime(data.data.noticeInfo.ctime)
        } else {
          // this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          console.log(data.msg)
        }
      })
    },
    // 列表分页
    sidechage (page) {
      this.sidetion.page = page
      this.side_list()
    }
  },
  computed: {

  }
}
</script>
