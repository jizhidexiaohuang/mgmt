<template>
    <div>
        <!-- 块展示模式 -->
        <Row style="display:inline-block;">
            <viewer :options="options" @inited="inited">
                <div class="demo-upload-list" v-for="(item,index) in uploadList" :style="styleDesign" :key="index">
                    <template v-if="item.status === 'finished'">
                        <!-- 图片类型的渲染方式 -->
                        <Row 
                            v-if="item.mediaType.indexOf('image')!=-1">
                            <img :src="item.smallUrl" data-enable="1" :ref="'img'+index" :data-source="item.url">
                            <div class="demo-upload-list-cover">
                                <Icon title="预览" type="ios-eye-outline" @click.native="handleView(item.url,index)"></Icon>
                                <Icon title="下载" type="ios-trash-outline" @click.native="handleRemove(item,index)" v-if="!uploadConfig.readOnly"></Icon>
                            </div>
                        </Row>
                        <!-- 非图片外的渲染方式 -->
                        <Row v-else>
                            <file-image :mediaType="item.mediaType" :fileName="item.fileName" :size="size || 80"></file-image>
                            <div class="demo-upload-list-cover" :title="item.fileName">
                                <Icon title="预览" type="ios-eye-outline" @click.native="handleLinkView(item)"></Icon>
                                <Icon title="下载" type="ios-cloud-download-outline" @click.native="handleDownload(item.url)" v-if="uploadConfig.readOnly"/>
                                <Icon title="删除" type="ios-trash-outline" @click.native="handleRemove(item,index)" v-if="!uploadConfig.readOnly"></Icon>
                            </div>
                        </Row>
                    </template>
                    <!-- 进度条展示 -->
                    <template v-else>
                        <Progress v-if="item.showProgress" :percent="item.percentage" hide-info></Progress>
                    </template>
                </div>
                <div class="my-upload" style="display:inline-block;" v-if="!uploadConfig.readOnly">
                    <div :class="myUploadClass" 
                        @drop.prevent="onDrop"
                        @dragover.prevent="dragOver = true"
                        @dragleave.prevent="dragOver = false"
                        @click="handleClick">
                        <input ref="input" type="file" 
                        :accept="acceptType"
                        :multiple="multiple" style="display:none;" @change="handleChange"> 
                        <div :style="styleDesign">
                            <Icon type="ios-add" size="20"></Icon>
                        </div>
                    </div>
                </div>
            </viewer>
        </Row>
        <preview-file :readOnly="wpsReadOnly" ref="perviewFile"></preview-file>
    </div>
</template>
<script>
import COS from 'cos-js-sdk-v5';
import fileImage from './../fileImage/fileImage.vue';
export default {
    data(){
        return {
            uploadList: [],
            type:'',
            cos:'',
            // multiple:true, //多文件上传
            dragOver:false, //允许拖拽
            styleDesign:{
                width:this.size?this.size+'px':'80px',
                height:this.size?this.size+'px':'80px',
                lineHeight:this.size?this.size+'px':'80px'
            },
            options: { //viewer的配置
                url: "data-source",
                filter (image) {
                    return image.dataset.enable === '1'
                }
            },
            uploadType:"public"
        }
    },
    props:{
        defaultList:{
            type:Array,
            default(){
                return []
            }
        },
        multiple:{
            type:Boolean,
            default:true
        },
        uploadConfig:{
            type:Object,
            default(){
                return {fileName:'base',readOnly:false,maxNum:100}
            }
        },
        acceptType: {
            type:String,
            default:'*'
        },
        format: {
            type: Array,
            default () {
                return [];
            }
        },
        size:{
            type:String | Number,
            default:""
        },
        // uploadType:{
        //     type: String,
        //     default:"public"
        // },
        wpsReadOnly:{
            type:Boolean,
            default:true
        }
    },
    computed:{
        myUploadClass(){
            return [
                `my-upload my-upload-drag`,
                {
                    'my-upload-dragOver':this.dragOver
                }
            ];
        }
    },
    methods: {
        //监听viewer组件
        inited(viewer) {
            this.$viewer = viewer;
        },
        //更新viewer组件
        updateViewer(){
            if(this.$viewer){
                this.$viewer.update();
            }
        },
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
        /*======================上传图片start=======================*/
        //预览
        handleView (url,index) {
            this.$refs[`img${index}`][0].click();
        },
        //打开链接
        handleLinkView(item){
            this.$refs.perviewFile.preview(item);
        },
        handleDownload(url){
            window.open(url);
        },
        //点击上传事件
        handleClick () {
            if (this.itemDisabled){return};
            if(this.uploadList.length>=this.uploadConfig.maxNum){
                this.$Message.error(`最多上传${this.uploadConfig.maxNum}份附件`);
                return
            }
            this.$refs.input.click();
        },
        //拖拽事件
        onDrop(e){
            this.dragOver = false;
            if (this.itemDisabled) return;
            this.uploadFiles(e.dataTransfer.files);
        },
        //input change事件
        handleChange(e){
            const files = e.target.files;
            if(!files){ return }
            this.uploadFiles(files);
            this.$refs.input.value = null;
        },
        formatFile(file){
            if(this.format.length){
                const _file_format = file.name.split('.').pop().toLocaleLowerCase();
                const checked = this.format.some(item => item.toLocaleLowerCase() === _file_format);
                if (!checked) {
                    this.onFormatError(file);
                    return false;
                }
            }
            this.upload(file);
        },
        onFormatError(file){
            this.$Message.error(file.name + '的文件格式不正确，请选择'+this.acceptType+'格式的文件。');
        },
        uploadFiles(files){
            let postFiles = Array.prototype.slice.call(files);
            if (!this.multiple) postFiles = postFiles.slice(0, 1);
            if (postFiles.length === 0) return;
            postFiles.forEach(file => {
                this.formatFile(file)
            });
        },
        //上传
        upload (file) {
            let fileSplitArr = file.name.split('.');
            let key = file.lastModified+Math.floor(Math.random()*9999)+'.'+fileSplitArr[fileSplitArr.length-1];
            let _this = this;
            let index = _this.uploadList.length;
            let json = { key:key };
            this.cos.putObject({
                Bucket: _this.uploadType=="public"?_this.config.uploadPublicUrl:_this.config.uploadPrivateUrl, /* 必须 */
                Region: 'ap-guangzhou',     /* 存储桶所在地域，必须字段 */
                Key: key,                   /* 必须 */
                StorageClass: 'STANDARD',
                Body: file, // 上传文件对象
                onProgress: function(progressData) {
                    // console.log(progressData);
                    json.status = 'unFinished';
                    json.showProgress = true;
                    json.percentage = (progressData.percent)*100;
                    _this.$set(_this.uploadList,index,json)
                }
            }, function(err, data) {
                if(data.statusCode==200){
                    json.status = 'finished';
                    json.showProgress = false;
                    json.percentage = 100;
                    json.mediaType = file.type;
                    json.fileName = file.name;
                    json.smallUrl = 'http://'+data.Location+'?imageView2/1/w/80/h/80';
                    json.url = 'http://'+data.Location;
                    if(_this.uploadType!="public"){
                        _this.getPublicUrl(key,json,index);
                    }else{
                        _this.$set(_this.uploadList,index,json);
                        _this.$emit('getFileList',_this.uploadList);
                    }
                }else{
                    _this.uploadList.splice(index,1);
                }
                _this.$nextTick(()=>{
                    _this.updateViewer();
                })
            });
        },
        //删除
        handleRemove (file,index) {
            this.uploadList.splice(index,1);
            this.$emit('getFileList',this.uploadList);
            this.$nextTick(()=>{
                this.updateViewer();
            })
        },
        getPublicUrl(key,json,index){
            let url = '/base/cos/presigned-url/ap-guangzhou/'+this.config.uploadPrivateUrl+'?keys='+key;
            this.$get(url).then(res=>{
                if(res.code==0){
                    let pubUrl = res.data[0];
                    json.smallUrl = pubUrl;
                    json.url = pubUrl;
                    this.$set(this.uploadList,index,json);
                    this.$emit('getFileList',this.uploadList);
                }
            })
        }
        /*======================上传图片  end=======================*/
    },
    mounted: function(){
        let path = "/base/cos/sesseionToken/ap-guangzhou/"+(this.uploadType=="public"?this.config.uploadPublicUrl:this.config.uploadPrivateUrl);
        // console.log('upload创建');
        let _this = this;
        var COS = require('cos-js-sdk-v5');
        this.cos = new COS({
            // 必选参数
            getAuthorization: function (options, callback) {
                // 服务端 JS 和 PHP 例子：https://github.com/tencentyun/cos-js-sdk-v5/blob/master/server/
                // 服务端其他语言参考 COS STS SDK ：https://github.com/tencentyun/qcloud-cos-sts-sdk
                // STS 详细文档指引看：https://cloud.tencent.com/document/product/436/14048
                _this.$get(path).then(res=>{
                    console.log(res);
                    callback({
                        TmpSecretId: res.data.tmpSecretId,
                        TmpSecretKey: res.data.tmpSecretKey,
                        XCosSecurityToken: res.data.token,
                        // 建议返回服务器时间作为签名的开始时间，避免用户浏览器本地时间偏差过大导致签名错误
                        StartTime: new Date().getTime()/1000, // 单位是秒
                        ExpiredTime: res.data.expiredTime, // SDK 在 ExpiredTime 时间前，不会再次调用 getAuthorization
                    });
                });
            }
        });
    },
    watch:{
        defaultList: {
            immediate: true,
            handler(fileList) {
                this.uploadList = fileList.map(item => {
                    if(typeof(item) == 'string'){
                        return {
                            url:item,
                            // smallUrl:item+'?imageView2/1/w/80/h/80',
                            smallUrl:item,
                            status:'finished',
                            mediaType:'image'
                        }
                    }else{
                        let obj = {
                                    fileName:item.fileName,
                                    url:item.url,
                                    // smallUrl:item.url+'?imageView2/1/w/80/h/80',
                                    smallUrl:item.url,
                                    status:'finished',
                                    mediaType:item.mediaType || 'image'
                                }
                        item.id ? obj.id=item.id:"";
                        item.fileId ? obj.fileId = item.fileId:"";
                        return obj
                    }
                });
                this.$nextTick(()=>{
                    this.updateViewer();
                })
            }
        }
    },
    components:{
        fileImage
    }
};
</script>
<style scoped lang="scss">
@import "./fileUpload.scss";
</style>