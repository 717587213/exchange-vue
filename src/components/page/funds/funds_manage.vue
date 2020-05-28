<template>
	<div class="funds">
		<div class="funds-main">
				<div class="funds-aside">
		 		  <div class="funds-aside-list">
		 				<router-link to="/funds/funds_manage" class="asideActive"><i class="icon-account"></i>{{Internationalization.funds_manage}}</router-link>
		 				<router-link to="/funds/finance_manage"><i class="icon-trade "></i>{{Internationalization.finance_manage}}</router-link>
		 				<router-link to="/funds/address_manage" ><i class="icon-address"></i>{{Internationalization.address_manage}}</router-link>
		 			</div>
	 		 </div>
	 		 	<div class="funds-content">
		<!--头部nav-->
					<div class="fund-manage-top" v-if="coinlist">
						<ul class="fund-manage-nav">
              <!-- 现货 -->
							<li @click="accountTab('transaction')" :class="accountTabClass === 'transaction' ? 'fundActive' : ''">{{Internationalization.transaction_acc}}</li>
							<!-- 合约 -->
              <li @click="accountTab('contract')" v-if="contractOpen === '1'"  :class="accountTabClass === 'contract' ? 'fundActive' : ''">{{Internationalization.contract_acc}}</li>
              <!-- 场外 -->
              <li v-if="otcOpen === '1'" @click="accountTab('Outside')" :class="accountTabClass === 'Outside' ? 'fundActive' : ''">{{Internationalization.outside_acc}}</li>
            </ul>
						<div class="fund-manage-tool" v-if="accountTabClass !== 'contract'">
							<div class="fund-manage-allassets">{{Internationalization.total_money}}: {{totalBalance}} <span>{{totalBalanceSymbol}}</span> <span> ≈ {{CNY}}</span></div>
							<div class="fund-manage-hidden">
								<input type="checkbox" name="" id="zero-assets"  @click="checked" v-model="check"/>{{Internationalization.hidden_zero}}
							</div>
						</div>
					</div>
					<div class="accountList">
						<div>
						  <div v-if="showLoading">
								<div class="loading">
									<loading-model></loading-model>
								</div>
							</div>
							<div v-else>
								<table>
									<!--交易账户-->
											<template v-if="accountTabClass === 'transaction'">
												<tr class="noWidth">
													<th class="firstTh">{{Internationalization.symbol}}</th>
													<th>{{Internationalization.total}}</th>
													<th>{{Internationalization.usable}}</th>
													<th>{{Internationalization.lock}}</th>
													<th>{{Internationalization.valuesBTC}}</th>
													<th>{{Internationalization.opera}}</th>
												</tr>
												<template v-for="(item, key) in accountList">
													<tr v-if="item.checked">
														<!--{{imgSrc}}-->
														<td class="firstTd"><img :src="coinlist[item.coinName].icon || imgSrc"/>{{item.coinName}}
														</td>
														<td>{{item.total_balance}}</td>
														<td>{{item.normal_balance}}</td>
														<td>{{item.lock_balance}}</td>
														<td>{{item.btcValuatin}}</td>
														<td>
															<span class="opear">
																	<a class="deff-text" 
																		@click="rechargeShow(key,'recharge')" 
																		href="javascript:void(0)" 
																		v-if="item.depositOpen" >
																			{{Internationalization.deposit}}
																	</a>
																</span>
																<span  class="opear">
																	<a href="javascript:void(0)" @click="withdrawShow(key,'withdraw')" v-if="item.withdrawOpen">	{{Internationalization.withdraw}}
																	</a>
																</span>
															</td>
													</tr>
													<tr v-if="item.isopen" class="rechargeShow">
														
														<td colspan="6" >
															<div v-if="rechargeLoading" class="rechargeCon clearfix">
																<div class="rechargeLoading">
																	<loading-model></loading-model>
																</div>
																<s class="triangleL" v-if="item.isopen"></s>
															</div>
															<div v-else class="rechargeCon clearfix">
																<ul>
																	<li>
																		{{item.coinName}} {{Internationalization.deposit_addr}}
																	</li>
																	<li>
																		<input readonly="readonly" class="addressStr"  ref="inviteUrl" :value="addressStr"/>
																	</li>
                                  <li v-if="labelShow">
																		{{Internationalization.numberID}}
																	</li>
                                  <li v-if="labelShow">
																		<input readonly="readonly" class="labelStr"  ref="labelId" :value="labelStr"/>    <a class="copyLabel" href="javascript:;" @click="copyLabel">{{Internationalization.copytag}}</a>
																	</li>
																	<li class="warn-txt">
																		{{Internationalization.deposit_notice}}
																	</li>
																</ul>
																<div class="qrcode">
																	<img v-if="addressQRCode" :src="addressQRCode"/>
																</div>
																<button class="copy" @click="copyUrl">{{Internationalization.copy_addr}}</button>
																<s class="triangleL" v-if="item.isopen"></s>
															</div>
														</td>
													</tr>
													<tr v-if="item.otherisopen" class="withdrawShow">
														<td colspan="6">
															<div class="withdrawCon clearfix">
																<ul style="width: 100%;">
																	<li>
																		<a   @click="addAddress(item)" class="add">{{Internationalization.add_addr}}</a>
																	</li>
																	<li>
                                    <inline-input 
                                        :property = "formData.addressList"
                                        v-model="formData.addressList.value"
                                        v-on:onevents="somethings" > 
                                    </inline-input>	
								                  </li>
                                  <li v-if="numberShow" class="numberID">
                                    <div>{{Internationalization.numberID}}</div>
                                    <input readonly="readonly" type="number" :value="numberId" :placeholder="Internationalization.numberID">
                                  </li>
																</ul>
																<ul>
																	 <inline-input 
								                      :property = "formData.canWithdraw"
								                      v-model="formData.canWithdraw.value"
								                      v-on:onevents="somethings" > 
								                    </inline-input>
																	<li class="feeNote">{{Internationalization.canWithdraw}}:{{item.normal_balance}}</li>
																</ul>
																<ul>
																	<inline-input 
								                      :property = "formData.feeWithdraw"
								                      v-model="formData.feeWithdraw.value"
								                      v-on:onevents="somethings" > 
								                    </inline-input>
																	<li class="feeNote">{{Internationalization.feeWithdraw}}:{{item.feeMin}}~{{item.feeMax}}</li>
																</ul>
																<button class="submit" @click="submitWithdraw(item)">{{Internationalization.submit}}</button>
																<s class="triangleR" v-if="item.otherisopen"></s>
															</div>
														</td>
													</tr>				
												</template >
											</template>
					
									
									<!--场外账户-->
									<template v-if="accountTabClass === 'Outside'">
										<tr>
					            <th class="firstTh">{{Internationalization.symbol}}</th>
											<th>{{Internationalization.total}}</th>
											<th>{{Internationalization.usable}}</th>
											<th>{{Internationalization.lock}}</th>
											<th>{{Internationalization.valuesBTC}}</th>
											<th>{{Internationalization.opera}}</th>
										</tr>
										
										<template v-for="(item,index) in accountList">
											<tr v-if="item.checked">
												<td class="firstTd"><img :src="(otcCoinlist_arr && otcCoinlist_arr[index].icon) || imgSrc"/>{{item.coinSymbol}}</td>
												<td>{{item.total_balance}}</td>
												<td>{{item.normal}}</td>
												<td>{{item.lock}}</td>
												<td>{{item.btcValuation}}</td>
												<td><span class="opear"><a class="deff-text" href="javascript:void(0)" @click="transferopera('in',item)">{{Internationalization.transferIn}}</a></span><span class="opear"><a href="javascript:void(0)" @click="transferopera('out',item)">{{Internationalization.transferOut}}</a></span></td>
											</tr>
										</template>
									</template >
									<!--合约账户-->
									<co-manage v-if="accountTabClass === 'contract'" />
								</table>
							</div>
						</div>
					</div>
					<!--弹窗-->
					<!-- 实名验证弹窗提示 -->
			    <el-dialog 
			      :title='Internationalization.notice'
			      :flag='goRealnameDialog'
			      name= 'goRealnameDialog'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div class="mobileverify-text" slot="content">{{Internationalization.firstGoRealname}}</div>
			      <div slot="options">
			        <button @click="closeDialog('goRealnameDialog')">{{Internationalization.cancel}}</button>
			        <button @click="goRealname()">{{Internationalization.goRealname}}</button>
			      </div>
			    </el-dialog >
			    <el-dialog 
			      :title='Internationalization.notice'
			      :flag='setSafetyDialog'
			      name= 'setSafetyDialog'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div class="mobileverify-text" slot="content">{{Internationalization.needVerify}}</div>
			      <div slot="options">
			        <button @click="closeDialog('setSafetyDialog')">{{Internationalization.needVerify}}</button>
			        <button @click="setSafety()">{{Internationalization.setSafety}}</button>
			      </div>
			    </el-dialog >
					<!--提现-->
					<el-dialog 
			      :title='Internationalization.confirm_withdraw'
			      :flag='confirmWithdraw'
			      name= 'confirmWithdraw'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div slot="content">
			      	<ul class="infor-list">
								<li>{{Internationalization.money_withdraw}}: {{canWithdrawCon}}  {{coinSymbol}}</li>
								<li>{{Internationalization.feeWithdraw}}: {{feeWithdrawCon}}  {{coinSymbol}}</li>
								<li>{{Internationalization.actual}}: <s class="amount">{{amount}}</s>  {{coinSymbol}}</li>
								<li>
									<div v-for="(item, key) in formList" :key='key'>
						          		<inline-input 
						              		v-bind:property = "item"
						              		v-model = "item.value"
								            v-on:onevents = "somethings"> 
								         </inline-input>
							         </div>
						         </li>
							</ul>	
			      </div>
			      <div slot="options">
			        <button @click="closeDialog">{{Internationalization.cancel}}</button>
			        <button @click="withdrawConfirm">{{Internationalization.confirm}}</button>
			      </div>
			   </el-dialog >
					<!--<div class="remindDiv"  v-if="confirmWithdraw" >
						<div class="confirm-withdraw">
							<div class="title">
								<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
								<h6>{{Internationalization.confirm_withdraw}}</h6>
							</div>
							<ul class="infor-list">
								<li>{{Internationalization.money_withdraw}}: {{formData.canWithdraw.value}}  {{coinSymbol}}</li>
								<li>{{Internationalization.feeWithdraw}}: {{formData.feeWithdraw.value}}  {{coinSymbol}}</li>
								<li class="margin-bot">{{Internationalization.actual}}: <s class="amount">{{amount}}</s>  {{coinSymbol}}</li>
								<div v-for="(item, key) in formList" :key='key'>
								
			          <inline-input 
			              v-bind:property = "item"
			              v-model = "item.value"
			              v-on:onevents = "somethings"> 
			          </inline-input>
			          
			        </div>
			          <li class="error-note">{{errorInfo}}</li>
								<li class="last">
									<button class="cancel" @click="closeDialog">{{Internationalization.cancel}}</button>
									<button class="confirm" @click="withdrawConfirm">{{Internationalization.confirm}}</button>
								</li>
							</ul>
						</div>
					</div>-->
					<!--提现成功-->
					<el-dialog 
			      :title='Internationalization.wait_note'
			      :flag='successWithdraw'
			      name= 'successWithdraw'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div slot="content">
			      	<ul class="infor-list">
									<li>{{Internationalization.applyTime}}: {{successData.applyTime}}</li>
									<li>{{Internationalization.symbol}}: {{successData.coinSymbol}}</li>
									<li>{{Internationalization.actual}}: <span class="amount">{{successData.amount}}</span>{{successData.coinSymbol}}</li>
									<li>{{Internationalization.feeWithdraw}}: {{feeWithdrawCon}}{{coinSymbol}}</li>
									<li>{{Internationalization.withdraw_addr}}: {{successData.address}}({{successData.label}})</li>
							</ul>
			      </div>
			      <div slot="options">
			        <button @click="closeDialog">{{Internationalization.confirm}}</button>
			      </div>
			    </el-dialog >
					<!--<div class="remindDiv" v-if="successWithdrawa">
						<div class="confirm-withdraw">
							<div class="title">
								<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
								<h5> <i class="icon-checked "></i> {{Internationalization.wait_note}}</h5>
							</div>
							<ul class="infor-list">
									<li>{{Internationalization.applyTime}}: {{successData.applyTime}}</li>
									<li>{{Internationalization.symbol}}: {{successData.coinSymbol}}</li>
									<li>{{Internationalization.actual}}: <span class="amount">{{successData.amount}}</span>{{successData.coinSymbol}}</li>
									<li>{{Internationalization.feeWithdraw}}: {{formData.feeWithdraw.value}}{{coinSymbol}}</li>
									<li>{{Internationalization.withdraw_addr}}: {{successData.address}}({{successData.label}})</li>
							</ul>
						</div>
					</div>		-->					
					<!--转出-->
					<el-dialog 
			      :title='Internationalization.transfer'
			      :flag='transferout'
			      name= 'transferout'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div slot="content">
			      	<ul class="transfer-list transferOpe">
									<li><span>{{Internationalization.from}}</span><span class="current-acc">{{Internationalization.outside_acc}}</span></li>
									<li><span>{{Internationalization.into}}</span><span class="current-acc">{{Internationalization.transaction_acc}}</span></li>
									<li><span>{{Internationalization.transferOutAmount}}</span><input type="number" :placeholder="Internationalization.transferOutAmount" v-model="transferAmount"/><span>{{coinSymbol}}</span></li>
									<li><span class="usable-quantity"></span><div><i>{{Internationalization.canTransferOutAmount}}:</i><i>{{normal}}</i><a href="javascript:void(0)" @click="alltransfer(transferItem.normal)">{{Internationalization.allTransferOut}}</a></div></li>
									<li class="error-note">{{errorInfo}}</li>
								
							</ul>
			      </div>
			      <div slot="options">
			        <button @click="closeDialog">{{Internationalization.cancel}}</button>
			        <button @click="transfer('out')">{{Internationalization.confirm}}</button>
			      </div>
			    </el-dialog >
					<!--<div class="remindDiv" v-if="transferout">
						<div class="funds-transfer">
							<div class="title">
								<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
								<h6>{{Internationalization.transfer}}</h6>
							</div>
							<ul class="transfer-list transferOpe">
									<li><span>{{Internationalization.from}}</span><span class="current-acc">{{Internationalization.outside_acc}}</span></li>
									<li><span>{{Internationalization.into}}</span><span class="current-acc">{{Internationalization.transaction_acc}}</span></li>
									<li><span>{{Internationalization.transferOutAmount}}</span><input type="number" :placeholder="Internationalization.transferOutAmount" v-model="transferAmount"/><span>{{coinSymbol}}</span></li>
									<li><span class="usable-quantity"></span><div><i>{{Internationalization.canTransferOutAmount}}:</i><i>{{transferItem.normal}}</i><a href="javascript:void(0)" @click="alltransfer(transferItem.normal)">{{Internationalization.allTransferOut}}</a></div></li>
									<li class="error-note">{{errorInfo}}</li>
									<li class="last"><button class="confirm" @click="transfer('out')">{{Internationalization.confirm}}</button></li>
							</ul>
						</div>
						
					</div>-->
					<!--转入-->
					<el-dialog 
			      :title='Internationalization.transfer'
			      :flag='transferin'
			      name= 'transferin'
			      :width='450'
			      :dialogClose='closeDialog'>
			      <div slot="content">
			      	<ul class="transfer-list transferOpe">
									<li><span>{{Internationalization.from}}</span><span class="current-acc">{{Internationalization.transaction_acc}}</span></li>
									<li><span>{{Internationalization.into}}</span><span class="current-acc">{{Internationalization.outside_acc}}</span></li>
									<li><span>{{Internationalization.transferInAmount}}</span><input type="number" :placeholder="Internationalization.transferInAmount" v-model="transferAmount" /><span>{{coinSymbol}}</span></li>
									<li><span class="usable-quantity"></span><div><i>{{Internationalization.canTransferInAmount}}:</i><i>{{exchangeNormal}}</i><a href="javascript:void(0)" @click="alltransfer(transferItem.exchangeNormal)">{{Internationalization.allTransferIn}}</a></div></li>
									<li class="error-note">{{errorInfo}}</li>
							</ul>
			      </div>
			      <div slot="options">
			        <button @click="closeDialog">{{Internationalization.cancel}}</button>
			        <button @click="transfer('in')">{{Internationalization.confirm}}</button>
			      </div>
			    </el-dialog >
					<!--<div class="remindDiv"  v-if="transferin">
						<div class="funds-transfer">
							<div class="title">
								<a href="javascript:void(0)" class="close" @click="closeDialog">╳</a>
								<h6>{{Internationalization.transfer}}</h6>
							</div>
							<ul class="transfer-list transferOpe">
									<li><span>{{Internationalization.from}}</span><span class="current-acc">{{Internationalization.transaction_acc}}</span></li>
									<li><span>{{Internationalization.into}}</span><span class="current-acc">{{Internationalization.outside_acc}}</span></li>
									<li><span>{{Internationalization.transferInAmount}}</span><input type="number" :placeholder="Internationalization.transferInAmount" v-model="transferAmount" /><span>{{coinSymbol}}</span></li>
									<li><span class="usable-quantity"></span><div><i>{{Internationalization.canTransferInAmount}}:</i><i>{{transferItem.exchangeNormal}}</i><a href="javascript:void(0)" @click="alltransfer(transferItem.exchangeNormal)">{{Internationalization.allTransferIn}}</a></div></li>
									<li class="error-note">{{errorInfo}}</li>
									<li class="last"><button class="confirm" @click="transfer('in')">{{Internationalization.confirm}}</button></li>
							</ul>
						</div>
						
					</div>-->
					<i v-if="rate"></i>
					
				</div>
	 		 
		</div>
	</div>

</template>


<script>
import coManage from './co_funds_manage'
import { mapState } from 'vuex'
import elDialog from '@/components/common/dialog'
import VPagination from '@/components/common/pagination'
import InlineInput from '@/components/common/inlineInput'
import loadingModel from '@/components/common/loadingModel'
import HeaderTop from '@/components/module/header'
import FooterBottom from '@/components/module/footer'
import coinImg from '@/assets/img/coindef.png'
export default {
  name: 'fund-manage-content',
  data () {
    return {
      accountTabClass: 'transaction', // contract transaction
      setSafetyDialog: false,
      goRealnameDialog: false,
      accountList: [],
      totalBalance: null,
      totalBalanceSymbol: null,
      addressQRCode: null,
      addressStr: null,
      labelStr: null,
      items: null,
      coinSymbol: null,
      confirmWithdraw: false,
      formList: {},
      formData: {},
      successWithdraw: false,
      successData: {},
      transferout: false,
      transferin: false,
      transferAmount: null,
      transferItem: null,
      errorInfo: null,
      check: false,
      // CNY: null,
      type: 'transaction',
      showLoading: false,
      rechargeLoading: false,
      ajaxUrl: null,
      asyncData: null,
      amount: null,
      imgSrc: '',
      secondClick: true,
      canWithdrawCon: null,
      feeWithdrawCon: null,
      normal: null,
      exchangeNormal: null,
      labelShow: false,
      numberId: null,
      numberShow: false,
      thisIntervals: null,
      isOpenItemName: null,
      otherisopenItemName: null
    }
  },
  mounted () {
    this._P.fixUrl('type') && (this.type = this._P.fixUrl('type'))
    this.formList = this.formList_obj
    this.formData = this.formData_obj
    this.imgSrc = coinImg
  },
  components: {
    elDialog, VPagination, InlineInput, loadingModel, HeaderTop, FooterBottom, coManage
  },
  computed: {
    ...mapState({
      userinfo ({baseData: {_user}}) { // 用户信息
        return _user || false
      },
      coinlist ({baseData: {_coinList}}) { // 场外币种列表
        if (_coinList) {
          this.setIntervalFund()
        }
        return _coinList || false
      },
      otcOpen ({baseData: {otcOpen}}) { // 是否开启场外
        return otcOpen || false
      },
      contractOpen ({baseData: {contractOpen}}) { // 是否开启合约
        return contractOpen || false
      },
      rate ({baseData: {_rate}}) { // 汇率
        return _rate || false
      }
    }),
    // 折合总资产
    CNY () {
      return this._P.fixRate(this.totalBalance, this.rate, this.totalBalanceSymbol)
    },
    formList_obj () {
      let obj = {}
      if (this.userinfo.isOpenMobileCheck === 1) {
        Object.assign(obj, {
          smsAuthCode: {
            title: this.Internationalization.smsAuthCode,
            placeholder: this.Internationalization.smsAuthCode,
            formType: 'verifiCode',
            name: 'smsAuthCode',
            operationType: 13,
            startTime: false,
            data: [],
            value: null
          }
        })
      }
      if (this.userinfo.googleStatus === 1) {
        Object.assign(obj, {
          googleCode: {
            title: this.Internationalization.googleCode,
            placeholder: this.Internationalization.googleCode,
            formType: 'text',
            type: null,
            name: 'googleCode',
            value: null
          }
        })
      }
      return obj
    },
    formData_obj () {
      return {
        canWithdraw: {
          title: this.Internationalization.money_withdraw,
          placeholder: this.Internationalization.inputwithdraw,
          formType: 'number',
          name: 'canWithdraw',
          value: ''
        },
        feeWithdraw: {
          title: this.Internationalization.workerFeeWithdraw,
          placeholder: this.Internationalization.inputFeeWithdraw,
          formType: 'number',
          name: 'feeWithdraw',
          value: ''
        },
        addressList: {
          title: this.Internationalization.withdraw_addr,
          placeholder: this.Internationalization.changeWithdrawAddr,
          formType: 'select',
          name: 'addressList',
          value: '',
          optionList: [

          ]
        }
      }
    },
    // 场外币种列表
    otcCoinlist_arr () {
      let arr = []
      for (let i in this.coinlist) {
        if (this.coinlist[i].otcOpen === 1) {
          arr.push(this.coinlist[i])
        }
      }
      return arr
    },
    // 国际化
    Internationalization () {
      return {
        funds_manage: this.$t('fund.funds_manage'), // 资金管理
        finance_manage: this.$t('fund.finance_manage'), // 资金流水
        address_manage: this.$t('fund.address_manage'), // 地址管理
        transaction_acc: this.$t('fund.transaction_acc'), // 交易账户
        contract_acc: this.$t('fund.contract_acc'), // 合约账户
        outside_acc: this.$t('fund.outside_acc'), // 场外账户
        total_money: this.$t('fund.total_money'), // 总资产折合
        hidden_zero: this.$t('fund.hidden_zero'), // 资金管理
        symbol: this.$t('fund.symbol'), // 币种
        total: this.$t('fund.total'), // 总额
        usable: this.$t('fund.usable'), // 可用
        lock: this.$t('fund.lock'), // 冻结
        valuesBTC: this.$t('fund.values') + '(BTC)', // 资产折合（BTC）
        opera: this.$t('fund.opera'), // 操作
        deposit_addr: this.$t('fund.funds.deposit_addr'), // 充值地址
        deposit_notice: this.$t('fund.funds.deposit_notice'), // 充值须知
        copy_addr: this.$t('fund.funds.copy_addr'), // 复制地址
        add_addr: this.$t('fund.funds.add_addr'), // 添加地址
        canWithdraw: this.$t('fund.funds.canWithdraw'), // 可提现
        feeWithdraw: this.$t('fund.funds.feeWithdraw'), // 手续费
        workerFeeWithdraw: this.$t('fund.funds.workerFeeWithdraw'), // 矿工手续费
        inputFeeWithdraw: this.$t('fund.funds.inputFeeWithdraw'), // 请输入手续费
        withdraw_addr: this.$t('fund.funds.withdraw_addr'), // 提币地址
        changeWithdrawAddr: this.$t('fund.funds.changeWithdrawAddr'), // 请选择提币地址
        submit: this.$t('fund.funds.submit'), // 提交
        deposit: this.$t('fund.funds.deposit'), // 充值
        withdraw: this.$t('fund.funds.withdraw'), // 提现
        transferOut: this.$t('fund.funds.transferOut'), // 转出
        transferIn: this.$t('fund.funds.transferIn'), // 转入
        notice: this.$t('fund.notice'), // 提示
        firstGoRealname: this.$t('fund.firstGoRealname'), // 请先进行实名验证
        cancel: this.$t('fund.cancel'), // 取消
        confirm: this.$t('fund.confirm'), // 确认
        goRealname: this.$t('fund.goRealname'), // 去实名
        needVerify: this.$t('fund.needVerify'), // 手机谷歌验证至少需要一个
        setSafety: this.$t('fund.setSafety'), // 去验证
        confirm_withdraw: this.$t('fund.funds.confirm_withdraw'), // 确认提现
        money_withdraw: this.$t('fund.funds.money_withdraw'), // 提现金额
        min_withdraw: this.$t('fund.funds.min_withdraw'), // 最小提币额
        inputwithdraw: this.$t('fund.funds.inputwithdraw'), // 请输入提现金额
        actual: this.$t('fund.funds.actual'), // 实际到账
        wait_note: this.$t('fund.funds.wait_note'), // 提币申请已提交，请耐心等待
        applyTime: this.$t('fund.funds.applyTime'), // 申请时间
        transfer: this.$t('fund.funds.transfer'), // 资金划转
        from: this.$t('fund.funds.from'), // 从
        into: this.$t('fund.funds.into'), // 转入
        transferOutAmount: this.$t('fund.funds.transferOutAmount'), // 转出数量
        canTransferOutAmount: this.$t('fund.funds.canTransferOutAmount'), // 可转出数量
        allTransferOut: this.$t('fund.funds.allTransferOut'), // 全部转出
        transferInAmount: this.$t('fund.funds.transferInAmount'), // 转入数量
        canTransferInAmount: this.$t('fund.funds.canTransferInAmount'), // 可转入数量
        allTransferIn: this.$t('fund.funds.allTransferIn'), // 全部转入
        smsAuthCode: this.$t('fund.smsAuthCode'), // 手机验证码
        googleCode: this.$t('fund.googleCode'), // 谷歌验证码
        passCode: this.$t('fund.passCode'), // 验证码已发送
        copySuccess: this.$t('fund.copySuccess'), // 复制成功
        inputRightWithdraw: this.$t('fund.funds.inputRightWithdraw'), // 请输入正确的提现金额
        inputRightFee: this.$t('fund.funds.inputRightFee'), // 请输入正确的手续费
        inputRight: this.$t('fund.funds.inputRight'), // 请输入正确的
        notEnough: this.$t('fund.funds.notEnough'), // 可用余额不足
        withdrawLess_min: this.$t('fund.funds.withdrawLess_min'), // 提现金额小于最小提币额
        inputRightTransfer: this.$t('fund.funds.inputRightTransfer'), // 请输入正确的划转金额
        transferSuccess: this.$t('fund.funds.transferSuccess'), // 划转成功
        transferList: this.$t('fund.funds.transferList'), // 划转
        otherList: this.$t('fund.funds.otherList'), // 其他
        amount: this.$t('fund.amount'), // 数量
        status: this.$t('fund.status'), // 状态
        numberID: this.$t('fund.numberID'), // 数字ID
        copytag: this.$t('fund.funds.copy_tag')
      }
    }
  },
  watch: {
    transferAmount (val, oldval) {
      let newVal = val + ''
      let fixVal = newVal.split('.')[1]
      if (fixVal && fixVal.length > this.coinlist[this.coinSymbol].showPrecision) {
        this.$nextTick(() => {
          this.transferAmount = this._P.fixD(val, this.coinlist[this.coinSymbol].showPrecision)
        })
      }
    },
    '$store.state.baseData._lan' (v, oldval) {
      if (oldval) {
        this.accountTab(this.type)
      }
    },
    'userinfo' () {
      this.formList = this.formList_obj
    },
    'formList_obj' (val) {
      this.formList = val
    }
  },
  // 获取交易账户和场外账户信息列表
  methods: {
    // 关闭长轮询
    celarIntervalFun () {
      clearInterval(this.thisIntervals)
    },
    setIntervalFund () {
      clearInterval(this.thisIntervals)
      this.accountTab(this.type)
      this.thisIntervals = setInterval(() => {
        this.accountTab(this.type, true)
      }, 20000)
    },
    accountTab (type, noLoding) {
      let _this = this
      if (noLoding) {
        this.showLoading = false
      } else {
        this.showLoading = true
      }
      this.type = type
      this.check = false
      this.accountTabClass = type
      this.ajaxUrl = this.$store.state.url.fund.account_balance
      if (this.accountTabClass === 'Outside') {
        this.ajaxUrl = this.$store.state.url.fund.otc_account_list
      }
      setTimeout(function () {
        _this.getList()
      }, 300)
    },
    // 请求列表信息
    getList () {
      this.axios({
        url: this.ajaxUrl,
        headers: {},
        params: {},
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.showLoading = false
          this.asyncData = data
          this.accountList = data.data.allCoinMap
          this.setAccountList()
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 切换账户列表
    setAccountList () {
      if (!this.asyncData) return
      let data = JSON.parse(JSON.stringify(this.asyncData))
      if (this.accountTabClass === 'Outside') {
        for (let i in this.accountList) {
          if (i === this.isOpenItemName) {
            this.$set(this.accountList[i], 'isopen', true)
          }
          if (i === this.otherisopenItemName) {
            this.$set(this.accountList[i], 'otherisopen', true)
          }
          this.accountList[i].total_balance = this._P.fixD(this.accountList[i].total_balance, this.otcCoinlist_arr[i].showPrecision)
          this.accountList[i].normal = this._P.fixD(this.accountList[i].normal, this.otcCoinlist_arr[i].showPrecision)
          this.accountList[i].lock = this._P.fixD(this.accountList[i].lock, this.otcCoinlist_arr[i].showPrecision)
          this.accountList[i].btcValuation = this._P.fixD(this.accountList[i].btcValuation, this.coinlist['BTC'].showPrecision)
        }
      } else {
        for (let i in this.accountList) {
          if (i === this.isOpenItemName) {
            this.$set(this.accountList[i], 'isopen', true)
          }
          if (i === this.otherisopenItemName) {
            this.$set(this.accountList[i], 'otherisopen', true)
          }
          this.accountList[i].total_balance = this._P.fixD(this.accountList[i].total_balance, this.coinlist[i].showPrecision)
          this.accountList[i].normal_balance = this._P.fixD(this.accountList[i].normal_balance, this.coinlist[i].showPrecision)
          this.accountList[i].lock_balance = this._P.fixD(this.accountList[i].lock_balance, this.coinlist[i].showPrecision)
          this.accountList[i].btcValuatin = this._P.fixD(this.accountList[i].btcValuatin, this.coinlist['BTC'].showPrecision)
        }
      }
      this.totalBalance = data.data.totalBalance
      this.totalBalanceSymbol = data.data.totalBalanceSymbol
    },
    // 获取充值地址
    rechargeShow (item, operation) {
      let _this = this
      this.rechargeLoading = true
      this.showOrhidden(item, operation)
      this.coinSymbol = item
      if (this.coinSymbol === 'XRP' || this.coinSymbol === 'EOS') {
        this.labelShow = true
      } else {
        this.labelShow = false
      }
      let ajaxUrl = this.$store.state.url.fund.get_charge_address
      let data = {
        'symbol': item
      }
      setTimeout(function () {
        _this.axios({
          url: ajaxUrl,
          headers: {},
          params: data,
          method: 'post'
        }).then((data) => {
          if (data.code === '0') {
            _this.addressQRCode = data.data.addressQRCode
            if (item === 'XRP' || item === 'EOS') {
              let arr = data.data.addressStr.split('_')
              _this.addressStr = arr[0]
              _this.labelStr = arr[1]
            } else {
              _this.addressStr = data.data.addressStr
            }
            _this.rechargeLoading = false
          } else {
            _this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          }
        })
      }, 300)
    },
    // 获取提现信息
    withdrawShow (item, operation) {
      if (this.userinfo.isOpenMobileCheck !== 1 && this.userinfo.googleStatus !== 1) {
        this.setSafetyDialog = true
        return
      }
      let addList = []
      if (item === 'XRP' || item === 'EOS') {
        this.numberId = null
        this.numberShow = true
        for (let i in this.accountList[item].withdrawAddressMap) {
          let arr = this.accountList[item].withdrawAddressMap[i].address.split('_')
          let obj = {value: arr[0] + '(' + this.accountList[item].withdrawAddressMap[i].label + ')', code: this.accountList[item].withdrawAddressMap[i].id, numberId: arr[1]}
          addList.push(obj)
        }
      } else {
        this.numberShow = false
        for (let i in this.accountList[item].withdrawAddressMap) {
          let obj = {value: this.accountList[item].withdrawAddressMap[i].address + '(' + this.accountList[item].withdrawAddressMap[i].label + ')', code: this.accountList[item].withdrawAddressMap[i].id}
          addList.push(obj)
        }
      }

      // 提现 旷工手续费 默认是手续费范围的最小值
      this.formData.feeWithdraw.value = this.accountList[item]['feeMin']

      this.formData.addressList.optionList = addList
      this.formData.canWithdraw.placeholder = this.Internationalization.min_withdraw + this.accountList[item].withdraw_min
      this.coinSymbol = item
      this.showOrhidden(item, operation)
        // 清除错误信息
      for (let item in this.formData) {
        this.$set(this.formData[item], 'errorInfo', '')
      }
    },
    // 关闭弹窗
    closeDialog (e) {
      this.goRealnameDialog = false
      this.setSafetyDialog = false
      this.confirmWithdraw = false
      this.successWithdraw = false
      this.transferin = false
      this.transferout = false
      this.errorInfo = null
      this.transferAmount = null
      this.amount = null
      this.formData.canWithdraw.value = null
      this.formData.feeWithdraw.value = null
      this.formData.addressList.value = null
      if (this.userinfo.googleStatus === 1) {
        this.formList.googleCode.value = null
        this.formList.googleCode.errorInfo = null
      }
      if (this.userinfo.isOpenMobileCheck === 1) {
        this.formList.smsAuthCode.value = null
        this.formList.smsAuthCode.startTime = false
        this.formList.smsAuthCode.errorInfo = null
      }
    },
    // 实名验证
    goRealname () {
      if (this.userinfo.authLevel === 0 || this.userinfo.authLevel === 2) {
        this.$router.push('/personal')
      }
      if (this.userinfo.authLevel === 3) {
        this.$router.push('/personal/infoAttestation')
      }
    },
    // 安全设置
    setSafety () {
      this.$router.push('/personal')
    },
    // 充值提现框的显示隐藏
    showOrhidden (item, operation) {
      for (let i in this.accountList) {
        if (i === item) {
          if (operation === 'recharge') {
            if (this.accountList[i].isopen) {
              this.accountList[i].isopen = false
              this.isOpenItemName = null
            } else {
              if (this.accountList[i].otherisopen) {
                this.accountList[i].otherisopen = false
                this.otherisopenItemName = null
              }
              this.$set(this.accountList[i], 'isopen', true)
              this.isOpenItemName = item
            }
          } else {
            if (this.accountList[i].otherisopen) {
              this.accountList[i].otherisopen = false
              this.otherisopenItemName = null
            } else {
              if (this.accountList[i].isopen) {
                this.accountList[i].isopen = false
                this.isOpenItemName = null
              }
              this.$set(this.accountList[i], 'otherisopen', true)
              this.otherisopenItemName = item
            }
          }
        } else {
          if (this.accountList[i].isopen) {
            this.accountList[i].isopen = false
            this.isOpenItemName = null
          }
          if (this.accountList[i].otherisopen) {
            this.accountList[i].otherisopen = false
            this.otherisopenItemName = null
          }
        }
        if (this.accountList[i].otherisopen === false) {
          this.formData.canWithdraw.value = null
          this.formData.feeWithdraw.value = null
          this.formData.addressList.value = null
        }
      }
    },
    // 复制充值地址
    copyUrl () {
      this.$refs.inviteUrl[0].select()
      document.execCommand('copy')
      this.$store.dispatch('setTipState', this.Internationalization.copySuccess)
    },
    // 复制地址标签
    copyLabel () {
      this.$refs.labelId[0].select()
      document.execCommand('copy')
      this.$store.dispatch('setTipState', this.Internationalization.copySuccess)
    },
    // 确认提现弹窗
    submitWithdraw (coin) {
      let data = {}
      let fla = true
      for (let item in this.formData) {
        let canWithdraw = this.formData['canWithdraw'].value
        let feeWithdraw = this.formData['feeWithdraw'].value
        if (this.formData[item].name === 'canWithdraw') {
          if (parseFloat(canWithdraw) === 0) {
            this.$set(this.formData[item], 'errorInfo', this.Internationalization.inputRightWithdraw)
            fla = false
          }
          if (parseFloat(canWithdraw) > parseFloat(coin.normal_balance)) {
            this.$set(this.formData[item], 'errorInfo', this.Internationalization.notEnough)
            fla = false
          }
          if (this._P.fixD(parseFloat(canWithdraw) - parseFloat(feeWithdraw), this.coinlist[coin.coinName].showPrecision) < parseFloat(coin.withdraw_min)) {
            this.$set(this.formData[item], 'errorInfo', this.Internationalization.withdrawLess_min)
            fla = false
          }
          if (parseFloat(canWithdraw) <= parseFloat(feeWithdraw)) {
            this.$set(this.formData[item], 'errorInfo', this.Internationalization.inputRightWithdraw)
            fla = false
          }
        }
        if (this.formData[item].name === 'feeWithdraw') {
          if (coin.feeMax !== 0) {
            if (parseFloat(this.formData[item].value) < coin.feeMin || parseFloat(this.formData[item].value) > coin.feeMax) {
              this.$set(this.formData[item], 'errorInfo', this.Internationalization.inputRightFee)
              fla = false
            }
          }
        }
        if (this.formData[item].value !== undefined && !this.formData[item].value) {
          this.$set(this.formData[item], 'errorInfo', this.Internationalization.inputRight + this.formData[item].title)
          fla = false
        } else {
          data[item] = this.formData[item].value
        }
      }
      if (!fla) return false
      this.canWithdrawCon = this.formData['canWithdraw'].value
      this.feeWithdrawCon = this.formData['feeWithdraw'].value
      this.amount = this._P.fixD(this.canWithdrawCon - this.feeWithdrawCon, this.coinlist[coin.coinName].showPrecision)
      this.confirmWithdraw = true
    },
    // 下拉框选择
    somethings (value) {
      if (value.handleType === 'sendCode') {
        this.sendCode(value)
      }
      if (value.name === 'addressList') {
        this.numberId = value.value.numberId
      }
      // 输入框精度校验
      if (value.name === 'canWithdraw') {
        if (value.handleType === 'input') {
          let newVal = value.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > this.coinlist[this.coinSymbol].showPrecision) {
            this.$nextTick(() => {
              this.formData.canWithdraw.value = this._P.fixD(value.value, this.coinlist[this.coinSymbol].showPrecision)
            })
          }
        }
      }
      if (value.name === 'feeWithdraw') {
        if (value.handleType === 'input') {
          let newVal = value.value + ''
          let fixVal = newVal.split('.')[1]
          if (fixVal && fixVal.length > this.coinlist[this.coinSymbol].showPrecision) {
            this.$nextTick(() => {
              this.formData.feeWithdraw.value = this._P.fixD(value.value, this.coinlist[this.coinSymbol].showPrecision)
            })
          }
        }
      }
    },
    // 发送验证码
    sendCode (item) {
      let data = {}
      if (this.formList[item.name].startTime) return false
      data.operationType = this.formList[item.name].operationType
      this.formList[item.name].startTime = true // 开启倒计时
      this.commonHttp.smsValidCode(data).then((data) => {
        if (data.code === '0') {
          this.$store.dispatch('setTipState', this.Internationalization.passCode)
        } else {
          this.formList.smsAuthCode.startTime = false  // 关闭倒计时
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 确认提现
    withdrawConfirm () {
      let data = {
        'addressId': this.formData.addressList.value,
        'fee': this.formData.feeWithdraw.value,
        'amount': this.formData.canWithdraw.value - this.formData.feeWithdraw.value,
        'symbol': this.coinSymbol
      }
      let fla = true
      for (let item in this.formList) {
        if (this.formList[item].value !== undefined && !this.formList[item].value) {
          this.$set(this.formList[item], 'errorInfo', this.Internationalization.inputRight + this.formList[item].title)
          fla = false
        } else {
          data[item] = this.formList[item].value
        }
      }
      if (!fla) return false
      if (!this.secondClick) return false
      this.secondClick = false
      this.axios({
        url: this.$store.state.url.fund.doWithdraw,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.confirmWithdraw = false
          this.successWithdraw = true
          this.successData = data.data
          this.errorInfo = null
          this.accountTab('transaction')
          this.secondClick = true
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
          this.secondClick = true
        }
      })
    },
    // 划转弹窗参数
    transferopera (opera, item) {
      if (opera === 'in') {
        this.transferin = true
        this.transferItem = item
        this.exchangeNormal = this._P.fixD(this.transferItem.exchangeNormal, this.coinlist[item.coinSymbol].showPrecision)
        this.coinSymbol = item.coinSymbol
        this.$set(this.transferItem, 'fromAccount', 1)
        this.$set(this.transferItem, 'toAccount', 2)
      } else {
        this.transferout = true
        this.transferItem = item
        this.normal = this._P.fixD(this.transferItem.normal, this.coinlist[item.coinSymbol].showPrecision)
        this.coinSymbol = item.coinSymbol
        this.$set(this.transferItem, 'fromAccount', 2)
        this.$set(this.transferItem, 'toAccount', 1)
      }
    },
    // 划转
    transfer (opera) {
//    console.log(this.transferItem)
      if (!this.transferAmount) {
        this.errorInfo = this.Internationalization.inputRightTransfer
//    	this.$set(this.transferItem,'errorInfo', '请输入划转金额')
        return false
      }
      if (this.transferAmount === 0) {
        this.errorInfo = this.Internationalization.inputRightTransfer
//    	this.$set(this.transferItem,'errorInfo', '请输入划转金额')
        return false
      }
      if (opera === 'in') {
        if (parseFloat(this.transferAmount) > parseFloat(this.transferItem.exchangeNormal)) {
          this.errorInfo = this.Internationalization.notEnough
//    	this.$set(this.transferItem,'errorInfo', '可用余额不足')
          return false
        }
      } else {
        if (parseFloat(this.transferAmount) > parseFloat(this.transferItem.normal)) {
          this.errorInfo = this.Internationalization.notEnough
//    	this.$set(this.transferItem,'errorInfo', '可用余额不足')
          return false
        }
      }
      let data = {
        'fromAccount': this.transferItem.fromAccount,
        'toAccount': this.transferItem.toAccount,
        'amount': this.transferAmount,
        'coinSymbol': this.transferItem.coinSymbol
      }
      this.axios({
        url: this.$store.state.url.fund.otc_transfer,
        headers: {},
        params: data,
        method: 'post'
      }).then((data) => {
        if (data.code === '0') {
          this.transferout = false
          this.transferin = false
          this.$store.dispatch('setTipState', this.Internationalization.transferSuccess)
          this.errorInfo = null
          this.transferAmount = null
          this.errorInfo = null
          this.accountTab('Outside')
        } else {
          this.$store.dispatch('setTipState', {text: data.msg, type: 'error'})
        }
      })
    },
    // 全部划转
    alltransfer (alltransfer) {
      if (parseFloat(alltransfer) === 0) {
        this.errorInfo = this.Internationalization.notEnough
        return false
      }
      this.transferAmount = alltransfer
    },
    // 隐藏零资产
    checked () {
      if (!this.check) {
        for (let item in this.accountList) {
          this.$set(this.accountList[item], 'otherisopen', false)
          this.$set(this.accountList[item], 'isopen', false)
          this.isOpenItemName = null
          this.otherisopenItemName = null
          if (parseFloat(this.accountList[item].total_balance) === 0) {
            this.accountList[item].checked = false
          } else {
            this.accountList[item].checked = true
          }
          this.check = true
        }
      } else {
        for (let item in this.accountList) {
          this.accountList[item].checked = true
          this.$set(this.accountList[item], 'otherisopen', false)
          this.$set(this.accountList[item], 'isopen', false)
          this.isOpenItemName = null
          this.otherisopenItemName = null
        }
        this.check = false
      }
    },
    // 添加地址
    addAddress (item) {
      this.$router.push({path: '/funds/address_manage', query: {type: item.coinName}})
    }
  },
  beforeDestroy () {
    this.celarIntervalFun()
  }
}
</script>

<style scoped>
.addNotice{
	-webkit-animation: my 0.2s ease infinite;
	-moz-animation: my 0.2s ease infinite;
	animation: my 0.2s ease infinite;
}
@keyframes my{
	0%{margin-top:8px;}
50%{margin-top:10px;}
100%{margin-top:8px;}
}
.funds .funds-content table tr.rechargeShow td{
}
.funds .funds-content table tr.withdrawShow td{
	height: 190px;
}
</style>