<template>
    <div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">快递公司：</Col><Col span="16" class="right-content">{{defaultData.companyName}}</Col></Row>
            <Row><Col span="5" class="left-label">快递单号：</Col><Col span="16" class="right-content">{{defaultData.courierNumber}}</Col></Row>
            <Row><Col span="5" class="left-label">邮寄时间：</Col><Col span="16" class="right-content">{{defaultData.sendTime}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">物流信息：</Col>
                <Col span="16" class="right-content">
                    <logistics-information :expressNo="defaultData.courierNumber" :company="defaultData.companyName"></logistics-information>
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
    props: ['defaultData'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
