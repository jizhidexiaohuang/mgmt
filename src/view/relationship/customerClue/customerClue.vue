<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="openAddDrawer" v-permission="['market-center:customer_clue:add-']" type="primary">新增客户线索</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="联系人/公司/电话/邮箱" style="width: 250px;" 
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
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                客户性质
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.customerNature" style="width:190px;" clearable>
                                    <Option v-for="item in custPropertyArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                是否转客户
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.toCustomer" placeholder="请选择" clearable>
                                    <Option :value="1">是</Option>
                                    <Option :value="0">否</Option>
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
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row.id,$event,row.name)" v-if="!row.toCustomer" v-permission="['market-center:customer_clue:manage-']">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit">编辑</DropdownItem>
                                <DropdownItem name="transform">转客户</DropdownItem>
                                <DropdownItem name="remark">备注</DropdownItem>
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
                <span>{{(!isInfo && !isEdit)?'新增客户线索':'客户线索'}}</span>
                <Dropdown transfer @on-click="option(customerDetail.id,$event,customerDetail.name)" 
                    v-if="isInfo&&(!customerDetail.toCustomer)" class="edit-icon" v-permission="['market-center:customer_clue:manage-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-if="!isEdit" name="edit">编辑</DropdownItem>
                        <DropdownItem name="transform">转客户</DropdownItem>
                        <DropdownItem name="remark">备注</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <edit-customer v-if="!isInfo && addDrawerCtrl" :customerDetail="customerDetail" @changeEditCtrl="changeCtrl"></edit-customer>
            <customer-info v-if="isInfo" :customerDetail="customerDetail"></customer-info>
        </Drawer>

        <!-- 备注信息modal -->
        <Modal
            v-model="remarkCtrl"
            title="备注信息"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="form">
                <Row class="modal-tips">请填写备注信息</Row>
                <FormItem label="" prop="remark" 
                    :rules="[{required: true, message: '请填写备注信息', trigger: 'blur'}]">
                    <Input v-model.trim="form.remark" type="textarea" :autosize="{minRows: 4,maxRows: 6}" placeholder="备注信息"></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" :disabled="remarkLoading" :loading="remarkLoading" @click="submitRemark">确认</Button>
                    <Button @click="cancelRemark" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 转客户modal -->
        <Modal
            v-model="agreeCtrl"
            title="转客户确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否将 {{activeName}} 转为客户？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :disabled="transformLoading" :loading="transformLoading" @click="transformCustomer">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from './../../../assets/globalStyle.scss';
import editCustomer from './editCustomer.vue';
import customerInfo from './customerInfo.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                customerNature:"",
                industryId:"",
                toCustomer:""
            },
            searchBoxCtrl:false,
            agreeCtrl:false,
            custPropertyArr:[],
            tableLoading:false,
            remarkLoading:false,
            transformLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"客户名称",
                    key:"name",
                    render:(h,params)=>{
                        let arr = [];
                        let titleSpan = h('span',{
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
                                    this.getCustomerDetail(params.row.id,'info');
                                }
                            }
                        },params.row.name);
                        arr.push(titleSpan);
                        return arr
                    }
                },
                {
                    title:"客户性质",
                    key:"customerNatureName",
                    width:100
                },
                {
                    title:"区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        let str = (params.row.provinceName || "") + (params.row.cityName || "") + (params.row.areaName || "");
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:(params.row.provinceName || "") + (params.row.cityName || "") + (params.row.areaName || "")
                            }
                        },str)
                    }
                },
                {
                    title:"行业",
                    key:"industryName",
                },
                {
                    title:"联系人",
                    key:"contact",
                    width:100,
                    render:(h,params)=>{
                        let str = params.row.contact || "";
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.contact
                            }
                        },str)
                    }
                },
                {
                    title:"联系人电话",
                    key:"mobile"
                },
                {
                    title:"职务",
                    key:"position",
                },
                {
                    title:"来源",
                    key:"sourceName",
                },
                {
                    title:"是否转客户",
                    key:"email",
                    render:(h,params)=>{
                        let str = params.row.email || "";
                        let turnCustomer = h('Tag',{
                            class:'textover',
                            attrs:{
                                color:params.row.toCustomer?styles.successColor:styles.warningColor
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.toCustomer?"已转":"未转");
                        return [turnCustomer]
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
            customerDetail:'',
            remarkCtrl:false,
            id:"",
            activeName:"",
            form:{
                remark:""
            }
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/base/customer-clues';
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
        option(id,name,customerName){
            this.id = id;
            this.type = name;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getCustomerDetail(this.id,"edit");
                break;
                case 'transform': 
                    this.activeName = customerName;
                    this.agreeSubmit();
                    break;
                case 'remark': 
                    this.remarkCtrl = true;
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
            this.customerDetail = '';
        },
        getCustomerDetail(id,type){
            this.type = type;
            let url = '/base/customer-clue/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.customerDetail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                        this.isInfo = false;
                    }else if(type=="info"){
                        this.isInfo = true;
                        this.isEdit = false;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        cancelRemark(){
            this.remarkCtrl = false;
            this.form.remark = "";
        },
        //提交备注信息
        submitRemark(){
            let url = `/base/customer-clue/${this.id}/remark`;
            this.remarkLoading = true;
            this.$patch(url,{remark:this.form.remark}).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.remarkCtrl=false;
                    this.form.remark = "";
                    if(this.addDrawerCtrl){
                        this.getCustomerDetail(this.id,"info");
                    }
                }else{
                    this.$Message.error(res.message);
                }
                this.remarkLoading = false;
            })
        },
        //验证客户是否已经存在
        agreeSubmit(){
            let url = '/base/customer/check-name';
            let ajaxData = {
                name:this.activeName
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    if(!res.data){
                        this.agreeCtrl=true;
                    }else{
                        this.$Message.error("该客户已存在");
                    }
                }
            })
        },
        //转客户
        transformCustomer(){
            let url = `/base/customer-clue/${this.id}/to-customer`;
            this.transformLoading = true;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.agreeCtrl=false;
                    this.$Message.success("操作成功");
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
                this.transformLoading = false;
            })
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.customerNature = "";
            this.searchForm.industryId = "";
            this.$refs.industrySelect.clearSelected();
            this.searchForm.toCustomer = "";
            this.reloadTable();
        },
        // 获取行业id
        getIndustryId(data){
            this.searchForm.industryId = data.id;
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
            this.custPropertyArr = await this.common.getDictionaryItems('customer_nature');
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
        editCustomer,
        customerInfo
    },
    watch: {}
}
</script>
<style>
 
</style>
