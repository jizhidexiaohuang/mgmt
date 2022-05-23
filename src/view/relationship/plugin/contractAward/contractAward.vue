<template>
    <div class="contact-card">
        <Row class="right-box clearfix header-common-right-box search-header" v-if="false">
            <Col class="filter-col search-box">
                <Input v-model="searchForm.keyword" placeholder="关键字" style="width: 250px;" 
                        @on-enter="getData">
                    <Icon type="ios-search" slot="suffix" @click="getData" />
                </Input>
                <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                <div class="container" v-show="searchBoxCtrl">
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            合同类型
                        </Col>
                        <Col span="18">
                            <Select v-model="searchForm.contractType" clearable style="width:190px;">
                                <Option v-for="item in contractTypeArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            有效期
                        </Col>
                        <Col span="18">
                            <DatePicker 
                                type="daterange" 
                                placement="bottom-start" 
                                placeholder="日期" 
                                style="width:190px"
                                v-model="timeRange"
                                @on-change="getTime"></DatePicker>
                        </Col>
                    </Row>
                    <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                        <Button type="primary" size="small" @click="getData">确定</Button>
                        <Button size="small" @click="clearConditions">清空</Button>
                    </Row>
                </div>
            </Col>
        </Row>

        <!-- 名片列表 -->
        <Row class="card-list-box clearfix">
            <Row v-for="(formItem,index) in formListItem" :key="index" class="card-block-item">
                <Row class="card-list-item">
                    <div :class="['card-header' ,'clearfix',{'invalid-state': !contractStateCtrl(formItem.state)}]">
                        <span class="textover contract-title" :title="formItem.contractNo + '-' + formItem.name">{{formItem.contractNo}} - {{formItem.name}}</span>
                        <Tag :style="contractState" type="border" 
                            :color="contractStateCtrl(formItem.state)?mainColor.successColor:mainColor.errorColor">{{formItem.stateName}}</Tag>
                    </div>
                    <div class="card-content">
                        <Row class="card-content-item textover">
                            <span>合同期限:</span>
                            <span :title="formItem.position">{{formItem.startDateStr}}---{{formItem.endDateStr}}</span>
                        </Row>
                        <Row class="card-content-item textover">
                            <span>合同类型:</span>
                            <span :title="formItem.position">{{formItem.typeName}}</span>
                        </Row>
                        <Row class="card-content-item textover">
                            <span>合同附件：</span>
                            <span class="plan-content-text">
                                <file-upload 
                                    :defaultList="formItem.attachmentList || []" 
                                    :uploadConfig="uploadConfig"
                                    size="60"
                                ></file-upload>
                            </span>
                        </Row>
                    </div>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            mainColor:styles,
            searchBoxCtrl:false,
            searchForm:{
                custId:this.id,
                keyword:"",
                contractType:""
            },
            contractTypeArr:[],
            keyWord:'',
            formListItem:[],
            formItem:{
                remark:'',
                name:'',
                position:'',
                phone:'',
                eMail:''
            },
            timeRange:[],
            uploadConfig:{
                readOnly:true
            },
            contractState:{
                float:'right',
                marginTop:'10px',
                borderRadius:'11px'
            }
        }
    },
    props: ['id'],
    methods: {
        getData(){
            let url = `/base/contract/${this.id}/signed`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.formListItem = res.data;
                    for(let i=0;i<this.formListItem.length;i++){
                        this.formListItem[i].attachmentList = this.formListItem[i].attachmentList.filter(file=>{
                            return (file.mediaType.indexOf('pdf')!==-1) && file
                        })
                        console.log(this.formListItem[i].attachmentList)
                        if(this.formListItem[i].attachmentList.length==0){
                            this.formListItem.splice(i,1);
                            i--;
                        }
                    }
                }
            })
        },
        contractStateCtrl(state){
            if(state=='BE'||state=='TE'){
                return true;
            }else if(state=='EX'||state=='TM'){
                return false;
            }else{
                return false;
            }
        },
        // 清空筛选项
        clearConditions(){
            this.searchForm.keyword="";
            this.searchForm.contractType = "";
            this.timeRange = [];
            this.getData();
        },
        // 获取字典数据接口
        async getDictionary(){
            this.contractTypeArr = await this.common.getDictionaryItems('contract_type');
        },
        getTime(date){
            this.searchForm.visitStartDate = date[0];
            this.searchForm.visitEndDate = date[1];
        },
    },
    created(){},
    beforeMount(){
        console.log(this.id);
    },
    activated:function(){
        
    },
    mounted(){
        this.getData();
        // this.getDictionary();
    },
    updated(){},
    components: {
        
    },
    watch: {
       
    }
}
</script>
<style lang="scss">
.card-box .ivu-form-item{
    margin-bottom:0;
}
</style>
<style lang="sass" scoped>
@import "./../communicationPlan/communicationPlan"
@import "./contractAward"
</style>
<style lang="scss">
@import "./../../../../assets/globalStyle";
.contact-card .ivu-rate{
    font-size: 12px;
    line-height: 15px;
    vertical-align: text-bottom;
}
.contact-card .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first, .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second{
    color: $globalMainColor!important;
}
</style>