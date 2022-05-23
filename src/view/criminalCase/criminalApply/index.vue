<template>
    <div class="criminal-apply">
        <Row class="detail-header">
            <span>刑事申请</span>
            <ButtonGroup size="small" class="lawsuit-btn">
                <Button @click="tabActive='sumbitMaterials'" :type="tabActive=='sumbitMaterials'?'primary':'default'">材料申请</Button>
                <Button @click="tabActive='senDdata'" :type="tabActive=='senDdata'?'primary':'default'">材料寄送</Button>
            </ButtonGroup>
        </Row>
        <Row class="lawsuit-form">
            <submit-material v-if="tabActive=='sumbitMaterials'" :processId="processId" :caseId="caseId"></submit-material>
            <send-data v-else :processId="processId" :caseId="caseId" v-on="$listeners"></send-data>
        </Row>
    </div>
</template>
<script>
import submitMaterial from "./submitMaterial.vue";
import sendData from "./sendData.vue";
export default {
    data () {
        return {
            tabActive:"sumbitMaterials"
        }
    },
    props: ['processId','caseId'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        submitMaterial,
        sendData
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/globalStyle.scss';
@import '../../civilCase/caseCommon.scss';
.criminal-apply{
    .lawsuit-form{
        margin-top:10px;
        padding-top:10px;
        border-top:1px solid $borderColor;
    }
 }
</style>
