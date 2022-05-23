<template>
    <div>
        <Row>
            <ul class="tabs-bar common-tabs-bar">
                <li :class="[tabsActive=='customerInfo'?'active':'']" @click="tabsActive='customerInfo';showRecordAdd=false;getDetail()">客户详情</li>
                <li :class="[tabsActive=='communicationPlan'?'active':'']" @click="tabsActive='communicationPlan';showRecordAdd=false">沟通计划</li>
                <li :class="[tabsActive=='followRecord'?'active':'']" @click="tabsActive='followRecord';showRecordAdd=false">跟进记录</li>
                <li :class="[tabsActive=='contractAward'?'active':'']" @click="tabsActive='contractAward';showRecordAdd=false">合同签约</li>
                <li :class="[tabsActive=='contactCard'?'active':'']" @click="tabsActive='contactCard';showRecordAdd=false">联系名片</li>
                <!-- <li :class="[tabsActive=='customerData'?'active':'']" @click="tabsActive='customerData'">客户数据</li> -->
                <li v-permission="[$route.path]" v-if="coopProgressState(detail.coopProgress)" :class="[tabsActive=='accountCard'?'active':'']" @click="tabsActive='accountCard';showRecordAdd=false">客户账号</li>
            </ul>
        </Row>
        <div class="manage-content">
            <!-- 客户详情 -->
            <Row v-if="tabsActive==='customerInfo'" class="info-tabs">
                <Row class="detail-header">
                    <span>基本信息</span>
                    <span v-if="!readOnly">
                        <span v-permission="[$route.path]" class="icon-edit-01 edit-icon"
                            v-if="!isEditDetail" @click="isEditDetail=true"></span>
                    </span>
                </Row>
                <channelInfo v-if="!isEditDetail&&tabsActive==='customerInfo'&&detail" :customerDetail="detail" v-on="$listeners"></channelInfo>
                <editChannel v-if="isEditDetail&&tabsActive==='customerInfo'" :customerDetail="detail" @changeEdit="getDetail"></editChannel>
            </Row>
            <!-- 沟通计划 -->
            <Row v-if="tabsActive==='communicationPlan'">
                <communication-plan :id="id" :readOnly="readOnly"></communication-plan>
            </Row>
            <!-- 跟进记录 -->
            <Row v-if="tabsActive==='followRecord'">
                <follow-record :id="id" :showRecordAdd="showRecordAdd" :readOnly="readOnly"></follow-record>
            </Row>
            <!-- 合同签约 -->
            <Row v-if="tabsActive==='contractAward'">
            <contract-award :id="id"></contract-award>
            </Row>
            <!-- 联系名片 -->
            <Row v-if="tabsActive==='contactCard'">
                <contact-card :id="id" :readOnly="readOnly"></contact-card>
            </Row>
            <!-- 客户数据 -->
            <Row v-if="tabsActive==='customerData'">
                <customer-data :id="id"></customer-data>
            </Row>
            <!-- 客户账号 -->
            <Row v-if="tabsActive==='accountCard'">
                <account-card :id="id" :customerAccount="detail.account" v-on="$listeners"></account-card>
            </Row>
        </div>
    </div>
</template>
<script>
import editChannel from "@/view/relationship/channelManage/channelForm";
import channelInfo from "@/view/relationship/channelManage/channelInfo";
import communicationPlan from "@/view/relationship/plugin/communicationPlan/communicationPlan";
import followRecord from "@/view/relationship/plugin/followRecord/followRecord";
import contractAward from "@/view/relationship/plugin/contractAward/contractAward";
import contactCard from "@/view/relationship/plugin/contactCard/contactCard";
import customerData from "@/view/relationship/plugin/customerData/customerData";
import accountCard from "@/view/relationship/plugin/accountCard/accountCard";
export default {
    data () {
        return {
            tabsActive:'customerInfo',
            isEditDetail:false,
            detail:'',
            showRecordAdd:false
        }
    },
    props:{
        id:{
            type:[String,Number]
        },
        editFlag:{
            type:Boolean,
            default:false
        },
        followFlag:{
            type:String,
            default:'customerInfo'
        },
        readOnly:{
           type:Boolean,
           default:false
        }
    },
    methods: {
        coopProgressState(data){
            let bool ;
            switch (true) {
                case (data=='P'||data=='I'): bool = false; break;
                case (data=='R'||data=='S'||data=='E'||data=='T'): bool = true; break;
            }
            if(this.readOnly){
                return false;
            }
            return bool;
        },
        getDetail(){
            let url = '/base/customer/'+this.id;
            return new Promise((resolve,reject)=>{
                this.$get(url).then(res=>{
                    if(res.code==0){
                        this.detail = res.data;
                        this.isEditDetail = false;
                        resolve(res.data)
                    }
                })
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getDetail().then(res=>{
            this.isEditDetail = this.editFlag;
        });
        this.tabsActive = this.followFlag || 'customerInfo';
        if(this.followFlag=='followRecord'){
            this.showRecordAdd = true;
        }
    },
    updated(){
        
    },
    components: {
        editChannel,
        channelInfo,
        communicationPlan,
        followRecord,
        contractAward,
        contactCard,
        customerData,
        accountCard,
    },
    watch: {
    }
}
</script>
<style lang="sass" scoped>
@import "../customerManage/drawerManage"
</style>
