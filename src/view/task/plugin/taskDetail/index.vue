<template>
    <div class="task-info" :style="{height:'calc(100% - '+ (calcheight || 0)+')'}">
        <!-- 锚点 -->
        <div class="anchor" :style="{top:height+'px'}">
            <p class="spec-p">
                <span class="icon-result"></span>
                <span class="line"></span>
                <span class="icon no-radius icon-table-01"></span>
            </p>
            <p :class="jumpCtrl=='Title-1'&&'active'"  @click.prevent="anchorGo('Title-1')">
                <a href="" title="基本详情">
                    <span class="line"></span>
                    <span :class="['icon','icon-details-01',{'icon-active':jumpCtrl=='Title-1'}]"></span>
                </a>
            </p>
            <p :class="jumpCtrl=='Title-2'&&'active'" @click.prevent="anchorGo('Title-2')">
                <a href="" title="任务介绍">
                    <span class="line"></span>
                    <span :class="['icon','icon-lntroduction-01',{'icon-active':jumpCtrl=='Title-2'}]"></span>
                </a>
            </p>
            <p :class="jumpCtrl=='Title-3'&&'active'" @click.prevent="anchorGo('Title-3')" v-if="false">
                <a href="" title="查看附件">
                    <span class="line"></span>
                    <span :class="['icon','icon-folder-01',{'icon-active':jumpCtrl=='Title-3'}]"></span>
                </a>
            </p>
            <p :class="jumpCtrl=='Title-4'&&'active'" @click.prevent="anchorGo('Title-4')">
                <a href="" title="查看附件">
                    <span class="line"></span>
                    <span class="line"></span>
                    <span :class="['icon','icon-folder-01',{'icon-active':jumpCtrl=='Title-4'}]"></span>
                </a>
            </p>
        </div>

        <!-- 内容 -->
        <div class="task-result" @scroll="getHeight" :style="{height:'100%',overflow:'auto'}">
            <div class="result-title" id="Title-1">[ 基本详情 ]</div>
            <div class="result-content detail-content clearfix">
                <Row><Col span="3" class="left-label">委托人：</Col><Col span="20" class="right-content">{{taskDetail.customerName}}</Col></Row>
                <Row><Col span="3" class="left-label">侵权区域：</Col><Col span="20" class="right-content">{{taskDetail.missionScopeZh}}</Col></Row>
                <Row><Col span="3" class="left-label">截止时间：</Col><Col span="20" class="right-content">{{taskDetail.endDate}}</Col></Row>
                <Row>
                    <Col span="3" class="left-label">安盾审批人：</Col>
                    <Col span="20" class="right-content">
                        {{taskDetail.manager?taskDetail.manager.name:""}}
                            <Tooltip :content="taskDetail.manager?taskDetail.manager.email:''" theme="light">
                            <span class="icon icon-mail-01"></span>
                        </Tooltip>
                        <Tooltip :content="taskDetail.manager?taskDetail.manager.mobile:''" theme="light">
                            <span class="icon icon-phone-01"></span>
                        </Tooltip>
                    </Col>
                </Row>
            </div>
            <div class="result-title" id="Title-2">[ 任务介绍 ]</div>
            <div class="result-content clearfix" v-html="taskDetail.description">{{taskDetail.description}}</div>
            <div class="result-title" id="Title-3" v-if="false">[ 案件材料 ]</div>
            <div class="result-content clearfix" v-if="false">
                <div class="result-subtitle">[诉讼文书模板]</div>
                <file-container type="two"></file-container>
                <div class="result-subtitle">[知名度证据]</div>
                <div class="result-subtitle">[维权指引]</div>
                <div class="result-subtitle">[权属材料]</div>
            </div>
            <div class="result-title" id="Title-4">[ 查看附件 ]</div>
            <div class="result-content clearfix">
                <materials-info ref="materialsInfo" :defaultList="taskDetail.attachmentList || []" :readOnly="true"></materials-info>
            </div>
        </div>
    </div>
</template>
<script>
import materialsInfo from "./../../plugin/materialsInfo/materialsInfo.vue";
import fileContainer from '@/components/common/fileContainer/fileContainer.vue';
export default {
    data () {
        return {
            jumpCtrl:'Title-1',
            height:15,
            flag:false,
            uploadConfig:{
                readOnly:true
            }
        }
    },
    props: ['calcheight','taskDetail'],
    methods: {
        anchorGo(anchorName){
            this.jumpCtrl = anchorName;
            this.flag = true;                
            let anchorElement = document.getElementById(anchorName);
            // 如果对应id的锚点存在，就跳转到锚点
            if(anchorElement) { 
                anchorElement.scrollIntoView();
            }
        },
        getHeight(e){
            if(!this.flag){
                if(e.target.scrollTop>=document.getElementById('Title-2').offsetTop){
                    this.jumpCtrl = 'Title-2';
                }
                // else if(e.target.scrollTop>=document.getElementById('Title-3').offsetTop){
                //     this.jumpCtrl = 'Title-3';
                // }
                else if(e.target.scrollTop>=document.getElementById('Title-4').offsetTop){
                    this.jumpCtrl = 'Title-4';
                }else{
                    this.jumpCtrl = 'Title-1';
                }
            }else{
                this.flag = false;
            }
        }
    },
    created(){
        
    },
    beforeMount(){
        
    },
    mounted(){

    },
    updated(){

    },
    components: {
        fileContainer,
        materialsInfo
    },  
    watch: {

    }
}
</script>
<style scoped lang="sass">
 @import './taskInfo.scss'
</style>
