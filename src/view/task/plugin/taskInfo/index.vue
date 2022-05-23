<template>
    <div style="height:100%;">
        <!-- 任务详情 -->
        <Row class="header-detail detail-content" id="header-detail">
            <Row><Col span="3" class="left-label">所属项目：</Col><Col span="20" class="right-content">{{taskDetail.projName}}</Col></Row>
            <Row>
                <Col span="3" class="left-label">调查区域：</Col>
                <Col span="20" class="right-content">
                    <fold-block 
                        :text="locationList" 
                        :maxNum="4"
                        placement="bottom"
                        :width="470"></fold-block>
                </Col>
            </Row>
            <Row><Col span="3" class="left-label">任务编号：</Col><Col span="20" class="right-content">{{taskDetail.code}}</Col></Row>
            <Row>
                <Col span="3" class="left-label">指派团队：</Col>
                <Col span="20" class="right-content">
                    <fold-block 
                        :text="licensorList" 
                        :maxNum="4"
                        placement="bottom"
                        :width="470"></fold-block>
                </Col>
            </Row>
            <Row>
                <Col span="3" class="left-label">接受团队：</Col>
                <Col span="20" class="right-content">
                    <fold-block 
                        :text="accepterList" 
                        :maxNum="4"
                        placement="bottom"
                        :width="470"></fold-block>
                </Col>
            </Row>
            <Row><Col span="3" class="left-label">任务备注：</Col><Col span="20" class="right-content">{{taskDetail.remark}}</Col></Row>
        </Row>
        <Row>
            <ul class="tabs-bar clearfix">
                <li :class="[tabsName=='taskDetail'?'active':'','flexWidth']" @click="tabsName='taskDetail'">任务详情</li>
                <li :class="[tabsName=='taskResult'?'active':'','flexWidth']" @click="tabsName='taskResult'" v-if="isShowTable">线索列表</li>
                <li :class="[tabsName=='lawyerAgreement'?'active':'','flexWidth']" @click="tabsName='lawyerAgreement'">律师协议</li>
                <li :class="[tabsName=='investAgreement'?'active':'','flexWidth']" @click="tabsName='investAgreement'">调查协议</li>
                <li :class="[tabsName=='projectConfig'?'active':'','flexWidth']" @click="tabsName='projectConfig'">测购配置</li>
            </ul>
        </Row>
        <task-detail :calcheight="detailHeight" :taskDetail="taskDetail" v-if="tabsName=='taskDetail'"></task-detail>
        <!-- 任务结果 -->
        <Row v-if="tabsName=='taskResult' && isShowTable">
            <task-result :id="taskDetail.id"></task-result>
        </Row>
        <Row v-if="tabsName=='lawyerAgreement'" style="padding:10px;">
            <task-lawyer-price-info :id="taskDetail.id"></task-lawyer-price-info>
        </Row>
        <Row v-if="tabsName=='investAgreement'" style="padding:10px;">
            <task-invest-price-info :id="taskDetail.id"></task-invest-price-info>
        </Row>
        <Row v-if="tabsName=='projectConfig'">
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">是否需要测购：</Col><Col span="16" class="right-content">{{configData.isTestPurchase?"是":"否"}}</Col></Row>
                <Row v-if="configData.isTestPurchase">
                    <Row><Col span="5" class="left-label">是否需要邮寄：</Col><Col span="16" class="right-content">{{configData.isMailingSample?"是":"否"}}</Col></Row>
                    <Row v-if="configData.isMailingSample"><Col span="5" class="left-label">商品邮寄给：</Col><Col span="16" class="right-content">{{configData.merchandiseMailing=="C"?"客户":"安盾"}}</Col></Row>
                    <Row v-if="configData.isMailingSample"><Col span="5" class="left-label">地址：</Col><Col span="16" class="right-content">{{configData.address || ""}}</Col></Row>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
import taskDetail from "../taskDetail/index.vue";
import taskResult from "./../taskResult/index.vue";
import taskLawyerPriceInfo from "../taskLawyerPriceInfo/index.vue";
import taskInvestPriceInfo from "../taskInvestPriceInfo/index.vue";
export default {
    data () {
        return {
            tabsName:"taskDetail",
            configData:""
        }
    },
    props: [
        "detailHeight",
        "isShowTable",       //是否展示任务结果以及接受团队
        "taskDetail"
    ],
    computed:{
        accepterList(){
            if(!this.taskDetail.accepterList || this.taskDetail.accepterList.length==0) return ;
            return this.taskDetail.accepterList.map(item=>{
                return item.teamName
            }).join(',')
        },
        licensorList(){
            if(!this.taskDetail.licensorList || this.taskDetail.licensorList.length==0) return ;
            return this.taskDetail.licensorList.map(item=>{
                return item.teamName
            }).join(',')
        },
        locationList(){
            if(this.taskDetail.missionScope==='N'){
                return this.taskDetail.missionScopeZh
            }else{
                let location = [],json={};
                this.taskDetail.locationList.forEach(item=>{
                    if(item.flag){
                        if(!json[item.province]){
                            json[item.province] = item.provinceName;
                        }
                    }else{
                        location.push(item.cityName)
                    }
                })
                for(let key in json){
                    location.push(json[key]);
                }
                return location.join(',')
            }
        }
    },
    methods:{
        // 获取项目测购配置
        getPojectConfig(){
            let url = `/business/test-purchase-config/${this.taskDetail.projId}`;
            this.$get(url).then(res=>{
                if(res.code===0){
                    if(res.data){
                        this.configData = res.data;
                    }
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getPojectConfig();
    },
    mounted(){},
    activated(){},
    updated(){},
    components: {
        taskDetail,
        taskResult,
        taskLawyerPriceInfo,
        taskInvestPriceInfo
    },
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./taskInfo.scss"
</style>

