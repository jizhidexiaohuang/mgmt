<template>
    <div class="carry-out">
        <Row class="detail-header">
            <span>执行</span>
        </Row>
        <Row v-if="dataArr.length!=0 && isCarryOut" class="carry-out-list">
            <Row v-for="(item,index) in dataArr" class="carry-out-item" :key="index">
                <Row class="item-header">
                    <span>{{item.applyForTime}}</span>
                    <span>执行案号[ {{item.caseNumber}} ]</span>
                    <Tag style="border-radius:11px;" :color="getTagColor(item.enforceResult)">{{item.enforceResult?item.results[0].enforceResultName:"暂无执行结果"}}</Tag>
                </Row>
                <Row class="item-content">
                    <Row class="item-row">
                        <span class="item-label">受理费用</span>
                        <span class="item-text fee-text">{{common.formateNumber(item.acceptFee || "")}}</span>
                    </Row>
                    <Row v-if="item.enforceResult=='SR'">
                        <Row class="item-row">
                            <span class="item-label">终止执行日期</span>
                            <span class="item-text">{{item.results[0].terminationEnforceTime}}</span>
                        </Row>
                        <Row class="item-row">
                            <span class="item-label">终止执行原因</span>
                            <span class="item-text">{{item.results[0].reason}}</span>
                        </Row>
                    </Row>
                    <Row v-if="item.enforceResult=='NP'">
                        <Row class="item-row">
                            <span class="item-label">未到款原因</span>
                            <span class="item-text">{{item.results[0].reason}}</span>
                        </Row>
                    </Row>
                    <Row v-if="item.enforceResult=='AP'">
                        <Row class="item-row">
                            <span class="item-label">执行金额</span>
                            <span class="item-text fee-text">{{common.formateNumber(item.results[0].amount || "")}}</span>
                        </Row>
                        <Row class="item-row">
                            <span class="item-label">执行结果附件</span>
                            <span class="item-text">
                                <file-upload
                                    :size="50"
                                    :defaultList="item.results[0].attachments || []" 
                                    :uploadConfig="{readOnly:true}"></file-upload>
                            </span>
                        </Row>
                    </Row>
                    <Row class="item-row">
                        <span class="item-label">申请执行附件</span>
                        <span class="item-text">
                            <file-upload
                                :size="50"
                                :defaultList="item.attachments || []" 
                                :uploadConfig="{readOnly:true}"></file-upload>
                        </span>
                    </Row>
                </Row>
            </Row>
        </Row>
        <h3 v-if="dataArr.length==0" style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        <h3 v-if="!isCarryOut" style="text-align:center;">不需要执行</h3>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            addCtrl:false,
            activeData:"",
            dataArr:[]
        }
    },
    props: ['processId'],
    computed:{
        isCarryOut(){
            let bool = true;
            this.dataArr.forEach((item,index)=>{
                if(!item.isEnforce){
                    bool = false;
                    return
                }
            })
            return bool
        }
    },
    methods: {
        // 获取执行接口
        getData(){
            let url = '/business/case/enforces?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.dataArr = res.data || [];
                }
            });
        },
        getTagColor(state){
            if(!state){ return styles.labelColor }
            let colorObj = {
                "NP":styles.warningColor,
                "AP":styles.successColor,
                "SR":styles.errorColor,
            }
            if(state){ return colorObj[state] };
        }
    },
    created(){},
    beforeMount(){
        this.getData();
    },
    mounted(){
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '../caseCommon.scss';
@import "./carryOut.scss";
</style>
