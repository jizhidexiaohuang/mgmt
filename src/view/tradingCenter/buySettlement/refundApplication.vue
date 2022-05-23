<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <div v-show="!infoCtrl">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <Button type="primary" @click="openAdd">新增退款申请</Button>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="退款单号/案件编号" style="width: 250px;" 
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
                                        @getValue="getTeamId">
                                    </mySelect>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    确认状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state" placeholder="请选择确认状态">
                                        <Option v-for="item in refundStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    冲抵状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.payState" placeholder="请选择冲抵状态">
                                        <Option v-for="item in refundPayStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                            <Dropdown @on-click="option(row,$event)" v-if="row.state!='E'">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="change" v-if="row.state!='E'">修改</DropdownItem>
                                    <DropdownItem name="revoke" v-if="row.state!='E'">撤销</DropdownItem>
                                    <DropdownItem name="getPay" v-if="row.state=='E'&&row.payState=='P'">已线下收款</DropdownItem>
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

            <refund-detail ref="refundDetail" v-if="infoCtrl" :isEdit="isEdit" :defaultData="defaultData" @closeDetail="closeCtrl" @changeEdit="isEdit=true">
                <div class="operate-box" slot="operate-box">
                    <Dropdown @on-click="option(defaultData,$event)">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="create" v-if="!defaultData || isEdit">生成退款单</DropdownItem>
                            <DropdownItem name="print" v-else>打印退款单</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                    <Icon class="close-icon" @click="infoCtrl=false" type="md-close"/>
                </div>
            </refund-detail>
        </div>

        <!-- 打印退款单 -->
        <Modal
            v-model="printCtrl"
            width="90%"
            :styles="{padding:0}"
            :closable="false"
            :footer-hide="true">
            <refund-print :defaultData="defaultData" @closeModal="printCtrl=false"></refund-print>
        </Modal>

        <!-- 撤销退款单 -->
        <Modal
            v-model="revokeCtrl"
            :width="300"
            title="提示"
            :footer-hide="true">
            <Row style="font-size:14px;margin-bottom:10px;">{{type=="revoke"?"请问是否撤销该退款单？":"请问该退款单是否已经确认收款？"}}</Row>
            <Row style="text-align:center;">
                <Button type="primary" @click="confrimRevoke">确认</Button>
                <Button @click="revokeCtrl=false">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import refundDetail from "./refundDetail.vue";
import refundPrint from "./plugin/refundPrint.vue";
export default {
    data () {
        return {
            styles:styles,
            printCtrl:false,
            id:'',
            searchForm:{
                keyword:'',
                state:'',
                payState:'',
                teamId:''
            },
            caseStateArr:[],
            certStateArr:[],
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
            columns:[
                {
                    title:"退款单号",
                    key:"code",
                    width:125,
                    render:(h,params)=>{
                        let aDom = h("a",{
                            class:["textover"],
                            on:{
                                click:()=>{
                                    this.id = params.row.id;
                                    this.isEdit = false;
                                    this.getDetail();
                                }
                            }
                        },params.row.code)
                        return aDom
                    }
                },
                {
                    title:"申请日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.createTime,1))
                    }
                },
                {
                    title:"通过/驳回日期",
                    key:"confirmTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.confirmTime,1))
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNum"
                },
                {
                    title:"申请团队",
                    key:"teamName"
                },
                {
                    title:"服务费退款金额",
                    key:"totalServiceAmount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalServiceAmount || ''))
                    }
                },
                {
                    title:"公证费退款金额",
                    key:"totalEvidAmount",
                    render:(h,params)=>{
                        return h("span",this.common.formateNumber(params.row.totalEvidAmount || ''))
                    }
                },
                {
                    title:"确认状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        switch (params.row.state){
                            case 'E':color = 'successColor';break;
                            case 'R':color = 'errorColor';break;
                            case 'P':color = 'warningColor';break;
                        }
                        let tagDom = h('Tag',{
                            attrs:{ color:styles[color] },
                            style:{ borderRadius:'11px' }
                        },params.row.stateName);
                        let spanDom = h('span','-');
                        return params.row.state?[tagDom]:[spanDom]
                    }
                },
                {
                    title:"退款原因",
                    key:"reasonName",
                    render:(h,params)=>{
                        let str = params.row.reasonName || "";
                        return h("span",{
                            attrs:{
                                title:str
                            }
                        },str)
                    }
                },
                {
                    title:"冲抵状态",
                    key:"payStateName",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.payState){
                            case "P": color = "orange"; break;
                            case "S": color = "green"; break;
                            default:color = "blue";break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            attrs:{ color:color }
                        },params.row.payStateName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                }
            ],
            defaultData:"",
            isEdit:false,
            revokeCtrl:false,
            refundPayStateArr:[],
            refundStateArr:[]
        }
    },
    props: [],
    methods: {
        //获取列表数据
        getData(){
            let url = `/settlement/trade/purchase/refund/mgmt`;
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
        getDetail(){
            let url = `/settlement/trade/purchase/refund/${this.id}`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data;
                    this.infoCtrl = true;
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
            this.idList = [];
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
        closeCtrl(bool){
            this.infoCtrl = false;
            if(bool){
                this.reloadTable();
            }
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch(name){
                case "create":
                    this.$refs.refundDetail.handleSumbit();
                    break;
                case "change":
                    this.isEdit = true;
                    this.getDetail();
                    break;
                case "revoke":
                    this.revokeCtrl = true;
                    break;
                case "print":
                    this.printCtrl = true;
                    break;
                case "getPay":
                    this.revokeCtrl = true;
                    break;
            }
        },
        openAdd(){
            this.defaultData = "";
            this.infoCtrl = true;
        },
        confrimRevoke(){
            let url = "";
            if(this.type=="revoke"){
                url = `/settlement/trade/purchase/mgmt/purchase-refund/${this.id}`;
                this.$del(url).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.revokeCtrl = false;
                        this.reloadTable();
                    }
                })
            }else if(this.type=="getPay"){
                url = `/settlement/trade/purchase/mgmt/purchase-refund-offline-pay`;
                let ajaxData = {
                    id:this.id
                }
                this.$patch(url,ajaxData).then(res=>{
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.revokeCtrl = false;
                        this.reloadTable();
                    }else{
                        this.$Message.success("操作失败!");
                    }
                })
            }
        },
        //选择团队
        getTeamId(data){
            this.searchForm.teamId = data.teamId;
        },
        /*------------操作End-------------*/
        //获取字典数据接口
        async getDictionary(){
            this.refundPayStateArr = await this.common.getDictionaryItems('pur_refund_pay_state');
            this.refundStateArr = await this.common.getDictionaryItems('pur_refund_state');
        }
    },
    created(){},
    activated(){
        this.getData();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {
        refundDetail,
        refundPrint
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
.operate-box{
    position: absolute;
    right:15px;
    top:3px;
    font-size:20px;
    cursor: pointer;
    .close-icon{
        margin-left: 10px;
    }
}
</style>