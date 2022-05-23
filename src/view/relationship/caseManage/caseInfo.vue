<template>
    <div>
        <Row class="detail-header">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">案例行业：</Col><Col span="16" class="right-content">{{caseDetail.industryName}}</Col></Row>
            <Row><Col span="5" class="left-label">案例名称：</Col><Col span="16" class="right-content">{{caseDetail.name}}</Col></Row>
            <Row><Col span="5" class="left-label">案例类型：</Col><Col span="16" class="right-content">{{caseDetail.typeName}}</Col></Row>
            <Row><Col span="5" class="left-label">案例客户：</Col><Col span="16" class="right-content">{{caseDetail.customerName}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>详细信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">维权起因：</Col><Col span="16" class="right-content">{{caseDetail.reason}}</Col></Row>
            <Row><Col span="5" class="left-label">维权过程：</Col><Col span="16" class="right-content">{{caseDetail.course}}</Col></Row>
            <Row><Col span="5" class="left-label">维权结果：</Col><Col span="16" class="right-content">{{caseDetail.result}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">案例图片：</Col>
                <Col span="16" class="right-content">
                    <file-upload 
                    :defaultList="caseDetail.custCaseAttachList" 
                    :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props: ['caseDetail'],
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
