<template>
    <div class="contact-card">
        <Row class="right-box clearfix header-common-right-box search-header">
            <Col style="float:left;" v-permission="[$route.path]">
                <p class="add-text-btn" v-if="!addFormCtrl && !readOnly" @click="addFormCtrl=true">
                    点击新增名片
                    <i class="icon-increase-01"></i>
                </p>
            </Col>
            <Col class="filter-col search-box">
                <Input v-model="searchForm.keyword" placeholder="姓名" style="width: 250px;" 
                        @on-enter="getData">
                    <Icon type="ios-search" slot="suffix" @click="getData" />
                </Input>
                <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                <div class="container" v-show="searchBoxCtrl">
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            亲密度
                        </Col>
                        <Col span="18">
                            <Select v-model="searchForm.starLevel" clearable style="width:190px;">
                                <Option v-for="item in starLevelArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                        <Button type="primary" size="small" @click="getData">确定</Button>
                        <Button size="small" @click="clearConditions">清空</Button>
                    </Row>
                </div>
            </Col>
        </Row>

        <!-- 新增记录表单 -->
        <Row class='plan-content-edit-form' v-if="addFormCtrl">
            <Row>
                <contact-card-form ref="addForm" :custId="id" @closeEdit="closeShow"></contact-card-form>
            </Row>
        </Row>

        <!-- 名片列表 -->
        <Row class="card-list-box clearfix">
            <!-- <Row v-for="(formItem,index) in formListItem" :key="index" :class="!formItem.isEdit?'card-block-item':'card-block-item card-block-edit-item'"> -->
            <Row v-for="(formItem,index) in formListItem" :key="index" class="card-block-item">
                <Row v-if="!formItem.isEdit" class="card-list-item">
                    <div class="card-header clearfix">
                        <img class="header-icon" src="./../../../../assets/images/card-01.png" alt="">
                        <div class="card-btn-box" v-permission="[$route.path]">
                            <i class="icon-edit-01" v-if="!readOnly" @click="editPlan(index)"></i>
                            <i class="icon-trash-01" v-if="!readOnly" @click="deletePlan(index)"></i>
                        </div>
                    </div>
                    <div class="card-content">
                        <Row class="card-center">
                            <p class="card-conten-name">{{formItem.name}}</p>
                            <Row>
                                <Rate v-model="formItem.starLevel" custom-icon="icon-star-01" :disabled="true"/>
                            </Row>
                        </Row>
                        <Row>
                            <Col span="12">
                                <Row class="card-content-item textover">
                                    <i class="icon-card-01"></i>
                                    <span>职务:</span>
                                    <span :title="formItem.position">{{formItem.position}}</span>
                                </Row>
                            </Col>
                            <Col span="12">
                                <Row class="card-content-item textover">
                                    <i class="icon-iPhone-01"></i>
                                    <span>手机号码:</span>
                                    <span :title="formItem.mobile">{{formItem.mobile}}</span>
                                </Row>
                            </Col>
                        </Row>
                        <Row class="card-content-item textover">
                            <i class="icon-mail-01"></i>
                            <span>邮箱:</span>
                            <span :title="formItem.email">{{formItem.email}}</span>
                        </Row>
                        <Row class="card-content-item textover">
                            <i class="icon-work-01"></i>
                            <span>备注信息:</span>
                            <span :title="formItem.remark">{{formItem.remark}}</span>
                        </Row>
                    </div>
                </Row>
                <Row v-if="formItem.isEdit">
                    <Row>
                        <contact-card-form :ref="'editForm'+index" :custId="id" :defaultData="formItem" @closeEdit="closeShow" :index="index"></contact-card-form>
                    </Row>
                </Row>
            </Row>
        </Row>

        <Modal
            v-model="delPlanCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">确认删除联系人吗？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :loading="delIng" @click="delFunc">确认</Button>
                <Button @click="delPlanCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import contactCardForm from "./contactCardForm";
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            addFormCtrl:false,
            mainColor:styles,
            delPlanCtrl:false,
            delIng:false,
            searchBoxCtrl:false,
            activeIndex:"",
            timeRange:[],
            searchForm:{
                custId:this.id,
                keyword:"",
                starLevel:""
            },
            planStateArr:[],
            formListItem:[],
            starLevelArr:[],


            keyWord:'',
            addCardBox:false,
            isEdit:false,
            formListItem:[],
            formItem:{
                remark:'',
                name:'',
                position:'',
                phone:'',
                eMail:''
            }
        }
    },
    props: ['id','readOnly'],
    methods: {
        getData(){
            let url = "/base/customer-contacts";
            this.$get(url,this.searchForm).then(res=>{
                if(res.code==0){
                    this.formListItem = res.data;
                    this.formListItem.forEach((item,index)=>{
                        item.isEdit = false;
                    });
                }
            })
        },
        // 清空筛选项
        clearConditions(){
            this.searchForm.keyword="";
            this.searchForm.starLevel = "";
            this.getData();
        },
        closeShow(index,bool){
            if(index || index==0){
                this.formListItem[index].isEdit = false;
                this.$set(this.formListItem, index, this.formListItem[index]);
            }else{
                this.addFormCtrl = false;
            }
            if(bool){
                this.getData();
            }
        },
        // 联系名片修改按钮
        editPlan(index){
            this.activeIndex = index;
            this.formListItem[index].isEdit = true;
            this.$set(this.formListItem, index, this.formListItem[index]);
        },
        // 联系名片删除按钮
        deletePlan(index){
            this.activeIndex = index;
            this.delPlanCtrl = true;
        },
        // 联系名片删除确认按钮
        delFunc(){
            let recordId = this.formListItem[this.activeIndex].id
            let url = `/base/customer-contact/${recordId}/remove`;
            this.delIng = true;
            this.$del(url).then(res=>{
                this.delIng = false;
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.getData();
                    this.delPlanCtrl = false;
                }else{
                    this.$Message.success(res.message);
                }
            })
        },
        // 获取字典数据接口
        async getDictionary(){
            this.starLevelArr = await this.common.getDictionaryItems('contact_star_level');
        },

        getkeyWord(){

        },
        addNewCard(){
            this.addCardBox = true;
        },
        editCard(index){
            this.card[index]['isEdit'] = true;
        }
    },
    created(){},
    beforeMount(){
        console.log(this.id);
    },
    activated:function(){
        
    },
    mounted(){
        this.getData();
        this.getDictionary();
    },
    updated(){},
    components: {
        contactCardForm
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
@import "./contactCard"
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