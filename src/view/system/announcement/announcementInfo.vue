<template>
    <div>
        <Row v-if="detail">
            <Row class="detail-content">
                <Row><Col span="5" class="left-label">公告名称：</Col><Col span="16" class="right-content">{{detail.title || ""}}</Col></Row>
                <Row><Col span="5" class="left-label">公告内容：</Col>
                    <Col span="16" class="right-content">
                        <div v-html="detail.text">{{detail.text}}</div>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">附件：</Col>
                    <Col span="16" class="right-content">
                        <file-upload 
                        :defaultList="detail.attachmentList || []" 
                        :uploadConfig="uploadConfig"></file-upload>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">发布平台：</Col><Col span="16" class="right-content">{{detail.platformName || ""}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">指定团队：</Col>
                    <Col span="16" class="right-content">
                    <span v-for="item in detail.bulletinTeamList" :key="item.teamId">
                        {{item.teamName || ""}}
                        [<span v-if="item.readState" class="success-color">已读</span>
                          <span v-if="!item.readState" class="info-color">未读</span>]&nbsp;&nbsp;
                    </span>
                    </Col>
                </Row>
                <Row><Col span="5" class="left-label">发布时间：</Col>
                    <Col span="16" class="right-content">{{common.formatTime(detail.startTime,5)}}</Col>
                </Row>
                <Row><Col span="5" class="left-label">截止时间：</Col>
                    <Col span="16" class="right-content">{{common.formatTime(detail.endTime,5)}}</Col>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:true
            },
        }
    },
    props: ['detail'],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
