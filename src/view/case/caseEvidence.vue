<template>
    <div class="litigant">
        <Row class="detail-header">
            <span>证据</span>
        </Row>
        <Row class="table-box" style="margin-bottom:16px;">
            <Table :columns="columns" :loading="tableLoading" :data="evidenceData">
                <template slot-scope="{ row, index }" slot="action">
                    <Icon type="md-eye" size="14" style="cursor:pointer" @click="option(row,'info')"/>
                </template>
            </Table>
        </Row>
        <Row class="detail-header">
            <span>关联证据</span>
        </Row>
        <Row class="table-box">
            <Table :columns="columns" :loading="tableLoading" :data="relatedEvidenceData">
                <template slot-scope="{ row, index }" slot="action">
                    <Icon type="md-eye" size="14" style="cursor:pointer" @click="option(row,'info')"/>
                </template>
            </Table>
        </Row>

        <!-- 详情抽屉 -->
        <Modal
            v-model="infoDrawerCtrl"
            title="证据详情"
            width="600"
            :footer-hide="true">
            <Row :style="blockStyle" v-if="infoDrawerCtrl">
                <case-evidence-info :defaultData="detailData" :clueDetail="clueDetail"></case-evidence-info>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseEvidenceInfo from './caseEvidenceInfo.vue';
export default {
    data () {
        return {
            styles:styles,
            blockStyle:{
                "max-height":"",
                "overflow-y":"auto",
                "margin":"-16px",
                "padding":"16px"
            },
            activeObj:{},
            tableLoading:false,
            isSubmit:false,
            infoDrawerCtrl:false,
            columns:[
                {
                    title:"证据类型",
                    key:"evidTypeName"
                },
                {
                    title:"公证书号/证据编号",
                    key:"notarialCode",
                },
                {
                    title:"取证时间",
                    key:"evidDate",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.evidDate,1));
                    }
                },
                {
                    title:"落款/固证时间",
                    key:"notarialObtainDate",
                    render:(h,params)=>{
                        let str = params.row.evidType == "EC"?params.row.curingTime:params.row.notarialObtainDate;
                        return h('span',this.common.formatTime(str,1));
                    }
                },
                {
                    title:"公证费",
                    key:"notarialFees",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.notarialFees || ""));
                    }
                },
                {
                    title:"公证书附件",
                    key:"notarialDeedAttachments",
                    render:(h,params)=>{
                        if(params.row.notarialDeedAttachments.length==0){
                            return h("span","");
                        }
                        let aDom = h('a',{
                            class:["textover"],
                            attrs:{
                                title:params.row.notarialDeedAttachments[0].fileName,
                                href:params.row.notarialDeedAttachments[0].url,
                                target:"_blank"
                            }
                        },params.row.notarialDeedAttachments[0].fileName);
                        return aDom
                    }
                },
                {
                    title:"操作",
                    slot:'action',
                    width:80
                },
            ],
            tableData:[],
            detailData:{}
        }
    },
    props: ['caseId','clueDetail'],
    computed:{
        relatedEvidenceData(){
            if(!this.tableData || this.tableData.length==0){ return [] }
            return this.tableData.filter((item,index)=>{
                return item.caseId != this.caseId
            })
        },
        evidenceData(){
            if(!this.tableData || this.tableData.length==0){ return [] }
            return this.tableData.filter((item,index)=>{
                return item.caseId == this.caseId
            })
        }
    },
    methods: {
        getData(){
            let url = '/business/evidences';
            let ajaxData = { caseId: this.caseId };
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.tableLoading = false;
                    this.tableData = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getDetail(){
            let url = '/business/evidence/'+this.activeObj.id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.detailData = res.data;
                    this.infoDrawerCtrl = true;
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        option(row,name){
            this.activeObj = row;
            switch (name) {
                case 'info':
                    this.getDetail();
                    break;
            }
            this.acceptCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.blockStyle["max-height"] = (document.body.clientHeight*0.8 - 55) + "px";
        this.detailData.caseId = this.caseId;
    },
    mounted(){
        this.getData();
    },
    updated(){},
    components: {
        caseEvidenceInfo
    },
    watch: {}
}
</script>
<style scoped lang="scss">
@import './../../assets/globalStyle.scss';
.litigant{
    margin:10px;
    .detail-header{
        background: #fff;
        padding:5px 0 5px 10px;
        &::before{
            left:0;
        }
    }
    .add-btn{
        float: right;
    }
    .table-box{
        border:1px solid #dcdee2;
        border-bottom:0;
    }
}
</style>
