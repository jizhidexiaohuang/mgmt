<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <!-- <Button type="primary" @click="openAddDrawer">立项申请</Button> -->
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="客户名称/立项编号" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                所属行业
                            </Col>
                            <Col span="18">
                                <mySelect ref="industrySelect"
                                    :path="'/base/industry'"
                                    :placeholder="'请选择行业名称'"
                                    :placeholderInput="'请输入行业名称'"
                                    :keyName="'industryName'"
                                    @getValue="getIndustryId">
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
                    <Dropdown @on-click="option(row.id,$event)" v-permission="['market-center:opportunities:audit:audit-']">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="agree">通过</DropdownItem>
                            <DropdownItem name="reject">驳回</DropdownItem>
                            <DropdownItem name="termination">终止</DropdownItem>
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

            <!-- 新增/编辑合同抽屉 抽屉详情 -->
            <Drawer 
                width="600" 
                v-model="addDrawerCtrl"
                :styles="{padding:'0px'}"
                :mask-style="{background:'rgba(0,0,0,0)'}">
                <div slot="header" class="drawer-title">
                    <span>{{(!isInfo && !isEdit)?"新增项目":"项目详情"}}</span>
                    <Dropdown transfer @on-click="option(projectDetail.id,$event)" class="edit-icon" 
                        v-if="!isEdit" v-permission="['market-center:opportunities:audit:audit-']">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="agree">通过</DropdownItem>
                            <DropdownItem name="reject">驳回</DropdownItem>
                            <DropdownItem name="termination">终止</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <project-application-form v-if="!isInfo && addDrawerCtrl" :projectDetail="projectDetail" @changeEditCtrl="changeCtrl"></project-application-form>
                <project-application-info v-if="isInfo && addDrawerCtrl" :projectDetail="projectDetail"></project-application-info>
            </Drawer>
        </div>

        <!-- 通过modal -->
        <Modal
            v-model="agreeCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{title}}此项目申请？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
         <!-- 驳回modal -->
        <Modal
            v-model="rejectCtrl"
            :title="rejectTitle+'确认'"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate">
                <Row class="modal-tips">请问是否确认{{rejectTitle}}此项目申请？</Row>
                <FormItem label="" prop="reason" 
                    :rules="[{required: true, message: '请填写'+rejectTitle+'原因', trigger: 'blur'},
                            { max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="rejectTitle+'原因(不超过512个字符)'"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 客户资料抽屉 -->
        <Drawer 
            width="800" 
            v-model="customerDrawerCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">{{custName}}</div>
            <cust-manage v-if="customerDrawerCtrl" :id="custId" :readOnly="true"></cust-manage>
        </Drawer>

        <!-- 项目建议书 -->
        <Modal 
            v-model="onlineWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">在线文档</div>
            <div style="height:calc(100% - 42px);">
                <wps-file 
                    :fileUrl="onlineFileUrl"
                    :fileId="onlineFileId"
                    operate="edit"
                    :readOnly="wpsReadOnly"
                    v-if="onlineWordModal"></wps-file>
            </div>    
            <Row style="text-align:right;margin-top:10px;">
                <Button type="default" @click="onlineWordModal=false;">关闭</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import projectApplicationForm from '../projectApplication/projectApplicationForm.vue';
import projectApplicationInfo from '../projectApplication/projectApplicationInfo.vue';
import custManage from "../plugin/custManage.vue";
export default {
    data () {
        return {
            userId:"",
            searchForm:{
                keyword:'',
                industryId:""
            },
            industryArr:[],
            searchBoxCtrl:false,
            addDrawerCtrl:false,
            isInfo:false,
            isEdit:false,
            projectDetail:'',
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            data:[],
            columns:[
                {
                    title:"立项编号",
                    key:"opportunitiesNo",
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
                                    this.id = params.row.id;
                                    this.getProjectDetail(params.row.id,'info')
                                }
                            }
                        },params.row.opportunitiesNo);
                        return dom
                    }
                },
                {
                    title:"客户名称",
                    key:"custName",
                    width:140,
                    render:(h,params)=>{
                        return h('a',{
                            class:'textover',
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.custName
                            },
                            on:{
                                "click":()=>{
                                    this.custName = params.row.custName;
                                    this.custId = params.row.custId;
                                    this.customerDrawerCtrl = true;
                                }
                            }
                        },params.row.custName)
                    }
                },
                {
                    title:"项目建议书",
                    key:"proposalAttachmentList",
                    width:140,
                    render:(h,params)=>{
                        let name ;
                        if(params.row.proposalAttachmentList && params.row.proposalAttachmentList.length>0){
                            name = params.row.proposalAttachmentList[0].fileName;
                        }
                        if(!name){
                            return h('div','暂未生成')
                        }
                        return h('a',{
                            class:'textover',
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:name
                            },
                            on:{
                                "click":()=>{
                                    this.wpsReadOnly = false;
                                    this.onlineFileId = params.row.proposalAttachmentList[0].docId;
                                    this.onlineWordModal = true;
                                }
                            }
                        },name)
                    }
                },
                {
                    title:"所属行业",
                    key:"industry"
                },
                {
                    title:"所属区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.provinceName+(params.row.cityName||'')+(params.row.areaName||'')
                            }
                        },params.row.provinceName+(params.row.cityName||'')+(params.row.areaName||''))
                    }
                },
                {
                    title:"审核状态",
                    key:"stateName",
                    width:100,
                    render:(h,params)=>{
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateName,
                                color:styles.warningColor
                            },
                            style:{
                                borderRadius:'11px'
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
            id:'',
            type:'',
            agreeCtrl:false,
            title:'通过',
            rejectCtrl:false,
            rejectTitle:'驳回',
            formValidate:{
                reason:''
            },
            customerDrawerCtrl:false,
            custName:'',
            custId:'',
            onlineWordModal:false,
            onlineFileUrl:"",
            onlineFileId:"",
            wpsReadOnly:true,
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            let url = '/base/customer-opportunities';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                state:'P'
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
        //关闭侧边栏
        changeCtrl(data,isReload){
            if(!data){
                this.addDrawerCtrl = false;
            }
            if(isReload){
                this.reloadTable();
            }
        },
        // 获取行业id
        getIndustryId(data){
            this.searchForm.industryId = data.id;
        },
        getProjectDetail(id,type){
            let url = '/base/customer-opportunitie/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.projectDetail = res.data;
                    if(type==='edit'){
                        this.isEdit = true;
                    }else if(type==='info'){
                        this.isEdit = false;
                        this.isInfo = true;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
            //刷新商机立项待审核数量徽标
            this.$store.dispatch('getOpportunitieCount');
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.industryId = "";
            this.$refs.industrySelect.clearSelected();
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(id,name){
            this.id = id;
            this.type = name;
            this.$refs['formValidate'].resetFields();
            switch (true) {
                case (name=='edit'): 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getProjectDetail(id,'edit');
                    break;
                case (name=='agree'): 
                    this.agreeCtrl = true;
                    this.title = '通过'
                    break;
                case (name=='reject'): 
                    this.rejectCtrl = true;
                    this.rejectTitle = '驳回'; 
                    break;
                case (name==='termination'):
                    this.rejectCtrl = true;
                    this.rejectTitle = '终止';
                    break;
            }
        },
        handleSubmit(name){
            let url;
            let ajaxData = {}
            if(this.type=='reject'){
                url = `/base/customer-opportunitie/${this.id}/reject`;
                ajaxData.auditResult = this.formValidate.reason;
            }else if(this.type=='termination'){
                url = `/base/customer-opportunitie/${this.id}/termination`;
                ajaxData.terminateReason = this.formValidate.reason;
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
        agreeSubmit(){
            let url = `/base/customer-opportunitie/${this.id}/audit`;
            this.$patch(url,{id:this.id}).then(res=>{
                if(res.code==0){
                    this.agreeCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        /*------------操作End-------------*/
        //打开新增抽屉
        openAddDrawer(){
            this.projectDetail = "";
            this.isEdit = false;
            this.addDrawerCtrl=true;
            this.isInfo=false;
        },
        //获取字典数据接口
        async getDictionary(){
            this.industryArr = await this.common.getDictionaryItems('industry_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){},
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        projectApplicationForm,
        projectApplicationInfo,
        custManage
    },
    watch: {
        
    }
}
</script>
<style>
 
</style>
