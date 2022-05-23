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
                                <Select v-model="searchForm.caseProperty" placeholder="请选择案件性质">
                                    <Option v-for="item in auditStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                                出售状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.saleState" placeholder="请选择出售状态">
                                    <Option v-for="item in saleStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                结算状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.statementState" placeholder="请选择结算状态">
                                    <Option value="S">待申请</Option>
                                    <Option value="P">待审核</Option>
                                    <Option value="E">已审核</Option>
                                    <Option value="R">审核拒绝</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                付款状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.payState" placeholder="请选择付款状态">
                                    <Option v-for="item in refundPayStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                        <Dropdown v-if="row.evidAuditState!='E'" @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="row.forensicsDate&&row.evidAuditState=='P'" name="pass">通过</DropdownItem>
                                <DropdownItem v-if="row.forensicsDate&&row.evidAuditState=='P'" name="rejected">驳回</DropdownItem>
                                <DropdownItem v-if="row.evidAuditState=='R'" name="reason">查看驳回原因</DropdownItem>
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
                <Dropdown v-if="caseDetail.evidAuditState!='E'" @on-click="option(caseDetail,$event)" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list" style="font-weight:normal;">
                        <DropdownItem v-if="caseDetail.forensicsDate&&caseDetail.evidAuditState=='P'" name="pass">通过</DropdownItem>
                        <DropdownItem v-if="caseDetail.forensicsDate&&caseDetail.evidAuditState=='P'" name="rejected">驳回</DropdownItem>
                        <DropdownItem v-if="caseDetail.evidAuditState=='R'" name="reason">查看驳回原因</DropdownItem>
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

        <Modal
            v-model="reasonCtrl"
            title='驳回原因'
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">{{rejectReason}}</Row>
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
                caseProperty:'',
                tortCategory:'',
                saleState:'',
                statementState:'',
                payState:'',
                evidAuditState:'',
                teamId:'',
                teamType:'',
                projId:''
            },
            operateCtrl:false,
            reasonCtrl:false,
            idList:[],
            searchBoxCtrl:false,
            formValidate:{
                remark:""
            },
            saleStateArr:[],
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            //全部回购案件表格
            columns:[],
            addDrawerCtrl:false,
            addType:'',
            projectDetail:'',
            type:'',
            confirmCtrl:false,
            title:'',
            caseInfoCtrl:false,
            caseDetail:"",
            batchCtrl:false,
            caseInfo:"",
            rejectReason:"",
            tortCategoryArr:[],
            refundPayStateArr:[],
            auditStateArr:[]
        }
    },
    props: [''],
    methods: {
        changeColumns(){
            let arr = [];
            let columnsObj = {
                selection:{
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                expand:{
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
                code:{
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
                projectName:{
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
                address:{
                    title:'案件区域',
                    key:'address',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{ title:params.row.address || "" },
                        },params.row.address || "")
                    }
                },
                litigantNames:{
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
                team:{
                    title:'取证团队',
                    key:'team'
                },
                forensicsDate:{
                    title:'证据提交时间',
                    key:'forensicsDate',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.forensicsDate,1))
                    }
                },
                tortCategory:{
                    title:'案件类型',
                    key:'tortCategory',
                    render:(h,params)=>{
                        let str = params.row.tortCategory === 1?"线下":"线上";
                        return h("span",str)
                    }
                },
                caseProperty:{
                    title:'案件性质',
                    key:'caseProperty'
                },
                saleState:{
                    title:"出售状态",
                    key:"saleState",
                    render:(h,params)=>{
                        let color ;
                        let text = "";
                        let state = params.row.saleState;
                        switch (state){
                            case 'P':
                                color = 'blue';
                                text = '待出售';
                                break;
                            case 'PO':
                                color = 'orange';
                                text = '待预约';
                                break;
                            case 'PR':
                                color = 'cyan';
                                text = "已预约";
                                break;
                            case 'S':
                                color = 'green';
                                text = "已出售";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:color
                            },
                        },text)
                    }
                },
                statementState:{
                    title:"结算状态",
                    key:"statementState",
                    render:(h,params)=>{
                        let color ;
                        let text = "";
                        let state = params.row.statementState;
                        switch (state){
                            case 'S':
                                color = 'warningColor';
                                text = "待申请";
                                break;
                            case 'P':
                                color = 'warningColor';
                                text = "待审核";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "已审核";
                                break;
                            case 'R':
                                color = 'errorColor';
                                text = "审核拒绝";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text)
                    }
                },
                payState:{
                    title:"付款状态",
                    key:"payState",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.payState;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待申请";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "已申请";
                                break;
                            case 'S':
                                color = 'infoColor';
                                text = "已付款";
                                break;
                        }
                        let TagDom = h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text);
                        let spanDom = h("span","-");
                        return state?TagDom:spanDom
                    }
                },
                caseNature:{
                    title:'案件标签',
                    key:'caseNature'
                },
                totalAmount:{
                    title:'回购价',
                    key:'totalAmount',
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalAmount || ""))
                    }
                },
                evidAuditTime:{
                    title:'审核时间',
                    key:'evidAuditTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.evidAuditTime,1))
                    }
                },
                evidAuditState:{
                    title:"审核状态",
                    key:"evidAuditState",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.evidAuditState;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待审核";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "已审核";
                                break;
                            case 'R':
                                color = 'errorColor';
                                text = "审核拒绝";
                                break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:text,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },text)
                    }
                },
                action:{
                    title:"操作",
                    width:120,
                    slot: 'action'
                }
            }
            if(this.searchForm.evidAuditState=="E" || this.searchForm.evidAuditState=="R"){
                delete columnsObj.selection;
                delete columnsObj.totalAmount;
                delete columnsObj.action;
            }
            if(this.searchForm.evidAuditState=="R"){
                delete columnsObj.saleState;
                delete columnsObj.statementState;
                delete columnsObj.payState;
            }
            for(let key in columnsObj){
                arr.push(columnsObj[key]);
            }
            return arr
        },
        //获取列表数据
        getData(){
            let url = `/settlement/trade/purchase/mgmt/purchase-case-all`;
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
                        if(item.evidAuditState!="P"){
                            item._disabled = true;
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
        //获取申请团队id
        getTeamId(data){
            this.searchForm.teamId = data.teamId;
            this.searchForm.teamType = data.platformSourceType;
        },
        getProjectId(data){
            this.searchForm.projId = data.id;
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
            this.columns = this.changeColumns();
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.caseProperty = '';
            this.searchForm.tortCategory = '';
            this.searchForm.saleState = '';
            this.searchForm.statementState = '';
            this.searchForm.payState = '';
            this.searchForm.evidAuditState = '';
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
            switch(name){
                case "pass":
                    this.batchCtrl = false;
                    this.id = row.id;
                    this.type = name;
                    this.formValidate.remark = "";
                    this.operateCtrl = true;
                    break;
                case "rejected":
                    this.batchCtrl = false;
                    this.id = row.id;
                    this.type = name;
                    this.formValidate.remark = "";
                    this.operateCtrl = true;
                    break;
                case "reason":
                    this.rejectReason = row.evidAuditRemark;
                    this.reasonCtrl = true;
                    break;
            }

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
        //获取字典数据接口
        async getDictionary(){
            this.tortCategoryArr = await this.common.getDictionaryItems('tort_category');
            this.refundPayStateArr = await this.common.getDictionaryItems('purchase_pay_state');
            this.auditStateArr = await this.common.getDictionaryItems('audit_state');
            this.saleStateArr = await this.common.getDictionaryItems('case_sale_state');
        },
    },
    created(){},
    activated(){
        this.reloadTable();
    },
    beforeMount(){
        this.getDictionary();
        this.columns = this.changeColumns();
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
</style>

