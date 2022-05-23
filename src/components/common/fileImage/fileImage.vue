<template>
    <div>
        <!-- 图片类的渲染 -->
        <img :style="style" :src="imageUrl" v-if="mediaType.indexOf('image')!=-1">
        <!-- 视频类的渲染 -->
        <img :style="style" :src="videoUrl" v-else-if="mediaType.indexOf('video')!=-1">
        <!-- word文档类的渲染 -->
        <img :style="style" :src="wordUrl" v-else-if="mediaType.indexOf('.document')!=-1||mediaType.indexOf('msword')!=-1">
        <!-- excel表格类的渲染 -->
        <img :style="style" :src="excelUrl" v-else-if="mediaType.indexOf('.sheet')!=-1||mediaType.indexOf('.ms-excel')!=-1">
        <!-- pdf类的渲染 -->
        <img :style="style" :src="pdfUrl" v-else-if="mediaType.indexOf('pdf')!=-1">
        <!-- txt类的渲染 -->
        <img :style="style" :src="txtUrl" v-else-if="mediaType.indexOf('text/plain')!=-1">
        <!-- ppt类的渲染 -->
        <img :style="style" :src="pptUrl" v-else-if="mediaType.indexOf('powerpoint')!=-1 || mediaType.indexOf('presentation')!=-1">
        <!-- 压缩包类的渲染部分mediaType为空，判断尾缀 -->
        <img :style="style" :src="archiveUrl" v-else-if="mediaType.indexOf('zip')!=-1 || (mediaType==''&&getFileType(fileName))">
        <!-- 其他类别的渲染 -->
        <img :style="style" :src="otherUrl" v-else>
    </div>
</template>
<script>
export default {
    data () {
        return {
            style:{
                width:(this.size || 80)+'px',
                height:(this.size || 80)+'px'
            },
            imageUrl:require("../../../assets/images/image.png"),
            videoUrl:require("../../../assets/images/video.png"),
            pdfUrl:require("../../../assets/images/pdf.png"),
            excelUrl:require("../../../assets/images/excel.png"),
            wordUrl:require("../../../assets/images/word.png"),
            txtUrl:require("../../../assets/images/txt.png"),
            pptUrl:require("../../../assets/images/ppt.png"),
            archiveUrl:require("../../../assets/images/archive.png"),
            otherUrl:require("../../../assets/images/document.png"),
        }
    },
    props: ['mediaType','fileName','size'],
    methods: {
        //判断文件后缀名称
        getFileType(name){
            let fileType = "";
            //判断上传文件类型
            if(name.lastIndexOf(".") != -1){
                let places = name.lastIndexOf(".") + 1;
                fileType = name.substring(places).toLowerCase();
            }
            let archiveArr = ["arj","cab","rar","tar","zip","7z","gzip","jar","z","ace"]
            if(archiveArr.indexOf(fileType)!=-1){
                return fileType;
            }else{
                return false
            }
        },
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
