<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <!-- <Button type="primary" @click="createTask">创建任务</Button> -->
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="任务名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                客户
                            </Col>
                            <Col span="18">
                                <mySelect ref="distributorSelect"
                                    :path="'/base/customers'"
                                    :placeholder="'请选择客户'"
                                    :params="{type:'G'}"
                                    :keyName="'name'"
                                    :inputKey="'name'"
                                    @getValue="getCustomerId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                            <Button type="primary" size="small" @click="reloadTable">确定</Button>
                            <Button size="small" @click="clearConditions">清空</Button>
                        </Row>
                    </div>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" 
                :loading="tableLoading">
                <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row.id,$event)" v-permission="['mission:audit-']">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="publish" v-show="getMissionState(row.state,'publish')">发布</DropdownItem>
                            <DropdownItem name="reject" v-show="getMissionState(row.state,'reject')">驳回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
                </Table>
            </Row>
            <Row style="margin-top:30px;text-align:center;">
                <Page :total="table.totalRecords" show-total
                    size="small"
                    :current="table.pageNum"
                    :page-size-opts="config.pageSizeOpts"
                    :page-size="config.pageSize"
                    prev-text="上一页" next-text="下一页"
                    @on-change="changePage"
                    @on-page-size-change="changeSize"
                    show-sizer show-elevator />
            </Row>
        </div>

        <!-- 线索任务详情 -->
        <Drawer 
            width="700" 
            v-model="drawerCtrl"
            @on-visible-change="getDetailHeight"
            :styles="{padding:'0px 0px 10px 0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}"
            >
            <div slot="header" class="drawer-title">
                <span>{{(!isEdit && !isInfo)?'新增任务':taskDetail.name}}</span>
                <Dropdown transfer @on-click="option(taskDetail.id,$event)" class="edit-icon" v-if="isInfo" v-permission="['mission:audit-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="publish" v-show="getMissionState(taskDetail.state,'publish')">发布</DropdownItem>
                        <DropdownItem name="reject" v-show="getMissionState(taskDetail.state,'reject')">驳回</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <task-info v-if="isInfo && drawerCtrl" :detailHeight="detailHeight" :taskDetail="taskDetail" :isShowTable="true"></task-info>
            <task-form v-if="!isInfo && drawerCtrl" @closeDrawer="changeCtrl" :taskDetail="taskDetail"></task-form>
        </Drawer>

        <!-- 删除任务 -->
        <Modal
            v-model="confirmCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{title}}此任务？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        
         <!-- 驳回modal -->
        <Modal
            v-model="rejectCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate">
                <Row class="modal-tips" v-if="!delayCtrl">请问是否确认{{title}}此任务？</Row>
                <FormItem label="" prop="reason" v-if="!delayCtrl"
                    :rules="[{required: true, message: '请填写'+title+'原因', trigger: 'blur'},
                            { max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="title+'原因(不超过512个字符)'"></Input>
                </FormItem>
                <FormItem label="截止日期" prop="date" v-if="delayCtrl"
                    :rules="[{required: true, message: '请选择截止日期', trigger: 'blur'}]">
                    <DatePicker type="date" @on-change="getDate" placement="bottom-end" placeholder="请选择截止日期"></DatePicker>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import taskInfo from "./plugin/taskInfo/index.vue"
import taskForm from "./myTask/taskForm.vue"

import { setTimeout } from 'timers';
import { valid } from 'semver';
export default {
    data () {
        return {
            id:'',
            searchForm:{
                keyword:'',
                customerId:'',
            },
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"任务名称",
                    key:"name",
                    width:140,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.opportunitiesNo
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getTaskDetail(params.row.id,'info')
                                }
                            }
                        },params.row.name);
                        return dom
                    }
                },
                {
                    title:"调查区域",
                    key:"missionScopeZh",
                    render:(h,params)=>{
                        if(params.row.missionScope==='N'){
                            return h('span',params.row.missionScopeZh)
                        }else{
                            let location = [],json={};
                            params.row.locationList.forEach(item=>{
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
                            return h('span',{
                                class:'textover',
                                attrs:{
                                    title:location.join('，')
                                }
                            },location.join('，'))
                        }
                    }
                },
                {
                    title:"项目名称",
                    key:"projName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projName
                            },
                        },params.row.projName)
                    }
                },
                {
                    title:"截止日期",
                    key:"endDate"
                },
                {
                    title:'任务类型',
                    key:'missionTypeZh',
                    width:100
                },
                {
                    title:"线索数量",
                    key:"clueNum"
                },
                {
                    title:"接单数量",
                    key:"acceptNum"
                },
                {
                    title:"任务状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='DT':color = 'globalMainColor';break;
                            case state=='BR':color = 'warningColor';break;
                            case state=='RD':color = 'successColor';break;
                            case state=='RT':color = 'errorColor';break;
                            case (state=='PE'||state=='OT'||state=='ED'):color = 'expireColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateZh,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateZh)
                    }
                },
                {
                    title:'负责人',
                    key:'managerName'
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            drawerCtrl:false,
            detailHeight:"",
            isEdit:false,
            isInfo:false,
            taskDetail:'',
            type:'',
            confirmCtrl:false,
            title:'',
            rejectCtrl:false,
            delayCtrl:false,
            formValidate:{
                reason:'',
                date:''
            }
        }
    },
    props: [''],
    methods: {
        getMissionState(state,name){
            switch (name) {
                case 'publish':
                    return ['DT','BR'].indexOf(state)!=-1?true:false;
                    break;
                case 'reject':
                    return state==='BR'?true:false;
                    break;
                case 'close':
                    return state==='RD'?true:false;
                    break;
                case 'open':
                    return state==='PE'?true:false;
                    break;
                case 'delay':
                    return state==='OT'?true:false;
                    break;
            }
        },
        //获取数据
        getData(){
            let url = '/business/missions';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                queryType:'B'
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
            //刷新任务待审核总数徽标
            this.$store.dispatch('getMissionCount');
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.customerId = "";
            this.$refs.distributorSelect.clearSelected();
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(id,name){
            this.id = id;
            this.type = name;
            this.$refs['formValidate'].resetFields();
            switch (true) {
                case (name==='edit'): 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getTaskDetail(id,'edit');
                    break;
                case (name==='delete'||name==='open'||name==='publish'):
                    this.confirmCtrl = true;
                    this.title = name==='delete'?'删除':(name==='open'?'开启':'发布');
                    break;
                case (name==='reject'||name==='close'||name==='delay'):
                    this.rejectCtrl = true;
                    this.delayCtrl = name==='delay'?true:false;
                    this.title = name==='reject'?'驳回':(name==='close'?'关闭':'延期');
                    break;
            }
        },
        agreeSubmit(){
            let url;
            if(this.type=='delete'){
                url = '/business/mission/'+this.id;
                this.$del(url).then(res=>{
                    if(res.code==0){
                        this.confirmCtrl = false;
                        this.$Message.success('操作成功！');
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else if(this.type==='publish'||this.type==='open'){
                url = this.type==='publish'?'/business/mission/audit':'/business/mission/open';
                this.$patch(url,{missionId:this.id}).then(res=>{
                    if(res.code==0){
                        this.confirmCtrl = false;
                        this.$Message.success('操作成功！');
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
                
            }
        },
        handleSubmit(name){
            let url;
            let ajaxData = {
                missionId:this.id,
            }
            if(this.type=='reject'||this.type=='close'){
                url = this.type==='reject'?"/business/mission/reject":'/business/mission/close';
                ajaxData.remark = this.formValidate.reason;
            }else if(this.type=='delay'){
                url = '/business/mission/delay';
                ajaxData.endDate = this.formValidate.date;
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.rejectCtrl = false;
                            this.$Message.success('操作成功！');
                            this.reloadTable();
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        getDate(value){
            this.formValidate.date = value;
        },
        /*------------操作End-------------*/
        //关闭侧边栏
        changeCtrl(isReload){
            this.drawerCtrl = false;
            if(isReload){
                this.reloadTable();
            }
        },
        //获取委托人
        getCustomerId(data){
            this.searchForm.customerId = data.id;
        },
        getDetailHeight(value){
            console.log(value)
            if(!this.isInfo||this.isEdit) return false;
            if(value){
                let t = this;
                setTimeout(function(){
                    t.headerHeight = document.getElementById("header-detail").clientHeight; 
                    t.detailHeight = (t.headerHeight + 43) + 'px';
                },50);
            }
        },
        //搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
                area = '';
            }
        },
        //获取任务详情
        getTaskDetail(id,type){
            let url = '/business/mission/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.taskDetail = res.data;
                    if(type==='edit'){
                        this.isEdit = true;
                    }else if(type==='info'){
                        this.isEdit = false;
                        this.isInfo = true;
                    }
                    this.drawerCtrl = true;
                }
            })
        },
        //创建任务
        createTask(){
            this.taskDetail = "";
            this.drawerCtrl = true;
            this.isEdit = false;
            this.isInfo = false;
        },
    },
    created(){},
    activated(){
        this.getData();
    },
    beforeMount(){
        
    },
    mounted(){},
    updated(){},
    components: {
        taskInfo,
        taskForm
    },
    watch: {}
}
</script>
<style scoped lang="sass">
@import "./myTask/myTask.scss"
</style>

