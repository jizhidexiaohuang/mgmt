<template>
    <div style="height:100%">
        <!-- 列表 -->
        <Row class="table-box">
            <Table :columns="columns" :loading="tableLoading" :data="data"></Table>
        </Row>

        <Modal
            v-model="materialCtrl"
            title="查看保全材料"
            :width="450"
            :footer-hide="true">
            <Row class="detail-content" v-if="materialCtrl">
                <Row>
                    <Col span="5" class="left-label">保全材料：</Col>
                    <Col span="16" class="right-content">
                        <file-upload
                            :defaultList="materialAttchment || []" 
                            :uploadConfig="{readOnly:true}"></file-upload>
                    </Col>
                </Row>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            tableLoading:false,
            data:[],
            materialCtrl:false,
            materialAttchment:"",
            columns:[
                {
                    title:"保全类型",
                    key:"preservationTypeName",
                },
                {
                    title:"申请人",
                    key:"applicant",
                },
                {
                    title:"被申请人",
                    key:"respondent",
                },
                {
                    title:"保全金额",
                    key:"amount",
                    render:(h,params)=>{
                        return h('span',this.common.formateNumber(params.row.amount))
                    }
                },
                {
                    title:"保全材料",
                    key:"attachmentList",
                    render:(h,params)=>{
                        if(params.row.attachmentList.length>0){
                            return h('a',{
                                style:{
                                    color:styles.$globalMainColor,
                                    cursor:"pointer",
                                },
                                on:{
                                    click:()=>{
                                        this.materialAttchment = params.row.attachmentList;
                                        this.materialCtrl = true;
                                    }
                                }
                            },'查看材料')
                        }
                    }
                }
            ]
        }
    },
    props: ['processId'],
    methods: {
        getData(type){
            let url = '/business/case/preservation/'+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0&&res.data){
                    this.data = res.data;
                }else{
                    this.$Message.error(res.message||'暂无数据');
                }
            })
        },
    },
    created(){},
    beforeMount(){
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../caseCommon.scss';
.table-box{
    margin-top:10px;
}
</style>
