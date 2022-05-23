<template>
    <div class="customer-form">
         <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="120">
            <Row class="detail-header">
                <span>分类信息</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="行业偏好" prop="industry">
                    <CheckboxGroup v-model="formValidate.industry">
                        <Checkbox v-for="item in industryArr" :key="item.id" :label="item.value" style="width:134px;"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="研发能力" prop="hasResearchDevelopAbility">
                    <RadioGroup v-model="formValidate.hasResearchDevelopAbility">
                        <Radio v-for="item in hasResearchDevelopAbilityArr" :key="item.id" :label="item.value">{{item.nameZh}}</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="级别" prop="level">
                    <Select v-model="formValidate.level" placeholder="请选择级别">
                        <Option v-for="item in levelArr" :key="item.id" :value="item.value">{{item.nameZh}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="可调查区域" prop="location">
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
            levelArr:[],
            industryArr:[],      //擅长行业
            hasResearchDevelopAbilityArr:[],//研发能力
            // 基本信息
            formValidate:{
                hasResearchDevelopAbility:'',
                industry:[],
                location:[],
                level:'',
                isExternal:'Y',
                note:'',
            },
            ruleValidate:{
                note:[{ max:255,message:'不能超过255个字符',trigger:'blur'}]
            },
            //区域多选默认值
            defaultLocation:[],
            detailsCtrl:false,
            editId:''
        }
    },
    props: ['investigatorDetail'],
    methods: {
        // 编辑
        handleSubmit(name){
            this.$refs[name].validate((valid) => {
                if (valid) {
                    //在这里提交数据
                    let url = '/base/investigator/'+this.editId+'/business';
                    let ajaxData = {
                        hasResearchDevelopAbility:this.formValidate.hasResearchDevelopAbility=='1'?true:false,
                        level:this.formValidate.level,
                        isExternal:this.formValidate.isExternal=='Y'?true:false,
                        note:this.formValidate.note,
                        industryList:this.formValidate.hasPreferenceIndustry=='N'?[]:this.formValidate.industry.map(item=>{return {industry:item}}),
                        locationList:this.formValidate.hasInquiryAbility=='N'?[]:this.formValidate.location
                    }
                    this.$patch(url,ajaxData).then(res=>{
                        console.log(res);
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
            this.levelArr = await this.common.getDictionaryItems('investigator_level');
            this.hasResearchDevelopAbilityArr = await this.common.getDictionaryItems('research_develop_ability_type');
        },
        getLocation(data){
            console.log(data);
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
        getDetails(investigatorDetail){
            let teamInfo = investigatorDetail.teamInfo;
            //基本信息
            this.editId = investigatorDetail.id;
            //分类信息
            this.formValidate.industry = teamInfo.industryList&&teamInfo.industryList.length>0?teamInfo.industryList.map(item=>{return item.industry}):[];
            this.formValidate.hasResearchDevelopAbility = teamInfo.hasResearchDevelopAbility?'1':'0';
            this.formValidate.level = teamInfo.level;
            this.defaultLocation = teamInfo.locationList&&teamInfo.locationList.length>0?teamInfo.locationList.map(item=>{
                return {
                    code:item.city,
                    name:item.cityName,
                    provinceCode:item.province,
                    province:item.provinceName
                }
            }):[]
            //补充信息
            this.formValidate.isExternal = teamInfo.isExternal?'Y':'N';
            this.formValidate.note = teamInfo.note;
            this.detailsCtrl = true;
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getDetails(this.investigatorDetail);
    },
    mounted(){
        console.log(this.investigatorDetail);
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.addBtn{
    position:absolute;
    right:-15px;
    top:0;
}
.form-add{
    position: relative;
    margin-bottom:24px;
}
</style>
<style lang="sass" scoped>
@import "../../relationship/customerManage/customerForm.scss"
</style>

