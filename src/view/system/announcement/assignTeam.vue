<template>
    <div>
        <!-- 筛选 -->
        <div class="container" style="margin-bottom:10px;">
            <Row class="header-common-right-box">
                <Col span="12">
                    <Col span="6" class="header-common-col">
                        关键字
                    </Col>
                    <Col span="18">
                        <Input v-model="searchForm.keyword" placeholder="姓名/执业机构" style="width:100%" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                    </Col>
                </Col>
                <Col span="12">
                    <Col span="6" class="header-common-col">
                        所属区域
                    </Col>
                    <Col span="18">
                        <City ref="transEvent" @listenCity="getCity" style="width:100%;"></City>
                    </Col>
                </Col>
            </Row>
            <Row class="header-common-right-box">
                <Col span="12" style="text-align:left;padding-left:96px;">
                    <Button type="primary" size="small" @click="reloadTable" style="margin-right:12px;">确定</Button>
                    <Button size="small" @click="clearConditions">重置</Button>
                </Col>
            </Row>
        </div>
        <!-- 表格 -->
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <checkbox-table :columns="columns" :data="data" v-bind="$attrs" ref="checkboxTable"
                :tableLoading="tableLoading" v-on="$listeners">
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
    inheritAttrs:false,
    data () {
        return {
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"姓名",
                    key:"team",
                },
                {
                    title:"执业机构",
                    key:"company"
                },
                {
                    title:"调查区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.province+(params.row.city||'')+(params.row.area||'')
                            }
                        },params.row.province+(params.row.city||'')+(params.row.area||''))
                    }
                },
                {
                    title:"身份类型",
                    key:"teamType"
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
                area:''
            },
        }
    },
    props: {
        params:{
            type:Object
        }
    },
    methods: {
        //获取数据
        getData(){
            let url = '/base/teams';
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
            this.searchForm.keyword = "";
            this.searchForm.province = "";
            this.searchForm.city = "";
            this.searchForm.area = "";
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        //搜索条件省市区接口
        getCity(data){
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
            }
        },
        //获取字典数据接口
        async getDictionary(){}
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
