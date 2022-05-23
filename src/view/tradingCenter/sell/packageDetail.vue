<template>
    <div>
        <Row class="detail-header">
            <span>案件包信息</span>
            <slot name='operate-box'></slot>
        </Row>
        <div class="table-box">
            <!-- 公共包案件详情 -->
            <table class="subject-header-table subject-table" v-if="defaultData.type=='P'">
                <tbody>
                    <tr>
                        <td class="subject-table-color">案件包编号</td>
                        <td colspan="7" class="tl">{{defaultData.code}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">案件区域</td>
                        <td class="tl">{{getLocationStr(defaultData.caseSaleBagLocationList)}}</td>
                        <td class="subject-table-color">区域保护剩余时间</td>
                        <td class="tl">
                            <count-down :time="defaultData.protectSeconds || 0"></count-down>
                        </td>
                        <td class="subject-table-color">出证数量</td>
                        <td class="tl">{{(defaultData.certedNum || 0)}}/{{defaultData.caseNum || 0}}</td>
                        <td class="subject-table-color">出售状态</td>
                        <td class="tl">{{defaultData.saleStateName || ""}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">已预约案件</td>
                        <td class="tl">{{defaultData.reservedNum || 0}}件</td>
                        <td class="subject-table-color">已出售案件</td>
                        <td class="tl">{{defaultData.soldNum || 0}}件</td>
                        <td class="subject-table-color">待出售案件</td>
                        <td class="tl">{{defaultData.forSaleNum || 0}}件</td>
                        <td class="subject-table-color">案件总数</td>
                        <td class="tl">{{defaultData.caseNum || 0}}件</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">起批量</td>
                        <td class="tl">{{defaultData.batchNum || 0}}</td>
                        <td class="subject-table-color">已付定金</td>
                        <td class="tl">{{common.formateNumber(defaultData.prepaidFee || 0)}}</td>
                        <td class="subject-table-color">已付尾款</td>
                        <td class="tl">{{common.formateNumber(defaultData.paidBalanceFee || 0)}}</td>
                        <td class="subject-table-color">案件总价</td>
                        <td class="tl">
                            <Tooltip theme="light">
                                <span>{{common.formateNumber(defaultData.sellFee || 0)}}</span>
                                <div slot="content">
                                    <p>基础价格：{{common.formateNumber(defaultData.baseFee || 0)}}</p>
                                    <p>附加费用：{{common.formateNumber(defaultData.surchargeFee || 0)}}</p>
                                </div>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
            <!-- 指派包详情 -->
            <table class="subject-header-table subject-table" v-if="defaultData.type=='A'">
                <tbody>
                    <tr>
                        <td class="subject-table-color">案件包编号</td>
                        <td colspan="7" class="tl">{{defaultData.code}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">指派团队</td>
                        <td class="tl">{{defaultData.caseSaleBagLicensor.teamName || 0}}</td>
                        <td class="subject-table-color">购买状态</td>
                        <td class="tl">{{defaultData.caseSaleBagLicensor.acceptStateName || 0}}</td>
                        <td class="subject-table-color">发布状态</td>
                        <td class="tl">{{defaultData.publishStateName || 0}}</td>
                        <td class="subject-table-color">出售状态</td>
                        <td class="tl">{{defaultData.saleStateName || 0}}</td>
                    </tr>
                    <tr>
                        <td class="subject-table-color">购买剩余时间</td>
                        <td class="tl">
                            <count-down :time="defaultData.caseSaleBagLicensor.dueSeconds || 0"></count-down>
                        </td>
                        <td class="subject-table-color">出证数量</td>
                        <td class="tl">{{(defaultData.certedNum || 0)}}/{{defaultData.caseNum || 0}}</td>
                        <td class="subject-table-color">案件总数</td>
                        <td class="tl">{{defaultData.caseNum}}</td>
                        <td class="subject-table-color">案件总价</td>
                        <td class="tl">
                            <Tooltip theme="light">
                                <span>{{common.formateNumber(defaultData.sellFee || 0)}}</span>
                                <div slot="content">
                                    <p>基础价格：{{common.formateNumber(defaultData.baseFee || 0)}}</p>
                                    <p>附加费用：{{common.formateNumber(defaultData.surchargeFee || 0)}}</p>
                                </div>
                            </Tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <Row class="detail-header" style="margin:16px 0 10px 0;">
            <span>案件信息</span>
        </Row>
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <Table :columns="columns" :data="tableData || []"></Table>
        </Row> 
        <Row style="margin-top:10px;text-align:center;">
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

        <!-- 案件详情 -->
        <Drawer 
            v-model="caseInfoCtrl"
            width="800"
            title="案件详情"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <case-info v-if="caseInfoCtrl" :caseDetail="caseDetail"></case-info>
        </Drawer>

        <!-- 详情抽屉 -->
        <Drawer 
            width="700" 
            v-model="taskDetailCtrl" 
            @on-visible-change="getDetailHeight"
            :styles="{padding:'0px 0px 10px 0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">任务详情</div>
            <!-- 详情 -->
            <task-info v-if="taskDetailCtrl" :detailHeight="detailHeight" :taskDetail="taskDetail"></task-info>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseInfo from "./../buyBack/caseInfo.vue";
import taskInfo from "./../../task/plugin/taskInfo/index.vue";
import surchargeFeeExpand from './surchargeFeeExpand.vue';
export default {
    data () {
        return {
            styles:styles,
            caseInfoCtrl:false,
            taskDetailCtrl:false,
            taskDetail:"",
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:140,
                    render:(h, params) => {
                        let arr = [];
                        if(params.row.status!=null&&!params.row.status){
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px",
                                    "background":"red"
                                },
                                attrs:{
                                    title:"退回"
                                }
                            },"退");
                            arr.push(iconDom);
                        }
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
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
                        arr.push(dom)
                        return arr
                    }
                },
                {
                    title:"所属任务",
                    key:"projectName",
                    render:(h,params)=>{
                        return h("a",{
                            class:["textover"],
                            attrs:{ title:params.row.missionName },
                            on:{
                                "click":()=>{
                                    this.getTaskDetail(params.row.missionId);
                                }
                            }
                        },params.row.missionName)
                    }
                },
                {
                    title:"案件区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        let str = `${params.row.provinceName || ""}${params.row.cityName || ""}${params.row.areaName || ""}`;
                        return h("span",{
                            class:["textover"],
                            attrs:{ title:str }
                        },str)
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
                    title:"取证状态",
                    key:"certStateName"
                },
                {
                    title:"出售价格",
                    key:"sellFee",
                    render:(h,params)=>{
                        if(params.row.caseSaleBagItemExtend){
                            return h(surchargeFeeExpand,{
                                props: {
                                    row: params.row,
                                    isBaseFee: true,
                                    scale:params.row.scale
                                }
                            })
                        }else{
                            return h("span",this.common.formateNumber(params.row.sellFee || 0))
                        }
                    }
                },
                {
                    title:"案件类型",
                    key:"tortCategoryName"
                },
                {
                    title:"出售状态",
                    key:"saleState",
                    render:(h,params)=>{
                        let color;
                        let state = params.row.saleState;
                        switch (true){
                            case state=='P':color = 'warningColor';break;
                            case state=='PR':color = 'successColor';break;
                            case state=='S':color = 'infoColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.saleStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.saleStateName)
                    }
                },
                {
                    title:"案件性质",
                    key:"code"
                },
            ],
            caseDetail:"",
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            searchForm:{},
            tableData:"",
            detailHeight:""
        }
    },
    props: ['defaultData'],
    computed:{},
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
        getTaskDetail(id){
            let url = "/business/mission/"+id;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.taskDetail = res.data || {};
                    this.taskDetailCtrl = true;
                }else{
                    this.$Message.error(res.message); 
                }
            })
        },
        getData(){
            let url = '/settlement/trade/sale/bag/item';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                bagId:this.defaultData.id
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.tableData = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        getDetailHeight(value){
            if(value){
                let t = this;
                setTimeout(function(){
                    t.headerHeight = document.getElementById("header-detail").clientHeight; 
                    t.detailHeight = (t.headerHeight + 43) + 'px';
                },50);
            }
        },
        getLocationStr(arr){
            let location = [],json={},str;
            arr.forEach(item=>{
                if(item.flag){
                    if(!json[item.province]){
                        json[item.province] = item.provinceName;
                    }
                }else{
                    location.push(item.cityName)
                }
            })
            for(let key in json){
                location.push(json[key]);
            }
            str = location.join('，');
            return str
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
    beforeMount(){
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {
        caseInfo,
        taskInfo,
        surchargeFeeExpand
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./../buySettlement/refundDetail.scss";
.spec-header{
    margin:20px 0 10px 0;
}
.bill-box{
    border:1px solid #ECECEE;
    padding:20px;
    p{
        margin-bottom: 10px;
        &:last-child{
            margin-bottom: 0;
        }
    }
}
</style>
