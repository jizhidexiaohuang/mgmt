<template>
    <div>
        <Form ref="formData" :model="tortSubjectObj" :label-width="labelWidth">
            <Row>
                <FormItem label="主体类型" prop="type">
                    <RadioGroup v-model="tortSubjectObj.category" @on-change="changeCategory">
                        <Radio :label="tortTypeItem.value" v-for="(tortTypeItem,index) in tortSubjCategoryArr" :key="index">{{tortTypeItem.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Row>
            <Row>
                <FormItem label="经营性质" prop="property" v-if="tortSubjectObj.category=='S'">
                    <RadioGroup v-model="tortSubjectObj.property">
                        <Radio :label="tortPropertyItem.value" v-for="(tortPropertyItem,index) in tortSubjPropertyArr" :key="index">{{tortPropertyItem.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Row>
            <Row>
                <FormItem label="主体名称" 
                prop="name"
                :rules="(notRequire && tortSubjectObj.category=='S')?[longLimit]:[{required: true, message: '主体名称不能为空', trigger: 'blur'},longLimit]">
                    <tianyancha v-if="isDetailLoad" :defaultName="tortSubjectObj.name" @getCustomerName="getTortSubjectInfo($event)" />
                </FormItem>
            </Row>
            <Row v-if="tortSubjectObj.category=='S'">
                <FormItem label="主体标签" prop="type">
                    <RadioGroup v-model="tortSubjectObj.type">
                        <Radio :label="tortTypeItem.value" v-for="(tortTypeItem,index) in tortSubjTypeArr" :key="index">{{tortTypeItem.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
            </Row>
            <Row>
                <FormItem 
                    :label="(tortSubjectObj.property!='P' || tortSubjectObj.category=='M')?'信用代码':'身份证号'" 
                    prop="creditCode"
                    :rules="(tortSubjectObj.property!='P' || tortSubjectObj.category=='M')?[longLimit]:[IDCardValid]">
                    <Input v-model.trim="tortSubjectObj.creditCode" 
                    :placeholder="'请输入'+((tortSubjectObj.property!='P' || tortSubjectObj.category=='M')?'信用代码':'身份证号')"/>
                </FormItem>
            </Row>
            <Row v-if="tortSubjectObj.property!='P'">
                <FormItem :label="$t('property.'+tortSubjectObj.property)" 
                prop="legalRepresentative"
                :rules="(notRequire && tortSubjectObj.category!='M')?[longLimit]:[{required: true, message: $t('property.'+tortSubjectObj.property)+'不能为空', trigger: 'blur'}]">
                    <Input v-model.trim="tortSubjectObj.legalRepresentative" :placeholder="'请输入'+$t('property.'+tortSubjectObj.property)" />
                </FormItem>
            </Row>
            <Row>
                <FormItem label="主体区域"
                prop="province"
                :rules="(notRequire && tortSubjectObj.category!='M')?{}:{required: true, message: '主体区域不能为空', trigger: 'blur'}">
                    <City ref="transEvent" v-if="isDetailLoad" v-on:listenCity="getCity($event,'clueTortSubjectList')" :cityList='tortSubjectObj.cityList || []' style="width:100%;"></City>
                </FormItem>
            </Row>
            <Row>
                <FormItem label="工商登记地址" 
                prop="address"
                :rules="(notRequire && tortSubjectObj.category!='M')?[longLimit]:[{required: true, message: '工商登记地址不能为空', trigger: 'blur'},longLimit]">
                    <Input v-model.trim="tortSubjectObj.address" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入工商登记地址"></Input>
                </FormItem>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tortSubjPropertyArr:[],
            tortSubjTypeArr:[],
            tortSubjCategoryArr:[],
            isDetailLoad:false,
            tortSubjectObj: {
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
            },
            longLimit:{ max:100,message:'不能超过100个字符',trigger:'blur'},
            IDCardValid:{pattern: /^[1-9]\d{5}(18|19|20|(3\d))\d{2}((0[1-9])|(1[0-2]))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/, message: '身份证格式错误', trigger: 'blur'}
        }
    },
    props:{
        notRequire:{
            type:Boolean,
            default:false
        },
        defaultData:{
            type:Object | String
        },
        labelWidth:{
            type:Number,
            default:150
        }
    },
    methods: {
        getTortSubjectInfo(data){
            this.tortSubjectObj.name = data.compayName?data.compayName.trim():"";
            this.tortSubjectObj.creditCode = data.creditCode; //身份证号
            if(this.tortSubjectObj.property!="P"){
                this.tortSubjectObj.legalRepresentative = data.legalPersonName; //法定代表人||经营者
            }
            if(data.address){
                this.tortSubjectObj.cityList = [data.address.provinceCode,data.address.cityCode,data.address.areaCode];
                this.tortSubjectObj.address = data.address.text;
                let name = 'transEvent';
                this.$nextTick(function(){
                    this.$refs[name].uploadData();
                })
            }
        },
        //搜索条件省市区接口
        getCity(data,name){
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
            this.tortSubjectObj.province = dataObj.province;
            this.tortSubjectObj.city = dataObj.city;
            this.tortSubjectObj.area = dataObj.area;
        },
        giveData(){
            this.tortSubjectObj.category=this.defaultData.category;
            this.tortSubjectObj.name=this.defaultData.name;
            this.tortSubjectObj.creditCode=this.defaultData.creditCode?this.defaultData.creditCode.trim():"";
            this.tortSubjectObj.legalRepresentative=this.defaultData.legalRepresentative;
            this.tortSubjectObj.cityList=this.defaultData.cityList;
            this.tortSubjectObj.address=this.defaultData.address;
            this.tortSubjectObj.province=this.defaultData.province;
            this.tortSubjectObj.city=this.defaultData.city;
            this.tortSubjectObj.area=this.defaultData.area;

            if(this.tortSubjectObj.category=="S"){
                this.tortSubjectObj.type=this.defaultData.type;
                this.tortSubjectObj.property=this.defaultData.property;
            }

            if(this.defaultData.id){
                this.tortSubjectObj.id=this.defaultData.id;
            }

            this.isDetailLoad = true;
        },
        //手动验证 传值
        submitValid(){
            let flag;
            this.$refs['formData'].validate((valid) => {
                flag = valid; 
                this.$emit('getList',this.tortSubjectObj);
            })
            return flag
        },
        changeCategory(type){
            if(type=="M"){ this.tortSubjectObj.property = "E" }
        },
        //数据字典
        async getDictionary(){
            this.tortSubjCategoryArr = await this.common.getDictionaryItems('tort_subj_category');
            this.tortSubjPropertyArr = await this.common.getDictionaryItems('tort_subj_property');
            this.tortSubjTypeArr = await this.common.getDictionaryItems('tort_subj_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        if(this.defaultData&&this.defaultData.id){
            this.giveData();
        }else{
            this.isDetailLoad = true;
        }
    },
    updated(){},
    components: {},
    watch: {
        tortSubjectObj:{
            handler(val,oldVal){
                setTimeout((()=>{
                    this.submitValid();
                }),50)
            },
            deep: true
        }
    }
}
</script>
<style>
 
</style>