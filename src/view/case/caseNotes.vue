<template>
    <div class="case-note">
        <Row v-if="noteList && noteList.length>0">
            <Row class="case-note-card" v-for="(item,index) in noteList" :key="index">
                <Row class="case-note-title">
                    <span class="note-taker">{{item.creatorName}}</span>&nbsp;
                    <Rate :value="item.star" custom-icon="icon-star-01" :disabled="true"/>
                    <span class="create-time">{{item.createTime}}</span>
                </Row>
                <p class="note">{{item.memo}}</p>
            </Row>
            <Row v-if="noteList && noteList.length>0" style="margin:30px 0px;text-align:center;">
                <Page :total="table.totalRecords" show-total
                    size="small"
                    :current="table.pageNum"
                    :page-size-opts="config.modalPageSizeOpts"
                    :page-size="config.modalPageSize"
                    prev-text="上一页" next-text="下一页"
                    @on-change="changePage"
                    @on-page-size-change="changeSize"
                    show-sizer show-elevator />
            </Row>
        </Row>
        <Row class="no-text" v-else>暂无备忘信息</Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            noteList:[],
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.modalPageSize,
                pageNum:1,
                totalRecords:1
            },
        }
    },
    props: ['caseId'],
    methods: {
        getCaseNotes(){
            let url = '/business/case-memoes';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                caseId:this.caseId
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code===0){
                    this.noteList = res.data.records;
                    this.noteList.forEach(item=>{
                        if(item.createTime){
                            item .createTime = item.createTime.replace('T',' ');
                        }
                    })
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getCaseNotes();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getCaseNotes();
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getCaseNotes();
        this.$eventBus.$on('refresh', () => {
            this.getCaseNotes()
        })
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import './../../assets/globalStyle.scss';
.case-note{
    padding:15px 15px 0px 30px;
    .case-note-card{
        border:1px solid $labelBorder;
        padding:10px;
        width:100%;
        max-width: 800px;
        margin-bottom:20px;
        .case-note-title{
            .ivu-rate{
                font-size: 12px;
                line-height: 15px;
                vertical-align: text-bottom;
            }
            >.note-taker{
                display: inline-block;
                line-height: 28px;
                // color: $globalMainColor;
                font-weight: 600;
                font-size: 14px;
            }
            .create-time{
                font-weight: 600;
                padding-right:20px;
                float: right;
            }
        }
        .note{
            text-indent: 2em;
            padding-top:5px;
        }
    }
    .no-text{
        font-size: 14px;
        font-weight: 600;
        text-align: center;
        padding-bottom:15px;
    }
}
</style>
<style lang="scss">
@import './../../assets/globalStyle.scss';
.case-note-title .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-first, .ivu-rate-star-chart.ivu-rate-star-full .ivu-rate-star-second{
    color: $globalMainColor!important;
}
</style>
