<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <!-- <Button @click="openAddDrawer" type="primary">新增律师协议</Button> -->
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="协议名称/创建人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                项目名称
                            </Col>
                            <Col span="18">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    method="GET"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目名称'"
                                    :keyName="'name'"
                                    :pagingMode="true"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                协议状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in agreementStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                创建时间
                            </Col>
                            <Col span="18">
                                <DatePicker 
                                type="daterange"
                                v-model="createTime"
                                @on-change="getTime"
                                split-panels 
                                placeholder="请选择创建时间" 
                                style="width: 190px"></DatePicker>
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
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row.id,$event,row.name)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <!-- <DropdownItem name="edit" v-permission="['agreement:lawyer:modify-']" v-if="getState(row.state,row.missionId)">编辑</DropdownItem> -->
                                <!-- <DropdownItem name="release" v-permission="['agreement:lawyer:audit-']" v-if="row&&row.state=='D'">发布</DropdownItem> -->
                                <!-- <DropdownItem name="release-P" v-permission="['agreement:lawyer:audit-',false]" v-if="row&&row.state=='D'">发布</DropdownItem> -->
                                <!-- <DropdownItem name="delete" v-permission="['agreement:lawyer:delete-']" v-if="row&&row.state=='D'">删除</DropdownItem> -->
                                <!-- <DropdownItem name="cancel" v-permission="['agreement:lawyer:cancel-']" v-if="row&&(row.state=='E'&& !row.missionId) || row.state=='R'">作废</DropdownItem> -->
                                <DropdownItem name="audit" v-permission="['agreement:lawyer:audit-']" v-show="row&&row.state=='P'">审核</DropdownItem>
                                <DropdownItem name="reject" v-permission="['agreement:lawyer:audit-']" v-show="row&&row.state=='P'">驳回</DropdownItem>
                                <!-- <DropdownItem name="copy" v-permission="['agreement:lawyer:copy-']">复制</DropdownItem> -->
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

        <!-- 律师协议抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{(!isInfo && !isEdit && !iscopy)?'新增律师协议':(iscopy?'复制律师协议':'律师协议')}}</span>
                <Dropdown transfer @on-click="option(agreementDetail.id,$event,agreementDetail.name)" v-if="isInfo" class="edit-icon" v-permission="['agreement:lawyer:audit-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="audit" v-if="agreementDetail&&agreementDetail.state=='P'">审核</DropdownItem>
                        <DropdownItem name="reject" v-if="agreementDetail&&agreementDetail.state=='P'">驳回</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <lawyer-agreement-form v-show="!isInfo && addDrawerCtrl" :iscopy="iscopy" :agreementDetail="agreementDetail" @changeEditCtrl="changeCtrl"></lawyer-agreement-form>
            <lawyer-agreement-info v-show="isInfo && addDrawerCtrl" :agreementDetail="agreementDetail"></lawyer-agreement-info>
        </Drawer>

        <!-- 删除modal -->
        <Modal
            v-model="delCtrl"
            :title="modalTitle+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{modalTitle}}本律师协议？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="delSubmit">确认</Button>
                <Button @click="delCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import lawyerAgreementForm from "./lawyerAgreementForm.vue";
import lawyerAgreementInfo from "./lawyerAgreementInfo.vue";
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                state:"",
                startDate:"",
                endDate:"",
                projectId:""
            },
            searchBoxCtrl:false,
            agreementStateArr:[],
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"协议名称",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                click:()=>{
                                    this.getAgreementDetail(params.row.id,'info');
                                }
                            }
                        },params.row.name)
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
                    title:"任务名称",
                    key:"missionName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.missionName
                            },
                        },params.row.missionName)
                    }
                },
                {
                    title:"创建人",
                    key:"creatorName",
                },
                {
                    title:"生效时间",
                    key:"beginDate",
                },
                {
                    title:"描述",
                    key:"remark",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            },
                        },params.row.remark)
                    }
                },
                {
                    title:"协议状态",
                    key:"stateZh",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='D':color = 'globalMainColor';break;
                            case state=='P':color = 'warningColor';break;
                            case state=='E':color = 'successColor';break;
                            case state=='C':color = 'errorColor';break;
                            case state=='R':color = 'errorColor';break;
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
                    title:"操作",
                    key: 'action',
                    width:160,
                    slot:'action'
                },
            ],
            addDrawerCtrl:false,
            isEdit:false,
            isInfo:false,
            iscopy:false,
            agreementDetail:'',
            id:"",
            createTime:[],
            delCtrl:false,
            modalType:"delete",
            modalTitle:"删除"
        }
    },
    props: [''],
    methods: {
        getState(state,id){
            let bool;
            switch (true) {
                case state=='D'||state=='R'||state=='P'||(state=='E'&&(!!id)):
                    bool = true;
                    break;
                case state=='E'&&(!id):
                    bool = false;
                    break;
                default:
                    bool = false;
                    break;
            }
            return bool;
        },
        getData(){
            let url = '/settlement/agreement-price-lawyers/pending';
            let ajaxData = {
                current: this.table.pageNum,size: this.table.pageSize
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
            //刷新律师协议待审核总数徽标
            this.$store.dispatch('getUnauditLawyerAgreementCount');
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
        option(id,name,customerName){
            this.id = id;
            this.modalType = name;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.iscopy = false;
                    this.getAgreementDetail(this.id,"edit");
                break;
                case 'audit':
                    this.modalTitle = "审核通过";
                    this.delCtrl = true;
                    break;
                case 'reject':
                    this.modalTitle = "审核驳回";
                    this.delCtrl = true;
                    break;
            }
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
        //新增客户线索
        openAddDrawer(){
            this.addDrawerCtrl = true;
            this.isInfo = false;
            this.isEdit = false;
            this.iscopy = false;
            this.agreementDetail = '';
        },
        getAgreementDetail(id,type){
            this.type = type;
            let url = '/settlement/agreement-price-lawyers/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.agreementDetail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                        this.iscopy = false;
                        this.isInfo = false;
                    }else if(type=="info"){
                        this.isInfo = true;
                        this.iscopy = false;
                        this.isEdit = false;
                    }else if(type=="copy"){
                        this.iscopy = true;
                        this.isInfo = false;
                        this.isEdit = false;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        getTime(date){
            this.searchForm.startDate = date[0];
            this.searchForm.endDate = date[1];
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        // 弹框操作律师协议
        delSubmit(){
            let url = "/settlement/agreement-price-lawyers/"+this.id;
            if(this.modalType=="delete"){   //删除
                this.$del(url).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功！");
                        this.delCtrl = false;
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else if(this.modalType=="audit" || this.modalType=="reject"){    
                // 作废 | 发布-生效 | 发布-待审核 | 审核通过 | 审核驳回
                url += '/'+this.modalType;
                this.$patch(url).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功！");
                        this.delCtrl = false;
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.state="";
            this.searchForm.startDate = "";
            this.searchForm.endDate = "";
            this.searchForm.projectId = "";
            this.createTime = [];
            this.reloadTable();
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
            this.agreementStateArr = await this.common.getDictionaryItems('agreement_state_lawyer');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        lawyerAgreementInfo,
        lawyerAgreementForm
    },
    watch: {}
}
</script>
<style>
 
</style>
