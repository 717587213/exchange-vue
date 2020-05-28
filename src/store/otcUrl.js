export default {
  state: {
    common: {
      public_info: 'otc/public_info', // 公共接口
      parameter: 'otc/parameter', // 初始化参数
      rates: 'otc/rates', // 获取费率信息
      otc_home: 'otc/index',   // 首页
      otc_search: 'otc/search',   // 广告搜索
      upload_img: '/otc/upload_user_img'  // 头像上传
    },
    personal: {
      nickname_update: 'user/nickname_update', // 修改用户昵称
      person_home_page: 'otc/person_home_page',   // 个人主页用户基本信息显示
      operation_ads: 'otc/person_ads',  // 个人广告信息
      person_relationship: '/otc/person_relationship', // 黑名单
      contacts: '/otc/user_contacts'  // 黑白名单修改
    },
    wanted: {
      wanted_detail: '/otc/wanted_detail', // 广告详情
      buy_order_save: 'otc/buy_order_save', // 生成购买订单
      sell_order_save: '/otc/sell_order_save',
      search: '/otc/search',  // 广告搜索
      wanted_save: '/otc/wanted_save', // 发布广告
      close_wanted: '/otc/close_wanted' // 关闭广告

    },
    order: {
      order_detail: '/otc/order_detail', // 订单详情数据
      order_cancel: '/otc/order_cancel', // 取消订单
      confirm_order: '/otc/confirm_order', // 确认打币
      order_payed: '/otc/order_payed', // 确认支付
      complain_order: '/otc/complain_order', // 申诉
      message: 'chatMsg/message' // 聊天历史记录
    }
  }
}
