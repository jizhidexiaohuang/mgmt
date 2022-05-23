<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <div v-show="!infoCtrl">
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Button type="primary" :disabled="idList.length==0" @click="openAdd">批量付款确认</Button>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="付款单号/收款人" style="width: 250px;" 
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
                                        :placeholder="'请选择项目'"
                                        :placeholderInput="'请输入项目'"
                                        :keyName="'name'"
                                        @getValue="getProjectId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    申请日期
                                </Col>
                                <Col span="18">
                                    <DatePicker type="daterange" v-model="applyDate"
                                    @on-change="getApplyDate" placement="bottom-end" placeholder="请选择申请日期" style="width:100%"></DatePicker>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    支出类目
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.category" clearable>
                                        <Option v-for="item in paymentCategoryArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    付款状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state">
                                        <Option v-for="item in financePaymentStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                    <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                        :tableLoading="tableLoading" @refreshList="getIdList($event)">
                        <template slot-scope="{ row, index }" slot="more-actions">
                            <Dropdown @on-click="option(row,$event)" v-if="row.state=='P'">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="confirmPay">付款确认</DropdownItem>
                                    <DropdownItem name="rejectPay">拒绝付款</DropdownItem>
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
        </div>

        <!-- 付款确认 -->
        <Drawer 
            v-model="paymentCtrl"
            width="600"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span v-if="!isInfo">付款确认</span>
                <span v-if="isInfo">付款明细</span>
            </div>
            <financial-apply-form v-if="!isInfo&&paymentCtrl" :objList="isBatch?idObjList:[activeObj]" :paymentIdList="isBatch?idList:[id]" @closeModal="closeModal"></financial-apply-form>
            <payment-detail v-if="isInfo&&paymentCtrl" :defaultData="defaultData"></payment-detail>
        </Drawer>
        
        <!-- 拒绝 -->
        <Modal
            v-model="auditCtrl"
            title="拒绝付款"
            :width="350"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="80">
                <FormItem label="拒绝原因" prop="auditRemark"
                    :rules="[{required:true,message:'拒绝原因不能为空',trigger:'blur'},
                        {max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.auditRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写拒绝原因(不超过512个字符)'></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;">
                <Button type="primary" :loading="trunCaseLoading" :disabled="trunCaseLoading"  @click="auditSubmit('formValidate')">确认</Button>
                <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import financialApplyForm from './financialApplyForm.vue';
import paymentDetail from './paymentDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            paymentCtrl:false,
            searchForm:{
                keyword:"",
                projectId:"",
                paymentDateStart:"",
                paymentDateEnd:"",
                category:"",
                state:""
            },
            paymentCategoryArr:[],
            financePaymentStateArr:[],
            applyDate:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            infoCtrl:false,
            type:'',
            idList:[],
            idObjList:[],
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"付款单号",
                    key:"code",
                    width:130,
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.getDetail(params.row.id,"info");
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"申请人",
                    key:"applyUser"
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1));
                    }
                },
                {
                    title:"所属项目",
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
                    title:"支出类目",
                    key:"categoryName"
                },
                {
                    title:"收款人",
                    key:"bankUser"
                },
                {
                    title:"支出金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.amount));
                    }
                },
                {
                    title:"付款状态",
                    key:"state",
                    render:(h,params)=>{
                        let color;
                        let text = "待付款";
                        switch (params.row.state){
                            case 'P': color = 'warningColor';text='待付款'; break;
                            case 'S': color = 'successColor';text='已付款'; break;
                            case 'R': color = 'errorColor';text='已驳回'; break;
                        }
                        return h('Tag',{
                            attrs:{ 
                                color:styles[color]
                            },
                            style:{ borderRadius:'11px' }
                        },text)
                    }
                },
                {
                    title:'付款方式',
                    key:'payWay'
                },
                {
                    title:"备注",
                    key:"remark",
                    render:(h,params)=>{
                        return h("span",{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            },
                        },params.row.remark)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            auditCtrl:false,
            formValidate:{
                auditRemark:''
            },
            trunCaseLoading:false,
            isBatch:false,
            defaultData:'',
            activeObj:"",
            isInfo:false
        }
    },
    props: [''],
    computed:{},
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance-payments';
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
                        return {
                            _disabled:item.state=='P'?false:true,    
                            ...item
                        }
                    }) || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        //获取申请时间
        getApplyDate(data){
            this.searchForm.paymentDateStart = data[0];
            this.searchForm.paymentDateEnd = data[1];
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
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.applyDate = [];
            this.$refs.projectSelect.clearSelected();
            this.reloadTable();
        },
        openAdd(){
            // 判断帐号，卡号持有人姓名，开户行是否相同，必须全部相同才允许批量付款确认
            let isGoOn = true;
            let prevCardNumber = this.idObjList[0].cardNumber;
            let prevbankUser = this.idObjList[0].bankUser;
            let prevbankName = this.idObjList[0].bankName;
            this.idObjList.forEach((item,index)=>{
                if(prevCardNumber!=item.cardNumber || prevbankUser!=item.bankUser || prevbankName!=item.bankName){
                    isGoOn = false;
                    return
                }
            })
            if(isGoOn){
                this.isInfo = false;
                this.isBatch = true;
                this.paymentCtrl = true;
            }else{
                this.$Message.error("申请批量付款确认的结算单的开户行、开户人、银行卡号必须一致！");
            }
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.activeObj = row
            this.id = row.id;
            this.type = name;
            this.isBatch = false;
            switch(name){
                case "confirmPay":
                    this.isInfo = false;
                    this.paymentCtrl = true;
                    break;
                case "rejectPay":
                    this.auditCtrl = true;
                    this.$refs['formValidate'].resetFields();
                    break;
            }
        },
        // 拒绝付款
        auditSubmit(name){
            let url = '/settlement/finance-payment/reject';
            let ajaxData = {
                id:this.id,
                auditRemark:this.formValidate.auditRemark
            }
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.trunCaseLoading = true;
                    this.$patch(url,ajaxData).then(res=>{
                        this.auditCtrl = false;
                        this.trunCaseLoading = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.reloadTable()
                        }else{
                            this.$Message.error(res.message)
                        }
                    })
                }
            })
        },
        // 付款单明细
        getDetail(id,type){
            let url = `/settlement/finance-payment/${id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.isInfo = true;
                    this.defaultData = res.data || "";
                    if(type=="info"){
                        this.paymentCtrl = true;
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        // 关闭弹窗
        closeModal(reload){
            this.paymentCtrl = false;
            if(reload){
                this.reloadTable();
            }
        },
        /*------------操作End-------------*/
        getIdList(list){
            this.idObjList = [];
            this.idList = list.map(item=>{
                this.idObjList.push(item);
                return item.id
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.paymentCategoryArr = await this.common.getDictionaryItems('payment_category');
            this.financePaymentStateArr = await this.common.getDictionaryItems('finance_payment_state');
        }
    },
    created(){},
    activated(){
        this.getDictionary();
        this.getData();
    },
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        financialApplyForm,
        paymentDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
</style>