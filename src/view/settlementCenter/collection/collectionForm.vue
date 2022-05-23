<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="金额" prop="amount">
                    <my-input ref="myInput" class="num-input"
                        appendText="￥" 
                        :defaultData="defaultAmount"
                        :toFixed="2"
                        @getValue="getInputValue($event)"
                    ></my-input>
                </FormItem>
                <FormItem label="付款人" prop="payer">
                    <Input type="text" v-model.trim="formData.payer" placeholder="请输入付款人"></Input>
                </FormItem>
                <FormItem label="收款日期" prop="incomeDate">
                    <DatePicker type="date" 
                        style="width:100%"
                        :value="formData.incomeDate"
                        @on-change="getIncomeDate"
                        placeholder="请选择收款日期"></DatePicker>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input type="textarea" v-model.trim="formData.remark" placeholder="请输入备注"></Input>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitRealIncome()">保存</Button>
                <Button @click="$emit('changeCtrl',false)">取消</Button>
            </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        const validateMoney = (rule, value, callback) => {
            if(!value){
                return callback(new Error('请填写金额'));
            }
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback()
        }
        return {
            defaultAmount:'',
            formData:{
                amount:'',
                payer:'',
                incomeDate:'',
                remark:''
            },
            ruleValidate:{
                amount:[{required: true,validator:validateMoney,trigger:'blur'}],
                payer:[
                    {required:true,message:'付款人不能为空',trigger:'blur'},
                    {max:32,message:'长度不能超过32个字符',trigger:'blur'}
                ],
                incomeDate:[{required:true,message:'收款日期不能为空',trigger:'blur'}]
            },
            isSubmit:false,
        }
    },
    props: [''],
    methods: {
        getIncomeDate(data){
            this.formData.incomeDate = data;
        },
        getInputValue(data){
            this.formData.amount = data;
        },
        submitRealIncome(){
            let url = '/settlement/finance/income';
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    this.$post(url,this.formData).then(res=>{
                        this.isSubmit = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.$emit('changeCtrl',true)
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        }
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
