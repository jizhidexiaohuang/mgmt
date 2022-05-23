<template>
    <div>
        <Collapse v-model="activeIndex" @on-change="getIndex" v-if="isbool">
            <Panel :name="(index+1)+''" v-for="(item,index) in historyArr" :key="index">
                {{item.beginDate}} ~ {{item.endDate}} {{"- " + (item.priceName || "")}}
                <div slot="content" style="margin:-16px;">
                    <investigator-agreement-info :detail="item.detail"></investigator-agreement-info>
                </div>
            </Panel>
        </Collapse>
    </div>
</template>
<script>
import investigatorAgreementInfo from "./../../../agreement/investigatorAgreementInfo.vue";
export default {
    data () {
        return {
            activeIndex:["1"],
            historyArr:[],
            isbool:false,
            detail:{
                online:{},
                offline:{
                    gradeConfig:{
                        subList:[{},{}]
                    }
                }
            }
        }
    },
    props: ['id'],
    methods: {
        getData(){
            let url = `/settlement/agreement-price-investigator/${this.id}/correlation`;
            this.$get(url).then(res=>{
                this.isbool = true;
                if(res.code==0){
                    this.detail = res.data;
                    this.historyArr = res.data.relationPriceList;
                    this.historyArr.forEach((item,index)=>{
                        item.detail = index==0?this.detail:{};
                    })
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getIndex(arr){
            arr.forEach((item,index)=>{
                let num = Number(item)-1;
                if(Object.keys(this.historyArr[num].detail).length==0){
                    this.getInvestDetail(this.historyArr[num].priceId,num);
                }
            })
        },
        getInvestDetail(id,index){
            let url = '/settlement/agreement-price-investigator/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.historyArr[index].detail = res.data;
                    this.$set(this.historyArr,index,this.historyArr[index]);
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {
        investigatorAgreementInfo
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./../../../agreement/lawyerAgreementForm.scss";
</style>
