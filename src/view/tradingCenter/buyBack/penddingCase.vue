<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button :disabled="idList.length==0" @click="batchSumbit('pass')">批量通过</Button>
                    <Button :disabled="idList.length==0" @click="batchSumbit('rejected')">批量驳回</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="案件编号/对方当事人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <!-- <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                案件性质
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" placeholder="请选择案件性质">
                                    <Option v-for="item in projectStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row> -->
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                案件类型
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.tortCategory" placeholder="请选择案件类型">
                                    <Option v-for="item in tortCategoryArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                取证团队
                            </Col>
                            <Col span="18">
                                <mySelect ref="teamSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择取证团队'"
                                    :placeholderInput="'请输入团队名称'"
                                    :keyName="'team'"
                                    :params="{teamType:'I'}"
                                    @getValue="getTeamId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                项目
                            </Col>
                            <Col span="18">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
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
                <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="pass">通过</DropdownItem>
                                <DropdownItem name="rejected">驳回</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </checkbox-table>
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

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="800"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>案件详情</span>
                <Dropdown @on-click="option(caseDetail,$event)" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list" style="font-weight:normal;">
                        <DropdownItem name="pass">通过</DropdownItem>
                        <DropdownItem name="rejected">驳回</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <case-info v-if="caseInfoCtrl" :caseDetail="caseInfo"></case-info>
        </Drawer>

        <Modal
            v-model="operateCtrl"
            :title='type=="pass"?"通过确认":"驳回确认"'
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否初审{{type=="pass"?"通过":"驳回"}}案件证据？</Row>
            <Form ref="formValidate" :model="formValidate">
                <FormItem label="" v-if="type=='rejected'" prop="remark" :rules="[{ required: true, message: '请填写驳回原因', trigger: 'blur' }]">
                    <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="驳回原因"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="operateCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 查看审核记录 -->
        <Modal 
            v-model="caseNotesModal" 
            title="审核记录"
            :footer-hide="true">
            <div>
                <Timeline v-if="caseAuditArr.length!=0">
                    <TimelineItem v-for="(item,index) in caseAuditArr" :key="index">
                        <p class="time">{{common.formatTime(item.auditTime,5)}}</p>
                        <Row class="content">
                            <Col class="left-label">审核人：</Col>
                            <Col span="18" class="right-content">{{item.auditorName}}</Col>
                        </Row>
                        <Row class="content">
                            <Col class="left-label">审核结果：</Col>
                            <Col span="18" class="right-content">{{item.stateName}}</Col>
                        </Row>
                         <Row class="content">
                            <Col class="left-label">审核备注：</Col>
                            <Col span="18" class="right-content">{{item.auditRemark}}</Col>
                        </Row>
                    </TimelineItem>
                </Timeline>
            </div>   
        </Modal>

        <!-- 标签modal -->
        <Modal 
            v-model="tagModal" 
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">已订阅标签</div>
            <tag-manage :defaultList="defaultList" v-if="tagModal" @changeTag="getTag"></tag-manage>
        </Modal>
    </div>
</template>
<script>
import caseInfo from './caseInfo.vue';
import styles from '@/assets/globalStyle.scss';
import expandRow from './../sell/expandRow.vue';
export default {
    data () {
        return {
            id:'',
            searchForm:{
                keyword:'',
                customerId:'',
                state:'',
                teamId:"",
                teamType:"",
                projId:""
            },
            operateCtrl:false,
            idList:[],
            projectStateArr:[],
            searchBoxCtrl:false,
            formValidate:{
                remark:""
            },
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            //待审核案件表格
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                list: params.row.subCaseInfoList
                            },
                            on:{
                                'clickCaseCode':(item)=>{
                                    this.state = item.state || "";
                                    this.getCaseDetail(item.id,'info');
                                }
                            }
                        })
                    }
                },
                {
                    title:"案件编号",
                    key:"code",
                    width:115,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{ "textover":true },
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"项目名称",
                    key:"projectName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                {
                    title:'案件区域',
                    key:'address',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{ title:params.row.address || "" },
                        },params.row.address || "")
                    }
                },
                {
                    title:'对方当事人',
                    key:'litigantNames',
                    render:(h,params)=>{
                        let domArr = [];
                        let categoryArr = params.row.litigantCategories?params.row.litigantCategories.split(",") : [];
                        let nameArr = params.row.litigantNames?params.row.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title:'取证团队',
                    key:'team'
                },
                {
                    title:'证据提交时间',
                    key:'forensicsDate',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.forensicsDate,1))
                    }
                },
                {
                    title:'案件类型',
                    key:'tortCategory',
                    render:(h,params)=>{
                        let str = params.row.tortCategory === 1?"线下":"线上";
                        return h("span",str)
                    }
                },
                {
                    title:'案件性质',
                    key:'caseProperty'
                },
                // {
                //     title:"取证状态",
                //     key:"evidAuditState",
                //     render:(h,params)=>{
                //         return h("span","-");
                //     }
                // },
                {
                    title:'案件标签',
                    key: 'taglibList',
                    render:(h,params)=>{
                        let tagList = params.row.taglibList;
                        return h('Poptip',{
                            props: {placement: 'bottom',trigger:"hover"},
                            style:{
                                width:'100%',
                                fontSize:'16px',
                                cursor: 'pointer'
                            }
                        },[
                            h('Icon',{
                                attrs:{
                                    type:'ios-pricetags',
                                    title:'标签'
                                },
                                style:{
                                    fontSize:'16px',
                                    cursor: 'pointer'
                                }
                            }),
                            h('span', {
                                slot: 'title', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },[
                                tagList.map(item=>{
                                    return h("Tag",{
                                        class:["textover"],
                                        attrs:{ color: item.color }
                                    },item.tagName)
                                })
                            ]),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },[
                                h('a',{
                                    on:{
                                        click:()=>{
                                            this.tagModal = true;
                                            this.defaultList = JSON.parse(JSON.stringify(tagList));
                                            this.caseId = params.row.caseId;
                                        }
                                    }
                                },[
                                    h('Icon',{
                                        attrs:{ type:'ios-build'},
                                        style:{fontSize:'14px'}
                                    }),
                                    h('span','标签管理'),
                                ])
                            ]),
                        ])
                    }
                },
                {
                    title:'审核记录',
                    key:'evidAuditTime',
                    render:(h,params)=>{
                        return h('Icon',{
                            attrs:{
                                type:'ios-information-circle',
                                title:'审核记录'
                            },
                            style:{
                                fontSize:'16px',
                                cursor: 'pointer'
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseAudit(params.row.caseId);
                                }
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            infoCtrl:false,
            addDrawerCtrl:false,
            addType:'',
            projectDetail:'',
            type:'',
            confirmCtrl:false,
            title:'',
            caseInfoCtrl:false,
            caseDetail:"",
            caseInfo:"",
            batchCtrl:false,
            tortCategoryArr:[],
            caseNotesModal:false,
            caseAuditArr:[],
            tagModal:false,
            defaultList:[]
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = `/settlement/trade/purchase/mgmt/purchase-case-pending`;
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records.map(item=>{
                        if(!item.subCaseInfoList || item.subCaseInfoList.length==0){
                            item._disableExpand = true;
                        }
                        return item;
                    }) || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseInfo = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        },
        //获取案件审核记录
        getCaseAudit(id){
            let url = '/settlement/trade/purchase/audit/log/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseAuditArr = res.data || [];
                    if(this.caseAuditArr.length>0){
                        this.caseNotesModal = true;
                    }else{
                        this.$Message.error("暂无审核记录");
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //获取申请团队id
        getTeamId(data){
            this.searchForm.teamId = data.teamId;
            this.searchForm.teamType = data.platformSourceType;
        },
        getProjectId(data){
            this.searchForm.projId = data.id;
        },
        // 修改tag
        getTag(data){
            let url = '/business/taglib/case';
            let ajaxData = {
                caseId:this.caseId,
                taglibIdList:data.map(item=>{
                    return item.taglibId;
                })
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.tagModal = false;
                    this.$Message.success('操作成功');
                    this.reloadTable();
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
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.customerId = "";
            this.searchForm.state = '';
            this.$refs.teamSelect.clearSelected();
            this.$refs.projectSelect.clearSelected();
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        batchSumbit(type){
            this.batchCtrl = true;
            this.type = type;
            this.formValidate.remark = "";
            this.operateCtrl = true;
        },
        option(row,name){
            this.batchCtrl = false;
            this.id = row.id;
            this.type = name;
            this.formValidate.remark = "";
            this.operateCtrl = true;
        },
        handleSubmit (name) {
            let url = '/settlement/trade/purchase/mgmt/purchase-case/' + this.type;
            let ajaxData = {
                ids:this.batchCtrl?this.idList:[this.id],
                remark:this.formValidate.remark
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.operateCtrl = false;
                            this.$Message.success('操作成功！');
                            this.reloadTable();
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        /*------------操作End-------------*/
        /*--------------------start---------------------*/
        getIdList(list){
            this.idList = list.map(item=>{
                return item.id
            })
        },
        /*--------------------end---------------------*/
        //关闭侧边栏
        changeCtrl(isReload){
            this.addDrawerCtrl = false;
            if(isReload){
                this.reloadTable();
            }
        },
        //获取客户
        getCustomerId(data){
            this.searchForm.customerId = data.id;
        },
        //获取字典数据接口
        async getDictionary(){
            this.projectStateArr = await this.common.getDictionaryItems('project_state');
            this.tortCategoryArr = await this.common.getDictionaryItems('tort_category');
        },
    },
    created(){},
    activated(){
        this.reloadTable();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {
        caseInfo,
        expandRow
    },
    watch: {}
}
</script>
<style scoped lang="scss">
@import "./../../case/case.scss";
.project-box{
    position: relative;
}
.time{
    font-size: 14px;
    font-weight: bold;
    margin-bottom: 5px;
}
.content{
    margin-bottom: 3px;
    &:last-child{
        margin-bottom: 0;
    }
    .left-label{
        text-align: right;
        width: 60px;
        float: left;
    }
    .right-content{
        min-height: auto;
    }
}
</style>

