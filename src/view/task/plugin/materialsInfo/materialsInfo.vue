<template>
    <div>
        <Row v-for="(item,index) in materialsList" :key="index" v-if="isBool">
            <div v-if="materialsObj[item.code].length!=0">
                <div class="result-title">[ {{item.name}} ]</div>
                <div class="result-content clearfix">
                    <div v-for="(itemSec,indexSec) in materialsObj[item.code]" class="file-block">
                        <div class="file-image">
                            <a :href="itemSec.attachment.url" target="_blank" v-if="readOnly">
                                <i class="icon-down-01 delete-icon" v-if="!readOnly" @click="deteleOne(item.code,indexSec)"></i>
                                <file-image :mediaType="itemSec.attachment?itemSec.attachment.mediaType:''" :fileName="itemSec.attachment?itemSec.attachment.fileName:''" :size="28"></file-image>
                            </a>
                            <div v-else>
                                <i class="icon-down-01 delete-icon" v-if="!readOnly" @click="deteleOne(item.code,indexSec)"></i>
                                <file-image :mediaType="itemSec.attachment?itemSec.attachment.mediaType:''" :fileName="itemSec.attachment?itemSec.attachment.fileName:''" :size="28"></file-image>
                            </div>
                        </div>
                        <span class="textover block-title" :title="itemSec.attachment?itemSec.attachment.fileName:''">{{itemSec.attachment?itemSec.attachment.fileName:''}}</span>
                    </div>
                </div>
            </div>
        </Row>
        <Row v-if="materialsObj['upload'].length!=0">
            <div class="result-title">[ 任务附件 ]</div>
            <div class="result-content clearfix">
                <div v-for="(itemSec,indexSec) in materialsObj['upload']" class="file-block">
                    <div class="file-image">
                        <a :href="itemSec.attachment.url" target="_blank" v-if="readOnly">
                            <i class="icon-down-01 delete-icon" v-if="!readOnly" @click="deteleOne('upload',indexSec)"></i>
                            <file-image :mediaType="itemSec.attachment?itemSec.attachment.mediaType:''" :fileName="itemSec.attachment?itemSec.attachment.fileName:''" :size="28"></file-image>
                        </a>
                        <div v-else>
                            <i class="icon-down-01 delete-icon" v-if="!readOnly" @click="deteleOne('upload',indexSec)"></i>
                            <file-image :mediaType="itemSec.attachment?itemSec.attachment.mediaType:''" :fileName="itemSec.attachment?itemSec.attachment.fileName:''" :size="28"></file-image>
                        </div>
                    </div>
                    <span class="textover block-title" :title="itemSec.attachment?itemSec.attachment.fileName:''">{{itemSec.attachment?itemSec.attachment.fileName:''}}</span>
                </div>
            </div>
        </Row>
    </div>
</template>
<script>
import fileImage from "@/components/common/fileImage/fileImage";
export default {
    data () {
        return {
            materialsList:[],
            materialsObj:{
                upload:[]
            },
            isBool:false
        }
    },
    props: ['defaultList',"readOnly"],
    methods: {
        getMaterialList(){
            let url = '/business/materialTypes';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.materialsList = res.data;
                    this.materialsList.forEach((item,index)=>{
                        this.materialsObj[item.code] = [];
                    })
                    if(this.defaultList){
                        this.uploadData(this.defaultList);
                    }
                }
            })
        },
        uploadData(data){
            this.isBool = false;
            for(let key in this.materialsObj){
                this.materialsObj[key] = [];
            }
            data.forEach((item,index)=>{
                if(item.type){
                    this.materialsObj[item.type].push(item);
                }else{
                    // this.materialsObj["upload"].push(item);
                    this.$set(this.materialsObj["upload"],this.materialsObj["upload"].length,item);
                }
            });
            this.isBool = true;
        },
        deteleOne(code,index){
            this.isBool = false;
            this.materialsObj[code].splice(index,1);
            this.isBool = true;
            // 将数据返回给父组件
            let obj = {
                materials:[],
                upload:[]
            };
            for(let key in this.materialsObj){
                if(key!="upload"){
                    obj.materials = obj.materials.concat(this.materialsObj[key]);
                }else{
                    obj.upload = this.materialsObj["upload"];
                }
            }
            this.$emit("getFileList",obj);
        }
    },
    created(){},
    beforeMount(){
        this.getMaterialList();
    },
    mounted(){},
    computed:{},
    updated(){},
    components: {
        fileImage
    },
    watch: {
        materialsObj:{
            deep: true,
            handler(fileList) {
                console.log(fileList);
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "@/assets/globalStyle.scss";
.file-block{
    display: inline-block;
    width:80px;
    text-align: center;
    .file-image{
        position: relative;
        height:30px;
        width:100%;
        .delete-icon{
            font-size: 14px;
            position: absolute;
            top:-3px;
            right: 0px;
            cursor: pointer;
            &:hover{
                color:$errorColor;
            }
        }
    }
    span{
        width:100%;
        text-align: center;
        line-height: 18px;
    }
    .block-title{
        display:inline-block;
        padding-right: 3px;
    }
}
</style>
