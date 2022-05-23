<template>
    <div class="prosecute">
        <Row class="detail-header">
            <span>起诉</span>
            <ButtonGroup size="small" class="lawsuit-btn">
                <Button @click="tabActive='submitMaterial'" :type="tabActive=='submitMaterial'?'primary':'default'">递交材料</Button>
                <Button @click="tabActive='mediateBeforeSue'" :disabled="disabledCtrl || processState===2" :type="tabActive=='mediateBeforeSue'?'primary':'default'">诉前联调</Button>
                <Button @click="tabActive='acceptance'" :disabled="disabledCtrl" :type="tabActive=='acceptance'?'primary':'default'">受理</Button>
            </ButtonGroup>
        </Row>
        <Row class="case-content">
            <submit-material v-if="tabActive=='submitMaterial'" :processId="processId" :caseId="caseId" @getAuditState="getState"></submit-material>
            <mediate-before-sue v-if="tabActive=='mediateBeforeSue'" :processId="processId"></mediate-before-sue>
            <acceptance v-if="tabActive=='acceptance'" :processId="processId" :caseId="caseId"></acceptance>
        </Row>
    </div>
</template>
<script>
import submitMaterial from "./submitMaterial.vue";
import acceptance from "./acceptance.vue";
import mediateBeforeSue from "./mediateBeforeSue.vue";
export default {
    data () {
        return {
            tabActive:"submitMaterial",
            disabledCtrl:true,
        }
    },
    props: ['processId','caseId','processState'],
    methods: {
        getState(state){
            this.disabledCtrl = !state;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        submitMaterial,
        acceptance,
        mediateBeforeSue
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '../caseCommon.scss';
.prosecute{
    .case-content{
        margin-top: 10px;
    }
}
</style>