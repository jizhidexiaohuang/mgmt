<template>
    <div>
        <Row class="table-row" v-if="list.length>0">
            <Col span="3">案件编号</Col>
            <Col span="3">项目</Col>
            <Col span="3">对方当事人</Col>
            <Col span="3">案件区域</Col>
            <Col span="3">承办团队</Col>
            <Col span="3">案件状态</Col>
            <Col span="3">取证状态</Col>
            <Col span="3">案件进度</Col>
        </Row>
        <Row class="expand-row" v-for="(item) in list" :key="item.id">
            <Col span="3"><span class="textover expand-code" :title="item.code" @click="clickCode(item)">{{item.code}}</span></Col>
            <Col span="3" class="textover" :title="item.projectName">{{item.projectName}}</Col>
            <Col span="3">
                <p class="textover" v-for="(litigant,index) in item.litigantList" :key="index">
                    <span class="descripe-icon" v-if="litigant.category">{{litigant.category=='M'?'生':'销'}}</span>
                    <span :title="litigant.name">{{litigant.name ||''}}</span>
                </p>
            </Col>
            <Col span="3" class="textover" :title="(item.provinceName||'')+(item.cityName||'')+(item.areaName||'')">{{(item.provinceName||'')+(item.cityName||'')+(item.areaName||'')}}</Col>
            <Col span="3">{{item.caseTakerName}}</Col>
            <Col span="3" style="line-height:1">
                <Tag v-if="item.state=='HH'" color="green">{{item.stateName}}</Tag>
                <Tag v-if="item.state=='RT'||item.state=='AT'||item.state=='RA'||item.state=='TN'" color="default">{{item.stateName}}</Tag>
                <Tag v-if="item.state=='ED'" color="red">{{item.stateName}}</Tag>
            </Col>
            <Col span="3">{{item.certStateName}}</Col>
            <Col span="3">{{item.progressName}}</Col>
        </Row>
        <Row v-if="list.length==0">暂无数据</Row>
    </div>
</template>
<script>
export default {
    data () {
        return {

        }
    },
    props: ['list'],
    methods: {
        getcaseExtend(){
            let list = this.list;
            for(let i=0;i<list.length;i++){
                let categoryArr = list[i].caseExtend.litigantCategories?list[i].caseExtend.litigantCategories.split(",") : '';
                let nameArr = list[i].caseExtend.litigantNames?list[i].caseExtend.litigantNames.split(",") : [];
                list[i].litigantList = [];
                nameArr.forEach((item,index)=>{
                    list[i].litigantList.push({
                        name:item,
                        category:(!!categoryArr) ? categoryArr[index] :''
                    })
                })
            }
        },
        clickCode(item){
            this.$emit('clickCaseCode',item);
        }
    },
    created(){},
    beforeMount(){
        this.getcaseExtend();
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import '@/assets/globalStyle.scss';
 .table-row{
     line-height: 30px;
     font-weight: 600;
     font-size: 14px;
 }
 .expand-row{
     line-height: 30px;
     >.ivu-col{
         min-height: 30px;
     }
 }
 .expand-code{
     cursor: pointer;
     color: $globalMainColor;
 }
</style>
