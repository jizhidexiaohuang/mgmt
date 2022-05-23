<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="130">
            <Row class="detail-header">
                <span>基本情况</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="一级行业名称" prop="primaryIndustry">
                    <Select v-model="formData.primaryIndustry" placeholder="请选择一级行业名称">
                        <Option v-for="item in primaryIndustryArr" :value="item.value" :key="item.id">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="二级行业名称" prop="industryName">
                    <Input v-model.trim="formData.industryName" placeholder="请输入二级行业名称"></Input>
                </FormItem>
                <FormItem label="行业描述" prop="description">
                    <Input v-model.trim="formData.description" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写行业描述"></Input>
                </FormItem>
                <FormItem label="行业市场结构" prop="structure">
                    <RadioGroup v-model="formData.structure">
                        <Radio :label="item.value" v-for="item in structureArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="行业属性" prop="industryAttributes">
                    <RadioGroup v-model="formData.industryAttributes">
                        <Radio :label="item.value" v-for="item in industryAttributesArr" :key="item.id"><span>{{item.nameZh}}</span></Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="行业要素集约度" prop="intensive">
                    <CheckboxGroup v-model="formData.intensive">
                        <Checkbox v-for="item in intensiveArr" :key="item.id" :label="item.value"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="行业政策环境" prop="policyEnvironment">
                    <Input v-model.trim="formData.policyEnvironment" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写行业政策环境描述"></Input>
                </FormItem>
                <FormItem label="行业市场环境" prop="marketingEnvironment">
                    <Input v-model.trim="formData.marketingEnvironment" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写行业市场环境描述"></Input>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>行业最近5年市场规模、利润率和增长率</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="" :label-width="30">
                    <CheckboxGroup v-model="situationType" @on-change="changeCategory">
                        <Checkbox v-for="item in situationTypeArr" :key="item.id" :label="item.value" :disabled="situationType.length==1 && item.value==situationType[0]">
                            <span>{{item.nameZh}}</span>
                        </Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="" :label-width="20" prop="industrySituationList"
                    :rules="{ validator: numValid,trigger:'blur' }">
                    <div class="industry-table">
                        <table>
                            <thead>
                                <th></th>
                                <th v-for="(year,index) in yearArr" :key="index">{{year}}</th>
                            </thead>
                            <tbody>
                                <tr v-for="industry in industrySituationList" :key="industry.name" v-show="industry.status">
                                    <td>{{industry.name}}</td>
                                    <td v-for="(item,index) in industry.list" :key="index">
                                        <Input type="text" v-model="item.value"></Input>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                </FormItem>
            </Row>
            <Row class="detail-header">
                <span>行业知识产权情况</span>
            </Row>
            <Row class="detail-form">
                <FormItem label="行业专利数量" prop="patentsNumber">
                    <InputNumber v-model="formData.patentsNumber" class="input-num" :min="0" :max="99999999" placeholder="请输入行业专利数量"></InputNumber>
                    <span>件</span>
                </FormItem>
                <FormItem label="行业商标数量" prop="trademarkNumber">
                    <InputNumber v-model="formData.trademarkNumber" class="input-num" :min="0" :max="99999999" placeholder="请输入行业商标数量"></InputNumber>
                    <span>件</span>
                </FormItem>
                <FormItem label="行业著作权数量" prop="copyrightNumber">
                    <InputNumber v-model="formData.copyrightNumber" class="input-num" :min="0" :max="99999999" placeholder="请输入行业著作权数量"></InputNumber>
                    <span>件</span>
                </FormItem>
                <FormItem label="企业知识产权侵权现状" prop="infringementStatus">
                    <Input v-model.trim="formData.infringementStatus" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写现状描述"></Input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submit('formData')">保存</Button>
                <Button @click="$emit('changeEditCtrl',false)">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        const numValid = (rule, value,callback)=>{
            this.industrySituationList.map(item=>{
                item.list.map(listItem=>{
                    if(listItem.value && !Number(listItem.value) && Number(listItem.value)!==0){
                        return callback(new Error('* 请填写数字'));
                    }else{
                        if(Number(listItem.value)>100000000){
                            return callback(new Error('* 数值不能超过100000000'));
                        }
                    }
                })
            })
            callback();
        }
        return {
            numValid:numValid,
            formData:{
                primaryIndustry:'',
                industryName:'',
                description:'',
                structure:'P',
                industryAttributes:'E',
                intensive:[],
                policyEnvironment:'',
                marketingEnvironment:'',
                patentsNumber:0,
                trademarkNumber:0,
                copyrightNumber:0,
                infringementStatus:'',
                industrySituationList:[]
            },
            ruleValidate:{
                primaryIndustry:[{ required:true, message:'请选择一级行业', trigger:'change' }],
                industryName:[
                    { required:true, message:'请填写二级行业名称', trigger:'blur' },
                    { max:64, message:'不能超过64个字符', trigger:'blur' }
                ],
                description:[
                    { required:true, message:'请填写行业描述', trigger:'blur' },
                    { max:1024, message:'不能超过1024个字符', trigger:'blur' }
                ],
                structure:[
                    { required:true, message:'请选择行业市场结构', trigger:'change' },
                ],
                industryAttributes:[
                    { required:true, message:'请选择行业属性', trigger:'change' },
                ],
                intensive:[
                    { required:true, type:'array',message:'请选择行业要素集约度', trigger:'change' }
                ],
                policyEnvironment:[
                    { required:true, message:'请填写行业政策描述', trigger:'blur' },
                    { max:1024, message:'不能超过1024个字符', trigger:'blur' }
                ],
                marketingEnvironment:[
                    { required:true, message:'请填写行业市场描述', trigger:'blur' },
                    { max:1024, message:'不能超过1024个字符', trigger:'blur' }
                ],
                patentsNumber:[
                    { required:true, type:'number', message:'请填写行业专利数量', trigger:'blur' },
                ],
                trademarkNumber:[
                    { required:true, type:'number', message:'请填写行业商标数量', trigger:'blur' },
                ],
                copyrightNumber:[
                    { required:true, type:'number', message:'请填写行业著作权数量', trigger:'blur' },
                ],
                infringementStatus:[
                    { max:1024, message:'不能超过1024个字符', trigger:'blur' }
                ]
            },
            primaryIndustryArr:[],
            structureArr:[],
            industryAttributesArr:[],
            intensiveArr:[],
            situationTypeArr:[],
            isSubmit:false,
            situationType:[],
            yearArr:[],
            industrySituationList:[]
        }
    },
    props: ['industryDetail'],
    methods: {
        // 获取最近5年的年份
        getYear(){
            let thisYear = new Date().getFullYear();
            for(let i=5;i>0;i--){
                this.yearArr.push(thisYear-i);
            }
        },
        // 勾选行业趋势的操作
        changeCategory(data){
            if(!data || data.length==0){
                return;
            }
            for(let i=0;i<this.industrySituationList.length;i++){
                for(let j=0;j<data.length;j++){
                    if(this.industrySituationList[i].type==data[j]){
                        this.industrySituationList[i].status = 1;
                        break;
                    }else if(this.industrySituationList[i].type!=data[j] && j==data.length-1){
                        this.industrySituationList[i].status = 0;
                    }
                }
            }
        },
        // 提交数据
        submit(name){
            let url = '/base/industry';
            let ajaxData = {};
            Object.assign(ajaxData,this.formData);
            ajaxData.industrySituationList = [];

            this.industrySituationList.map(item=>{
                if(item.status==1){
                    item.list.map(listItem=>{
                        ajaxData.industrySituationList.push({
                            year:String(listItem.year),
                            type:item.type,
                            value:listItem.value==''?0:Number(listItem.value)
                        })
                    })
                }
            })
            ajaxData.intensive = ajaxData.intensive.join(',');
            this.$refs[name].validate((valid)=>{
                if(valid){
                    this.isSubmit = true;
                    if(this.industryDetail){
                        ajaxData.id = this.industryDetail.id;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功')
                                this.$emit('changeEditCtrl',true);
                            }else{
                                this.$Message.error('操作成功')
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功')
                                this.$emit('changeEditCtrl',true);
                            }else{
                                this.$Message.error('操作成功')
                            }
                        })
                    }
                }
            })
        },
        // 赋值
        getDetail(){
            let data = this.industryDetail;
            for(let key in this.formData){
                this.formData[key] = data[key];
            }
            this.formData.intensive = data.intensive.split(',');
            let list = data.industrySituationList;
            // 默认勾选全部的行业发展趋势 初始化--编辑状态下
            this.situationType = [];
            let json={};
            list.map(item=>{
                if(!json[item.type]){
                    json[item.type] = 1;
                    this.situationType.push(item.type);
                }else{
                    json[item.type]++;
                }
            })
            // 赋值tableList
            this.industrySituationList.map(item=>{
                list.map(listItem=>{
                    if(item.type==listItem.type){
                        item.status = 1;
                        item.list.map(itemSub=>{
                            if(itemSub.year==listItem.year){
                                itemSub.value = listItem.value;
                            }
                        })
                    }
                })
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.primaryIndustryArr = await this.common.getDictionaryItems('primary_industry');
            this.structureArr = await this.common.getDictionaryItems('structure');
            this.industryAttributesArr = await this.common.getDictionaryItems('industry_attributes');
            this.intensiveArr = await this.common.getDictionaryItems('intensive');
            this.situationTypeArr = await this.common.getDictionaryItems('situation_type');
            //默认勾选全部的行业发展趋势 初始化--新增状态下
            this.initList();
            if(!this.industryDetail){
                this.situationType = this.situationTypeArr.map(item=>{
                    return item.value;
                })
            }else{
                this.getDetail();
            }
        },
        //初始化tableList
        initList(){
            this.industrySituationList = [];
            this.situationTypeArr.map(item=>{
                // 初始化表格数据
                this.industrySituationList.push({
                    name:item.nameZh,
                    type:item.value,
                    status:this.industryDetail?0:1,
                    list:this.yearArr.map(yearItem=>{
                        return {
                            year:yearItem,
                            value:'',
                            type:item.value
                        }
                    })
                })
            })
        }
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getYear();
    },
    mounted(){
        // if(this.industryDetail){
        //     this.getDetail();
        // }
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
 @import './industryForm.scss';
</style>
<style lang="scss">
.industry-table input.ivu-input.ivu-input-default{
    border:none;
}
.input-num{
    width:calc(100% - 30px);
    margin-right:5px;
}
</style>
