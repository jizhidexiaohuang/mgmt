<template>
    <div>
        <Form ref="formSign" :model="formSign" :rules="formSignRules" :label-width="120">
            <div class="detail-form">
                <FormItem label="签署日期" prop="signingDate" >
                    <DatePicker type="date" style="width:100%;" @on-change="getSignDate" placeholder="请选择签署日期"></DatePicker>
                </FormItem>
                <FormItem label="签署地址" prop="province">
                    <City ref="transEvent" v-on:listenCity="getCity" :cityList="cityList" style="width:100%;"></City>
                </FormItem>
                <FormItem label="详细地址" prop="address">
                    <Input v-model.trim="formSign.address" maxlength="128" type="textarea" :autosize="{minRows: 2,maxRows: 5}" show-word-limit placeholder="请输入地址"></Input>
                </FormItem>
                <FormItem label="合同附件" prop="contract">
                    <file-upload 
                        :acceptType="'.pdf'"
                        :format="['pdf']"
                        :defaultList="defaultList" 
                        :uploadConfig="uploadConfig" @getFileList="getFileList"></file-upload>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="signSubmit('formSign')">确认</Button>
                    <Button @click="$emit('changeEditCtrl',false,false);" style="margin-left: 8px">取消</Button>
                </FormItem>
            </div>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formSign:{
                signingDate:'',
                province:'',
                city:'',
                area:'',
                address:'',
                contract:[]
            },
            formSignRules:{
                signingDate:[{required:true,message:'请选择签署日期',trigger:'change'}],
                province:[{required:true,message:'省份不能为空',trigger:'change'}],
                city:[{required:true,message:'城市不能为空',trigger:'change'}],
                area:[{required:true,message:'城市不能为空',trigger:'change'}],
                address:[
                    {required:true,message:'详细地址不能为空',trigger:'change'},
                    { max:128,message:'不能超过128个字符',trigger:'blur'}
                ],
                contract:[{required:true,type:'array',message:'请上传合同附件',trigger:'blur'}],
            },
            cityList:[],
            defaultList:[],
            uploadConfig:{fileName:'contract'},
        }
    },
    props: ['signId'],
    methods: {
        //签署操作
        signSubmit(name){
            let url = '/base/contract/sign';
            let ajaxData = {
                id:this.signId,
                signTime:this.formSign.signingDate,
                signProvince:this.formSign.province,
                signCity:this.formSign.city,
                signArea:this.formSign.area,
                signAddress:this.formSign.address,
                attachmentList:this.formSign.contract
            }
            this.$refs[name].validate((valid) => {
                if (valid) {
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$Message.success('操作成功！');
                            this.$emit('changeEditCtrl',false,true);
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        },
        getSignDate(value){
            this.formSign.signingDate = value;
        },
        // 搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.formSign.province = data[0].value;
                    this.formSign.city = '';
                    this.formSign.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.formSign.province = data[0].value;
                    this.formSign.city = data[1].value;
                    this.formSign.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.formSign.province = data[0].value;
                    this.formSign.city = data[1].value;
                    this.formSign.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.formSign.province = '';
                this.formSign.city = '';
                this.formSign.area = '';
                area = '';
            }
        },
        //获取文件list
        getFileList(data){
            console.log(data)
            if(data.length>0){
                this.formSign.contract = data.map(item=>{
                    return {
                        url:item.url,
                        fileName:item.fileName,
                        mediaType:item.mediaType
                    };
                });
            }else{
                this.formSign.contract = [];
            }
        },
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
