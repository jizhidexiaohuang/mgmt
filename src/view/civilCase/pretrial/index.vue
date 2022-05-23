<template>
    <div class="lawsuit-programme">
        <Row class="detail-header">
            <span>庭前准备</span>
            <ButtonGroup size="small" class="lawsuit-btn">
                <Button @click="tabActive='summons'" :type="tabActive=='summons'?'primary':'default'">传票</Button>
                <Button @click="tabActive='preservation'" :disabled="processState==2?false:true"  :type="tabActive=='preservation'?'primary':'default'">保全</Button>
                <Button @click="tabActive='serviceOfNotice'" :disabled="processState==2?false:true"  :type="tabActive=='serviceOfNotice'?'primary':'default'">公告送达</Button>
                <Button @click="tabActive='evidenceExchange'" :disabled="processState==2?false:true"  :type="tabActive=='evidenceExchange'?'primary':'default'">证据交换</Button>
                <Button @click="tabActive='jurisdictionalProtest'" :disabled="processState==2?false:true"  :type="tabActive=='jurisdictionalProtest'?'primary':'default'">管辖异议</Button>
            </ButtonGroup>
        </Row>
        <Row class="lawsuit-form">
            <summons v-if="tabActive=='summons'" :processId="processId"></summons>
            <preservation v-if="tabActive=='preservation'" :processId="processId"></preservation>
            <serviceOfNotice v-if="tabActive=='serviceOfNotice'" :processId="processId"></serviceOfNotice>
            <evidenceExchange v-if="tabActive=='evidenceExchange'" :processId="processId"></evidenceExchange>
            <jurisdictionalProtest v-if="tabActive=='jurisdictionalProtest'" :processId="processId"></jurisdictionalProtest>
        </Row>
    </div>
</template>
<script>
import summons from './summons.vue';
import preservation from './preservation.vue';
import serviceOfNotice from './serviceOfNotice.vue';
import evidenceExchange from './evidenceExchange.vue';
import jurisdictionalProtest from './jurisdictionalProtest.vue';
export default {
    data () {
        return {
            tabActive:'summons'
        }
    },
    props: ['processId','processState'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        summons,
        preservation,
        serviceOfNotice,
        evidenceExchange,
        jurisdictionalProtest
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/globalStyle.scss';
@import '../caseCommon.scss';
.lawsuit-programme{
    .lawsuit-form{
        margin-top:10px;
        padding-top:10px;
        border-top:1px solid $borderColor;
    }
}
</style>
