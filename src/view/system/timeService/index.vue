<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="addDrawerCtrl=true" type="primary">新增定时任务</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.jobDesc" placeholder="任务名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.triggerStatus" style="width:190px;" clearable>
                                    <Option v-for="item in triggerStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
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
                <Table :columns="columns" :data="data" :loading="tableLoading"></Table>
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

        <!-- 新增客户抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :transfer="false"
            :inner="true"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>新增定时服务</span>
            </div>
            <add-task v-if="addDrawerCtrl" @changeEditCtrl="changeCtrl"></add-task>
        </Drawer>

        <!-- 转客户modal -->
        <Modal
            v-model="agreeCtrl"
            :title="operationType=='start'?'启动任务':'停止任务'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否将此定时服务{{operationType=="start"?"启动":"停止"}}？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="operateTask">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from './../../../assets/globalStyle.scss';
import addTask from './addTask.vue';
export default {
    data () {
        return {
            searchForm:{
                jobDesc:"",
                triggerStatus:""
            },
            searchBoxCtrl:false,
            agreeCtrl:false,
            triggerStatusArr:[
                {
                    nameZh:"停止",
                    value:0
                },
                {
                    nameZh:"启用",
                    value:1
                },
            ],
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"任务名称",
                    key:"jobDesc",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                // color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.jobDesc
                            },
                            on:{
                                click:()=>{
                                    // this.getTaskDetail(params.row.id,'info');
                                }
                            }
                        },params.row.jobDesc)
                    }
                },
                {
                    title:"执行规则",
                    key:"jobCron"
                },
                {
                    title:"任务参数",
                    key:"executorParam",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.executorParam
                            },
                        },params.row.executorParam)
                    }
                },
                {
                    title:"状态",
                    key:"triggerStatus",
                    render:(h,params)=>{
                        let str = "";
                        if(params.row.triggerStatus == 0){
                            str = "停止";
                        }else if(params.row.triggerStatus == 1){
                            str = "启用";
                        }
                        return h("span",str)
                    }
                },
                {
                    title:"操作",
                    key: 'action',
                    width:100,
                    render:(h,params)=>{
                        let startButton = h("span",{
                            class:'icon-start-01',
                            style:{
                                cursor:'pointer',
                                fontSize:'16px'
                            },
                            attrs:{title:'启动'},
                            on:{
                                click:()=>{
                                    this.operationType = "start";
                                    this.id = params.row.id;
                                    this.agreeCtrl = true;
                                }
                            }
                        });
                        let stopButton = h("span",{
                            class:'icon-stop-01',
                            style:{
                                cursor:'pointer',
                                fontSize:'16px'
                            },
                            attrs:{title:'停止'},
                            on:{
                                click:()=>{
                                    this.operationType = "stop";
                                    this.id = params.row.id;
                                    this.agreeCtrl = true;
                                }
                            }
                        });
                        if(params.row.triggerStatus==0){
                            return [startButton];
                        }else{
                            return [stopButton];
                        }
                    }
                },
            ],
            addDrawerCtrl:false,
            operationType:"",
            id:''
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/task/tasks';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        /***********操作************/
        //关闭侧边栏
        changeCtrl(data,isReload){
            if(!data){
                this.addDrawerCtrl = false;
            }
            if(isReload){
                this.reloadTable();
            }
        },
        operateTask(){
            let url = "";
            if(this.operationType=="start"){
                url = `/task/task/${this.id}/start`;
            }else if(this.operationType=="stop"){
                url = `/task/task/${this.id}/stop`;
            }
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.agreeCtrl=false;
                    this.getData();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //清除条件
        clearConditions(){
            this.searchForm.jobDesc = "";
            this.searchForm.triggerStatus = "";
            this.reloadTable();
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        addTask
    },
    watch: {}
}
</script>
<style>
 
</style>
