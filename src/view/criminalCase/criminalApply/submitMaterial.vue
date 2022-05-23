<template>
    <div class="submit-material">
        <Row class="detail-content" v-if="defaultData&&isDetailLoad">
            <Row><Col span="5" class="left-label">申请缘由：</Col><Col span="16" class="right-content">{{defaultData.reason}}</Col></Row>
            <Row><Col span="5" class="left-label">控告当事人：</Col><Col span="16" class="right-content">{{defaultData.litigantNames}}</Col></Row>
            <Row v-for="(item,index) in defaultData.materialList" :key="index">
                <Col span="5" class="left-label">{{item.name}}：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="item.attachmentList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
        </Row>
        <h3 v-if="!defaultData&&isDetailLoad" style="text-align:center;margin-top:10px;">暂无相关信息</h3>
        <h3 v-if="!isDetailLoad" style="text-align:center;margin-top:10px;">信息查询中</h3>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isDetailLoad:false,
            defaultData:""
        }
    },
    props: ['processId'],
    methods: {
        //获取详情
        getDetail(){
            let url = '/business/case/criminal/apply?processId='+this.processId;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.defaultData = res.data || "";
                    this.isDetailLoad = true;
                }
            })
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
