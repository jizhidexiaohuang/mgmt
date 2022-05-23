<template>
    <div>
        <Row class="detail-header">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">合同编号：</Col><Col span="16" class="right-content">{{defaultData.contractNo || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">合同名称：</Col><Col span="16" class="right-content">{{defaultData.name || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">合同类型：</Col><Col span="16" class="right-content">{{defaultData.typeName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">产品：</Col><Col span="16" class="right-content">{{defaultData.productName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">有效期：</Col><Col span="16" class="right-content">{{ (defaultData.startDateStr || "") + " - " + (defaultData.endDateStr || "") }}</Col></Row>
            <Row v-if="ifSign()">
                <Col span="5" class="left-label">签署时间：</Col><Col span="16" class="right-content">{{defaultData.signTime || ""}}</Col>
            </Row>
            <Row v-if="ifSign()">
                <Col span="5" class="left-label">签署地址：</Col><Col span="16" class="right-content">{{defaultData.provinceName || ""}}{{defaultData.cityName || ""}}{{defaultData.areaName || ""}}{{defaultData.signAddress || ""}}</Col>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>合同主体</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">甲方主体：</Col>
                <Col span="16" class="right-content">
                    <a href="javascript:void(0);" 
                    v-if="defaultData.firstPartyType=='C'" 
                    @click="openCustDetail(defaultData.firstParty,defaultData.firstPartyName)">
                        {{defaultData.firstPartyName}}
                    </a>
                    <span v-else>{{defaultData.firstPartyName}}</span>
                </Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">乙方主体：</Col>
                <Col span="16" class="right-content">
                    <a href="javascript:void(0);" 
                    v-if="defaultData.secondPartyType=='C'" 
                    @click="openCustDetail(defaultData.secondParty,defaultData.secondPartyName)">
                        {{defaultData.secondPartyName}}
                    </a>
                    <span v-else>{{defaultData.secondPartyName}}</span>
                </Col>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>合同文本</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">合同附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload 
                        :defaultList="contractFile || []" 
                        :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
        <Row class="detail-header" v-if="defaultData.state=='BE'||defaultData.state=='EX'||defaultData.state=='TE'">
            <span>已签署合同</span>
        </Row>
        <Row class="detail-content" v-if="defaultData.state=='BE'||defaultData.state=='EX'||defaultData.state=='TE'">
            <Row>
                <Col span="5" class="left-label">合同附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload 
                        :defaultList="signedContract || []" 
                        :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
        <Row class="audit-log-block">
            <Row class="time-line-header">
                <span>审核日志</span>
            </Row>
            <Row class="time-line-body">
                <Timeline>
                    <TimelineItem v-for="(item,index) in defaultData.contractNodeInfoList" :key="index">
                        <i :class="!renderColor(item.operation)?'icon-correct-01':'icon-down-01'" slot="dot"></i>
                        <Row class="line-content">
                            <img class="line-avatar" :src="item.icon || defaultIcon" alt="">
                            <Row class="line-right">
                                <span class="line-name">{{item.operatorName}}</span>
                                <span :class="{'tag':true,'error-tag':renderColor(item.operation)}">{{item.nodeName || ""}}-{{item.operationName || ""}}</span>
                                <span class="line-time">{{item.operationTime || ""}}</span>
                                <Row class="line-remark" v-if="item.operation=='2' || item.operation=='3'">
                                    <span class="line-left-label" v-if="item.operation=='2'">驳回原因：</span>
                                    <span class="line-left-label" v-if="item.operation=='3'">终止原因：</span>
                                    <span class="line-right-content">{{item.reason || ""}}</span>
                                </Row>
                            </Row>
                        </Row>
                    </TimelineItem>
                </Timeline>
            </Row>
        </Row>

        <!-- 客户资料抽屉 -->
        <Drawer 
            width="800" 
            v-model="customerDrawerCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">{{custName}}</div>
            <cust-manage v-if="customerDrawerCtrl" :id="id" :readOnly="true"></cust-manage>
        </Drawer>
    </div>
</template>
<script>
import styles from './../../assets/globalStyle.scss';
import fileUpload from '@/components/common/fileUpload/fileUpload';
import defaultIcon from "@/assets/images/card-02.png";
import custManage from "@/view/relationship/plugin/custManage.vue";
export default {
    data () {
        return {
            defaultList:[],
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:true
            },
            defaultIcon:defaultIcon,
            styles:styles,
            customerDrawerCtrl:false,
            tabsActive:"",
            id:"",
            custName:"",
            customerDetail:{},
            customerAccount:""
        }
    },
    computed:{
        contractFile(){
            let arr = [];
            if(!!!this.defaultData.attachmentList && !!!this.defaultData.docId) return
            if(this.defaultData.attachmentList==0 || this.defaultData.state=='BE' || this.defaultData.state=='EX' || this.defaultData.state=='TE'){
                let obj = {
                    mediaType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    fileName:"",
                    url:this.defaultData.docUrl
                }
                arr.push(obj);
                return arr
            }
            this.defaultData.attachmentList.forEach(item=>{
                if(item.mediaType.indexOf('.document')!=-1||item.mediaType.indexOf('msword')!=-1){
                    arr.push(item)
                }
            })
            return arr;
        },
        signedContract(){
            let arr = [];
            if(this.defaultData.attachmentList.length==0) return;
            this.defaultData.attachmentList.forEach(item=>{
                if(item.mediaType.indexOf('pdf')!=-1){
                    arr.push(item)
                }
            })
            return arr;
        }
    },
    props: ['defaultData'],
    methods: {
        ifSign(){
            let state = this.defaultData.state;
            if(state == "BE" || state == "EX" || state == "TE" || state == "TM"){
                return true
            }else{
                return false
            }
        },
        renderColor(operation){
            if(!operation){return false}
            let str = "time-line-icon";
            if(operation=="2" || operation=="3"){
                return true
            }else{
                return false
            }
        },
        //打开客户详情
        openCustDetail(id,name){
            console.log(id)
            this.id = id;
            this.custName = name;
            this.customerDrawerCtrl = true;
        },
        coopProgressState(data){
            let bool ;
            switch (true) {
                case (data=='P'||data=='I'): bool = false; break;
                case (data=='R'||data=='S'||data=='E'||data=='T'): bool = true; break;
            }
            return bool;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        fileUpload,
        custManage
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./contractInfo.scss";
@import "./../relationship/customerManage/drawerManage.scss";
</style>
<style lang="scss">
.body-drawer-style{
    .ivu-drawer-content{
        height:calc(100% - 97px);
        top:97px;
    }
}
</style>