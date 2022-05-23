<template>
    <div>
        <Row class="detail-header">
            <span>基本情况</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">一级行业名称：</Col>
                <Col span="16" class="right-content">{{industryDetail.primaryIndustryName}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">二级行业名称：</Col>
                <Col span="16" class="right-content">{{industryDetail.industryName}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业描述：</Col>
                <Col span="16" class="right-content">{{industryDetail.description}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业市场结构：</Col>
                <Col span="16" class="right-content">{{industryDetail.structureName}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业属性：</Col>
                <Col span="16" class="right-content">{{industryDetail.industryAttributesName}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业要素集约度：</Col>
                <Col span="16" class="right-content">{{industryDetail.intensiveName}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业政策环境：</Col>
                <Col span="16" class="right-content">{{industryDetail.policyEnvironment}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业市场环境：</Col>
                <Col span="16" class="right-content">{{industryDetail.marketingEnvironment}}</Col>
            </Row>
        </Row>
        <Row class="detail-header">
            <span>行业最近5年市场规模、利润率和增长率</span>
        </Row>
        <Row class="detail-content">
            <div class="industry-table table-info">
                <table>
                    <thead>
                        <th></th>
                        <th v-for="(item,index) in yearList" :key="index">{{item.year}}</th>
                    </thead>
                    <tbody>
                        <tr v-for="industry in industrySituationList" :key="industry.name">
                            <td>{{industry.name}}</td>
                            <td class="info-text" v-for="(item,index) in industry.list" :key="index">{{item.value}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Row>
        <Row class="detail-header">
            <span>行业知识产权情况</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">行业专利数量：</Col>
                <Col span="16" class="right-content">{{industryDetail.patentsNumber}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业商标数量：</Col>
                <Col span="16" class="right-content">{{industryDetail.trademarkNumber}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">行业著作权数量：</Col>
                <Col span="16" class="right-content">{{industryDetail.copyrightNumber}}</Col>
            </Row>
            <Row>
                <Col span="5" class="left-label">企业知识产权侵权现状：</Col>
                <Col span="16" class="right-content">{{industryDetail.infringementStatus}}</Col>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            industrySituationList:[],
            yearList:[]
        }
    },
    props: ['industryDetail'],
    computed:{},
    methods: {
        getDetail(){
            let list = this.industryDetail.industrySituationList;
            let json = {};
            if(list.length>0){
                list.map(item=>{
                    if(!json[item.type]){
                        json[item.type] = 1;
                        this.industrySituationList.push({
                            name:item.name,
                            type:item.type,
                            list:[]
                        })
                    }else{
                        json[item.type]++;
                    }
                })
                this.industrySituationList.map(itemIndustry=>{
                    list.map(item=>{
                        if(itemIndustry.type==item.type){
                            itemIndustry.list.push({
                                year:item.year,
                                type:item.type,
                                value:item.value,
                            })
                        }
                    })
                })
            }
            this.yearList = this.industrySituationList[0].list;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getDetail();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
 @import './industryForm.scss';
</style>
<style lang="scss">
.industry-table input.ivu-input.ivu-input-default{
    border:none;
}
</style>
