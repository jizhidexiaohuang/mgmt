<template>
    <div>
        <Row v-if="custAgreementDetail">
            <Row class="detail-header">
                <span>客户协议信息</span>
                <Dropdown @on-click="option($event)" style="position: absolute;right: 15px;top: 10px;">
                    <a href="javascript:void(0)">
                        历史协议
                        <Icon type="ios-arrow-down"></Icon>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-for="item in agreementList" :key="item.id" :name="item.id">有效期：{{item.date}}</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </Row>
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">协议名称：</Col><Col span="16" class="right-content">{{data.name || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">客户名称：</Col><Col span="16" class="right-content">{{data.customerName || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">产品名称：</Col><Col span="16" class="right-content">{{data.productName || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">描述：</Col><Col span="16" class="right-content">{{data.remark || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">有效期：</Col><Col span="16" class="right-content">{{`${data.startDateStr || ""}-${data.endDateStr || ""}`}}</Col></Row>
                <Row><Col span="5" class="left-label">协议状态：</Col><Col span="16" class="right-content">{{data.stateName || ""}}</Col></Row>
            </Row>
            <Row class="detail-header">
                <span>结算规则</span>
            </Row>
            <Row class="detail-content">
                <Row class="detail-form-block">
                    <Row class="detail-form-item">
                        <Row class="block-header">成本费用</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">成本费用：</Col><Col span="16" class="right-content">{{costFee}}</Col></Row>
                            <Row v-if="data.costType == 'F'"><Col span="5" class="left-label">固定金额：</Col><Col span="16" class="right-content">{{common.formateNumber(data.fixedAmount || "")}}</Col></Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">分成比例</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">分成比例：</Col><Col span="16" class="right-content">{{data.ratioType=="P"?"累进比例":"固定比例"}}</Col></Row>
                        </Row>
                        <Row class="block-content block-info-content">
                            <Row class="block-content-title">
                                <Row>
                                    <div class="title-begin">金额下限</div>
                                    <div class="title-end">金额上限</div>
                                    <div class="title-proportion">比例</div>
                                </Row>
                            </Row>
                            <Row v-for="(item,index) in data.agreementPriceRatioCustList" :label-width="0" :key="index">
                                <Row class="fee-loop-list" style="margin-bottom:0px;padding:4px 10px">
                                    <Row class="fee-loop-content">
                                        <div class="fee-loop-begin">
                                            {{common.formateNumber(item.minAmount)}}
                                        </div>
                                        <div class="fee-loop-end">
                                            {{item.maxAmount?common.formateNumber(item.maxAmount):"无"}}
                                        </div>
                                        <div class="fee-loop-proportion">
                                            {{`${item.ratio}%`}}
                                        </div>
                                    </Row>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">安盾终止报酬</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">客户终止报酬：</Col><Col span="16" class="right-content">{{data.terminationIsFixedAmount?"固定成本":"分段收费"}}</Col></Row>
                            <Row v-if="data.terminationIsFixedAmount">
                                <Col span="5" class="left-label">固定金额：</Col><Col span="16" class="right-content">{{common.formateNumber(data.terminationFixedAmount)}}</Col>
                            </Row>
                            <Row v-else>
                                <Row>
                                    <Col span="5" class="left-label">未起诉：</Col><Col span="16" class="right-content">{{common.formateNumber(data.terminationNotSuedFixAmount)}}</Col>
                                </Row>
                                <Row>
                                    <Col span="5" class="left-label">已起诉：</Col>
                                    <Col span="16" class="right-content">
                                        {{data.terminationSuedRatio?`${data.terminationSuedRatio}%`:common.formateNumber(data.terminationSuedFixedAmount)}}
                                    </Col>
                                </Row>
                            </Row>
                        </Row>
                    </Row>
                    <Row class="detail-form-item">
                        <Row class="block-header">诉讼退费归属</Row>
                        <Row class="block-content">
                            <Row><Col span="5" class="left-label">诉讼退费归属：</Col><Col span="16" class="right-content">{{data.litigationRefundOwner=="A"?"安盾":"客户"}}</Col></Row>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>
        <Row v-if="!custAgreementDetail">
            <p style="width:100%;font-size:20px;line-height:100px;text-align:center">暂无数据</p>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            agreementList:[], // 客户协议历史
            data: {},
            id:''
        }
    },
    props: ['custAgreementDetail'],
    methods: {
        // 获取客户协议历史数据
        getAgreementList(){
            this.agreementList = []
            this.data.agreementPriceCustVOList.forEach(item => {
                this.agreementList.push({
                    id: item.id,
                    date: `${item.startDate}-${item.endDate}`
                })
            })
        },
        // 根据协议历史获取详情
        getAgreementDetail(){
            let url = '/settlement/agreement/'+this.id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.data = res.data;
                    this.getAgreementList()
                }
            })
        },
        option(name){
            this.id = name
            this.getAgreementDetail()
        }
    },
    created(){
        this.data = Object.assign({}, this.custAgreementDetail)
    },
    beforeMount(){},
    mounted(){
        if(this.custAgreementDetail) {
            this.getAgreementList()
        }
    },
    updated(){},
    computed:{},
    computed:{
        costFee(){
            let costType = this.data?this.data.costType:"";
            let str = "";
            switch(costType){
                case "F":
                    str = "固定成本";
                break;
                case "A":
                    str = "实际成本";
                break;
                case "N":
                    str = "无成本";
                break;
            }
            return str
        }
    },
    components: {},
    watch: {}
}
</script>
<style lang="scss">
@import "./lawyerAgreementForm.scss";
</style>
