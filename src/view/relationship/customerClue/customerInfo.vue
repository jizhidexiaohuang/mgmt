<template>
    <div>
        <Row class="detail-header">
            <span>线索信息</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">客户名称：</Col>
                <Col span="16" class="right-content">
                    <span>{{customerDetail.name}}</span>
                    <span class="icon-information-01" v-if="customerDetail.customerNature != 'P'" @click="openBusiness" :style="iconStyle"></span>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">客户性质：</Col><Col span="16" class="right-content">{{customerDetail.customerNatureName || ""}}</Col></Row>
            <Row v-if="customerDetail.customerNature!='P'"><Col span="5" class="left-label">法人代表：</Col><Col span="16" class="right-content">{{customerDetail.legalRepresentative || ""}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">{{customerDetail.customerNature=='P'?'身份证号':'信用代码'}}：</Col>
                <Col span="16" class="right-content">{{customerDetail.certificateNumber}}</Col>
            </Row>
            <Row><Col span="5" class="left-label">主营业务：</Col><Col span="16" class="right-content">{{customerDetail.business || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">所属区域：</Col><Col span="16" class="right-content">{{customerDetail.provinceName || ""}}{{customerDetail.cityName || ""}}{{customerDetail.areaName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">详细地址：</Col><Col span="16" class="right-content">{{customerDetail.address || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">所属行业：</Col><Col span="16" class="right-content">{{customerDetail.industryName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">客户来源：</Col><Col span="16" class="right-content">{{customerDetail.sourceName || ""}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>联系人信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">姓名：</Col><Col span="16" class="right-content">{{customerDetail.contact || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">固定电话：</Col><Col span="16" class="right-content">{{customerDetail.phone || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">手机号：</Col><Col span="16" class="right-content">{{customerDetail.mobile || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">邮箱号：</Col><Col span="16" class="right-content">{{customerDetail.email || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">职务：</Col><Col span="16" class="right-content">{{customerDetail.position || ""}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>备注信息</span>
        </Row>
        <Row class="detail-content time-padding-content">
            <Col span="5" class="left-label">备注信息：</Col>
            <Col span="16" class="right-content">
                <Row class="time-line-body">
                    <Timeline>
                        <TimelineItem v-for="(item,index) in remarkList" :key="index">
                            <Icon type="md-radio-button-off" size="14" :color="styles.globalMainColor" slot="dot"/>
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
import styles from '@/assets/globalStyle.scss';
import defaultIcon from "@/assets/images/card-02.png";
import businessInformation from "./../plugin/businessInformation/businessInformation";
export default {
    data () {
        return {
            defaultIcon:defaultIcon,
            remarkList:[],
            styles:styles,
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
    props: ['customerDetail'],
    methods: {
        openBusiness(){
            this.businessModal = true;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.remarkList = this.customerDetail.remark?JSON.parse(this.customerDetail.remark):[];
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
    watch: {
        customerDetail(newVal,oldVal){
            this.remarkList = newVal.remark?JSON.parse(newVal.remark):[]
        }
    }
}
</script>
