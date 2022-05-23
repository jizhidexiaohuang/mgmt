<template>
    <div class="materials-box">
        <Row class="materials-sort-list">
            <ul>
                <li v-for="(item,index) in materialsList" :key="index">
                    <i class="icon-folder-01"></i>
                    <span 
                        :class="{'materials-list-title':true,'list-title-selected':index==activeIndex}"
                        @click="getMaterialContent(item.code,index)">{{item.name}}</span>
                </li>
            </ul>
        </Row>
        <Row class="materials-sort-content">
            <Row class="sort-btn-box" v-if="!check && isAdd">
                <Button type="primary" icon="md-add" @click="openAddModal" v-permission="[$route.path]">新建</Button>
            </Row>
            <Row class="demo-upload-horizontal-list">
                <Row>
                    <span class="fl sm-width" v-if="check">
                        <Checkbox
                            :indeterminate="indeterminate"
                            :value="checkAll"
                            label=""
                            @on-change="handleCheckAll"></Checkbox>
                    </span>
                    <span class="fl sm-width" style="height:20px;">类型</span>
                    <span class="fl lg-width">文件名</span>
                    <span class="fl sm-width" v-if="!check">操作</span>
                </Row>
                <Row v-if="defaultList.length==0" style="text-align:center;">暂无文件</Row>
                <Row v-for="(item,index) in defaultList" :key="index">
                    <Row class="list-td">
                        <Row class="fl sm-width" v-if="check">
                            <Checkbox :value="selectArr.indexOf(item.attachment.id)!=-1" label="" @on-change="checkCode($event,item)"></Checkbox>
                        </Row>
                        <Row class="fl sm-width">
                            <file-image :mediaType="item.attachment?item.attachment.mediaType:''" :fileName="item.attachment?item.attachment.fileName:''" :size="28"></file-image>
                        </Row>
                        <Row class="fl lg-width">{{item.name || ""}}</Row>
                        <Row class="fl sm-width" v-if="!check">
                            <Dropdown transfer @on-click="option(item,index,$event)" v-permission="[$route.path]">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="modify">修改</DropdownItem>
                                    <DropdownItem name="preview">预览</DropdownItem>
                                    <DropdownItem name="download">下载</DropdownItem>
                                    <DropdownItem name="reUpload">重新上传</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>

        <!-- 新增文件/修改文件/重新上传附件 -->
        <Modal
            v-model="addModal"
            title="新增文件"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :label-width="80" :model="formValidate">
                <FormItem 
                    label="材料分类" 
                    prop="type"
                    :rules="[{required: true, message: '请选择材料分类', trigger: 'change'}]"
                    v-if="operateName=='add' || operateName=='modify'">
                    <Select v-model="formValidate.type" placeholder="请选择材料分类">
                        <Option v-for="item in materialsList" :value="item.code" :key="item.code">{{ item.name }}</Option>
                    </Select>
                </FormItem>
                <FormItem 
                    label="名称" 
                    prop="name" 
                    :rules="[{required: true, message: '请输入名称', trigger: 'blur'}]" 
                    v-if="operateName=='modify'">
                    <Input v-model="formValidate.name" placeholder="请输入名称"/>
                </FormItem>
                <FormItem 
                    label="是否公开" 
                    prop="isPublic"
                    v-if="operateName=='add' || operateName=='modify'"
                    :rules="[{required: true, message: '请选择是否公开', trigger: 'blur'}]">
                    <RadioGroup v-model="formValidate.isPublic">
                        <Radio label="0">否</Radio>
                        <Radio label="1">是</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem 
                    label="上传附件" 
                    prop="attachments"
                    :rules='[{required: true,type:"array",message: "材料附件不能为空",trigger: "blur" }]'
                    v-if="operateName=='add' || operateName=='reUpload'">
                    <file-upload
                        uploadType="private"
                        :defaultList="formValidate.attachments || []" 
                        :uploadConfig="operateName=='add'?{}:{maxNum:1}"
                        @getFileList="getAttachmentList"></file-upload>
                </FormItem>
            </Form>
            <Row style="text-align:center;">
                <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                <Button @click="addModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 在线查看 -->
        <Modal 
            v-model="onlineWordModal" 
            :fullscreen="!isImage"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">预览</div>
            <div style="height:calc(100% - 42px);" v-if="!isImage">
                <wps-file
                    :fileUrl="onlineFileUrl"
                    operate="edit"
                    :readOnly="true"
                    v-if="onlineWordModal"></wps-file>
            </div>
            <img :src="onlineFileUrl" v-else style="width: 100%">
            <Row style="text-align:right;margin-top:10px;">
                <Button type="default" @click="onlineWordModal=false;">关闭</Button>
            </Row>
        </Modal>

        <preview-file ref="perviewFile"></preview-file>
    </div>
</template>
<script>
export default {
    data () {
        return {
            indeterminate: false,
            checkAll: false,
            activeIndex:0,
            addModal:false,
            onlineWordModal:false,
            operateName:"",
            onlineFileUrl:"",
            uploadContractConfig:{},
            defaultList:[],
            acitveObj:"",
            type:"",
            formValidate:{
                type:"",
                attachments:[],
                projectId:this.projectId,
                name:"",
                isPublic:"0"
            },
            isImage:false,
            materialsList:[],
            selectArr:[],
            selectObjArr:[]
        }
    },
    props:{
        projectId:{
            type:String | Number,
            default:""
        },
        check:{
            type:Boolean,
            default:false
        },
        defaultData:{
            type:Array,
            default(){
                return []
            }
        },
        isAdd:{
            type:Boolean,
            default:false
        }
    },
    methods: {
        // 获取材料分类
        getMaterialList(){
            let url = '/business/materialTypes';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.materialsList = res.data;
                    this.getMaterialContent(this.type || this.materialsList[0].code,this.activeIndex || 0);
                }
            })
        },
        // 获取材料分类里具体的附件
        getMaterialContent(type,index){
            this.activeIndex = index;
            this.formValidate.type = type;
            this.type = type;
            let url = '/business/materials?projectId='+this.projectId+'&type='+type;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.defaultList = res.data || [];
                    // 如果存在勾选模式则判断已经勾选了什么
                    if(this.check){
                        this.checkIfAll();
                    }
                }
            })
        },
        assembleData(){
            let arr = this.formValidate.attachments;
            let submitArr = [];
            arr.forEach((item,index)=>{
                let obj = {
                    attachment:item,
                    type:this.formValidate.type,
                    projectId:this.formValidate.projectId,
                    name:item.fileName || "未命名",
                    isPublic:this.formValidate.isPublic=="0"?false:true
                }
                submitArr.push(obj);
            })
            return submitArr
        },
        // 新增||修改||重新上传
        handleSubmit(formName){
            let url;
            let obj = this.formValidate;
            let ajaxData = { 
                type:obj.type,
                projectId:obj.projectId,
                isPublic:obj.isPublic=="0"?false:true
            };
            if(this.operateName=="add"){
                url = "/business/material";
                ajaxData = this.assembleData();
            }else if(this.operateName=="reUpload"){
                url = `/business/material/${this.acitveObj.id}/attach/${this.acitveObj.attachment.id}`;
                ajaxData = obj.attachments[0];
            }else if(this.operateName=="modify"){
                url = "/business/material/"+this.acitveObj.id;
                ajaxData.id = this.acitveObj.id;
                ajaxData.name = obj.name;
                ajaxData.attachment = { id:this.acitveObj.attachment.id };
            }
            this.$refs[formName].validate((valid) => {
                if(valid){
                    if(this.operateName=="add"){
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功！");
                                this.getMaterialList();
                                this.addModal = false;
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else if(this.operateName=="reUpload" || this.operateName=="modify"){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功！");
                                this.getMaterialList();
                                this.addModal = false;
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            })
        },
        openAddModal(){
            this.operateName = "add";
            this.addModal = true;
        },
        option(item,index,name){
            this.acitveObj = item;
            this.operateName = name;
            switch(name){
                case "modify":
                    this.formValidate.type = item.type;
                    this.formValidate.name = item.name;
                    this.formValidate.isPublic = item.isPublic?"1":"0";
                    this.addModal = true;
                    break;
                case "preview":
                    // this.onlineFileUrl = item.attachment.url;
                    // if(item.attachment.mediaType.indexOf('image')!=-1){
                    //     this.isImage = true;
                    //     this.onlineWordModal = true;
                    // }else{
                    //     if(this.getFileType(item.attachment.mediaType)){
                    //         this.isImage = false;
                    //         this.onlineWordModal = true;
                    //     }else{
                    //         this.$Message.error("该类别文件暂不支持预览");
                    //     }
                    // }
                    this.$refs.perviewFile.preview(item.attachment);
                    break;
                case "download":
                    let url = item.attachment.url;
                    let link = document.createElement('a');
                    link.style.display = 'none';
                    link.href = url;
                    link.target = "_blank";
                    link.setAttribute('download', item.attachment.fileName);
                    document.body.appendChild(link);
                    link.click();
                    document.body.removeChild(link);
                    break;
                case "reUpload":
                    this.formValidate.type = this.acitveObj.type;
                    this.formValidate.id = this.acitveObj.id;
                    this.formValidate.isPublic = this.acitveObj.isPublic?"1":"0";
                    this.addModal = true;
                    break;
            }
        },
        // 获取附件
        getAttachmentList(arr){
            this.formValidate.attachments = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formValidate.attachments.push(obj);
            })
        },
        getFileType(mediaType){
            let arr = ['.document','msword','.sheet','.ms-excel','pdf','text/plain','powerpoint','presentation'];
            let flag = false;
            for(let i = 0;i<arr.length;i++){
                if(mediaType.indexOf(arr[i])!=-1){
                    flag = true;
                    break;
                }   
            }
            return flag
        },
        /****勾选开始*****/
        handleCheckAll(isChecked){
            this.defaultList.forEach((item,index)=>{
                this.checkCode(isChecked,item);
            })
        },
        checkCode(isChecked,item){
            let index = this.selectArr.indexOf(item.attachment.id);
            if(isChecked && index==-1){
                this.selectArr.push(item.attachment.id);
                this.selectObjArr.push(item);
            }else if(!isChecked && index!=-1){
                this.selectArr.splice(index,1);
                this.selectObjArr.splice(index,1);
            }
            this.checkIfAll();
        },
        checkIfAll(){
            let seLength = 0;
            this.defaultList.forEach((seItem,seIndex)=>{
                if(this.selectArr.indexOf(seItem.attachment.id)!=-1){
                    seLength++;
                }
            })
            if(seLength==0){
                this.checkAll = false;
                this.indeterminate = false;
            }else if(seLength!=0 && seLength<this.defaultList.length){
                this.checkAll = false;
                this.indeterminate = true;
            }else if(seLength!=0 && seLength==this.defaultList.length){
                this.checkAll = true;
                this.indeterminate = false;
            }
        },
        uploadCheck(arr){
            this.selectObjArr = arr;
            this.selectArr = [];
            this.selectObjArr.forEach((item,index)=>{
                this.selectArr.push(item.id || item.attachment.id);
            })
            this.checkIfAll();
        },
        /****勾选结束*****/
    },
    created(){},
    beforeMount(){
        this.getMaterialList();
    },
    mounted(){
        if(this.defaultData){
            console.log(this.defaultData);
            this.uploadCheck(this.defaultData);
        }
    },
    updated(){},
    computed:{},
    components: {},
    watch: {
        addModal(newVal,oldVal){
            if(!newVal){
                this.acitveObj = {};
                this.$refs.formValidate.resetFields();
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./materialsChecklist.scss";
@import "@/components/common/fileUpload/fileUpload.scss";
@import "@/components/common/multiFileUpload/multiFileUpload.scss"
</style>
