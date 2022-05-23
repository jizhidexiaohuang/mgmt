<template>
    <div>
        <Row class="detail-header">
            <span>基本信息</span>
        </Row>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">合同模版名称：</Col><Col span="16" class="right-content">{{defaultData.name || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">合同类型：</Col><Col span="16" class="right-content">{{defaultData.typeName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">创建人：</Col><Col span="16" class="right-content">{{defaultData.userName || ""}}</Col></Row>
            <Row><Col span="5" class="left-label">创建时间：</Col><Col span="16" class="right-content">{{ (defaultData.createTimeStr || "")}}</Col></Row>
            <Row><Col span="5" class="left-label">描述：</Col><Col span="16" class="right-content">{{ (defaultData.remark || "")}}</Col></Row>
        </Row>
        <Row class="detail-header">
            <span>合同模版文本</span>
        </Row>
        <Row class="detail-content">
            <Row>
                <Col span="5" class="left-label">模版附件：</Col>
                <Col span="16" class="right-content">
                    <file-upload 
                        :defaultList="contractFile || []" 
                        :uploadConfig="uploadConfig"></file-upload>
                </Col>
            </Row>
        </Row>
    </div>
</template>
<script>
import fileUpload from '@/components/common/fileUpload/fileUpload';
export default {
    data () {
        return {
            defaultList:[],
            uploadConfig:{
                multiple:true,
                fileName:'',
                readOnly:true
            }
        }
    },
    computed:{
        contractFile(){
            let arr = [];
            let attachmentList = [];
            if(this.defaultData.attachment){
                attachmentList.push(this.defaultData.attachment);
            }
            if(!!!attachmentList && !!!this.defaultData.docId) return
            if(attachmentList.length==0){
                let obj = {
                    mediaType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                    fileName:"",
                    url:this.defaultData.docUrl
                }
                arr.push(obj);
                return arr
            }
            attachmentList.forEach(item=>{
                if(item.mediaType.indexOf('.document')!=-1||item.mediaType.indexOf('msword')!=-1){
                    arr.push(item)
                }
            })
            return arr;
        }
    },
    props: ['defaultData'],
    methods: {

    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        fileUpload
    },
    watch: {}
}
</script>
<style lang="scss">
.body-drawer-style{
    .ivu-drawer-content{
        height:calc(100% - 97px);
        top:97px;
    }
}
</style>