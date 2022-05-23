<template>
    <div style="padding-bottom:10px;">
        <Table :columns="columns" :data="data" :loading="tableLoading">
            <template slot-scope="{ row, index }" slot="action">
                <span class="icon-edit table-btn" title="编辑"></span>
                <span class="icon-auditing table-btn" title="审核"></span>
                <span class="icon-rebut table-btn" title="驳回"></span>
            </template>
        </Table>
        <Row style="margin-top:30px;text-align:center;">
            <Page :total="table.totalRecords" show-total
                size="small"
                :current="table.pageNum"
                :page-size-opts="config.pageSizeOpts"
                :page-size="10"
                prev-text="上一页" next-text="下一页"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-sizer show-elevator />
        </Row>

         <!-- 线索详情 -->
        <Drawer 
            title="线索详情" 
            v-model="clueDetailCtrl"
            width="800"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{clueDetail.code}}---{{clueDetail.missionName}}</span>
            </div>
            <clue-Info :clueDetail="clueDetail"></clue-Info>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import clueInfo from '../../../clue/myManage/clueInfo.vue';
export default {
    data () {
        return {
            tableLoading:true,
            data:[],
            table:{                     //表格数据接口的相关参数
                // pageSize:this.config.pageSize,
                pageSize:10,
                pageNum:1,
                totalRecords:1
            },
            styles:styles,
            columns:[
                {
                    title:"线索编号",
                    key:"code",
                    width:100,
                    render:(h,params) => {
                        let dom = h("a",{
                            class:["textover"],
                            attrs:{ title:params.row.code },
                            on:{
                                click:()=>{
                                    this.getClueDetail(params.row.id);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"侵权产品",
                    key:"clueProduct",
                    render:(h,params) => {
                        let text = params.row.clueProduct?params.row.clueProduct.productName:"";
                        let dom = h("span",{
                            class:["textover"],
                            attrs:{ title:text },
                        },text);
                        return dom
                    }
                },
                {
                    title:"侵权主体",
                    key:"tortSubject",
                    render:(h,params)=>{
                        let domArr = [];
                        let tortSubjectArr = params.row.tortSubject?params.row.tortSubject.split(",") : [];
                        let manufacturerArr = params.row.manufacturerName?params.row.manufacturerName.split(",") : [];
                        domArr = domArr.concat(this.renderSubject(h,params,tortSubjectArr,"L"));
                        domArr = domArr.concat(this.renderSubject(h,params,manufacturerArr,"M"));
                        return domArr
                    }
                },
                {
                    title:"报备人",
                    key:"reportTeam"
                },
                {
                    title:"侵权地址",
                    key:"provinceName",
                    render:(h,params)=>{
                        let text = (params.row.provinceName || "") + (params.row.cityName || "") + (params.row.areaName || "");
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:text
                            }
                        },text)
                    }
                },
                {
                    title:"调查时间",
                    key:"surveyDate"
                },
                {
                    title:"状态",
                    key:"state",
                    width:100,
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
                }
            ],
            clueDetailCtrl:false,
            clueDetail:""
        }
    },
    props: ['id'],
    methods: {
        getData(){
            let url = '/business/clues';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
                missionId:this.id
            };
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },  
        getClueDetail(id){
            this.clueDetailCtrl = true;
            let url = '/business/clue/view/'+id;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.clueDetail = res.data;
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
        renderSubject(h,params,arr,type){
            let temArr = [];
            arr.forEach((item,index)=>{
                // let iconDom = h('span',{
                //     class:'descripe-icon',
                //     style:{
                //         "marginRight":"5px"
                //     }
                // },type==="M"?"产":"售");
                let spanDom = h('span',item);
                let pDom = h('p',{
                    class:"textover",
                    attrs:{ title:item },
                },[spanDom]);
                temArr.push(pDom)
            })
            return temArr
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    updated(){},
    components: {
        clueInfo
    },
    watch: {}
}
</script>
<style>
 
</style>
