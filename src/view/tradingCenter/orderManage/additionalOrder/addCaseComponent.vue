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
                    所属项目
                </Col>
                <Col span="9">
                    <mySelect ref="projectSelect"
                        :path="'/business/projects/list'"
                        :placeholder="'请选择项目'"
                        :placeholderInput="'请输入项目名称'"
                        :keyName="'name'"
                        @getValue="getProjectId">
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
                <Col span="12" style="text-align:left;padding-left:25px;">
                    <Button type="primary" size="small" @click="reloadTable" style="margin-right:12px;">确定</Button>
                    <Button size="small" @click="clearConditions">重置</Button>
                </Col>
            </Row>
        </div>
        <!-- 表格 -->
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <Table :columns="columns" :data="data" :tableLoading="tableLoading"></Table>
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
                    title:"#",
                    width: 30,
                    align: 'center',
                    render:(h,params)=>{
                        return h('Radio',
                        {
                            props:{
                                value:params.row.caseId==this.selectedObj.caseId
                            },
                            on:{
                                "on-change":()=>{
                                    this.getRadio(params.row);
                                }
                            }
                        },
                        [
                            h('span')
                        ])
                    }
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h, params) => {
                        let dom = h("a",{
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
                    title:"项目",
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
                    title:"购买团队",
                    key:"teamName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.teamName
                            },
                        },params.row.teamName)
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
                projectId:'',
                province:'',
                city:'',
                area:'',
            },
            selectedObj:''
        }
    },
    props: ['defaultObj'],
    methods: {
        //获取数据
        getData(){
            let url = '/settlement/trade/sale/order/additional/cases';
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
            this.$refs.projectSelect.clearSelected();
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        // 单选
        getRadio(item){
            console.log(item)
            this.selectedObj = item;
            this.$emit('refreshList',item);
        },
        getProjectId(data){
            this.searchForm.projectId = data.id;
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
        this.getData()
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
