<template>
    <div>
        <Row class="plan-content-box">
            <!-- 搜索 -->
            <Row class="right-box clearfix header-common-right-box search-header">
                <Col style="float:left;" v-permission="[$route.path]">
                    <p class="add-text-btn" v-if="!addFormCtrl && !readOnly" @click="addFormCtrl=true">
                        点击新增计划
                        <i class="icon-increase-01"></i>
                    </p>
                </Col>
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="计划名称/计划内容/提醒人员" style="width: 250px;" 
                            @on-enter="changePage(1)">
                        <Icon type="ios-search" slot="suffix" @click="changePage(1)" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                计划时间
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
                                计划状态
                            </Col>
                            <Col span="18">
                               <Select v-model="searchForm.state" style="width:190px;">
                                    <Option v-for="item in planStateArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
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
            <Row class="plan-content-list-box">
                <Row class='plan-content-edit-form' v-if="addFormCtrl">
                    <Row>
                        <plan-form ref="addForm" :custId="id" @closeEdit="closeShow"></plan-form>
                    </Row>
                </Row>

                <!-- 计划详情 -->
                <Row :class="!formItem.isEdit?'plan-content-detail':'plan-content-edit-form'" v-for="(formItem,index) in formListItem" :key="formItem.id">
                    <Row v-if="!formItem.isEdit">
                        <Row class="plan-content-header">
                            <i class="header-icon"></i>
                            <span class="header-title">{{formItem.name}}</span>
                            <Row class="header-btn-box">
                                <Tag color="error" v-if="formItem.state=='P'" type="border" style="border-radius: 11px;">进行中</Tag>
                                <Tag color="success" v-if="formItem.state=='E'" type="border" style="border-radius: 11px;">已完成</Tag>
                                <Dropdown 
                                    v-if="!readOnly"
                                    style="margin-left: 10px" 
                                    placement="bottom-end" v-permission="[$route.path]">
                                    <a href="javascript:void(0)">
                                        <i class="icon-omitted-01"></i>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="edit" v-if="formItem.state=='P'" @click.native="editPlan(index)">编辑</DropdownItem>
                                        <DropdownItem name="finish" v-if="formItem.state=='P'" @click.native="finishPlan(index)">完成</DropdownItem>
                                        <DropdownItem name="delete" @click.native="deletePlan(index)">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Row>
                        </Row>
                        <Row class="plan-content-body">
                            <Row style="margin-bottom:14px;">
                                <Col span="12">
                                    <span class="plan-content-label left-label">计划时间：</span>
                                    <span class="plan-content-text textoverOne">{{formItem.startTimeStr}}至{{formItem.endTimeStr}}</span>
                                </Col>
                                <Col span="12">
                                    <span class="plan-content-label left-label">提醒人员：</span>
                                    <span class="plan-content-text textoverOne">
                                        <fold-block 
                                            :text="formItem.remindUser" 
                                            :maxNum="3"
                                            unit="人"
                                            ></fold-block>
                                    </span>
                                </Col>
                            </Row>
                            <Row>
                                <span class="plan-content-label left-label">计划内容：</span>
                                <span class="plan-content-text textoverFour">{{formItem.content}}</span>
                            </Row>
                        </Row>
                    </Row>
                    <Row v-if="formItem.isEdit">
                        <Row>
                            <plan-form :ref="'editForm'+index" :custId="id" :planId="formItem.id" @closeEdit="closeShow" :index="index"></plan-form>
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
        </Row>

        <Modal
            v-model="finishPlanCtrl"
            title="转为跟进记录"
            :width="700"
            :footer-hide="true">
            <follow-record-form ref="addForm" 
                v-if="planId" 
                :transferPlanId="planId" 
                :custId="id" 
                @closeTransfer="closeTransfer" 
                :isFromPlan="true"
                ></follow-record-form>                                                                                                                                                                            
        </Modal>

        <Modal
            v-model="delPlanCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">确认删除这条沟通计划吗？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :loading="delIng" @click="delFunc">确认</Button>
                <Button @click="delPlanCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import planForm from "./planForm";
import followRecordForm from "./../followRecord/followRecordForm";
export default {
    data () {
        return {
            addFormCtrl:false,
            mainColor:styles,
            delPlanCtrl:false,
            delIng:false,
            searchBoxCtrl:false,
            finishPlanCtrl:false,
            activeIndex:"",
            planId:"",
            timeRange:[],
            searchForm:{
                custId:this.id,
                state:"",
                keyword:"",
                endTime:"",
                startTime:""
            },
            table:{
                current:1,
                totalRecords:0,
                size:10
            },
            planStateArr:[],
            formListItem:[],
            finishData:{
                renderMetionArr:[],
                vistUserIds:[]
            }
        }
    },
    props: ['id','readOnly'],
    methods: {
        getData(){
            let url = "/base/customer-plans";
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
            this.searchForm.startTime = date[0];
            this.searchForm.endTime = date[1];
        },
        // 计划详情修改按钮
        editPlan(index){
            this.activeIndex = index;
            this.formListItem[index].isEdit = true;
            this.$set(this.formListItem, index, this.formListItem[index]);
        },
        // 计划详情删除按钮
        deletePlan(index){
            this.activeIndex = index;
            this.delPlanCtrl = true;
        },
        // 计划详情删除确认按钮
        delFunc(){
            let planId = this.formListItem[this.activeIndex].id;
            let url = `/base/customer-plan/${planId}/remove`;
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
        // 计划完成按钮
        finishPlan(index){
            this.activeIndex = index;
            this.finishPlanCtrl = true;
            this.planId = this.formListItem[index].id;
        },
        // 清空筛选项
        clearConditions(){
            this.searchForm.state="";
            this.searchForm.keyword="";
            this.searchForm.endTime="";
            this.searchForm.startTime="";
            this.timeRange = [];
            this.changePage(1);
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
        closeTransfer(bool){
            if(true){
                this.getData();
            }
            this.finishPlanCtrl = false;
        },
        // 获取字典数据接口
        async getDictionary(){
            this.planStateArr = await this.common.getDictionaryItems('plan_state');
        }
    },
    created(){},
    beforeMount(){
    },
    mounted(){
        this.getData();
        this.getDictionary();
    },
    activated(){
    },
    updated(){},
    components: {
        planForm,
        followRecordForm
    },
    watch: {
       
    }
}
</script>
<style lang="sass" scoped>
@import "./communicationPlan"
</style>
