<template>
    <div>
        <Row class="right-box clearfix header-common-right-box search-header">
            <Col style="float:left;" v-permission="[$route.path]">
                <p class="add-text-btn" v-if="!addFormCtrl && !readOnly" @click="addFormCtrl=true">
                    点击新增记录
                    <i class="icon-increase-01"></i>
                </p>
            </Col>
            <Col class="filter-col search-box">
                <Input v-model="searchForm.keyword" placeholder="跟进名称/跟进内容/跟进人员" style="width: 250px;" 
                        @on-enter="changePage(1)">
                    <Icon type="ios-search" slot="suffix" @click="changePage(1)" />
                </Input>
                <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                <div class="container" v-show="searchBoxCtrl">
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            关注程度
                        </Col>
                        <Col span="18">
                            <Select v-model="searchForm.starLevel" clearable style="width:190px;">
                                <Option v-for="item in starLevelArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            跟进时间
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
                    <Row class="header-common-right-box">
                        <Col span="6" class="header-common-col">
                            跟进方式
                        </Col>
                        <Col span="18">
                            <Select v-model="searchForm.vistType" style="width:190px;">
                                <Option v-for="item in visitTypeArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                            </Select>
                        </Col>
                    </Row>
                    <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                        <Button type="primary" size="small" @click="changePage(1)">确定</Button>
                        <Button size="small" @click="clearConditions">清空</Button>
                    </Row>
                </div>
            </Col>
        </Row>

        <!-- 内容区域 -->
        <Row class="plan-content-box follow-record-form">
            <Row class="plan-content-list-box">
                <!-- 新增记录表单 -->
                <Row class='plan-content-edit-form' v-if="addFormCtrl">
                    <Row>
                        <follow-record-form ref="addForm" :custId="id" @closeEdit="closeShow"></follow-record-form>
                    </Row>
                </Row>

                 <!-- 计划详情 -->
                <Row :class="!formItem.isEdit?'plan-content-detail':'plan-content-edit-form'" v-for="(formItem,index) in formListItem" :key="formItem.id">
                    <Row v-if="!formItem.isEdit">
                        <Row class="plan-content-header">
                            <i class="header-icon"></i>
                            <span class="header-title">{{formItem.visitName}}</span>
                            <div class="follow-record-img-list clearfix">
                                <div class="follow-record-img" v-for="(imgItem,index) in formItem.users" :key="index">
                                    <img v-if="imgItem.icon" :src="imgItem.icon" alt="">
                                    <span :class="[imgItem.icon?'has-img-span':'']" :title="imgItem.name">{{splitImgName(imgItem.name)}}</span>
                                </div>
                            </div>
                            <Row class="header-btn-box">
                                <Rate v-model="formItem.starLevel" custom-icon="icon-star-01" :disabled="true"/>
                                <Dropdown
                                    v-if="!readOnly"
                                    trigger="click" 
                                    style="margin-left: 10px" 
                                    placement="bottom-end" v-permission="[$route.path]">
                                    <a href="javascript:void(0)">
                                        <i class="icon-omitted-01"></i>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="edit" @click.native="editPlan(index)">编辑</DropdownItem>
                                        <DropdownItem name="delete" @click.native="deletePlan(index)">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Row>
                        </Row>
                        <Row class="plan-content-body">
                            <Row style="margin-bottom:14px;">
                                <Col span="8">
                                    <span class="plan-content-label left-label">跟进时间：</span>
                                    <span class="plan-content-text textoverOne">{{formItem.vistTimeStr}}</span>
                                </Col>
                                <Col span="8">
                                    <span class="plan-content-label left-label">跟进方式：</span>
                                    <span class="plan-content-text textoverOne">{{formItem.visitTypeName}}</span>
                                </Col>
                                <Col span="8">
                                    <span class="plan-content-label left-label">关联计划：</span>
                                    <span class="plan-content-text textoverOne">{{formItem.planName}}</span>
                                </Col>
                            </Row>
                            <Row style="margin-bottom:14px;">
                                <span class="plan-content-label left-label">跟进内容：</span>
                                <span class="plan-content-text textoverFour">{{formItem.note}}</span>
                            </Row>
                            <Row>
                                <span class="plan-content-label left-label">相关文件：</span>
                                <span class="plan-content-text">
                                    <file-upload 
                                        :defaultList="formItem.attachmentList || []" 
                                        :uploadConfig="uploadConfig"
                                        size="60"
                                    ></file-upload>
                                </span>
                            </Row>
                        </Row>
                    </Row>
                    <Row v-if="formItem.isEdit">
                        <Row>
                            <follow-record-form :ref="'editForm'+index" :custId="id" :recordId="formItem.id" @closeEdit="closeShow" :index="index"></follow-record-form>
                        </Row>
                    </Row>
                </Row>
            </Row>

            <Row style="margin-top:30px;text-align:center;">
                <Page :total="table.totalRecords" show-total
                size="small"
                :page-size-opts="config.pageSizeOpts"
                :page-size="config.pageSize"
                prev-text="上一页" next-text="下一页"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-sizer show-elevator />
            </Row>
        </Row>

        <Modal
            v-model="delPlanCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">确认删除这条跟进记录吗？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :loading="delIng" @click="delFunc">确认</Button>
                <Button @click="delPlanCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import followRecordForm from "./followRecordForm";
import fileUpload from "@/components/common/fileUpload/fileUpload";
import fileContainer from "@/components/common/fileContainer/fileContainer";
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
                visitStartDate:"",
                visitEndDate:"",
                starLevel:"",
                vistType:""
            },
            table:{
                current:1,
                totalRecords:0,
                size:10
            },
            planStateArr:[],
            formListItem:[],
            starLevelArr:[],
            visitTypeArr:[],
            uploadConfig:{
                readOnly:true
            },
        }
    },
    props: ['id','showRecordAdd','readOnly'],
    methods: {
        getData(){
            let url = "/base/customer-visit-record";
            let ajaxData = {
                current:this.table.current,
                size:this.table.size
            } 
            Object.assign(ajaxData,this.searchForm);
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.formListItem = res.data.records;
                    this.formListItem.forEach((item,index)=>{
                        item.isEdit = false;
                    })
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        changePage(page){
            this.table.current = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.size = size;
            this.getData();
        },
        getTime(date){
            this.searchForm.visitStartDate = date[0];
            this.searchForm.visitEndDate = date[1];
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
        // 清空筛选项
        clearConditions(){
            this.searchForm.state="";
            this.searchForm.keyword="";
            this.searchForm.visitEndDate="";
            this.searchForm.visitStartDate="";
            this.searchForm.starLevel = "";
            this.searchForm.vistType = "";
            this.timeRange = [];
            this.changePage(1);
        },
        // 计划详情修改按钮
        editPlan(index){
            this.activeIndex = index;
            this.formListItem[index].isEdit = true;
            this.$set(this.formListItem, index, this.formListItem[index]);
        },
        splitImgName(str){
            let start = str.length-2;
            let end = str.length;
            return str.substring(start,end)
        },
        // 计划详情删除按钮
        deletePlan(index){
            this.activeIndex = index;
            this.delPlanCtrl = true;
        },
        // 计划详情删除确认按钮
        delFunc(){
            let recordId = this.formListItem[this.activeIndex].id
            let url = `/base/customer-visit-record/${recordId}/remove`;
            this.delIng = true;
            this.$del(url).then(res=>{
                this.delIng = false;
                if(res.code==0){
                    this.table.current = 1;
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
            this.visitTypeArr = await this.common.getDictionaryItems('visit_type');
        },
    },
    created(){},
    beforeMount(){
    },
    mounted(){
        this.getDictionary();
        this.getData();
        if(this.showRecordAdd){
            this.addFormCtrl = true;
        }
    },
    activated(){
    },
    updated(){},
    components: {
        followRecordForm,
        fileUpload,
        fileContainer
    },
    watch: {
       
    }
}
</script>
<style lang="scss" scoped>
@import "./../communicationPlan/communicationPlan";
@import "./followRecord";
</style>
<style lang="scss">
@import "./../../../../assets/globalStyle";
.follow-record-form .ivu-rate{
    font-size: 12px;
    line-height: 15px;
    vertical-align: text-bottom;
}
.follow-record-form .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first, .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second{
    color: $globalMainColor!important;
}
</style>