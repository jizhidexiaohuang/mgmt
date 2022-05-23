<template>
    <div>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">客户名称：</Col>
                <Col span="16" class="right-content">
                    <span>{{customerDetail.name}}</span>
                    <span class="icon-information-01" v-if="customerDetail.customerNature != 'P'" title="企业工商信息" @click="openBusiness" :style="iconStyle"></span>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">客户性质：</Col><Col span="16" class="right-content">{{customerDetail.customerNatureName}}</Col></Row>
            <Row v-if="customerDetail.customerNature=='E'">
                <Row><Col span="5" class="left-label">简称：</Col><Col span="16" class="right-content">{{customerDetail.abbreviation}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">公司logo：</Col>
                    <Col span="16" class="right-content">
                        <file-upload v-if="customerDetail.completeIcon"
                            :defaultList="[{url:customerDetail.completeIcon}]" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">公司介绍：</Col><Col span="16" class="right-content">{{customerDetail.introduce}}</Col></Row>
            </Row>
            <Row><Col span="5" class="left-label">客户等级：</Col><Col span="16" class="right-content">{{customerDetail.level}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">客户标签：</Col>
                <Col span="16" class="right-content">
                    <Tag :color="mainColor.globalMainColor" v-for="(item,index) in customerDetail.tags" class="cust-info-tag" :key="index" type="border">{{item}}</Tag>
                </Col>
            </Row>
            <Row v-if="customerDetail.customerNature!='P'">
                <Col span="5" class="left-label">法人代表：</Col>
                <Col span="16" class="right-content">{{customerDetail.legalRepresentative}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">{{customerDetail.customerNature=='P'?'身份证号':'信用代码'}}：</Col>
                <Col span="16" class="right-content">{{customerDetail.certificateNumber}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">经营范围：</Col><Col span="16" class="right-content">{{customerDetail.business}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">所属区域：</Col>
                <Col span="16" class="right-content">{{customerDetail.provinceName}}{{customerDetail.cityName&&customerDetail.cityName}}{{customerDetail.areaName}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">详细地址：</Col><Col span="16" class="right-content">{{customerDetail.address}}</Col></Row>
            <Row v-if="customerDetail.customerNature=='E'">
                <Row>
                    <Col span="5" class="left-label">实际所属区域：</Col>
                    <Col span="16" class="right-content">
                        {{customerDetail.actualProvinceName}}{{customerDetail.actualCityName&&customerDetail.actualCityName}}{{customerDetail.actualAreaName}}
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">实际联系地址：</Col><Col span="16" class="right-content">{{customerDetail.actualAddress}}</Col></Row>
                <Row><Col span="5" class="left-label">是否上市：</Col><Col span="16" class="right-content">{{customerDetail.isIpo=='1'?'是':'否'}}</Col></Row>
                <Row><Col span="5" class="left-label">行业地位：</Col><Col span="16" class="right-content">{{customerDetail.positionInIndustryName}}</Col></Row>
                <Row><Col span="5" class="left-label">运作方式：</Col><Col span="16" class="right-content">{{customerDetail.modeOfOperationName}}</Col></Row>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>业务信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">所属行业：</Col><Col span="16" class="right-content">{{customerDetail.industryName}}</Col></Row>
            <Row v-if="customerDetail.customerNature=='E'"><Col span="5" class="left-label">主营业务：</Col><Col span="16" class="right-content">{{customerDetail.mainBusiness}}</Col></Row>
            <Row><Col span="5" class="left-label">负责人：</Col><Col span="16" class="right-content">{{principalName}}</Col></Row>
            <Row><Col span="5" class="left-label">协作人：</Col><Col span="16" class="right-content">{{helperName}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>合作信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">客户来源：</Col><Col span="16" class="right-content">{{customerDetail.sourceName}}</Col></Row>
            <Row>
                <Col v-if="customerDetail.source=='C'" span="5" class="left-label">渠道商：</Col>
                <Col v-if="customerDetail.source=='C'" span="16" class="right-content">{{customerDetail.channeName}}</Col>
            </Row>
            <!-- <Row><Col span="5" class="left-label">合作模式：</Col><Col span="16" class="right-content">{{customerDetail.coopModeName}}</Col></Row> -->
        </Row>
        <Row class="detail-header" v-if="customerDetail.terminateReason">
            <span>终止信息</span>
        </Row>
        <Row class="detail-content time-padding-content" v-if="customerDetail.terminateReason">
            <Col span="5" class="left-label">终止信息：</Col>
            <Col span="16" class="right-content">
                <Row class="time-line-body">
                    <Timeline>
                        <TimelineItem v-for="(item,index) in terminateReason" :key="index">
                            <Icon type="md-radio-button-off" size="14" :color="mainColor.globalMainColor" slot="dot"/>
                            <Row class="line-content">
                                <img class="line-avatar" :src="item.icon || defaultIcon" alt="">
                                <Row class="line-right">
                                    <span class="line-name">{{item.creator || ""}}</span>
                                    <span class="line-time">{{item.time || ""}}</span>
                                    <Row class="line-remark">
                                        <span style="font-size:14px;">{{item.remark || ""}}</span>
                                    </Row>
                                </Row>
                            </Row>
                        </TimelineItem>
                    </Timeline>
                </Row>
            </Col>
        </Row>
        <Modal 
            v-model="businessModal" 
            width="80%"
            class="business-modal"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">工商信息</div>
            <div style="height:100%">
                <business-information :defaultObj="activeObj" v-if="businessModal"></business-information>
            </div>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import defaultIcon from "@/assets/images/card-02.png";
import businessInformation from "./../plugin/businessInformation/businessInformation";
export default {
    data () {
        return {
            defaultIcon:defaultIcon,
            mainColor:styles,
            businessModal:false,
            iconStyle:{
                fontSize:"16px",
                color:styles.globalMainColor,
                cursor:"pointer",
                verticalAlign:"text-bottom"
            },
            activeObj:""
        }
    },
    computed:{
        principalName(){
            return this.customerDetail.principalUser.length>0?this.customerDetail.principalUser[0].name:'';
        },
        helperName(){
            if(this.customerDetail.helperUser.length==0){return '';}
            let tempArr = this.customerDetail.helperUser.map(item=>{
                return item.name;
            });
            return tempArr.join('，');
        },
        terminateReason(){
            return this.customerDetail.terminateReason?JSON.parse(this.customerDetail.terminateReason):[]
        }
    },
    props: ['customerDetail'],
    methods: {
        openBusiness(){
            this.businessModal = true;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        if(this.customerDetail){
            this.activeObj = {
                creditCode:this.customerDetail.certificateNumber,
                name:this.customerDetail.name
            }
        }
    },
    updated(){},
    components: {
        businessInformation
    },
    watch: {}
}
</script>