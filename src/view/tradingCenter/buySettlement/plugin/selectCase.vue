<template>
    <div>
        <!-- 筛选 -->
        <div class="container" style="margin-bottom:10px;">
            <Row class="header-common-right-box">
                <Col span="3" class="header-common-col">
                    关键字
                </Col>
                <Col span="9">
                    <Input v-model="searchForm.keyword" @on-change="reloadTable" placeholder="案件编号/对方当事人" style="width:100%" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                </Col>
                <Col span="3" class="header-common-col">
                    承办团队
                </Col>
                <Col span="9">
                    <mySelect ref="lawyerSelect" style="width:100%"
                        :path="'/base/lawyer-teams'"
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
            <checkbox-table :columns="columns" :defaultObjList="objArr" :data="data" @refreshList="getIdList($event)" ref="checkboxTable"
                :keyId="mainKey" :tableLoading="tableLoading">
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
export default {
    data () {
        return {
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                },
                {
                    title:"对方当事人",
                    key:"litigantNames"
                },
                {
                    title:"案件区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        let str = (params.row.provinceName|| '')+(params.row.cityName||'')+(params.row.areaName||'');
                        return h('span',{
                            class:'textover',
                            attrs:{ title:str }
                        },str)
                    }
                },
                {
                    title:"所属项目",
                    key:"projectName"
                },
                {
                    title:"承办团队",
                    key:"team"
                }
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
                province:'',
                city:'',
                area:'',
                teamId:''
            },
            idList:[],
            idObjList:[],
        }
    },
    props: {
        defaultData:{
            type:Array,
            required:true
        },
        objArr:{
            type:Array,
            default:[]
        },
        mainKey:{
            type:String,
            default:"caseId"
        },
        // 所需要传递的对象
        params:{
            type:Object,
            default(){
                return {}
            }
        },
        //接口地址
        path:{
            type:String
        }
    },
    methods: {
        //获取数据
        getData(){
            let url = this.path;
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize,
                ...this.params
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
        getTeamsId(data){
            this.searchForm.teamId = data.id;
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
            this.searchForm.keyword = "";
            this.searchForm.teamType = "";
            this.searchForm.province = "";
            this.searchForm.city = "";
            this.searchForm.area = "";
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
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
        getIdList(list){
            this.idList = [];
            this.idObjList = [];
            list.forEach((item,index)=>{
                this.idObjList.push(item);
                this.idList.push(item[this.mainKey])
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.teamTypeArr = await this.common.getDictionaryItems('team_type');
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    updated(){},
    components: {},
    watch: {
        
    }
}
</script>
<style>
 
</style>
