<template>
    <div>
        <Collapse v-model="activeIndex" @on-change="getIndex" v-if="isbool">
            <Panel :name="(index+1)+''" v-for="(item,index) in historyArr" :key="index">
                 {{item.beginDate}} ~ {{item.endDate}} {{"- " + item.priceName}}
                <div slot="content" style="margin:-16px;" v-if="item.agreementDetail">
                    <lawyer-agreement-info :agreementDetail="item.agreementDetail"></lawyer-agreement-info>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
import lawyerAgreementInfo from "./../../../agreement/lawyerAgreementInfo.vue";
export default {
    data () {
        return {
            historyArr:[],
            isbool:false,
            activeIndex:["1"],
            agreementDetail:{}
        }
    },
    props: ['id'],
    methods: {
        getData(){
            let url = `/settlement/agreement-price-lawyers/${this.id}/correlation`;
            this.$get(url).then(res=>{
                this.isbool = true;
                if(res.code==0){
                    this.agreementDetail = res.data || {};
                    this.historyArr = res.data.relationPriceList;
                    this.historyArr.forEach((item,index)=>{
                        item.agreementDetail = index==0?this.agreementDetail:{};
                    })
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getIndex(arr){
            arr.forEach((item,index)=>{
                let num = Number(item)-1;
                if(Object.keys(this.historyArr[num].agreementDetail).length==0){
                    this.getLawyerDetail(this.historyArr[num].priceId,num);
                }
            })
        },
        getLawyerDetail(id,index){
            let url = '/settlement/agreement-price-lawyers/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.historyArr[index].agreementDetail = res.data;
                    this.$set(this.historyArr,index,this.historyArr[index]);
                }
            })
        },
        fillterArr(arr,type){
            if(!arr){return []}
            return this.agreementDetail.additionalFeeList.filter((item,index)=>{
                return item.feeType==type
            })
        }
    },
    created(){},
    beforeMount(){
        this.getData();
    },
    mounted(){},
    updated(){},
    computed:{},
    components: {
        lawyerAgreementInfo
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./../../../agreement/lawyerAgreementForm.scss";
</style>
