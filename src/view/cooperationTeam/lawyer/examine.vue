<template>
    <div class="customer-manage have-drawer-style relationship">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;" v-permission="['cooperation:lawyerteam:audit:audit:-']">
                    <Button :disabled="idList.length==0" @click="rejectLawyer()">批量驳回</Button>
                    <Button :disabled="idList.length==0" @click="agreeLawyer()">批量通过</Button>
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
                                调查能力
                            </Col>
                            <Col span="18">
                                <Select v-model="investigationAbility" style="width:190px;" clearable>
                                    <Option v-for="item in investigationAbilityArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <!-- <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                审核状态
                            </Col>
                            <Col span="18">
                                <Select v-model="auditStatus" style="width:190px;" clearable>
                                    <Option v-for="item in auditStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row> -->
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
                        <Dropdown @on-click="option(row,$event)" v-permission="['cooperation:lawyerteam:audit:audit:-']">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <!-- <DropdownItem v-if="row.state!='R'" name="edit-base">编辑</DropdownItem> -->
                                <DropdownItem v-if="row.state=='P'" name="agree">通过</DropdownItem>
                                <DropdownItem v-if="row.state=='P'" name="reject">驳回</DropdownItem>
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

        <!-- 驳回modal -->
        <Modal
            v-model="rejectCtrl"
            title="驳回确认"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate">
                <Row class="modal-tips">请问是否确认驳回该律师的账号申请？</Row>
                <FormItem label="" prop="reason">
                    <Input v-model="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="驳回原因"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 通过modal -->
        <Modal
            v-model="agreeCtrl"
            title="通过确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认通过该律师的账号申请？</Row> 
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 详情抽屉 -->
        <Drawer 
            width="600" 
            v-model="infoDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                律师详情
                <Dropdown transfer @on-click="option(lawyerDetail,$event)" class="edit-icon" 
                    v-if="lawyerDetail&& (!(isEditLawyerBase&&isEditLawyerBusiness))" v-permission="['cooperation:lawyerteam:audit:audit:-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <!-- <DropdownItem v-if="!isEditLawyerBase" name="edit-base">编辑基础信息</DropdownItem>
                        <DropdownItem v-if="!isEditLawyerBusiness" name="edit-business">编辑业务信息</DropdownItem> -->
                        <DropdownItem name="agree">通过</DropdownItem>
                        <DropdownItem name="reject">驳回</DropdownItem>
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
            <LawyerInfo v-if="!isEditLawyerBase&&infoDrawerCtrl&&tabsActive=='baseInfo'" :lawyerDetail="lawyerDetail" :tabsActive="tabsActive" v-on:changeEditCtrl="changeCtrl"></LawyerInfo>
            <EditLawyerBase v-if="isEditLawyerBase&&infoDrawerCtrl&&tabsActive=='baseInfo'" :lawyerDetail="lawyerDetail" v-on:changeEditCtrl="changeCtrl"></EditLawyerBase>

            <LawyerInfo v-if="!isEditLawyerBusiness&&infoDrawerCtrl&&tabsActive==='businessInfo'" :lawyerDetail="lawyerDetail" :tabsActive="tabsActive" v-on:changeEditCtrl="changeCtrl"></LawyerInfo>
            <EditLawyerBusiness v-if="isEditLawyerBusiness&&infoDrawerCtrl&&tabsActive=='businessInfo'" :lawyerDetail="lawyerDetail" v-on:changeEditCtrl="changeCtrl"></EditLawyerBusiness>
        </Drawer>
    </div>
</template>
<script>
import EditLawyerBase from './editLawyerBase';
import EditLawyerBusiness from './editLawyerBusiness';
import LawyerInfo from './lawyerInfo';
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
                                    this.getLawyerDetail(params.row.primaryUserId,'info');
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
                    title:"注册时间",
                    key:"createTime",
                    render:(h,params)=>{
                        return h('span',params.row.createTime&&params.row.createTime.slice(0,-9));
                    }
                },
                {
                    title:"调查能力",
                    key:"hasInquiryAbility",
                    render:(h,params)=>{
                        return h('span',params.row.hasInquiryAbility=='Y'?'有':'无');
                    }
                },
                {
                    title:"内外属性",
                    key:"externalZH"
                },
                // {
                //     title:"审核状态",
                //     key:"statusName",
                //     render:(h,params)=>{
                //         return h('Tag',{
                //             attrs:{
                //                 color:params.row.state=='E'?'success':(params.row.state=='R'?'error':'warning')
                //             },
                //             style:{
                //                 borderRadius:'11px'
                //             }
                //         },params.row.statusName)
                //     }
                // },
                {
                    title:"操作",
                    width:160,
                    slot:'action',
                },
            ],
            data:[],
            searchBoxCtrl:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            idList:[], //全部订单id
            flag:false,
            rejectCtrl:false,
            formValidate:{
                reason:''
            },
            ruleValidate:{
                reason: [
                    { required: true, message: '请填写驳回原因', trigger: 'blur' },
                    { max:512, message: '长度不能超过512个字符', trigger: 'blur' }
                ]
            },
            rejectArr:[],
            investigationAbilityArr:[],
            investigationAbility:'',
            // auditStatusArr:[],
            // auditStatus:'',
            keyWord:'',  //关键字
            province:'',
            city:'',
            area:'',
            isEditLawyerBase:false,
            isEditLawyerBusiness:false,
            lawyerDetail:'',
            agreeCtrl:false,
            agreeArr:[]
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            this.infoDrawerCtrl = false;
            let url = '/base/lawyer-teams';
            let ajaxData = {
                current: this.table.pageNum,        
                size: this.table.pageSize,         
                province:this.province,    
                city:this.city, 
                area:this.area,
                keyword:this.keyWord,  
                inquiryAbility:this.investigationAbility,  
                state:'P'
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.data.forEach(item=>{
                        if(item.state!='P'){
                            item._disabled = true;
                        }
                    })
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
            //刷新待律师待审核总数徽标
            this.$store.dispatch('getUnauditLawyerCount');
        },
        //列表操作
        option(row,name){
            let id = row.primaryUserId;
            switch (name) {
                case 'edit-base': 
                    this.getLawyerDetail(id,'edit-base');
                    break;
                case 'edit-business': 
                    this.getLawyerDetail(id,'edit-business');
                    break;
                case 'agree': 
                    this.agreeLawyer(id);
                    break;
                case 'reject': 
                    this.rejectLawyer(id);
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.keyWord = '';
            this.investigationAbility = '';
            // this.auditStatus = '';
            this.province = '';
            this.city = '';
            this.area = '';
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        changeCtrl(data){
            this.isEditLawyerBase = data;
            this.isEditLawyerBusiness = data;
            if(!data){
                this.infoDrawerCtrl = false;
                this.reloadTable();
            }
        },
        //获取律师详情
        getLawyerDetail(id,type){
            let url = '/base/lawyer/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.lawyerDetail = res.data;
                    this.tabsActive = 'baseInfo';
                    if(type==='info'){
                        this.isEditLawyerBase = false;
                        this.isEditLawyerBusiness = false;
                    }else if(type==='edit-base'){
                        this.isEditLawyerBase = true;
                        this.isEditLawyerBusiness = false;
                    }else if(type==='edit-business'){
                        this.tabsActive = 'businessInfo';
                        this.isEditLawyerBase = false;
                        this.isEditLawyerBusiness = true;
                    }
                    this.infoDrawerCtrl = true;
                }
            })
        },
        /***********筛选条件Begin***********/
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
        /***********筛选条件End***********/
        //通过审核
        agreeLawyer(){
            this.agreeArr = [];
            if(arguments.length>0){
                this.agreeArr.push(arguments[0])
            }else{
                this.agreeArr = this.idList;
            }
            this.agreeCtrl = true;
        },
        agreeSubmit(){
            let url = '/base/lawyer-team/audit';
            let ajaxData = {
                userIds:this.agreeArr,
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.agreeCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //拒绝审核
        rejectLawyer(){
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
            let url = '/base/lawyer-team/reject';
            let ajaxData = {
                userIds:this.rejectArr,
                rejectReason:this.formValidate.reason
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
            this.investigationAbilityArr = await this.common.getDictionaryItems('inquiry_ability_type');
            // this.auditStatusArr = await this.common.getDictionaryItems('lawteam_audit');
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
        EditLawyerBase,
        EditLawyerBusiness,
        LawyerInfo,
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

