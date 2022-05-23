<template>
    <div class="case-journal">
        <Row class="audit-log-block">
            <Row class="time-line-body">
                <Timeline>
                    <TimelineItem v-for="(item,index) in journalList" :key="index">
                        <!-- <i :class="!renderColor(item.operation)?'icon-correct-01':'icon-down-01'" slot="dot"></i> -->
                        <Icon type="ios-radio-button-on" slot="dot" :size="18" :color="styles.globalMainColor"/>
                        <!-- <Icon type="ios-radio-button-on" /> -->
                        <Row class="line-content">
                            <img class="line-avatar" :src="item.headImgUrl || defaultIcon" alt="">
                            <Row class="line-right">
                                <span class="line-name">{{item.operatorName || ""}}</span>
                                <span style="margin-right:6px;">{{item.operateName || ""}}</span>
                                <span style="margin-right:6px;">{{item.remark || ""}}</span>
                                <span>{{item.newValue}}</span>
                                <span class="line-time">{{item.operateTime || ""}}</span>
                                <!-- <Row class="line-remark" v-if="item.operation=='2' || item.operation=='3'">
                                    <span class="line-left-label" v-if="item.operation=='2'">驳回原因：</span>
                                    <span class="line-left-label" v-if="item.operation=='3'">终止原因：</span>
                                    <span class="line-right-content">{{item.reason || ""}}</span>
                                </Row> -->
                            </Row>
                        </Row>
                    </TimelineItem>
                </Timeline>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import defaultIcon from "@/assets/images/card-02.png";
export default {
    data () {
        return {
            journalList:[],
            styles:styles,
            defaultIcon:defaultIcon,
        }
    },
    props: ['caseId'],
    methods: {
        getData(){
            let url = '/business/case-logs/case';
            let ajaxData = {
                caseId:this.caseId,
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.journalList = res.data || [];
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.case-journal{
    .audit-log-block{
        margin-top: 30px;
        padding:0 50px 5px 50px;
    }
    .tag{
        background: transparent;
        border:1px solid $globalMainColor;
        color:$textColor;
    }
}
</style>
