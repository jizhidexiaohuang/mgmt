<template>
    <div class="customer-form">
        <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Row class="detail-header">
                <span>能力信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="是否有偏好行业" prop="hasPreferenceIndustry">
                    <RadioGroup v-model="formValidate.hasPreferenceIndustry">
                        <Radio label="Y">有</Radio>
                        <Radio label="N">无</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="擅长行业" 
                    prop="industry"
                    :rules="{ required: true, type: 'array', min:1, message:'请选择擅长行业',trigger: 'change' }" 
                    v-if="formValidate.hasPreferenceIndustry=='Y'">
                    <CheckboxGroup v-model="formValidate.industry">
                        <Checkbox v-for="item in industryArr" :key="item.id" :label="item.value" style="width:134px;"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="是否有调查能力" prop="hasInquiryAbility">
                    <RadioGroup v-model="formValidate.hasInquiryAbility">
                        <Radio v-for="item in inquiryAbilityArr" :key="item.id" :label="item.value">{{item.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="调查类型" 
                    prop="inquiryType"
                    :rules="{ required: true, type: 'array', min:1, message:'请选择调查类型',trigger: 'change' }"
                    v-if="formValidate.hasInquiryAbility=='Y'">
                    <CheckboxGroup v-model="formValidate.inquiryType">
                        <Checkbox v-for="item in inquiryTypeArr" :key="item.id" :label="item.value"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="可调查区域" prop="location"
                    v-if="formValidate.hasInquiryAbility=='Y'&&formValidate.inquiryType.indexOf('offline')!=-1">
                    <chooseCity v-if="detailsCtrl" v-on:listenLocation="getLocation" :defaultLocation="defaultLocation"></chooseCity>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>补充信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="内外属性" prop="isExternal">
                    <RadioGroup v-model="formValidate.isExternal">
                        <Radio label="Y">外部</Radio>
                        <Radio label="N">内部</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="售卖权利" prop="isToSale">
                    <RadioGroup v-model="formValidate.isToSale">
                        <Radio label="Y">有</Radio>
                        <Radio label="N">无</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="备注信息" prop="note">
                    <Input v-model.trim="formValidate.note" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" @click="handleSubmit('formValidate')">保存</Button>
                <Button @click="$emit('changeEditCtrl',false);">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            industryArr:[],      //擅长行业
            inquiryTypeArr:[],     //调查类型
            inquiryAbilityArr:[],  //有无调查能力
            index:1,
            // 基本信息
            formValidate:{
                hasPreferenceIndustry:'',
                industry:[],
                hasInquiryAbility:'',
                inquiryType:[],
                location:[],
                isExternal:'Y',
                isToSale:'N',
                note:'',
            },
            ruleValidate:{
                hasPreferenceIndustry:[{ required: true, message: '请选择是否有偏好行业', trigger: 'change' }],
                hasInquiryAbility:[{ required: true, message: '请选择是否有调查能力', trigger: 'change' }],
                location:[{ required: true, type: 'array', min: 1, message: '可调查区域不能为空', trigger: 'change' }],
                isExternal:[{ required: true, message: '请选择内外属性', trigger: 'change' }],
                isToSale:[{ required: true, message: '请选择售卖权利', trigger: 'change' }],
                note:[{ max:255,message:'不能超过255个字符',trigger:'blur'}]
            },
            cityList:[],
            //区域多选默认值
            defaultLocation:[],
            detailsCtrl:false,
            editId:''
        }
    },
    props: ['lawyerDetail'],
    methods: {
        // 编辑
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //在这里提交数据
                    let url = '/base/lawyer/'+this.editId+'/business';
                    let ajaxData = {
                        hasPreferenceIndustry:this.formValidate.hasPreferenceIndustry,
                        industryList:this.formValidate.hasPreferenceIndustry=='N'?[]:this.formValidate.industry.map(item=>{return {industry:item}}),
                        hasInquiryAbility:this.formValidate.hasInquiryAbility,
                        inquiryTypeList:this.formValidate.hasInquiryAbility=='N'?[]:this.formValidate.inquiryType.map(item=>{return {inquiryType:item}}),
                        locationList:this.formValidate.hasInquiryAbility=='N'?[]:this.formValidate.location,
                        
                        isExternal:this.formValidate.isExternal=='Y'?true:false,
                        isToSale:this.formValidate.isToSale=='Y'?true:false,
                        note:this.formValidate.note,
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            //关闭侧边栏，刷新列表
                            this.$emit('changeEditCtrl',false);
                        }
                    })
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.industryArr = await this.common.getDictionaryItems('industry_type');
            this.inquiryTypeArr = await this.common.getDictionaryItems('inquiry_type');
            this.inquiryAbilityArr = await this.common.getDictionaryItems('inquiry_ability_type');
        },
        getLocation(data){
            this.formValidate.location = [];
            if(data.length>0){
                data.forEach(item=>{
                    item.cities.forEach(city=>{
                        this.formValidate.location.push({province:item.provinceCode,city:city.code})
                    })
                })
            }else{
                this.formValidate.location = [];
            }
        },
        //赋值
        getDetails(lawyerDetail){
            let teamInfo = lawyerDetail.teamInfo;
            //基本信息
            this.editId = lawyerDetail.id;
            //能力信息
            this.formValidate.hasPreferenceIndustry = teamInfo.hasPreferenceIndustry;
            this.formValidate.industry = teamInfo.industryList&&teamInfo.industryList.length>0?teamInfo.industryList.map(item=>{return item.industry}):[];
            this.formValidate.hasInquiryAbility = teamInfo.hasInquiryAbility;
            this.formValidate.inquiryType = teamInfo.inquiryTypeList&&teamInfo.inquiryTypeList.length>0?teamInfo.inquiryTypeList.map(item=>{return item.inquiryType}):[];
            this.defaultLocation = teamInfo.locationList&&teamInfo.locationList.length>0?teamInfo.locationList.map(item=>{
                return {
                    code:item.city,
                    name:item.cityName,
                    provinceCode:item.province,
                    province:item.provinceName
                }
            }):[]
            console.log(teamInfo.locationList)
            console.log(this.defaultLocation)
            //补充信息
            this.formValidate.isExternal = teamInfo.isExternal?'Y':'N';
            this.formValidate.isToSale = teamInfo.isToSale?'Y':'N';
            this.formValidate.note = teamInfo.note;
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getDetails(this.lawyerDetail)
    },
    mounted(){
       
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.addBtn{
    position:absolute;
    right:0px;
    top:0;
}
.form-add{
    position: relative;
    margin-bottom:10px;
}
</style>
<style lang="sass" scoped>
@import "../../relationship/customerManage/customerForm.scss"
</style>

