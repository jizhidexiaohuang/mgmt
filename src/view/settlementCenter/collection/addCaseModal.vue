<template>
    <div>
        <!-- 筛选 -->
        <div class="container" style="margin-bottom:10px;">
            <Row class="header-common-right-box">
                <Col span="3" class="header-common-col">
                    关键字
                </Col>
                <Col span="9">
                    <Input v-model="searchForm.keyword" placeholder="案件编号/对方当事人" style="width:100%" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                </Col>
                <Col span="3" class="header-common-col">
                    承办团队
                </Col>
                <Col span="9">
                    <mySelect ref="lawyerSelect" style="width:100%"
                        :path="'/base/teams'"
                        :keyName="'team'"
                        :width="190"
                        placeholder="请选择取证团队"
                        @getValue="getTeamsId">
                    </mySelect>
                </Col>
            </Row>
            <Row class="header-common-right-box">
                <Col span="3" class="header-common-col">
                    案件区域
                </Col>
                <Col span="9">
                    <City ref="transEvent" v-on:listenCity="getCity" style="width:100%;"></City>
                </Col>
                <Col span="8" style="text-align:left;padding-left:20px;">
                    <Button type="primary" size="small" @click="reloadTable" style="margin-right:12px;">确定</Button>
                    <Button size="small" @click="clearConditions">重置</Button>
                </Col>
            </Row>
        </div>
        <!-- 表格 -->
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <checkbox-table :columns="columns" :data="data" v-bind="$attrs" ref="checkboxTable"
                keyId="seq" :tableLoading="tableLoading" v-on="$listeners">
            </checkbox-table>
        </Row>
        <Row style="margin-top:30px;text-align:center;">
            <Page :total="table.totalRecords" show-total
                size="small"
                :current="table.pageNum"
                :page-size-opts="config.modalPageSizeOpts"
                :page-size="config.modalPageSize"
                prev-text="上一页" next-text="下一页"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-sizer show-elevator />
        </Row>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:110,
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"对方当事人",
                    key:"caseExtend",
                    render:(h,params)=>{
                        let domArr = [];
                        let idArr = params.row.caseExtend.litigantIds?params.row.caseExtend.litigantIds.split(",") : [];
                        let categoryArr = params.row.caseExtend.litigantCategories?params.row.caseExtend.litigantCategories.split(",") : [];
                        let nameArr = params.row.caseExtend.litigantNames?params.row.caseExtend.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title:'案件区域',
                    key:'cityName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:(params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||'')
                            },
                        },
                        (params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||''))
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
                    title: '承办团队',
                    key: 'caseTakerName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.caseTakerName
                            },
                        },params.row.caseTakerName)
                    }
                },
                {
                    title: '赔偿款',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            }
                        },amount)
                    }
                },
                {
                    title: '诉讼退费',
                    key: 'otherAmount',
                    render:(h,params)=>{
                        let otherAmount = this.common.formateNumber(params.row.otherAmount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:otherAmount
                            }
                        },otherAmount)
                    }
                },
            ],
            data:[],
            tableLoading:false,
            table:{
                totalRecords:1,
                pageNum:1,
                pageSize:this.config.modalPageSize
            },
            searchForm:{
                keyword:'',
                caseTaker:'',
                teamType:'',
                province:'',
                city:'',
                area:'',
            },
        }
    },
    props: ['params'],
    methods: {
        //获取数据
        getData(){
            let url = '/settlement/finance/claim/cases';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm,this.params);
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
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.lawyerSelect.clearSelected();
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        getTeamsId(data){
            this.searchForm.caseTaker = data.teamId;
            this.searchForm.teamType = data.platformSourceType;
        },
        //搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
                area = '';
            }
        },
        /*--------------------end---------------------*/
        //获取字典数据接口
        async getDictionary(){
            
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        this.getData()
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
