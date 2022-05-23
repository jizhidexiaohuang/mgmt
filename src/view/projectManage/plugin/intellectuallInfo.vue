<template>
    <div>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">权利类型</Col>
                <Col span="16" class="right-content">{{detail.ipTypeZh || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">权利编号</Col>
                <Col span="16" class="right-content">{{detail.ipNumber || ""}}</Col>
            </Row>
            <Row v-if="detail.ipType=='T' || detail.ipType=='P'">
                <Col span="5" class="left-label">{{detail.ipType=='T'?'商标分类':'专利分类'}}</Col>
                <Col span="16" class="right-content">{{detail.ipSpecialTypeZh || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">权利名称</Col>
                <Col span="16" class="right-content">{{detail.name || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">权利人</Col>
                <Col span="16" class="right-content">{{detail.holder || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">权利状态</Col>
                <Col span="16" class="right-content">{{detail.ipStateZh || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">权利描述</Col>
                <Col span="16" class="right-content">{{detail.remark || ""}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">附件</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="detail.attachments || []" 
                        :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            uploadConfig:{
                readOnly:true
            }
        }
    },
    props: ['detail'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
