<template>
    <div>
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="150">
            <div class="detail-header">
                <span>基本信息</span>
            </div>
            <div class="base-message detail-form">
                <Row>
                    <FormItem label="任务名称" prop="missionId">
                        <mySelect ref="selectConditions"
                            v-if="!clueDetail && !taskObj"
                            :path="'/business/missions/team'"
                            :keyName="'name'"
                            placeholder="请选择任务"
                            :defaultObj="taskObj || {}"
                            @getValue="getMissionId">
                        </mySelect>
                        <span v-if="clueDetail || taskObj">{{clueDetail?(clueDetail.missionName || ""):(taskObj.name || "")}}</span>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="侵权方式" prop="tortType">
                        <Select v-model="formValidate.tortType" @on-change="changeTortType" placeholder="请选择侵权方式" >
                            <Option v-for="item in tortTypeArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType=='E_EC'" key="channelType">
                    <FormItem label="销售渠道" prop="channelType" :rules="{ required: true, message: '销售渠道不能为空', trigger: 'change' }">
                        <Select v-model="formValidate.channelType" placeholder="请选择销售渠道">
                            <Option v-for="item in ecChannelArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                        </Select>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType=='E_EC'&&formValidate.channelType=='OT'" key="platformName">
                    <FormItem 
                        label="平台名称" 
                        prop="platformName"
                        :rules="{ max:128,message:'不能超过128个字符',trigger:'blur'}">
                        <Input v-model.trim="formValidate.platformName" placeholder="请输入平台名称" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType.indexOf('E')>-1" key="storeUrl">  
                    <FormItem 
                        :label="(formValidate.tortType=='E_WL'?'网页':'店铺')+'链接'"
                        :rules="[{type:'url', message: (formValidate.tortType=='E_WL'?'网页':'店铺')+'链接不正确', trigger: 'blur'}]"
                        prop="storeUrl">
                        <Input v-model="formValidate.storeUrl" :placeholder="'请输入'+(formValidate.tortType=='E_WL'?'网页':'店铺')+'链接'" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem :label="(formValidate.tortType=='S_FA'?'工厂':'店铺')+'名称'" prop="storeName">
                        <Input v-model.trim="formValidate.storeName" :placeholder="'请输入'+(formValidate.tortType=='S_FA'?'工厂':'店铺')+'名称'" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType.indexOf('S')>-1" key="suveryArea">
                    <FormItem label="调查区域" prop="province" :rules="{required: true, message: '调查区域不能为空', trigger: 'blur'}">
                        <City v-on:listenCity="getCity($event,'suveryArea')" :cityList="cityList" style="width:100%;"></City>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType.indexOf('S')>-1" key="address">
                    <FormItem 
                        label="侵权地址" 
                        prop="address" 
                        :rules="[
                            {required: true, message: '侵权地址不能为空', trigger: 'blur'},
                            { max:128,message:'不能超过128个字符',trigger:'blur'}
                            ]">
                        <Input v-model.trim="formValidate.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入调查详细地址"></Input>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType.indexOf('S')>-1" key="valid">
                    <FormItem label="是否侵权" prop="valid">
                        <RadioGroup v-model="formValidate.valid" @on-change="changeValid">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType.indexOf('E')>-1&&formValidate.tortType!='E_WL'&&(formValidate.channelType=='TT' || formValidate.channelType=='PD')" key="dispenser">
                    <FormItem 
                        label="掌柜号" 
                        prop="dispenser" 
                        :rules="formValidate.tortType.indexOf('E')>-1&&formValidate.channelType=='TT'?[{required: true, message: '掌柜号不能为空', trigger: 'blur'},{ max:64,message:'不能超过64个字符',trigger:'blur'}]:{}">
                        <Input v-model.trim="formValidate.dispenser" placeholder="请输入掌柜号" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.valid===1" key="hasProduct">
                    <FormItem label="是否有产品" prop="hasProduct">
                        <RadioGroup v-model="formValidate.hasProduct">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                </Row>
                <Row v-if="formValidate.hasProduct===1&&formValidate.valid===1" key="productName">
                    <FormItem 
                        label="产品名称" 
                        prop="clueProduct.productName" 
                        :rules="[
                            {required: true, message: '产品名称不能为空', trigger: 'blur'},
                            { max:128,message:'不能超过128个字符',trigger:'blur'}
                        ]">
                        <Input v-model.trim="formValidate.clueProduct.productName" placeholder="请输入产品名称" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.hasProduct===1&&formValidate.tortType.indexOf('E')>-1&&formValidate.valid===1" key="productUrl">
                    <FormItem 
                        label="产品链接" 
                        prop="clueProduct.productUrl" 
                        :rules="[
                            {required: true, message: '产品链接不能为空', trigger: 'blur'},
                            {type:'url', message: '产品链接不正确', trigger: 'blur'},
                        ]">
                        <Input v-model="formValidate.clueProduct.productUrl" placeholder="请输入产品链接" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.hasProduct===1&&formValidate.valid===1" key="price">
                    <FormItem 
                        label="产品单价" 
                        prop="clueProduct.price" 
                        :rules="formValidate.tortType.indexOf('E')>-1?[{required: true,type:'number', message: '产品单价不能为空', trigger: 'blur'},numberValid,maxNumberValid]:[numberValid,maxNumberValid]">
                        <Input v-model.number="formValidate.clueProduct.price" placeholder="请输入产品单价(数字)" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.hasProduct===1&&formValidate.valid===1" key="saleNum">
                    <FormItem 
                        label="销量" 
                        prop="clueProduct.saleNum" 
                        :rules="formValidate.tortType.indexOf('E')>-1?[{required: true,type:'number', message: '销量不能为空', trigger: 'blur'},numberValid,maxNumberValid]:[numberValid,maxNumberValid]">
                        <Input v-model.number="formValidate.clueProduct.saleNum" placeholder="请输入销量(数字)" />
                    </FormItem>
                </Row>
                <Row v-if="formValidate.tortType=='E_EC'&&formValidate.channelType=='AL'&&formValidate.hasProduct===1&&formValidate.valid===1" key="batchNum">
                    <FormItem 
                        label="起批量"
                        prop="clueProduct.batchNum" 
                        :rules="[numberValid,maxNumberValid]">
                        <Input v-model.number="formValidate.clueProduct.batchNum" placeholder="请输入起批量(数字)" />
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="调查时间" prop="surveyDate">
                        <DatePicker type="date" placeholder="请选择调查时间" style="width:100%" format="yyyy-MM-dd" :value="formValidate.surveyDate" placement="bottom-start" @on-change="getSurveyDate"></DatePicker>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="备注" prop="remark">
                        <Input v-model.trim="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
                    </FormItem>
                </Row>
                <Row>
                    <FormItem label="侵权照片/录像/附件" prop="attachmentList">
                        <file-upload
                            :defaultList="defaultList || []" 
                            :uploadConfig="uploadConfig"
                            @getFileList="getAttachmentList"></file-upload>
                    </FormItem>
                </Row>
            </div>
            <div v-if="formValidate.valid===1" class="detail-header">
                <span>侵权主体</span>
                <span class="icon-increase-01 add-icon" title="新增侵权主体" @click="handleAdd('clueTortSubjectList')"></span>
            </div>
            <div class="clue-tort-subject detail-form"
                v-for="(item, index) in formValidate.clueTortSubjectList"
                :key="'clueTortSubjectList.' + item.id"
                v-if="formValidate.valid===1&&isDetailLoad">
                <span v-if="item.index!=1" class="divider"></span>
                <span class="icon-down-01 remove-icon" v-if="(formValidate.clueTortSubjectList.length!=1)" @click="handleRemove('clueTortSubjectList',index)"></span>
                <tort-subject-form :notRequire="isRules()" @getList="getTortList($event,index)" :ref="'tortSubjectDom'+index" :defaultData="item || ''"></tort-subject-form>
            </div>
        </Form>
        <Row class="detail-btn-box">
            <Button type="primary" style="margin-right:10px;" :disabled="savePRLoading" :loading="savePRLoading" @click="handleSubmit('formValidate')">提交</Button>
            <Button @click="$emit('changeEditCtrl',false,false);">取消</Button>
        </Row>
    </div>
</template>
<script>
import tortSubjectForm from "./plugin/tortSubjectForm.vue";
export default {
    data () {
        const productUrlCheck = (rule, value, callback)=>{
            if(this.formValidate.tortType.indexOf('E')>-1){
                if(value===''){
                    callback(new Error('请输入产品链接'));
                }
            }
        }
        const overMillion = (rule, value, callback) => {
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback();
        };
        return {
            subjectIndex:1,
            uploadConfig:{
                fileName:'',
            },
            isDetailLoad:true,
            ctrl:false,
            savePRLoading:false,
            cityList:[],
            missionList:[],
            tortTypeArr:[],
            ecChannelArr:[],
            formValidate: {
                missionId: '',
                tortType: 'E_EC',
                channelType:'TT',
                platformName:'',
                storeUrl:'',
                storeName:'',
                address:'',
                valid:1,          // 是否侵权选项
                hasProduct:1,     // 是否有产品
                dispenser:"",     // 掌柜号
                surveyDate:'',
                remark:'',
                province:'',
                city:'',
                area:'',
                attachmentList:[],
                clueProduct:{
                    saleNum:'',
                    batchNum:'',
                    price:'',
                    productName:'',
                    productUrl:'',
                },
                clueTortSubjectList:[{status:1}],
            },
            ruleValidate:{
                missionId: [
                    { required: true,type:"number", message: '任务名称不能为空', trigger: 'blur' }
                ],
                tortType: [
                    { required: true, message: '侵权方式不能为空', trigger: 'change' }
                ],
                storeName:[
                    { required: true, message: '名称不能为空', trigger: 'blur' },
                    { max:128,message:'不能超过128个字符',trigger:'blur'}
                ],
                surveyDate:[
                    { required: true,message: '调查时间不能为空', trigger: 'blur' }
                ],
                attachmentList:[
                    { required: true,type:"array", message: '附件不能为空', trigger: 'blur' }
                ],
                remark:[
                    { max:512,message:'不能超过512个字符',trigger:'blur'}
                ]
            },
            longLimit:{ max:100,message:'不能超过100个字符',trigger:'blur'},
            numberValid:{pattern: /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/, message: '请输入正确的数字', trigger: 'blur'},
            maxNumberValid:{validator:overMillion, message: '最大不能超过一亿', trigger: 'blur'},
            //图片上传参数
            defaultList:[],
            uploadConfig:{
                num:1000
            },
        }
    },
    props: ["clueDetail","taskObj"],
    methods: {
        isRules(){
            if(this.formValidate.tortType.indexOf('E')>-1&&this.formValidate.tortType!='E_WL'&&(this.formValidate.channelType=='TT' || this.formValidate.channelType=='PD' || this.formValidate.channelType=='OT')){
                return true
            }else{
                return false
            }
        },
        //搜索条件省市区接口
        getCity(data,name,index){
            let area;
            let dataObj = {};
            if(data.length!=0){
                if(data.length==1){
                    dataObj.province = data[0].value;
                    dataObj.city = '';
                    dataObj.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    dataObj.province = data[0].value;
                    dataObj.city = data[1].value;
                    dataObj.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    dataObj.province = data[0].value;
                    dataObj.city = data[1].value;
                    dataObj.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                dataObj.province = '';
                dataObj.city = '';
                dataObj.area = '';
                area = '';
            }
           if(name=="suveryArea"){
                this.formValidate.province = dataObj.province;
                this.formValidate.city = dataObj.city;
                this.formValidate.area = dataObj.area;
            }else{
                // 改变数组中的对象的值，使用$set改变视图
                this.$set(this.formValidate[name][index],"province",dataObj.province);
                this.$set(this.formValidate[name][index],"city",dataObj.city);
                this.$set(this.formValidate[name][index],"area",dataObj.area);
            }
        },
        getSurveyDate(date){
            this.formValidate.surveyDate = date;
        },
        findDelete(prevArr,lastArr){
            for(let i=0;i<prevArr.length;i++){
                for(let k=0;k<lastArr.length;k++){
                    if(lastArr[k].id==prevArr[i].id){
                        prevArr.splice(i,1);
                        i--;
                        break;
                    }
                }
            }
        },
        //获取图片列表
        getAttachmentList (arr) {
            this.formValidate.attachmentList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                if(item.id){obj.id = item.id}
                this.formValidate.attachmentList.push(obj);
            })
        },
        //是否侵权
        changeValid(label){
            if(label===0){
                this.formValidate.hasProduct = 0;
            }else{
                this.formValidate.hasProduct = 1;
            }
        },
        //组装参数提交
        assembleData(){
            let ajaxDataObj = {};
            let formData = this.formValidate;
            for(let key in formData){
                if(key=="clueTortSubjectList"){
                    ajaxDataObj[key] = [];
                    formData[key].forEach((item,index)=>{
                        // 如果不侵权则不处理数据
                        if(!this.formValidate.valid){ return }
                        // 数据验证不通过则直接返回空字符串
                        if(!item || JSON.stringify(item)=="{}"){
                            ajaxDataObj[key].push("");
                            return
                        }
                        // 如果销售商非必填并且主体名称与主体区域均没有填写则不需要传递给后台
                        if(this.isRules() && item.name=="" && item.province==""){ return }
                        let obj = {
                            category:item.category,
                            name:item.name,
                            creditCode:item.creditCode,
                            legalRepresentative:item.legalRepresentative,
                            province:item.province,
                            city:item.city,
                            area:item.area,
                            address:item.address
                        }
                        if(item.id){
                            obj.id = item.id;
                        }
                        if(item.category=="S"){
                            obj.property = item.property;
                            obj.type = item.type;
                        }
                        ajaxDataObj[key].push(obj);
                    });
                }else{
                    ajaxDataObj[key] = formData[key];
                }
            }
            return ajaxDataObj
        },
        //提交按钮
        handleSubmit (name) {
            let tortSubjectIndex = 0;
            let isGoOn = true;
            //销售商、生产商组件手动校验
            //校验销售商、生产商是否有不通过的数据，并且校验是否必须统计销售商的个数
            this.formValidate.clueTortSubjectList.forEach((item,index)=>{
                let flag = this.$refs[`tortSubjectDom${index}`][0].submitValid();
                if(item.category=="S"){ tortSubjectIndex++ }
                if(!flag){
                    isGoOn = flag;
                    return
                }
            })
            //组装数据
            let ajaxData = this.assembleData();
            let url="/business/clue";
            if(this.clueDetail){
                ajaxData.id = this.clueDetail.id;
                //如果状态是撤回，则将其改为待审核
                if(this.clueDetail.state=="W"){
                    ajaxData.state="P";
                }
            }
            this.$refs[name].validate((valid) => {
                if (valid&&isGoOn) {
                    if(!this.isRules() && tortSubjectIndex==0 && this.formValidate.valid){
                        this.$Message.error("侵权主体中必须存在一个销售商，请完善销售商资料！");
                        return
                    }
                    this.savePRLoading = true;
                    //判断是否有删除的附件,过滤掉有id的附件
                    ajaxData.attachmentList = ajaxData.attachmentList.filter((item,index)=>{
                        return (!item.id)&&item
                    });
                    if(!this.clueDetail){
                        this.$post(url,ajaxData).then(res=>{
                            this.savePRLoading = false;
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        });
                    }else{
                        this.findDelete(this.defaultList,this.formValidate.attachmentList);
                        ajaxData.deleteIdList = this.defaultList.map((item)=>{
                            return item.id
                        });
                        this.$patch(url,ajaxData).then(res=>{
                            this.savePRLoading = false;
                            if(res.code==0){
                                this.$Message.success('操作成功');
                                this.$emit('changeEditCtrl',false,true);
                            }else{
                                this.$Message.error(res.message);
                            }
                        });
                    }
                }
            })
        },
        changeTortType(data){
            if(data.indexOf('E')>-1){
                this.formValidate.province = "";
                this.formValidate.city = "";
                this.formValidate.area = "";
            }
        },
        //动态增加侵权主体
        handleAdd (type) {
            this.subjectIndex++;
            let obj = {
                id:this.subjectIndex,
                category:"S",
                property:'E',
                name:'',
                type:'E',
                creditCode:'',
                legalRepresentative:'',
                address:'',
                province:"",
                city:"",
                area:"",
            }
            this.formValidate.clueTortSubjectList.unshift(obj);
        },
        handleRemove (type,index) {
            this.formValidate.clueTortSubjectList.splice(index,1);
        },
        //可搜索的select框
        getMissionId (data) {
            this.formValidate.missionId = data.id;
        },
        //赋默认值
        getDeafultData(){
            let t = this;
            this.isDetailLoad = false;
            this.formValidate.missionId = this.clueDetail.missionId;
            this.formValidate.tortType = this.clueDetail.tortType;
            this.formValidate.channelType = this.clueDetail.channelType;
            this.formValidate.platformName = this.clueDetail.platformName;
            this.formValidate.storeUrl = this.clueDetail.storeUrl;
            this.formValidate.storeName = this.clueDetail.storeName;
            this.formValidate.address = this.clueDetail.address;
            this.formValidate.valid = this.clueDetail.valid?1:0;
            this.formValidate.hasProduct = this.clueDetail.hasProduct?1:0;
            this.formValidate.dispenser = this.clueDetail.dispenser;
            this.formValidate.surveyDate = this.clueDetail.surveyDate;
            this.formValidate.remark = this.clueDetail.remark;
            this.formValidate.province = this.clueDetail.province;
            this.formValidate.city = this.clueDetail.city;
            this.formValidate.area = this.clueDetail.area;
            this.cityList = [this.clueDetail.province,this.clueDetail.city, this.clueDetail.area]
            this.formValidate.attachmentList = this.clueDetail.attachmentList;
            this.defaultList = this.clueDetail.attachmentList;
            this.formValidate.clueProduct = this.clueDetail.clueProduct || {};

            let clueTortSubjectArr = this.clueDetail.clueTortSubjectList || [];
            if(clueTortSubjectArr.length!=0){
                this.formValidate.clueTortSubjectList = [];
                clueTortSubjectArr.forEach((item,index)=>{
                    let obj = {
                        id:item.id,
                        category:item.category,
                        name:item.name,
                        creditCode:item.creditCode,
                        legalRepresentative:item.legalRepresentative,
                        province:item.province,
                        city:item.city,
                        area:item.area,
                        address:item.address,
                        cityList:[item.province || "",item.city || "",item.area || ""],
                    }
                    if(item.category=="S"){
                        obj.property = item.property;
                        obj.type = item.type;
                    }
                    this.formValidate.clueTortSubjectList.push(obj);
                })
            }
            setTimeout(function(){
                t.isDetailLoad = true;
            },50)
        },
        getTortSubjectInfo(data,item,index){
            item.tortSubject = data.compayName.trim();
            if(item.tortSubjectProperty=="P"){
                item.legalRepresentative = data.creditCode; //身份证号
            }else{
                item.tortSubjectNo = data.creditCode;        //统一社会信用代码
                item.legalRepresentative = data.legalPersonName; //法定代表人||经营者
            }
            if(data.address){
                item.cityList = [data.address.provinceCode,data.address.cityCode,data.address.areaCode];
                let name = 'transEvent'+index;
                this.$nextTick(function(){
                    this.$refs[name][0].uploadData();
                })
            }
        },
        getTortList(data,index){
            this.$set(this.formValidate.clueTortSubjectList,index,data);
        },
        //数据字典
        async getDictionary(){
            this.tortTypeArr = await this.common.getDictionaryItems('tort_type');
            this.ecChannelArr = await this.common.getDictionaryItems('ec_channel');
        },
    },
    created(){
        
    },
    beforeMount(){
        if(this.taskObj){
            this.formValidate.missionId = this.taskObj.id;
        }
        this.getDictionary();
    },
    mounted(){
        if(this.clueDetail){
            this.getDeafultData();
        }
    },
    updated(){

    },
    components: {
        tortSubjectForm
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import  './clueForm.scss';
</style>
