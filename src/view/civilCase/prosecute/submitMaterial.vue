<template>
    <div>
        <Row v-if="defaultData" class="detail-content">
            <Row><Col span="5" class="left-label">递交材料日期：</Col><Col span="16" class="right-content">{{defaultData.filingDate}}</Col></Row>
            <Row><Col span="5" class="left-label">递交方式：</Col><Col span="16" class="right-content">{{defaultData.filingWayName}}</Col></Row>
            <Row><Col span="5" class="left-label">接受法院：</Col><Col span="16" class="right-content">{{defaultData.court}}</Col></Row>
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
        // 获取递交材料详情
        getDetail(){
            let url = '/business/case-filing?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultData = res.data || "";
                    this.$emit('getAuditState',res.data?true:false)
                }
            });
        },
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
