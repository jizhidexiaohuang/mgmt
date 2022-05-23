<template>
    <div class="send-letter">
        <Row class="detail-header">
            <span>发函记录 (律师函)</span>
        </Row>
        <Row class="case-content">
            <!-- 律师函 -->
            <Row class="table-box" style="margin-bottom:16px">
                <Table :columns="letterColumns" :loading="tableLoading" :data="lawyerLetterData"></Table>
            </Row>
            <Row class="detail-header">
                <span>发函记录 (线上投诉)</span>
            </Row>
            <!-- 线上投诉 -->
            <Row class="table-box">
                <Table :columns="complaintColumns" :loading="tableLoading" :data="complainData"></Table>
            </Row>
        </Row>

        <Row class="viewer-img-box">
            <viewer :options="options" @inited="inited">
                <img ref="imgDom" :src="imgUrl" :data-source="imgUrl" alt="">
            </viewer>
        </Row>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+this.expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>

        <Modal 
            v-model="onlineWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">在线文档</div>
            <div style="height:100%;">
                <wps-file 
                    :fileUrl="onlineFileUrl"
                    operate="edit"
                    :readOnly="true"
                    v-if="onlineWordModal"></wps-file>
            </div>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            addCtrl:false,
            logisticsCtrl:false,
            expressNo:'',
            company:'',
            tableLoading:false,
            onlineWordModal:false,
            styles:styles,
            onlineFileUrl:"",
            imgUrl:"",
            options: {
                url: "data-source"
            },
            letterColumns:[
                {
                    title:"发函时间",
                    key:"sendDateStr",
                },
                {
                    title:"发函内容",
                    key:"letterContent",
                    render:(h,params)=>{
                        let dom = h("span",{
                            class:["textover"],
                            attrs:{
                                title:params.row.letterContent,
                            }
                        },params.row.letterContent)
                        return dom
                    }
                },
                {
                    title:"文件",
                    key:"attachmentList",
                    render:(h,params)=>{
                        let arrs = [];
                        params.row.attachmentList.forEach((item)=>{
                            let type = this.common.getFileType(item.mediaType);
                            let spanDom = h("span",{
                                class:["textover"],
                                style:{
                                    display:"block",
                                    color:styles.globalMainColor,
                                    cursor:"pointer"
                                },
                                attrs:{ title:item.fileName },
                                on:{
                                    click:()=>{
                                        if(type==="image"){
                                            this.imgUrl = item.url;
                                            this.$viewer.update();
                                            this.$refs["imgDom"].click();
                                        }else{
                                            this.onlineFileUrl = item.url;
                                            this.onlineWordModal = true;
                                        }
                                    }
                                }
                            },item.fileName)
                            let linkDom = h("a",{
                                class:["textover"],
                                style:{ display:"block" },
                                attrs:{
                                    title:item.fileName,
                                    href:item.url,
                                    target:"_blank"
                                }
                            },item.fileName)
                            if(type==="image" || type==="wps"){
                                arrs.push(spanDom);
                            }else if(type==="other"){
                                arrs.push(linkDom);
                            }
                        })
                        return arrs;
                    }
                },
                {
                    title:"发函方式",
                    key:"sendWayName"
                },
                {
                    title:"是否收到已读回执",
                    key:"auditState",
                    render:(h,params)=>{
                        let dom;
                        if(params.row.sendWay=="M"){
                            let arrs =  [h('span',{slot: 'open'},'是'),h('span', {slot: 'close'},'否')]
                            dom = h("i-switch",{
                                class:["textover","icon-case-05"],
                                attrs:{
                                    value:params.row.emailReturnReceipt
                                },
                                props:{
                                    'disabled':true
                                },
                            },arrs)
                        }else if(params.row.sendWay=="E"){
                            dom = h("span","--")
                        }
                        return dom
                    }
                },
                {
                    title:"物流信息",
                    key:"operate",
                    render:(h,params)=>{
                        let dom;
                        if(params.row.sendWay=="M"){
                            dom = h("span","--");
                        }else if(params.row.sendWay=="E"){
                            dom = h("a",{
                            class:["textover"],
                                style:{
                                    cursor:"pointer"
                                },
                                attrs:{
                                    title:"物流信息",
                                    cursor:"pointer"
                                },
                                on:{
                                    click:()=>{
                                        this.expressNo = params.row.expressNo;
                                        this.company = params.row.expressCompany;
                                        this.logisticsCtrl = true;
                                    }
                                }
                            },"物流信息")
                        }
                        return dom
                    }
                }
            ],
            complaintColumns:[
                {
                    title:"投诉时间",
                    key:"complaintsDateStr"
                },   
                {
                    title:"投诉网址",
                    key:"url",
                    render:(h,params)=>{
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                display:"block"
                            },
                            attrs:{
                                href:params.row.url,
                                target:"_blank"
                            }
                        },params.row.url)
                        return dom;
                    }
                },
                {
                    title:"投诉平台",
                    key:"platformName"
                },
                {
                    title:"投诉内容",
                    key:"content"
                }
            ],
            lawyerLetterData:[],
            complainData:[],
        }
    },
    props: ['processId'],
    computed:{},
    methods: {
        inited(viewer) {
            this.$viewer = viewer;
        },
        getData(){
            let url = '/business/case/lawyer-letters';
            let ajaxData = {
                processId:this.processId
            }
            this.isTableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.lawyerLetterData = res.data.lawyerLetter || [];
                    this.complainData = res.data.onlineComplaints || [];
                }
                this.isTableLoading = false;
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "../caseCommon.scss";
</style>
