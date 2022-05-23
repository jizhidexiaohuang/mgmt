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
                    <Input v-model="searchForm.keyword" placeholder="任务名称/拒绝团队" style="width: 250px;" 
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
                    <Dropdown @on-click="option(row.id,row.licensorId,$event)" v-if="row.operateResult=='P'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="reassign">转派</DropdownItem>
                            <DropdownItem name="ignore">忽略</DropdownItem>
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
                <span>拒绝详情</span>
                <Dropdown transfer @on-click="option(taskDetail.id,taskDetail.licensorId,$event)" class="edit-icon" v-if="taskDetail.operateResult=='P'">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="reassign">转派</DropdownItem>
                        <DropdownItem name="ignore">忽略</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Row class="header-detail">
                <p>任务名称：{{taskDetail.name}}</p>
                <p>拒绝团队：{{taskDetail.team}}</p>
                <p>拒绝原因：{{taskDetail.note}}</p>
                <p>处理状态：{{taskDetail.operateResultZh}}</p>
            </Row>
        </Drawer>

        <!-- 忽略任务 -->
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
        
         <!-- 重新指派modal -->
        <Modal
            v-model="rejectCtrl"
            :title="title+'确认'"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="80">
                <FormItem label="指派团队" prop="licensorList"
                    :rules="[{required: true,type:'array',message: '指派团队不能为空',trigger: 'blur' }]">
                    <div class="tag">
                        <Tag class="tag-style" v-for="(item,index) in assignTeamArr" :key="index" type="border" 
                            :color="mainColor.globalMainColor" closable @on-close="clearAssignTeam(item,index)">{{item.team}}</Tag>
                        <Button icon="ios-add" type="dashed" size="small" @click="assignTeamCtrl=true">选择团队</Button>
                    </div>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 指派团队 -->
        <Modal
            v-model="assignTeamCtrl"
            title="选择指派团队"
            :width="800"
            :footer-hide="true">
            <assignTeam ref="AssignTeam" v-if="assignTeamCtrl" :defaultObjList="defaultData" @refreshList="getIdList($event)"></assignTeam>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import taskInfo from "./plugin/taskInfo/index.vue"
import taskForm from "./myTask/taskForm.vue"
import assignTeam from './myTask/assignTeam.vue';

import { setTimeout } from 'timers';
import { valid } from 'semver';
export default {
    data () {
        return {
            id:'',
            licensorId:'',
            mainColor:styles,
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
                                    this.taskDetail = params.row;
                                    this.drawerCtrl = true;
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
                    title:"截止日期",
                    key:"endDate"
                },
                {
                    title:"拒绝团队",
                    key:"team"
                },
                {
                    title:"拒绝原因",
                    key:"note"
                },
                {
                    title:"指派状态",
                    key:"operateResult",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.operateResult;
                        switch (true){
                            case state=='P':color = 'warningColor';break;
                            case state=='H':color = 'successColor';break;
                            case state=='I':color = 'expireColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.operateResultZh,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.operateResultZh)
                    }
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
                licensorList:[]
            },
            assignTeamCtrl:false,
            assignTeamArr:[],
            defaultData:[]
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            let url = '/business/missions/refused';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
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
        option(id,licensorId,name){
            this.id = id;
            this.licensorId = licensorId;
            this.type = name;
            this.$refs['formValidate'].resetFields();
            switch (true) {
                case (name==='reassign'): 
                    this.rejectCtrl = true;
                    this.title = '指派';
                    break;
                case (name==='ignore'):
                    this.confirmCtrl = true;
                    this.title = '忽略';
                    break;
            }
        },
        agreeSubmit(){
            let url;
            if(this.type=='ignore'){
                url = '/business/mission/ignore';
                this.$patch(url,{missionId:this.id,licensorId:this.licensorId}).then(res=>{
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
            let url = '/business/mission/reassign';
            let ajaxData = {
                missionId:this.id,
                licensorId:this.licensorId
            }
            this.formValidate.licensorList = this.assignTeamArr.map(item=>{
                return {teamId:item.teamId,licensorType:item.platformSourceType}
            })
            ajaxData.licensorList = this.formValidate.licensorList;
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
        //获取指派团队
        confirm(){
            this.assignTeamCtrl = false;
            this.defaultData = this.assignTeamArr;
        },
        //获取指派团队
        getIdList(data){
            this.assignTeamArr = data;
        },
        //取消
        cancel(){
            this.assignTeamCtrl = false;
            this.assignTeamArr = this.defaultData;
        },
        //清除指派团队
        clearAssignTeam(item,index){
            this.assignTeamArr.splice(index,1);
            this.defaultData = this.assignTeamArr;
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
        taskForm,
        assignTeam
    },
    watch: {}
}
</script>
<style scoped lang="sass">
@import "./myTask/myTask.scss"
</style>
<style scoped lang="scss">
.tag{
    height: auto;
    border: 1px solid #ebeaf0;
    padding: 4px 7px;
}
</style>

