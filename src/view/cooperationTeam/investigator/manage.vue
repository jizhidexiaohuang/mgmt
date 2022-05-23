<template>
    <div class="customer-manage have-drawer-style relationship">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                        <Dropdown @on-click="headerOption" v-permission="['cooperation:investigatorteam:manage:manage-']">
                            <Button style="padding:0 15px">
                                批量操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem :disabled="idList.length==0" name="disable">批量禁用</DropdownItem>
                                <DropdownItem :disabled="idList.length==0" name="enable">批量启用</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                        <Dropdown @on-click="exportOption">
                            <Button style="padding:0 15px" type="primary">
                                导出
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem name="all">全部导出</DropdownItem>
                                <DropdownItem :disabled="idList.length==0" name="part">勾选导出</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="keyWord" placeholder="姓名/机构名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                所属区域
                            </Col>
                            <Col span="18">
                                <City ref="transEvent" v-on:listenCity="getCity" style="width:190px;"></City>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                内外属性
                            </Col>
                            <Col span="18">
                                <Select v-model="investigatorExternal" style="width:190px" clearable>
                                    <Option v-for="item in investigatorExternalArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                账号状态
                            </Col>
                            <Col span="18">
                                <Select v-model="accountStatus" style="width:190px" clearable>
                                    <Option v-for="item in accountStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                注册时间
                            </Col>
                            <Col span="18">
                                <DatePicker type="daterange" v-model="registrationTime" @click="getRegistrationTime" split-panels placeholder="请选择加入时间" style="width: 190px"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                审核状态
                            </Col>
                            <Col span="18">
                                <Select v-model="auditStatus" style="width:190px;" clearable>
                                    <Option v-for="item in auditStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                通过时间
                            </Col>
                            <Col span="18">
                                <DatePicker type="daterange" v-model="passingTime" @click="getPassingTime" split-panels placeholder="请选择加入时间" style="width: 190px"></DatePicker>
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
                    keyId="primaryUserId" :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)" v-permission="['cooperation:investigatorteam:manage:manage-']">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit-base">编辑基础信息</DropdownItem>
                                <DropdownItem name="edit-business">编辑业务信息</DropdownItem>
                                <DropdownItem v-if="row.state=='R'" name="reject-reason">查看审核驳回原因</DropdownItem>
                                <DropdownItem v-if="row&&(!row.status)" name="disable-reason">查看禁止原因</DropdownItem>
                                <DropdownItem v-if="row&&row.status&&row.state!='P'" name="reject">禁用</DropdownItem>
                                <DropdownItem v-if="row&&(!row.status)&&row.state!='P'" name="agree">启用</DropdownItem>
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
                show-elevator show-sizer />
            </Row>
        </div>
        
        <!-- 禁用modal -->
        <Modal
            v-model="rejectCtrl"
            title="禁用确认"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <Row class="modal-tips">请问是否确认禁用该调查员的账号信息？</Row>
                <FormItem label="" prop="reason">
                    <Input v-model="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="禁用原因"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 启用modal -->
        <Modal
            v-model="enableCtrl"
            title="启用确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认启用该调查员的账号申请？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="enableSubmit">确认</Button>
                <Button @click="enableCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <Modal
            v-model="reasonCtrl"
            :title="`${type=='reject-reason'?'审核驳回':'禁止'}原因`"
            :width="450"
            :footer-hide="true">
            {{modalReason}}
        </Modal>

        <!-- 详情抽屉 -->
        <Drawer 
            width="600" 
            v-model="infoDrawerCtrl" 
            title="调查员详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                调查员详情
                <Dropdown transfer @on-click="option(investigatorDetail,$event)" class="edit-icon" v-permission="['cooperation:investigatorteam:manage:manage-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-if="!isEditInvestigatorBase" name="edit-base">编辑基础信息</DropdownItem>
                        <DropdownItem v-if="!isEditInvestigatorBusiness" name="edit-business">编辑业务信息</DropdownItem>
                        <DropdownItem v-if="investigatorDetail.state=='R'" name="reject-reason">查看审核驳回原因</DropdownItem>
                        <DropdownItem v-if="investigatorDetail&&(!investigatorDetail.status)" name="disable-reason">查看禁止原因</DropdownItem>
                        <DropdownItem v-if="investigatorDetail&&(investigatorDetail.status)&&investigatorDetail.state!='P'" name="reject">禁用</DropdownItem>
                        <DropdownItem v-if="investigatorDetail&&(!investigatorDetail.status)&&investigatorDetail.state!='P'" name="agree">启用</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <!-- tabs -->
            <Row>
                <ul class="tabs-bar common-tabs-bar">
                    <li :class="[tabsActive=='baseInfo'?'active':'']" @click="tabsActive='baseInfo';">基础信息</li>
                    <li :class="[tabsActive=='businessInfo'?'active':'']" @click="tabsActive='businessInfo';">业务信息</li>
                </ul>
            </Row>
            <!-- 详情 -->
            <InvestigatorInfo v-if="!isEditInvestigatorBase&&infoDrawerCtrl&&tabsActive=='baseInfo'" :investigatorDetail="investigatorDetail" :tabsActive="tabsActive" v-on:changeEditCtrl="changeCtrl"></InvestigatorInfo>
            <EditInvestigatorBase v-if="isEditInvestigatorBase&&infoDrawerCtrl&&tabsActive=='baseInfo'" :investigatorDetail="investigatorDetail" v-on:changeEditCtrl="changeCtrl"></EditInvestigatorBase>

            <InvestigatorInfo v-if="!isEditInvestigatorBusiness&&infoDrawerCtrl&&tabsActive=='businessInfo'" :investigatorDetail="investigatorDetail" :tabsActive="tabsActive" v-on:changeEditCtrl="changeCtrl"></InvestigatorInfo>
            <EditInvestigatorBusiness v-if="isEditInvestigatorBusiness&&infoDrawerCtrl&&tabsActive=='businessInfo'" :investigatorDetail="investigatorDetail" v-on:changeEditCtrl="changeCtrl"></EditInvestigatorBusiness>
        </Drawer>
    </div>
</template>
<script>
import EditInvestigatorBase from './editInvestigatorBase';
import EditInvestigatorBusiness from './editInvestigatorBusiness';
import InvestigatorInfo from './investigatorInfo';
import style from '../../../assets/globalStyle.scss';
export default {
    data () {
        return {
            tabsActive:'baseInfo',
            id:"",
            infoDrawerCtrl:false,
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"姓名",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:style.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                click:()=>{
                                    this.getInvestigatorDetail(params.row.primaryUserId,'info');
                                }
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"性别",
                    key:"sex",
                    render:(h,params)=>{
                        return h('span',params.row.sex=='M'?'男':'女');
                    }
                },
                {
                    title:"机构名称",
                    key:"company",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.company
                            }
                        },params.row.company)
                    }
                },
                {
                    title:"联系方式",
                    key:"mobile"
                },
                {
                    title:"所属区域",
                    key:"province",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:(params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||'')
                            }
                        },(params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||''))
                    }
                },
                {
                    title:"律师身份",
                    key:"isLawyerName"
                },
                {
                    title:"内外属性",
                    key:"externalName"
                },
                {
                    title:"团队人数",
                    key:"memberNum"
                },
                {
                    title:"注册时间",
                    key:"createTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.createTime,1));
                    }
                },
                {
                    title:"审核时间",
                    key:"auditTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.auditTime,1));
                    }
                },
                {
                    title:"审核状态",
                    key:"state",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.state){
                            case "P": color = "orange"; break;
                            case "E": color = "green"; break;
                            case "R": color = "red"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.stateName,
                                color:color
                            },
                        },params.row.stateName)
                    }
                },
                {
                    title:"账号状态",
                    key:"statusName",
                    render:(h,params)=>{
                        return h('Tag',{
                            attrs:{
                                color:params.row.status?'success':'error'
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.statusName)
                    }
                },
                {
                    title:"操作",
                    width:100,
                    slot:'action'
                },
            ],
            data:[],
            searchBoxCtrl:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            keyWord:'',  //关键字
            industryCtrl:'',//行业
            tableLoading:false,
            idList:[], //全部订单id
            flag:false,
            rejectCtrl:false,
            formValidate:{
                reason:''
            },
            ruleValidate:{
                reason: [
                    { required: true, message: '请填写禁用原因', trigger: 'blur' }
                ]
            },
            rejectArr:[],
            accountStatus:'',
            accountStatusArr:[],
            investigatorExternalArr:[],
            investigatorExternal:'',
            keyWord:'',  //关键字
            province:'',
            city:'',
            area:'',
            registrationTime:[],
            passingTime:[],
            investigatorDetail:'',
            isEditInvestigatorBase:false,
            isEditInvestigatorBusiness:false,
            enableArr:[],
            enableCtrl:false,
            exportLoading:false,
            auditStatusArr:[],
            auditStatus:'',
            type:"",
            modalReason:"",
            reasonCtrl:false
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            this.infoDrawerCtrl = false;
            let url = '/base/investigator-teams';
            let ajaxData = {
                current: this.table.pageNum,        
                size: this.table.pageSize,         
                state:this.auditStatus,       
                province:this.province,    
                city:this.city, 
                area:this.area,
                keyword:this.keyWord,  
                isExternal:this.investigatorExternal,  
                status:this.accountStatus,
                regBeginTime:this.registrationTime[0]&&this.registrationTime[0].getTime(),
                regEndTime:this.registrationTime[1]&&this.registrationTime[1].getTime(),
                auditBeginTime:this.passingTime[0]&&this.passingTime[0].getTime(),
                auditEndTime:this.passingTime[1]&&this.passingTime[1].getTime()
            }
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
            this.table.pageNum = 1;
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        headerOption(name){
            switch (name) {
                case 'disable': 
                    this.rejectInvestigator();
                    break;
                case 'enable': 
                    this.enableInvestigator();
                    break;
            }
        },
        exportOption(name){
            this.exportExcel(name);
        },
        option(row,name){
            let id = row.primaryUserId || row.id;
            this.type = name;
            switch (name) {
                case 'edit-base': 
                    this.getInvestigatorDetail(id,'edit-base');
                    break;
                case 'edit-business': 
                    this.getInvestigatorDetail(id,'edit-business');
                    break;
                case 'reject-reason':
                    this.modalReason = row.teamInfo?(row.teamInfo.rejectReason || "") : (row.rejectReason || "");
                    this.reasonCtrl = true;
                    break;
                case 'disable-reason':
                    this.modalReason = row.teamInfo?(row.teamInfo.disableReason || "") : (row.disableReason || "");
                    this.reasonCtrl = true;
                    break;
                case 'agree': 
                    this.enableInvestigator(id);
                    break;
                case 'reject': 
                    this.rejectInvestigator(id);
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.keyWord = '';
            this.investigatorExternal = '';
            this.accountStatus = '';
            this.registrationTime = [];
            this.passingTime = [];
            this.province = '';
            this.city = '';
            this.area = '';
            this.auditStatus = '';
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        changeCtrl(data){
            this.isEditInvestigatorBase = data;
            this.isEditInvestigatorBusiness = data;
            if(!data){
                this.infoDrawerCtrl = false;
                this.reloadTable();
            }
        },
        //获取调查员详情
        getInvestigatorDetail(id,type){
            let url = '/base/investigator/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.investigatorDetail = res.data;
                    this.tabsActive = 'baseInfo';
                    if(type==='info'){
                        this.isEditInvestigatorBase = false;
                        this.isEditInvestigatorBusiness = false;
                    }else if(type==='edit-base'){
                        this.isEditInvestigatorBase = true;
                        this.isEditInvestigatorBusiness = false;
                    }else if(type==='edit-business'){
                        this.tabsActive = 'businessInfo';
                        this.isEditInvestigatorBase = false;
                        this.isEditInvestigatorBusiness = true;
                    }
                    this.infoDrawerCtrl = true;
                }
            })
        },
        exportExcel(type){
            let url = '/base/investigator-teams/export';
            let ajaxData = {
                state:this.auditStatus,       
                province:this.province,    
                city:this.city, 
                area:this.area,
                keyword:this.keyWord,  
                isExternal:this.investigatorExternal,  
                status:this.accountStatus,
                regBeginTime:this.registrationTime[0]&&this.registrationTime[0].getTime(),
                regEndTime:this.registrationTime[1]&&this.registrationTime[1].getTime(),
                auditBeginTime:this.passingTime[0]&&this.passingTime[0].getTime(),
                auditEndTime:this.passingTime[1]&&this.passingTime[1].getTime()
            }
            if(type==='part'){
                ajaxData.ids = this.idList.join(',')
            }else{
                delete ajaxData.ids;
            }
            this.$exportGet(url,ajaxData).then(res=>{});
        },
        /***********筛选条件Begin***********/
        getkeyWord(){
            this.table.pageNum = 1;
            this.getData();
        },
        // 搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.province = data[0].value;
                    this.city = '';
                    this.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.province = data[0].value;
                    this.city = data[1].value;
                    this.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.province = data[0].value;
                    this.city = data[1].value;
                    this.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.province = '';
                this.city = '';
                this.area = '';
                area = '';
            }
        },
        getRegistrationTime(value){
            this.registrationTime = value;
        },
        getPassingTime(value){
            this.passingTime = value;
        },
        /***********筛选条件End***********/
        //启用
        enableInvestigator(){
            this.enableArr = [];
            if(arguments.length>0){
                this.enableArr.push(arguments[0])
            }else{
                this.enableArr = this.idList;
            }
            this.enableCtrl = true;
        },
        enableSubmit(){
            let url = '/base/investigator-team/enable';
            let ajaxData = {
                userIds:this.enableArr,
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.enableCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //禁用
        rejectInvestigator(){
            this.rejectArr = [];
            if(arguments.length>0){
                this.rejectArr.push(arguments[0])
            }else{
                this.rejectArr = this.idList;
            }
            this.$refs['formValidate'].resetFields();
            this.rejectCtrl = true;
        },
        handleSubmit (name) {
            let url = '/base/investigator-team/disable';
            let ajaxData = {
                userIds:this.rejectArr,
                disableReason:this.formValidate.reason
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
        /*--------------------start---------------------*/
        getIdList(list){
            this.idList = list.map(item=>{
                return item.primaryUserId
            })
        },
        /*--------------------end---------------------*/
        //获取字典数据接口
        async getDictionary(){
            this.accountStatusArr = await this.common.getDictionaryItems('lawteam_available');
            this.investigatorExternalArr = await this.common.getDictionaryItems('investigator_external');
            this.auditStatusArr = await this.common.getDictionaryItems('lawteam_audit');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getData();
    },
    mounted(){
        
    },
    activated(){
        this.reloadTable();
    },
    updated(){},
    components: {
        EditInvestigatorBase,
        EditInvestigatorBusiness,
        InvestigatorInfo,
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "../../relationship/customerManage/myClient";
@import "@/assets/globalStyle.scss";
.common-tabs-bar{
    border-bottom:1px solid $borderColor;
    display: flex;
    flex-wrap: nowrap;
    justify-content: space-around;
    li{
        padding:0 8px;
    }
}
</style>

