<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
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
                    <Input v-model="searchForm.keyword" placeholder="结算单编号/案件编号" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                申请团队
                            </Col>
                            <Col span="18">
                                <mySelect ref="teamSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择申请团队'"
                                    :placeholderInput="'请输入团队名称'"
                                    :keyName="'team'"
                                    :params="{teamType:'I'}"
                                    @getValue="getTeamId">
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
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="pass">通过</DropdownItem>
                                <DropdownItem name="rejected">驳回</DropdownItem>
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
        <!-- 结算单详情 -->
        <statement-detail v-if="infoCtrl" :statementDetailId="id">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
            <div class="operate-box" slot="operate-box">
                <Dropdown @on-click="option({id:id},$event)">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="pass">通过</DropdownItem>
                        <DropdownItem name="rejected">驳回</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </statement-detail>
        <Modal v-model="rejectCtrl" title="提示" class-name="vertical-center-modal" :footer-hide="true" width="400">
            <p style="margin-bottom:10px;">是否驳回选中结算单？</p>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" >
                <FormItem label="驳回原因" prop="desc">
                    <Input v-model="formValidate.desc" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="驳回原因"></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin-top:20px;">
                <Button style="margin-right:5px;" type="primary" @click="settlementRemove('formValidate')">确认</Button>
                <Button @click="rejectCtrl=false">取消</Button>
            </Row>
        </Modal>

        <Modal v-model="passCtrl" title="提示" class-name="vertical-center-modal" :footer-hide="true" width="300">
            <p style="margin-bottom:15px;font-size:14px;">是否通过该结算单？</p>
            <Row style="text-align:center;">
                <Button type="primary" class="do-div-btn" @click="passSettlement">确认</Button>
                <Button class="do-div-btn" @click="passCtrl=false">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import statementDetail from './statementDetail.vue'
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            searchForm:{ //搜索
                keyword:'',
                teamId:'',
            },
            projectStateArr:[],//筛选条件
            idList:[],
            data:[],
            id:'',//结算单id
            infoCtrl:false, //结算单详情框
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            formValidate:{
                desc:''
            },
            ruleValidate: {
                desc: [
                    { required: true, message: '请输入驳回理由', trigger: 'blur' }
                ]
            },
            addDrawerCtrl:false,
            searchBoxCtrl:false,
            rejectCtrl:false, //驳回
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"结算单号",
                    key:"code",
                    tree:true,
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
                                    this.getStatementDetail(params.row.id);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:'申请日期',
                    key:'createTime',
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1))
                    }
                },
                {
                    title:'案件数量',
                    key:'caseNum'
                },
                {
                    title:'申请团队',
                    key:'teamName'
                },
                {
                    title:"结算金额",
                    key:"totalAmount",
                    render:(h,params)=>{
                       return h('span',this.common.formateNumber(params.row.totalAmount))
                    }
                },
                {
                    title:"审核状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        let text = "";
                        switch (state){
                            case 'P':
                                color = 'warningColor';
                                text = "待审核";
                                break;
                            case 'E':
                                color = 'successColor';
                                text = "审核通过";
                                break;
                            case 'R':
                                color = 'errorColor';
                                text = "审核驳回";
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
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            casePurchaseStatement:{
                id:'',
                auditRemark:''
            },
            passCtrl:false
        }
    },
    props: [''],
    methods: {
        // 导出
        exportOption(name){
            console.log(name);
        },
        getData(){
            let url = '/settlement/trade/purchase/mgmt/statement-pending'
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
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
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.teamSelect.clearSelected();
            this.reloadTable();
        },
        /*--------------------start---------------------*/
        getIdList(list){
            this.idList = list.map(item=>{
                return item.id
            })
        },
        /*--------------------end---------------------*/
        option(row,name){
            this.id = row.id;
            switch (name) {
                case 'pass':
                    this.passCtrl = true;
                    break;
                case 'rejected':
                    this.rejectedSettlement(row)
                    break;
                default:
                    break;
            }
        },
        //结算单审核通过
        passSettlement(){
            let url = '/settlement/mgmt/purchase-statement/pass'
            let ajaxData = {
                id: this.id 
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.infoCtrl = false;
                    this.passCtrl = false;
                    // 重新获取数据
                    this.getData()
                }
            })
        },
        //结算单驳回
        rejectedSettlement(data){
            this.rejectCtrl = true
            this.id = data.id
        },
        //确认驳回
        settlementRemove(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    let url = '/settlement/mgmt/purchase-statement/rejected';
                    let ajaxData = {
                        id: this.id,
                        auditRemark: this.formValidate.desc
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        this.rejectCtrl = false;
                        if(res.code==0){
                            // 重新获取数据
                            this.getData();
                            this.infoCtrl = false;
                            this.$Message.success("操作成功!");
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        //获取申请团队id
        getTeamId(data){
            this.searchForm.teamId = data.teamId
        },
        getStatementDetail(detailId){
            this.infoCtrl = true;
            this.id = detailId
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    activated(){
        this.reloadTable();
    },
    updated(){},
    components: {
        statementDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
.operate-box{
    position: absolute;
    right: 40px;
    top: 0px;
    font-size:20px;
    cursor: pointer;
    .close-icon{
        margin-left: 10px;
    }
}
</style>