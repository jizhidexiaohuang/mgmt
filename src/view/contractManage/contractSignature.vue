<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="名称/编号/主体" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <!-- <Row class="header-common-right-box">
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
                        </Row> -->
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                创建人
                            </Col>
                            <Col span="18">
                                <mySelect
                                    :path="'/base/mgmt-users'"
                                    :placeholder="'请选择创建人'"
                                    :keyName="'name'"
                                    @getValue="getCreatorId">
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
                <Table :columns="columns" :data="data" :loading="tableLoading" >
                    <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row.id,$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="agree">同意</DropdownItem>
                            <DropdownItem name="reject">驳回</DropdownItem>
                            <DropdownItem name="stop">终止</DropdownItem>
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

        <!-- 通过modal -->
        <Modal
            v-model="agreeCtrl"
            title="通过确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认同意签字本合同？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 驳回modal -->
        <Modal
            v-model="rejectCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate">
                <Row class="modal-tips">请问是否确认{{title}}本合同申请？</Row>
                <FormItem label="" prop="reason" 
                    :rules="[{required: true, message: '请填写'+title+'原因', trigger: 'blur'},
                            { max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.reason" type="textarea" :autosize="{minRows: 2,maxRows: 5}" :placeholder="title+'原因(不超过512个字符)'"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="rejectCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 侧边栏 -->
        <Drawer 
            width="600" 
            v-model="infoDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <!-- 合同详情 -->
            <div slot="header" class="drawer-title">
                <span>合同详情</span>
                <Dropdown transfer @on-click="option(contractDetail.id,$event)" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="agree">同意</DropdownItem>
                        <DropdownItem name="reject">驳回</DropdownItem>
                        <DropdownItem name="stop">终止</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <contractForm v-if="isEditDetail&&infoDrawerCtrl" :contractDetail="contractDetail" @changeEditCtrl="changeCtrl"></contractForm>
            <contractInfo v-if="!isEditDetail&&infoDrawerCtrl" :defaultData="contractDetail"></contractInfo>
        </Drawer>

        <Modal 
            v-model="onlineWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">在线文档</div>
            <div style="height:calc(100% - 42px);">
                <wps-file 
                    :fileUrl="onlineFileUrl"
                    operate="edit"
                    :fileId="onlineFileId"
                    v-if="onlineWordModal"></wps-file>
            </div>    
            <Row style="text-align:right;margin-top:10px;">
                <Button type="primary" @click="option(onlineId,'agree')">同意</Button>
                <Button type="primary" @click="option(onlineId,'reject')">驳回</Button>
                <Button type="primary" @click="option(onlineId,'stop')">终止</Button>
                <Button type="default" @click="onlineWordModal=false;">关闭</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from './../../assets/globalStyle.scss';
import contractInfo from './contractInfo.vue';
import contractForm from './contractForm.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:'',
                createStartDate:"",
                createEndDate:"",
                userId:""
            },
            contractStatusArr:[],
            createTime:[],
            searchBoxCtrl:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            data:[],
            columns:[
                {
                    title:"合同编号",
                    key:"contractNo",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.contractNo
                            },
                            on:{
                                click:()=>{
                                    this.state = params.row.state;
                                    this.getContractDetail(params.row.id);
                                }
                            }
                        },params.row.contractNo)
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
                    title:"创建人",
                    key:"creatorName",
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
                    key:"productName",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.infoColor,
                                cursor:'pointer'
                            },
                            on:{
                                click:()=>{
                                    if((!params.row.attachmentList || params.row.attachmentList.length==0) && !params.row.docId){
                                        this.$Message.error("暂无合同文本");
                                        return
                                    }
                                    if(params.row.docId){
                                        this.onlineFileUrl = "";
                                        this.onlineFileId = params.row.docId;
                                    }else{
                                        this.onlineFileUrl = params.row.attachmentList[0].url;
                                        this.onlineFileId = "";
                                    }
                                    this.onlineId = params.row.id;
                                    this.onlineWordModal = true;
                                }
                            }
                        },'在线文档')
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
                    slot: 'action',
                    width:160
                },
            ],
            id:'',
            state:'',
            rejectCtrl:false,
            formValidate:{
                reason:''
            },
            type:'',
            title:'驳回',
            agreeCtrl:false,
            infoDrawerCtrl:false,
            isEditDetail:false,
            contractDetail:'',
            onlineWordModal:false,
            onlineFileUrl:"",
            onlineFileId:""
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            let url = '/base/contracts';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
                state:'EP'
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
        getTime(date){
            this.searchForm.createStartDate = date[0];
            this.searchForm.createEndDate = date[1];
        },
        getCreatorId(data){
            this.searchForm.userId = data.id;
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
            this.infoDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
            //刷新总裁待审核合同总数徽标
            this.$store.dispatch('getCountWaitAuditPresident');
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
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
            if(name=='agree'){
                this.agreeCtrl = true;
            }else if(name=="reject"){
                this.rejectCtrl = true;
                this.title = '驳回';
            }else if(name=='stop'){
                this.rejectCtrl = true;
                this.title = '终止';
            }
        },
        handleSubmit(name){
            let url;
            if(this.type=='reject'){
                url = `/base/contract/${this.id}/reject-president`;
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
            let url = `/base/contract/${this.id}/audit-president`;
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
        getContractDetail(id){
            this.infoDrawerCtrl = true;
            let url = '/base/contract/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.isEditDetail = false;
                    this.contractDetail = res.data;
                }
            })
        },
        /*------------操作End-------------*/
        changeCtrl(data){
            this.isEditDetail = data;
            if(!data){
                this.infoDrawerCtrl = false;
                this.reloadTable();
            }
        },
        //获取字典数据接口
        async getDictionary(){
            this.contractStatusArr = await this.common.getDictionaryItems('contract_state');
            this.getData();
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        contractForm,
        contractInfo
    },
    watch: {
        
    }
}
</script>
<style>
 
</style>
