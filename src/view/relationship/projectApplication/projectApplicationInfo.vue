<template>
    <div class="project-app-form">
        <Row class="step-box">
            <div class="step-icon-box" @click="toPrev(1)">
                <i class="icon-correct-01" :style="iconStyle"></i>
                <p>客户基本信息</p>
            </div>
            <div class="step-line">
                <i></i>
            </div>
            <div class="step-icon-box" @click="toNext(2)">
                <i class="icon-correct-01" :style="iconStyle"></i>
                <p>知产与调研信息</p>
            </div>
            <!-- <div class="step-line">
                <i></i>
            </div>
            <div class="step-icon-box" @click="toNext(3)">
                <i class="icon-correct-01" v-if="projectDetail.state=='E'" :style="iconStyle"></i>
                <i class="icon-down-01" v-else-if="projectDetail.state=='R'||projectDetail.state=='T'" :style="iconErrorStyle"></i>
                <i class="icon-error-01" v-else></i>
                <i class="icon-down-01" v-if="false"></i>
                <p>{{projectState}}</p>
            </div> -->
        </Row>
        <!-- 第一步申请 start -->
        <Row v-show="step==1">
            <Row class="detail-header">
                <span>基本信息</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">客户名称</Col>
                    <Col span="16" class="right-content textover" :title="custDetail.name || ''">{{custDetail.name || ""}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">客户标签</Col>
                    <Col span="16" class="right-content">
                        <Tag :color="mainColor.globalMainColor" v-for="(item,index) in custDetail.tags" class="cust-info-tag" :key="index" type="border">{{item}}</Tag>
                    </Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">客户性质</Col>
                    <Col span="16" class="right-content textover" :title="custDetail.customerNatureName || ''">{{custDetail.customerNatureName || ""}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">所属区域</Col>
                    <Col span="16" class="right-content textover" :title="(custDetail.provinceName || '')+(custDetail.cityName || '')+(custDetail.areaName || '')">{{custDetail.provinceName || ''}}{{custDetail.cityName || ''}}{{custDetail.areaName || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">客户等级</Col>
                    <Col span="16" class="right-content textover" :title="custDetail.level || ''">{{custDetail.level || ''}}</Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>客户需求</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">主要产品</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.product || ''">{{projectDetail.product || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">自有品牌情况</Col>
                    <Col span="16" class="right-content textover">{{projectDetail.brandCondition || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">授权品牌情况</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.brandAuthCondition || ''">{{projectDetail.brandAuthCondition || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">代工贴牌情况</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.brandOemCondition || ''">{{projectDetail.brandOemCondition || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">正品销售渠道</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.salesChannelName || ''">{{projectDetail.salesChannelName || ''}}</Col>
                </Row>
                <Row v-if="projectDetail.salesChannel.indexOf('Other')!=-1">
                    <Col span="5" class="left-label">渠道备注信息</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.salesChannelRemark || ''">{{projectDetail.salesChannelRemark || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">维权态度</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.attitudeName || ''">{{projectDetail.attitudeName || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">诉求</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.appealName || ''">{{projectDetail.appealName || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">流程管控要求</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.procedureControllRequirement || ''">{{projectDetail.procedureControllRequirement || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">主要权利</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.mainRightName || ''">{{projectDetail.mainRightName || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">主要权利备注</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.mainRightRemark || ''">{{projectDetail.mainRightRemark || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">授权情况</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.authorizationScope || ''">{{projectDetail.authorizationScope || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">鉴假方法</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.identificationMethod || ''">{{projectDetail.identificationMethod || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">调查取证要求</Col>
                    <Col span="16" class="right-content">{{location}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">其他维权代理商</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.otherAgentScope || ''">{{projectDetail.otherAgentScope || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">居间授权/加盟/许可需求</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.cooperateRequirement || ''">{{projectDetail.cooperateRequirement || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">对客户的承诺</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.promise || ''">{{projectDetail.promise || ''}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">其它要求</Col>
                    <Col span="16" class="right-content textover" :title="projectDetail.otherRequirement || ''">{{projectDetail.otherRequirement || ''}}</Col>
                </Row>
            </Row>
            <!-- <Row class="detail-header">
                <span>客户方案</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">附件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload 
                            :defaultList="projectDetail.programAttachmentList || []" 
                            :uploadConfig="uploadConfig"></file-upload>
                    </Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>建议书</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">附件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload 
                            :defaultList="projectDetail.proposalAttachmentList || []" 
                            :uploadConfig="uploadConfig"></file-upload>
                    </Col>
                </Row>
            </Row> -->
        </Row>
        <!-- 第一步申请 end -->
        <!-- 第二步可行性分析 start -->
        <Row v-show="step==2">
            <Row class="detail-header">
                <span>知产情况</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">知名商标</Col>
                    <Col span="16" class="right-content">
                        <Tag :color="mainColor.globalMainColor" v-for="(item,index) in projectDetail.custTrademarkList" class="cust-info-tag" :key="index" type="border">{{item}}</Tag>
                    </Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>线上店铺调研</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">关键字</Col>
                    <Col span="16" class="right-content textover">{{projectDetail.onlineKeyword || ''}}</Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>线下店铺调研</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">是否有线下店铺检索信息</Col>
                    <Col span="16" class="right-content textover">{{projectDetail.isShopSearch=='1'?'是':'否'}}</Col>
                </Row>
                <Row>
                    <Col span="5" class="left-label">关键字</Col>
                    <Col span="16" class="right-content textover">{{projectDetail.offlineKeyword || ''}}</Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>添加案例</span>
            </Row>
            <Row class="detail-content">
                <Row v-for="(item,index) in projectDetail.opportunitiesCaseRelationList" :key="index">
                    <Col span="5" class="left-label">案例{{index+1}}</Col>
                    <Col span="16" class="right-content textover">
                        <Row>{{item.name || ''}}</Row>
                    </Col>
                </Row>
            </Row>
            <Row class="detail-header">
                <span>项目建议书</span>
            </Row>
            <Row class="detail-content">
                <Row>
                    <Col span="5" class="left-label">附件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload 
                            :defaultList="projectDetail.proposalAttachmentList || []" 
                            :uploadConfig="uploadConfig"></file-upload>
                    </Col>
                </Row>
            </Row>
        </Row>
        <!-- 第二步可行性分析 end -->
        <Row v-show="step==3" v-if="false">
            <Row class="detail-header">
                <span>审核信息</span>
            </Row>
            <Row class="detail-content time-padding-content">
                <Row>
                    <Col span="5" class="left-label">审核信息</Col>
                    <Col span="16" class="right-content">
                        <Row class="time-line-body">
                            <Timeline>
                                <TimelineItem v-for="(item,index) in remarkList" :key="index">
                                    <i class="icon-correct-01" v-if="item.state=='E'" :style="[{'color':mainColor.successColor},{'fontSize':'14px'}]" slot="dot"></i>
                                    <i class="icon-down-01" v-else :style="[iconErrorStyle,{'fontSize':'14px'}]" slot="dot"></i>
                                    <Row class="line-content">
                                        <img class="line-avatar" :src="item.icon || defaultIcon" alt="">
                                        <Row class="line-right">
                                            <span class="line-name">{{item.creator || ""}}</span>
                                            <span v-if="item.state=='E'" class="tag">审核通过</span>
                                            <span v-else-if="item.state=='R'" class="tag error-tag">审核驳回</span>
                                            <span v-else-if="item.state=='T'" class="tag error-tag">终止</span>
                                            <span class="line-time">{{item.time || ""}}</span>
                                            <Row class="line-remark">
                                                <span class="line-right-content">{{item.remark || ""}}</span>
                                            </Row>
                                        </Row>
                                    </Row>
                                </TimelineItem>
                            </Timeline>
                        </Row>
                    </Col>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import defaultIcon from "@/assets/images/card-02.png";
export default {
    data () {
        return {
            mainColor:styles,
            iconStyle:{
                color:styles.globalMainColor
            },
            iconErrorStyle:{
                color:styles.errorColor
            },
            step:1,
            uploadConfig:{
                readOnly:true
            },
            custDetail:'',
            contractList:[],
            defaultIcon:defaultIcon
        }
    },
    computed:{
        projectState(){
            switch (this.projectDetail.state){
                case 'P':return '待审核';break;
                case 'E':return '通过';break;
                case 'R':return '驳回';break;
                case 'T':return '终止';break;
                default:return '草稿';break;
            }
        },
        location(){
            if(this.projectDetail.locationList==false){
                return '全国';
            }
            let location = [],json={};
            this.projectDetail.locationList.forEach(item=>{
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
            return location.join('，');
        },
        remarkList(){
            if(this.projectDetail.auditResult){
                let arr = JSON.parse(this.projectDetail.auditResult) || [];
                if(this.projectDetail.state=="T"){
                    let obj = {
                        creator:this.projectDetail.terminateUserName,
                        remark:this.projectDetail.terminateReason,
                        time:this.projectDetail.terminateTimeStr,
                        state:"T"
                    }
                    arr.push(obj);
                }
                return arr
            }
        }
    },
    props: ['projectDetail','id'],
    methods: {
        toPrev(page){
            this.step = page;
        },
        toNext(page){
            if(page===3 && this.projectDetail.state=="D"){return}
            this.step = page;
        },
        getCustInfo(){
            let url = '/base/customer/'+this.projectDetail.custId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.custDetail = res.data;
                }
            })
        },
        getContractList(){
            let url = `/base/contract/${this.projectDetail.custId}/info`;
            this.$get(url).then(res=>{
                if(res.code===0 && res.data && res.data.length!=0){
                    this.contractList = res.data;
                }
            })
        }
    },
    created(){},
    beforeMount(){
        
    },
    mounted(){
        this.getCustInfo();
        this.getContractList();
    },
    updated(){},
    components: {},
    watch: {
        
    }
}
</script>
<style lang="scss" scoped>
@import "./step.scss";
</style>
