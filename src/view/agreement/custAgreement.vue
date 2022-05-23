<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="openAddDrawer" v-permission="['agreement:customer:add-']" type="primary">新增客户协议</Button>
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
                                客户
                            </Col>
                            <Col span="18">
                                <mySelect ref="distributorSelect"
                                    :path="'/base/customers'"
                                    :placeholder="'请选择客户'"
                                    :params="{type:'G'}"
                                    :keyName="'name'"
                                    :inputKey="'name'"
                                    :pagingMode="true"
                                    @getValue="getCustomerId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                产品
                            </Col>
                            <Col span="18">
                                <mySelect ref="productSelect"
                                    :path="'/base/products'"
                                    :placeholder="'请选择产品'"
                                    :placeholderInput="'请输入产品名称'"
                                    :keyName="'name'"
                                    :pagingMode="true"
                                    @getValue="getProductId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                协议状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                        <Dropdown @on-click="option(row.id,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit" v-permission="['agreement:customer:add-']" v-show="row.state=='D'">编辑</DropdownItem>
                                <DropdownItem name="release" v-permission="['agreement:customer:manage-']" v-show="row.state=='D'">发布</DropdownItem>
                                <DropdownItem name="delete" v-permission="['agreement:customer:manage-']" v-show="row.state=='D'">删除</DropdownItem>
                                <DropdownItem name="cancel" v-permission="['agreement:customer:manage-']" v-show="row.state=='E'">作废</DropdownItem>
                                <DropdownItem name="delay" v-permission="['agreement:customer:manage-']" v-show="row.state=='O'">延期</DropdownItem>
                                <DropdownItem name="copy" v-permission="['agreement:customer:add-']">复制</DropdownItem>
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

        <!-- 新增客户抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{(!isInfo && !isEdit && !iscopy)?'新增客户协议':(iscopy?'复制客户协议':'客户协议')}}</span>
                <Dropdown transfer @on-click="option(custAgreementDetail.id,$event)" v-if="isInfo" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit" v-permission="['agreement:customer:add-']" v-show="custAgreementDetail.state=='D'">编辑</DropdownItem>
                        <DropdownItem name="release" v-permission="['agreement:customer:manage-']" v-show="custAgreementDetail.state=='D'">发布</DropdownItem>
                        <DropdownItem name="delete" v-permission="['agreement:customer:manage-']" v-show="custAgreementDetail.state=='D'">删除</DropdownItem>
                        <DropdownItem name="cancel" v-permission="['agreement:customer:manage-']" v-show="custAgreementDetail.state=='E'">作废</DropdownItem>
                        <DropdownItem name="delay" v-permission="['agreement:customer:manage-']" v-show="custAgreementDetail.state=='O'">延期</DropdownItem>
                        <DropdownItem name="copy" v-permission="['agreement:customer:add-']">复制</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <cust-agreement-form v-if="!isInfo && addDrawerCtrl" :iscopy="iscopy" :custAgreementDetail="custAgreementDetail" @changeEditCtrl="changeCtrl"></cust-agreement-form>
            <cust-agreement-info v-if="isInfo && addDrawerCtrl" :custAgreementDetail="custAgreementDetail"></cust-agreement-info>
        </Drawer>

        <!-- 删除modal -->
        <Modal
            v-model="delCtrl"
            :title="modalTitle+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{modalTitle}}此客户协议？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="delSubmit">确认</Button>
                <Button @click="delCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 延期 -->
        <Modal
            v-model="delayCtrl"
            title="延期确认"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="80">
                <FormItem label="截止日期" prop="date"
                    :rules="[{required: true, message: '请选择截止日期', trigger: 'blur'}]">
                    <DatePicker type="date" :options="dateOption" @on-change="getDate" style="width:100%" placement="bottom-start" placeholder="请选择截止日期"></DatePicker>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="delayCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import custAgreementForm from './custAgreementForm.vue';
import custAgreementInfo from './custAgreementInfo.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                custId:'',
                productId:"",
                state:'',
                startDate:"",
                endDate:""
            },
            stateArr:[],
            createTime:[],
            searchBoxCtrl:false,
            custPropertyArr:[],
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
                    title:"客户名称",
                    key:"customerName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.customerName
                            },
                        },params.row.customerName)
                    }
                },
                {
                    title:"创建人",
                    key:"createName",
                },
                {
                    title:"有效期",
                    key:"startDate",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.startDateStr&&params.row.startDateStr+'-'+params.row.endDateStr
                            },
                        },params.row.startDateStr&&params.row.startDateStr+'-'+params.row.endDateStr)
                    }
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
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='D':color = 'globalMainColor';break;
                            case state=='E':color = 'successColor';break;
                            case state=='C':color = 'errorColor';break;
                            case state=='O':color = 'expireColor';break;
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
                    key: 'action',
                    width:160,
                    slot:'action'
                },
            ],
            addDrawerCtrl:false,
            isEdit:false,
            isInfo:false,
            iscopy:false,
            custAgreementDetail:'',
            id:"",
            delCtrl:false,
            modalTitle:"删除",
            delayCtrl:false,
            formValidate:{
                date:''
            },
            dateOption:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            }
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/settlement/agreements';
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
        option(id,name){
            this.id = id;
            this.type = name;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.iscopy = false;
                    this.getAgreementDetail(this.id,"edit");
                break;
                case 'release':
                    this.modalTitle = "发布";
                    this.delCtrl = true;
                    break;
                case 'delete': 
                    this.modalTitle = "删除";
                    this.delCtrl = true;
                    break;
                case 'cancel': 
                    this.modalTitle = "作废";
                    this.delCtrl = true;
                    break;
                case 'delay': 
                    this.delayCtrl = true;
                    break;
                case 'copy':
                    this.isInfo = false;
                    this.isEdit = true;
                    this.iscopy = true;
                    this.getAgreementDetail(this.id,"copy");
            }
        },
        // 弹框操作客户协议
        delSubmit(){
            let url = "/settlement/agreement/"+this.id+"/remove";
            if(this.type=="delete"){   //删除
                this.$patch(url).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功！");
                        this.delCtrl = false;
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else if(this.type=="cancel" || this.type=="release"){    // 作废|发布
                url = '/settlement/agreement/'+this.id+(this.type=="cancel"?"/expire":"/release");
                this.$patch(url).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功！");
                        this.delCtrl = false;
                        this.getData();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        //延期
        handleSubmit(name){
            let url = '/settlement/agreement/'+this.id+'/delay';
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$patch(url,{endDate:this.formValidate.date}).then(res=>{
                        if(res.code==0){
                            this.$Message.success("操作成功！");
                            this.delayCtrl = false;
                            this.getData();
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        getDate(value){
            this.formValidate.date = value;
        },
        //关闭侧边栏
        changeCtrl(isReload){
            this.addDrawerCtrl = false;
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
            this.custAgreementDetail = '';
        },
        getAgreementDetail(id,type){
            let url = '/settlement/agreement/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.custAgreementDetail = res.data;
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
        //获取委托人
        getCustomerId(data){
            this.searchForm.custId = data.id;
        },
        //选择所属产品
        getProductId(data){
            this.searchForm.productId = data.id;
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.createTime = [];
            this.searchForm.startDate = '';
            this.searchForm.endDate = '';
            this.searchForm.state = '';
            this.$refs.distributorSelect.clearSelected();
            this.$refs.productSelect.clearSelected();
            this.reloadTable();
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
            this.stateArr = await this.common.getDictionaryItems('agreement_state'); 
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
        custAgreementForm,
        custAgreementInfo    
    },
    watch: {}
}
</script>
<style>
 
</style>
