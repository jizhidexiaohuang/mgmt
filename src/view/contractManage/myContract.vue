<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button type="primary" @click="openAddDrawer">创建合同</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="名称/编号/主体" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                合同状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in contractStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                <Table :columns="columns" :data="data" 
                :loading="tableLoading">
                <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row.id,$event)" v-if="row.state!=='TM'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem v-if="row.state=='CD'||row.state=='RR'||row.state=='SR'" name="edit">编辑</DropdownItem>
                            <DropdownItem v-if="row.state=='CD'" name="submit">提交审核</DropdownItem>
                            <!-- <DropdownItem v-if="row.state=='PR'" name="legalAffairsAgree">通过</DropdownItem> -->
                            <!-- <DropdownItem v-if="row.state=='PR'" name="legalAffairsReject">驳回</DropdownItem> -->

                            <!-- <DropdownItem v-if="row.state=='EP'" name="agree">同意</DropdownItem> -->
                            <!-- <DropdownItem v-if="row.state=='EP'" name="reject">驳回</DropdownItem> -->
                            <DropdownItem name="stop">终止</DropdownItem>

                            <DropdownItem v-if="row.state=='SP'" name="sign">签署</DropdownItem>
                            <DropdownItem v-if="row.state=='EX'" name="postpone">顺延</DropdownItem>
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
                    <span>{{(!isInfo && !isEdit)?"新增合同":"合同详情"}}</span>
                        <Dropdown transfer @on-click="option(contractDetail.id,$event)" v-if="state!=='TM' && isInfo" class="edit-icon">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="isInfo&&(state=='CD'||state=='RR'||state=='SR')" name="edit">编辑</DropdownItem>
                                <DropdownItem v-if="state=='CD'" name="submit">提交审核</DropdownItem>

                                <DropdownItem name="stop">终止</DropdownItem>

                                <DropdownItem v-if="state=='SP'" name="sign">签署</DropdownItem>
                                <DropdownItem v-if="state=='EX'" name="postpone">顺延</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                </div>
                <contract-form v-if="!isInfo && addDrawerCtrl" :contractDetail="contractDetail" @changeEditCtrl="changeCtrl"></contract-form>
                <contract-info v-if="isInfo" :defaultData="contractDetail"></contract-info>
            </Drawer>

        <!-- 通过modal -->
        <Modal
            v-model="agreeCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否同意{{title}}本合同？</Row>
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
                <Row class="modal-tips">请问是否确认{{rejectTitle}}本合同申请？</Row>
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

        <!-- 签署modal -->
        <Drawer 
            width="600" 
            v-model="signCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <!-- 客户详情 -->
            <div slot="header" class="drawer-title">签署信息 </div>
            <signForm v-if="signCtrl" :signId="id" @changeEditCtrl="changeSignCtrl"></signForm>
        </Drawer>
        </div>

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
                <Button type="primary" v-if="state=='CD'" @click="option(onlineId,'submit')">提交审核</Button>
                <Button type="primary" @click="option(onlineId,'stop')">终止</Button>
                <Button type="primary" v-if="state=='SP'" @click="option(onlineId,'sign')">签署</Button>
                <Button type="primary" v-if="state=='EX'" @click="option(onlineId,'postpone')">顺延</Button>
                <Button type="default" @click="onlineWordModal=false;">关闭</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from './../../assets/globalStyle.scss';
import contractForm from './contractForm';
import signForm from './signForm';
import contractInfo from './contractInfo';
export default {
    data () {
        return {
            userId:"",
            searchForm:{
                keyword:'',
                state:"",
                createStartDate:"",
                createEndDate:""
            },
            state:"",
            createTime:[],
            contractStatusArr:[],
            searchBoxCtrl:false,
            addDrawerCtrl:false,
            isInfo:false,
            isEdit:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            data:[],
            contractDetail:"",
            columns:[
                {
                    title:"合同编号",
                    key:"contractNo",
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.contractNo
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getContractDetail(params.row.id,"info");
                                }
                            }
                        },params.row.contractNo);
                        return dom
                    }
                },
                {
                    title:"合同名称",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.name
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"有效期",
                    key:"startDateStr",
                    width:200,
                    render:(h,params)=>{
                        let str = (params.row.startDateStr || "") + " - " + (params.row.endDateStr || "");
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:str
                            }
                        },str)
                    }
                },
                {
                    title:"创建时间",
                    key:"createTimeStr"
                },
                {
                    title:"类型",
                    key:"typeName"
                },
                {
                    title:"产品",
                    key:"productName"
                },
                {
                    title:"在线文档",
                    key:"attachmentList",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.infoColor,
                                cursor:'pointer'
                            },
                            on:{
                                click:()=>{
                                    this.state = params.row.state || "";
                                    if((!params.row.attachmentList || params.row.attachmentList.length==0) && !params.row.docId){
                                        this.$Message.error("暂无合同文本");
                                        return
                                    }
                                    
                                    //同意签字、已签署/生效中、已过期、顺延\生效中、终止 均为只读
                                    if(params.row.state == "SP" || params.row.state == "BE" || params.row.state == "EX" || params.row.state == "TE" || params.row.state == "TM"){
                                        this.wpsReadOnly = true;
                                    }else{
                                        this.wpsReadOnly = false;
                                    }

                                    //已签署/生效中、已过期、顺延\生效中、终止展示pdf
                                    if(params.row.state=='BE'|| params.row.state=='EX'|| params.row.state=='TE'){
                                        params.row.attachmentList.forEach((item,index)=>{
                                            if(item.mediaType.indexOf('pdf')!=-1){
                                                this.onlineFileUrl = item.url;
                                            }
                                        })
                                        this.onlineFileId = "";
                                    }else{
                                        this.onlineFileUrl = "";
                                        this.onlineFileId = params.row.docId;
                                    }

                                    this.onlineId = params.row.id;
                                    this.onlineWordModal = true;
                                }
                            }
                        },'在线文档');
                    }
                },
                {
                    title:"合同状态",
                    key:"stateName",
                    width:110,
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case (state=='CD'):color = 'globalMainColor';break;
                            case (state=='RR'||state=='SR'):color = 'errorColor';break;
                            case (state=='EP'||state=='SP'):color = 'successColor';break;
                            case (state=='BE'||state=='TE'||state=='PR'):color = 'warningColor';break;
                            case (state=='TM'):color = 'expireColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    width:160,
                    slot: 'action'
                },
            ],
            id:'',
            type:'',
            rejectCtrl:false,
            rejectTitle:'驳回',
            formValidate:{
                reason:''
            },
            agreeCtrl:false,
            title:'通过',
            signCtrl:false,//签署
            onlineWordModal:false,
            onlineFileUrl:"",
            onlineFileId:"",
            wpsReadOnly:true
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            let url = '/base/contracts';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                userId:this.userId
            }
            Object.assign(ajaxData,this.searchForm);
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
        getTime(date){
            this.searchForm.createStartDate = date[0];
            this.searchForm.createEndDate = date[1];
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
        changeSignCtrl(data,isReload){
            if(!data){
                this.signCtrl = false;
            }
            if(isReload){
                this.reloadTable();
            }
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
            //刷新法务待审核合同总数徽标
            this.$store.dispatch('getCountWaitAuditLegal');
            //刷新总裁待审核合同总数徽标
            this.$store.dispatch('getCountWaitAuditPresident');
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.state = "";
            this.searchForm.createStartDate = "";
            this.searchForm.createEndDate = "";
            this.createTime = [];
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
                    this.getContractDetail(this.id,"edit");
                break;
                case (name=='agree'||name=='legalAffairsAgree'): 
                    this.agreeCtrl = true;
                    this.title = '通过'; break;
                case (name=='submit'): 
                    this.agreeCtrl = true;
                    this.title = '提交'; break;
                case (name=='sign'): 
                    //如果打开了在线文档，则关闭
                    if(this.onlineWordModal){
                        this.onlineWordModal = false;
                    }
                    this.signCtrl = true; 
                    break;
                case (name=='postpone'):
                    this.agreeCtrl = true;
                    this.title = '合同顺延'; break;
                case (name=='reject'||name=='legalAffairsReject'): 
                    this.rejectCtrl = true; 
                    this.rejectTitle = '驳回'; break;
                case (name=='stop'): 
                    this.rejectCtrl = true;
                    this.rejectTitle = '终止'; break;
            }
        },
        handleSubmit(name){
            let url;
            if(this.type=='reject'){
                url = `/base/contract/${this.id}/reject-president`;
            }else if(this.type=='legalAffairsReject'){
                url = `/base/contract/${this.id}/reject`;
            }else if(this.type=='stop'){
                url = `/base/contract/${this.id}/termination`;
            }
            let ajaxData = {
                reason:this.formValidate.reason
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
                        if(this.onlineWordModal){
                            this.onlineWordModal = false;
                        }
                    })
                }
            })
        },
        agreeSubmit(){
            let url;
            if(this.type=='agree'){
                url = `/base/contract/${this.id}/audit-president`;
            }else if(this.type=='legalAffairsAgree'){
                url = `/base/contract/${this.id}/audit`;
            }else if(this.type=='submit'){
                url = `/base/contract/${this.id}/submit-audit`;
            }else if(this.type=='postpone'){
                url = `/base/contract/${this.id}/delay`;
            }
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.agreeCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
                if(this.onlineWordModal){
                    this.onlineWordModal = false;
                }
            })
        },
        //获取合同详情
        getContractDetail(id,type){
            let url = '/base/contract/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.contractDetail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                    }else if(type=="info"){
                        this.isInfo = true;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        /*------------操作End-------------*/
        //打开新增抽屉
        openAddDrawer(){
            this.contractDetail = "";
            this.isEdit = false;
            this.addDrawerCtrl=true;
            this.isInfo=false;
        },
        //获取字典数据接口
        async getDictionary(){
            this.contractStatusArr = await this.common.getDictionaryItems('contract_state');
        },
    },
    created(){},
    beforeMount(){
        this.userId = JSON.parse(window.localStorage.getItem('account')).id;
        this.getDictionary();
    },
    mounted(){},
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        contractForm,
        signForm,
        contractInfo
    },
    watch: {
        
    }
}
</script>
<style>
 
</style>
