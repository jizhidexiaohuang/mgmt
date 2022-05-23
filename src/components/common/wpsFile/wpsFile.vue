<template>
    <div style="height:100%;width:100%;">
        <div :id="'online-word'+randomNum" style="height:100%;"></div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            randomNum:"",
            simpleMode:false,
            wpsId:""
        }
    },
    props:{
        //文件url
        fileUrl:{
            type:String
        },
        //用于判断是新增还是编辑或者是引用模版
        operate:{
            type:String
        },
        //判断是只读还是编辑
        readOnly:{
            type:Boolean
        },
        //文件id 仅用于WPSid
        fileId:{
            type:Number|String
        }
    },
    methods: {
        //获取打开wps文档的链接
        getWpsFileUrl(){
            let url = "";
            let permission = this.readOnly?"read":"write";
            if(this.operate=="add"){
                url = "/tpi/wps/v1/api/file/createTemplateFile/word";
            }else{
                //如果是通过上传组件上传的附件则调用第一个接口，如果是通过在线文档创建的文档则调用第二条接口
                if(this.fileUrl){
                    url = "/tpi/wps/v1/api/file/getViewUrlWebPath?fileUrl="+this.fileUrl+"&permission="+permission;
                }else{
                    url = "/tpi/wps/v1/api/file/getViewUrlDbPath?fileId="+this.fileId+"&permission="+permission;
                }
            }
            this.$get(url).then(res=>{
                if(res.code==0){
                    if(this.operate=="add"){
                        this.openWps(res.data);
                    }else{
                        this.openWps(res.data.wpsUrl,res.data.token); 
                    }
                }
            })
        },
        //打开wps(初始化wps)
        openWps(fileUrl, token) {
            let _this = this;
            const wps = _this.wps.config({
                mode: _this.simpleMode?'simple':'normal',
                mount: document.querySelector('#online-word'+this.randomNum),
                wpsUrl: fileUrl,
                onHyperLinkOpen(data){
                    _this.openWps(data.linkUrl,token);
                }
            });
            //wps打开文档回调
            wps.on("fileOpen",function(data){
                if(data.success){
                    _this.wpsId = (data.fileInfo.id.split("-"))[1];
                    _this.getFileUrl(_this.wpsId);
                }
            });
            //wps保存回调
            wps.on("fileStatus",function(data){
                //自动保存成功或者手动保存成功时 重新调取一遍文档信息，获取最新的文件名称
                if(data.status == "7" || data.status == "1"){
                    _this.getFileUrl(_this.wpsId);
                }
            })
            if(token){
                wps.setToken({"token": token});
            }
        },
        //获取操作完保存的文档url
        getFileUrl(id){
            let url = '/tpi/wps/v1/api/file/getFileInfo/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    if(this.operate=="add" || this.operate=="template"){
                        let obj = {
                            mediaType:"application/vnd.openxmlformats-officedocument.wordprocessingml.document",
                            fileName:res.data.name || "",
                            url:res.data.downloadUrl || "",
                            fileId:id
                        }
                        this.$emit("getFile",obj);
                    }
                }
            })
        }
    },
    created(){},
    beforeMount(){
        //生成随机数 避免id重复
        this.randomNum = (Math.random()*10000).toFixed(0);
    },
    mounted(){
        this.getWpsFileUrl();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
