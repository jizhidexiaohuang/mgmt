<template>
    <div>
        <Row class="time-line-body" :style="blockStyle">
            <Timeline>
                <TimelineItem v-for="(item,index) in logisticsArr" :key="index">
                    <Icon type="ios-radio-button-on" :size="18" :color="styles.globalMainColor" slot="dot"/>
                    <Row class="line-content">
                        <Row class="line-right">
                            <span class="line-name">{{item.context}}</span>
                            <span class="line-time">{{item.ftime}}</span>
                        </Row>
                    </Row>
                </TimelineItem>
            </Timeline>
        </Row>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            blockStyle:{
                "max-height":"",
                "overflow-y":"auto",
                "margin":"-16px",
                "padding":"25px"
            },
            logisticsArr:[]
        }
    },
    props: ['company','expressNo'],
    methods: {
        //获取物流信息
        getExpressMes(){
            let url = "/business/case/express?company="+this.company+"&expressNo="+this.expressNo;
            this.$get(url).then(res=>{
                if(res.code==0){
                    if(res.data && res.data.content && res.data.content!="null"){
                        this.logisticsArr = JSON.parse(res.data.content);
                        this.logisticsCtrl = true;
                    }else{
                        this.logisticsArr = [];
                        this.$Message.error("暂无物流信息");
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
    },
    created(){},
    beforeMount(){
        this.blockStyle["max-height"] = (document.body.clientHeight*0.8 - 55) + "px";
    },
    mounted(){
        this.getExpressMes();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
