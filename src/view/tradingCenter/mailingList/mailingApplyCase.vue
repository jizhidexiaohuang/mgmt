<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <!-- <Button type="primary" :disabled="idList.length==0" @click="openNewMail">批量邮寄</Button> -->
                </Col>
                <Col style="float:right;">
                    <slot name='close-icon'></slot>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <!-- <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)" v-if="!row.mailingAll">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="add">新建邮寄</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template> -->
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
            width="900"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">案件详情</div>
            <case-detail style="top:0;" v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-detail>
        </Drawer>

        <!-- 新建邮寄信息 -->
        <Modal
            v-model="mailCtrl"
            title="新建邮寄信息"
            :width="400"
            :footer-hide="true">
            <mailing-form :receiveId="receiveId" v-if="mailCtrl" :caseList="idObjList" :defaultData="defaultData" @closeModal="closeModal"></mailing-form>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import mailingForm from "./mailingForm.vue";
import caseDetail from "./../../case/caseDetail.vue";
export default {
    data () {
        return {
            styles:styles,
            id:'',
            idList:[],
            idObjList:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                // {
                //     type: 'selection',
                //     width: 30,
                //     align: 'center'
                // },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:120,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.globalMainColor
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                            on:{
                                "click":()=>{
                                    this.getCaseDetail(params.row.caseId);
                                }
                            }
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"对方当事人",
                    key:"litigantNames"
                },
                {
                    title:"项目名称",
                    key:"projectName",
                    render:(h,params)=>{
                        return h("span",{
                            class:["textover"],
                            attrs:{
                                title:params.row.projectName
                            }
                        },params.row.projectName)
                    }
                },
                {
                    title:"公证书",
                    key:"certificateNo",
                },
                {
                    title:"购买时间",
                    key:"purchaseTime",
                    render:(h,params)=>{
                        return h("span",this.common.formatTime(params.row.purchaseTime,1))
                    }
                },
                // {
                //     title:"是否邮寄公证物",
                //     key:"notary",
                //     align:"center",
                //     render:(h,params)=>{
                //         if(params.row.hasSendNotary){
                //             return h("span","已邮寄");
                //         }
                //         return this.renderCheckbox(h,params,"notary");
                //     }
                // },
                // {
                //     title:"是否邮寄公证书",
                //     key:"certificate",
                //     align:"center",
                //     render:(h,params)=>{
                //         if(params.row.hasSendCertificate){
                //             return h("span","已邮寄");
                //         }
                //         return this.renderCheckbox(h,params,"certificate");
                //     }
                // },
                // {
                //     title:"是否邮寄公证发票",
                //     key:"notaryInvoice",
                //     align:"center",
                //     render:(h,params)=>{
                //         if(!params.row.invoice){
                //             return h("span","无发票")
                //         }

                //         if(params.row.hasSendNotaryInvoice){
                //             return h("span","已邮寄");
                //         }

                //         return this.renderCheckbox(h,params,"notaryInvoice");
                //     }
                // },
                // {
                //     title:"操作",
                //     width:120,
                //     slot: 'action'
                // },
            ],
            type:'',
            mailCtrl:false,
            defaultData:"",
            caseInfoCtrl:false,
            caseDetail:""
        }
    },
    props: ['receiveId'],
    methods: {
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        },
        renderCheckbox(h,params,key){
            if(params.row.mailingAll){
                return h("span","是")
            }
            let checkboxDom = h("Checkbox",{
                props: {
                    value:params.row[key],
                },
                on:{
                    "on-change":(val)=>{
                        params.row[key] = val;
                        this.$set(this.data[params.index],key,val);
                        this.idObjList.forEach((item,index)=>{
                            if(item.id = params.row.id){
                                this.$set(this.idObjList[index],key,val);
                            }
                        })
                    },
                }
            },"")
            return checkboxDom
        },
        openNewMail(){
            let isGo = true;
            this.idObjList.forEach((item,index)=>{
                if( (!item.hasSendNotary&&!item.notary) || (!item.hasSendCertificate&&!item.certificate) || (!item.hasSendNotaryInvoice&&!item.notaryInvoice) ){
                    this.$Message.error("存在未勾选邮寄物品的案件，请确保每条案件至少有一项邮寄物品");
                    isGo = false;
                    return
                }
            })
            if(isGo){
                this.mailCtrl = true;
            }
        },
        /*--------------------start---------------------*/
        getIdList(list){
            this.idObjList = [];
            this.idList = list.map(item=>{
                this.idObjList.push(item);
                return item.id
            })
        },
        /*--------------------end---------------------*/
        //获取列表数据
        getData(){
            let url = '/settlement/order-mailing-details';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize,
                receiverInfoId:this.receiveId,
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.data.forEach((item,index)=>{
                        if(item.notary){
                            item.hasSendNotary = true;//代表已经邮寄了公证物
                        }
                        if(item.certificate){
                            item.hasSendCertificate = true;//代表已经邮寄了公证书
                        }
                        if(item.notaryInvoice){
                            item.hasSendNotaryInvoice = true;//代表已经邮寄了公证发票
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
        },
        closeModal(reload){
            this.mailCtrl = false;
            this.$refs.checkboxTable.clearSelected();
            if(reload){
                this.$emit("reloadList");
                this.reloadTable();
            }
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch (name) {
                case 'add':
                    if( (!row.hasSendNotary&&!row.notary) || (!row.hasSendCertificate&&!row.certificate) || (!row.hasSendNotaryInvoice&&!row.notaryInvoice&&row.notary)){
                        this.$Message.error("请至少勾选一项邮寄物品");
                        return
                    }
                    this.idList = [this.id];
                    this.idObjList = [row];
                    this.mailCtrl = true;
                    break;
            }
        },
        /*------------操作End-------------*/
    },
    created(){},
    activated(){},
    beforeMount(){
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {
        mailingForm,
        caseDetail
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
</style>

