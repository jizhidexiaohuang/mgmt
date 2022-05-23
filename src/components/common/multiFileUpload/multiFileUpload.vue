<template>
    <div>
        <!-- 操作按钮 -->
        <Row v-if="!uploadConfig.readOnly">
            <Dropdown @on-click="option($event)" style="float:right;margin-bottom:5px;">
                <Button type="primary">
                <i class="icon-add-01"></i>
                    新建
                </Button>
                <DropdownMenu slot="list">
                    <DropdownItem name="upload">上传</DropdownItem>
                    <DropdownItem name="onlineWps">在线创建</DropdownItem>
                    <DropdownItem name="citeContract" v-if="templateMode">引用模版</DropdownItem>
                </DropdownMenu>
            </Dropdown>
        </Row>
        <Row v-show="false">
            <file-upload
                ref="fileUpload"
                :acceptType="'.doc,.dot,.docx'"
                :format="['doc','dot','docx']"
                :on-format-error="onFormatError"
                :defaultList="childDefaultList" 
                :uploadConfig="uploadConfig"
                @getFileList="getAttachmentList"
                @onlineEdit="onlineEdit"></file-upload>
        </Row>
        <!-- 普通的附件上传 -->
        <Row>
            <div class="demo-upload-horizontal-list">
                <Row>
                    <span class="fl sm-width" style="height:20px;"></span>
                    <span class="fl lg-width">文件名</span>
                    <span class="fl sm-width">操作</span>
                </Row>
                <Row v-if="childDefaultList.length==0" style="text-align:center;">暂无文件</Row>
                <Row v-for="(item,index) in childDefaultList" :key="index">
                    <Row class="list-td">
                        <Row class="fl sm-width">
                            <file-image :mediaType="item.mediaType" :fileName="item.fileName" :size="28"></file-image>
                        </Row>
                        <Row class="fl lg-width">{{item.fileName || "暂无文件名"}}</Row>
                        <Row class="fl sm-width">
                            <Dropdown transfer @on-click="listOption(item,index,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="download">下载</DropdownItem>
                                    <DropdownItem name="onlineEdit">在线编辑</DropdownItem>
                                    <DropdownItem name="delete">删除</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </Row>
                </Row>
            </div>
        </Row>

        <!-- 新增在线wps -->
        <Modal 
            v-model="onlineWordModal"
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">新建在线文档</div>
            <div style="height:calc(100% - 42px);">
                <wps-file operate="add" v-if="onlineWordModal" @getFile="getWpsFile"></wps-file>
            </div>
            <Row style="text-align:right;margin-top:10px;">
                <Button type="primary" @click="saveWpsFile">完成</Button>
                <Button type="default" @click="onlineWordModal=false;">取消</Button>
            </Row>
        </Modal>

        <!-- 引用模版 -->
        <Modal 
            v-model="onlineSelectModal"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">选择合同模版</div>
            <Form :model="formSelectData" ref="formSelectData" :label-width="100">
                <FormItem label="合同模版" prop="wpsId" :rules="[{required:true,message:'请选择合同模版',trigger:'change'}]">
                    <Input v-model.trim="formSelectData.wpsId" readonly placeholder="请选择合同模版"></Input>
                    <Row class="sel-ab-box">
                        <my-select
                            v-if="onlineSelectModal"
                            :path="templateUrl"
                            :keyName="'name'"
                            :params="{}"
                            :placeholder="'请选择合同模版'"
                            :pagingMode="true"
                            :single="true"
                            :defaultObj="{}"
                            @getValue="getWpsId"
                            ></my-select>
                    </Row>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin-top:10px;">
                <Button type="primary" @click="getCopyWpsId">确定</Button>
                <Button type="default" @click="onlineSelectModal=false;">取消</Button>
            </Row>
        </Modal>

        <!-- 编辑模版 -->
        <Modal 
            v-model="onlineTemWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">合同模版编辑</div>
            <div style="height:calc(100% - 42px);">
                <wps-file
                    :fileId="onlineFileId"
                    @getFile="getWpsFile"
                    operate="template"
                    v-if="onlineTemWordModal"></wps-file>
            </div>
            <Row style="text-align:right;margin-top:10px;">
                <Button type="primary" @click="saveWpsFile">完成</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            onlineWordModal:false,
            onlineTemWordModal:false,
            onlineSelectModal:false,
            isOnlineEdit:false,
            onlineFileId:"",
            wpsUrlObj:{},
            childDefaultList:[],
            formSelectData:{
                wpsId:""
            },
        }
    },
    props:{
        // 是否开启引用模版模式 默认为否，开启引用模版模式以后，templateUrl需要填写
        templateMode:{
            type:Boolean,
            default:false
        },
        templateUrl: {
            type:String,
            default:""
        },
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
                return {fileName:'',readOnly:false,maxNum:100}
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
        onFormatError: {
            type: Function,
            default () {
                return ()=>{}
            }
        }
    },
    methods: {
        option(name){
            switch (true) {
                case name=="upload":
                    this.$refs.fileUpload.handleClick();
                break;
                case name=="onlineWps":
                    if(this.childDefaultList.length>=this.uploadConfig.maxNum){
                        this.$Message.error(`最多上传${this.uploadConfig.maxNum}份附件`);
                        return
                    }
                    this.onlineWordModal = true;
                break;
                case name=="citeContract":
                    if(this.childDefaultList.length>=this.uploadConfig.maxNum){
                        this.$Message.error(`最多上传${this.uploadConfig.maxNum}份附件`);
                        return
                    }
                    this.onlineSelectModal = true;
                break;
            }
        },
        listOption(item,index,name){
            switch (true) {
                case name=="delete":
                    this.$refs.fileUpload.handleRemove(item,index);
                break;
                case name=="download":
                    this.$refs.fileUpload.handleLinkView(item.url);
                break;
                case name=="onlineEdit":
                    this.onlineEdit(item);
                break;
            }
        },
        // 编辑完成后将在线文档的id以及url赋值
        getWpsFile(obj){
            //type为2代表是wps在线创建的
            this.wpsUrlObj = obj;
            this.wpsUrlObj.type = 2;
        },
        // wps完成按钮
        saveWpsFile(){
            //代表是编辑，需要替换掉原来的那一份
            if(this.onlineTemWordModal && this.isOnlineEdit){
                this.childDefaultList.forEach((item,index)=>{
                    if(item.fileId == this.onlineFileId){
                        item = this.wpsUrlObj;
                    }
                });
            }else{
                this.childDefaultList.push(this.wpsUrlObj);
            }
            this.isOnlineEdit = false;
            this.onlineWordModal = false;
            this.onlineTemWordModal = false;
            this.$emit("getFileList",this.childDefaultList);
        },
        getAttachmentList(arr){
            this.childDefaultList = [];
            // type为1代表是上传的
            arr.forEach((item,index)=>{
                let obj = {
                    type:1,
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                if(item.id){obj.id=item.id}
                this.childDefaultList.push(obj);
            });
            this.$emit("getFileList",this.childDefaultList);
        },
        // 获取选择的模版docId
        getWpsId(data){
            this.formSelectData.wpsId = data.docId;
        },
        // 获取拷贝的模版docId并且打开在线编辑模版
        getCopyWpsId(){
            let url = '/tpi/wps/v1/api/file/getViewUrlTemplatePath?fileId='+this.formSelectData.wpsId;
            this.$refs['formSelectData'].validate((valid) => {
                if(valid){
                    this.$get(url).then(res=>{
                        if(res.code==0){
                            this.onlineFileId = res.data;
                        }else{
                            this.$Message.error(res.message);
                        }
                        this.onlineSelectModal = false;
                        this.onlineTemWordModal = true;
                    })
                }
            })
        },
        onlineEdit(obj){
            if(obj.id){
                this.onlineFileId = obj.id;
                this.isOnlineEdit = true;
                this.onlineTemWordModal = true;
            }else{
                // 调用接口，将上传的附件存储到wps以便在线编辑
                let url = "/tpi/wps/v1/api/file/saveAttachment";
                let ajaxData = [{
                    fileType:obj.mediaType || "",
                    name:obj.fileName || "",
                    downloadUrl:obj.url || ""
                }]
                this.$post(url,ajaxData).then(res=>{
                    if(res.code==0){
                        let id = res.data?res.data[0].id:"";
                        this.onlineFileId = id;
                        this.childDefaultList.forEach((item,index)=>{
                            if(item.fileName == obj.fileName){
                                this.childDefaultList.splice(index,1);
                            }
                        });
                        this.isOnlineEdit = false;
                        this.onlineTemWordModal = true;
                    }
                })
            }
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    computed:{},
    updated(){},
    components: {},
    watch: {
        defaultList(newVal,oldVal){
            this.childDefaultList = [];
            this.defaultList.forEach((item,index)=>{
                this.childDefaultList.push(item);
            })
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./multiFileUpload.scss";
</style>