<template>
    <div>
        <Row v-if="bussiness.category=='S'">
            <Row class="detail-content">
                <slot name='info-title'></slot>
                <Col :span="labelWidth" class="left-label">主体性质：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.property=='P'?'个人':(bussiness.property=='E'?'企业':'个体工商户')}}</Col>
                <Col :span="labelWidth" class="left-label">主体名称：</Col>
                <Col :span="contentWidth" class="right-content textover" :title="bussiness.name">{{bussiness.name}}</Col>

                <Col :span="labelWidth" class="left-label">主体标签：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.type=='E'?'经营主体':(bussiness.type=='B'?'开票主体':'POS机主体')}}</Col>
                <Col :span="labelWidth" class="left-label">{{bussiness.property=='P'?'身份证号':(bussiness.property=='E'?'信用代码':'信用代码')}}：</Col>
                <Col :span="contentWidth" class="right-content textover" :title="bussiness.legalRepresentative">
                    {{bussiness.creditCode || ""}}
                </Col>

                <Col :span="labelWidth" class="left-label" v-if="bussiness.property!='P'">{{bussiness.property=='E'?'法定代表人':'经营者'}}：</Col>
                <Col :span="contentWidth" class="right-content textover" v-if="bussiness.property!='P'" :title="bussiness.legalRepresentative">{{bussiness.legalRepresentative}}</Col>

                <Col :span="labelWidth" class="left-label">主体区域：</Col>
                <Col :span="contentWidth" class="right-content textover" 
                    :title="bussiness.provinceName+bussiness.cityName+bussiness.areaName">
                    {{bussiness.provinceName}} {{bussiness.cityName}} {{bussiness.areaName}}
                </Col>
                <Col :span="labelWidth" class="left-label">工商登记地址：</Col>
                <Col :span="contentWidth" class="right-content textover" :title="bussiness.address">{{bussiness.address}}</Col>
            </Row>
        </Row>
        <Row v-if="bussiness.category=='M'">
            <Row class="detail-content">
                <slot name='info-title'></slot>
                <Col :span="labelWidth" class="left-label">生产商名称：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.name || ""}}</Col>
                <Col :span="labelWidth" class="left-label">信用代码：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.creditCode || ""}}</Col>
                <Col :span="labelWidth" class="left-label">法定代表人：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.legalRepresentative || ""}}</Col>
                <Col :span="labelWidth" class="left-label">主体区域：</Col>
                <Col :span="contentWidth" class="right-content" :title="bussiness.provinceName+bussiness.cityName+bussiness.areaName">
                    {{bussiness.provinceName || ""}} {{bussiness.cityName || ""}} {{bussiness.areaName || ""}}
                </Col>
                <Col :span="labelWidth" class="left-label">工商登记地址：</Col>
                <Col :span="contentWidth" class="right-content">{{bussiness.address || ""}}</Col>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            bussiness:{},
            labelWidth:"3",
            contentWidth:"8",
        }
    },
    props:{
        defaultData:{
            type:Object,
            default(){
                return {}
            }
        },
        double:{
            type:Boolean,
            default:true
        }
    },
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){
        this.bussiness = this.defaultData;
        if(this.double){
            this.labelWidth="3";
            this.contentWidth="8";
        }else{
            this.labelWidth="5";
            this.contentWidth="16";
        }
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
