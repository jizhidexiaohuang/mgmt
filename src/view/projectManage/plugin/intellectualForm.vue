<template>
    <div class="intellectual-form">
        <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="权利类型" prop="ipType">
                    <Select v-model="formData.ipType" placeholder="请选择权利类型">
                        <Option v-for="item in ipTypeList" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem 
                    label="权利编号" 
                    prop="ipNumber" 
                    :rules='[{ required: true, message: "权利编号不能为空", trigger: "blur" },{ max:18,message:"不能超过18个字符",trigger:"blur"}]'>
                    <Input v-model.trim="formData.ipNumber" @on-blur="getContent" placeholder="请输入权利编号"></Input>
                </FormItem>
                <FormItem 
                    :label="formData.ipType=='T'?'商标分类':'专利分类'" 
                    prop="ipSpeciesType" 
                    v-if="formData.ipType=='P' || formData.ipType=='T'">
                    <Select v-model="formData.ipSpeciesType" filterable placeholder="请选择商标分类" v-if="formData.ipType=='T'">
                        <Option v-for="item in ipSpeciesTypeTList" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                    <Select v-model="formData.ipSpeciesType" filterable placeholder="请选择专利分类" v-if="formData.ipType=='P'">
                        <Option v-for="item in ipSpeciesTypePList" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权利名称" prop="name">
                    <Input v-model.trim="formData.name" placeholder="请输入权利名称"></Input>
                </FormItem>
                <FormItem label="权利人" prop="holder">
                    <Input v-model.trim="formData.holder" placeholder="请输入权利人"></Input>
                </FormItem>
                <FormItem label="权利状态" prop="state">
                    <Select v-model="formData.state" placeholder="请选择权利状态">
                        <Option v-for="item in ipStateList" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="权利描述" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" placeholder="请输入权利描述"></Input>
                </FormItem>
                <FormItem 
                    :label="formData.ipType=='T'?'商标图片':'附件'" 
                    prop="attachments"
                    :rules="formData.ipType=='T'?{ required: true,type:'array', message: '附件不能为空', trigger: 'blur' }:{type:'array'}">
                    <file-upload
                        v-if="isBool"
                        :defaultList="defaultList" 
                        :uploadConfig="uploadConfig" 
                        @getFileList="getUploadList"></file-upload>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="handleSubmit('formData')">保存</Button>
                <Button @click="$emit('closeModal',false);">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isSubmit:false,
            isBool:false,
            formData:{
                projectId:this.projectId,
                ipType:"T",
                ipNumber:"",
                ipSpeciesType:"",
                name:"",
                holder:"",
                state:"",
                remark:"",
                attachments:[]
            },
            ruleValidate:{
                ipType:[{ required: true, message: "权利类型不能为空", trigger: "blur" }],
                ipSpeciesType:[{ required: true, message: "商标分类不能为空", trigger: "blur" }],
                name:[{ required: true, message: "权利名称不能为空", trigger: "blur" },{ max:128,message:"不能超过128个字符",trigger:"blur"}],
                state:[{ required: true, message: "权利状态不能为空", trigger: "blur" }],
                remark:[{ required: true, message: "权利描述不能为空", trigger: "blur" },{ max:512,message:"不能超过512个字符",trigger:"blur"}],
                holder:[{ max:128,message:"不能超过128个字符",trigger:"blur"}]
            },
            ipTypeList:[],
            ipSpeciesTypePList:[],
            ipSpeciesTypeTList:[],
            ipStateList:[],
            trademarkTypeArr:[],        //商标种类数组
            //图片上传参数
            defaultList:[],
            uploadConfig:{},
            anpaiToken:""
        }
    },
    props: ['defaultData','projectId'],
    methods: {
        // 获取安牌网token
        getAnpaiToken(){
            let url = "/tpi/anpai/token";
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.anpaiToken = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        // 新增||修改||重新上传
        handleSubmit(formName){
            let url = "/business/ipRight";
            let ajaxData = {};
            if(this.defaultData){
                url += `/${this.defaultData.id}`;
                ajaxData.id = this.defaultData.id;
            }
            Object.assign(ajaxData,this.formData);
            this.$refs[formName].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(!this.defaultData){
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$emit("closeModal",true);
                                this.$Message.success("操作成功！");
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }else{
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$emit("closeModal",true);
                                this.$Message.success("操作成功！");
                            }else{
                                this.$Message.error(res.message);
                            }
                        })
                    }
                }
            })
        },
        // 根据权利编号查询相关内容
        getContent(){
            if(this.formData.ipType!="T"){return}
            if(!this.formData.ipNumber.length){return}
            let url = "/v3/search/colligate";
            let ajaxData = {
                page:0,
                pagesize:10,
                tmstatus:[],
                regno:this.formData.ipNumber,
                tmname:"",
                tmagent:"",
                tmapplicant:"",
                tmapplicant_en:"",
                intcls:[]
            }
            for(let k=1;k<=45;k++){
                ajaxData.intcls.push(parseInt(k));
            }
            this.$anpaiAjax(url,"POST",ajaxData,{Token:this.anpaiToken}).then(res=>{
                this.isSubmit = false;
                if(res.code==200){
                    let obj = res.data;
                    if(obj.intcls_group && obj.intcls_group.length>0){
                        let key = obj.intcls_group[0].key;
                        this.formData.ipSpeciesType = this.ipSpeciesTypeTList[key-1].value;
                    }
                    if(obj.tmList && obj.tmList.length>0){
                        this.formData.name = obj.tmList[0].sbmc || "";
                        this.formData.holder = obj.tmList[0].tmapplicant || "";
                        this.renderTrademarkInfo(obj.tmList,obj.intcls_group);
                        this.generateImage(obj.tmList[0].regno);
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        renderTrademarkInfo(data,intclsGroup){
            let rightRemark = "经国家工商行政管理总局商标局核准，原告注册了第";
            for(let i=0;i<data.length;i++){
                rightRemark += data[i].regno+"号商标，核定使用商品范围为第";
                let key = "";
                //取出种类
                for(let j=0;j<intclsGroup.length;j++){
                    key = intclsGroup[j].key;
                    rightRemark += key
                }
                rightRemark += "类：";
                //取出使用范围
                let strTmdetail = "";
                if(data[i].tmdetail){
                    let tmdetail = data[i].tmdetail;
                    for(let k=0;k<tmdetail.length;k++){
                        if(k>4){
                            //只取前四条
                            break;
                        }
                        if(k == 0){
                            strTmdetail = tmdetail[k];
                        }else {
                            strTmdetail += "，"+tmdetail[k];
                        }
                    }
                    rightRemark += strTmdetail;
                }
                //取出有效期
                rightRemark += "等，注册有效期限为"+ data[i].regdate + "至"+data[i].validdate;
                this.formData.remark = rightRemark;
            }
        },
        // 上传图片
        generateImage(code){
            this.formData.attachments = [];
            let url = "/tpi/anpai/upload/"+code;
            this.isBool = false;
            this.$post(url).then(res=>{
                if(res.code==0){
                    let obj = {
                        fileName:res.data.fileName,
                        mediaType:res.data.mediaType,
                        url:res.data.url
                    }
                    this.formData.attachments.push(obj)
                    this.defaultList.push(obj)
                }else{
                    this.$Message.error(res.message);
                }
                this.isBool = true;
            })
        },
        // 获取图片列表
        getUploadList (arr) {
            this.formData.attachments = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formData.attachments.push(obj);
            })
        },
        getDefaultData(){
            this.formData.ipType = this.defaultData.ipType;
            this.formData.ipNumber = this.defaultData.ipNumber;
            this.formData.ipSpeciesType = this.defaultData.ipSpeciesType;
            this.formData.name = this.defaultData.name;
            this.formData.holder = this.defaultData.holder;
            this.formData.state = this.defaultData.state;
            this.formData.remark = this.defaultData.remark;
            this.formData.attachments = this.defaultData.attachments;
            this.defaultList = this.formData.attachments;
            this.isBool = true;
        },
        //获取字典数据接口
        async getDictionary(){
            this.ipTypeList = await this.common.getDictionaryItems('ip_type');
            this.ipSpeciesTypePList = await this.common.getDictionaryItems('ip_species_type_P');
            this.ipSpeciesTypeTList = await this.common.getDictionaryItems('ip_species_type_T');
            this.ipStateList = await this.common.getDictionaryItems('ip_state');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getAnpaiToken();
    },
    mounted(){
        if(this.defaultData){
            this.getDefaultData();
        }else{
            this.isBool = true;
        }
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="sass" scoped>

</style>

