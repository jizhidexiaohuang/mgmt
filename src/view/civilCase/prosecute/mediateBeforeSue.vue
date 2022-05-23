<template>
    <div>
        <Row v-if="defaultData" class="detail-content">
            <Row><Col span="5" class="left-label">联调时间：</Col><Col span="16" class="right-content">{{defaultData.mediationDate}}</Col></Row>
            <Row><Col span="5" class="left-label">联调案号：</Col><Col span="16" class="right-content">{{defaultData.caseNumber}}</Col></Row>
            <Row><Col span="5" class="left-label">预计联调周期：</Col><Col span="16" class="right-content">{{defaultData.periodName}}</Col></Row>
        </Row>
        <h3 v-else style="text-align:center;margin-top:10px;">暂无相关信息</h3>
    </div>
</template>
<script>
export default {
    data () {
        return {
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        // 获取诉前联调详情
        getDetail(){
            let url = '/business/case/mediation?type=BL&processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                }
            });
        }
    },
    created(){},
    beforeMount(){
        this.getDetail();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
