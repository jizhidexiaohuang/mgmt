<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="类型" prop="type">
                    <Select v-model="formData.type" placeholder="请选择类型">
                        <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="">
                    <Row>
                        <Button type="primary" @click="addCaseModal=true">选择案件</Button>
                    </Row>
                </FormItem>
                <FormItem label="案件" prop="type">
                    <Row>{{caseCode}}</Row>
                </FormItem>
                <FormItem label="律师团队" prop="teamId">
                    <Row>{{teamName}}</Row>
                </FormItem>
                <FormItem label="金额" prop="saleFee">
                    <my-input ref="myInput" class="num-input"
                        appendText="￥" 
                        :defaultData="defaultSalesFee"
                        :toFixed="2"
                        @getValue="getInputValue($event)"
                    ></my-input>
                </FormItem>
                <FormItem label="备注" prop="remark">
                    <Input v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
                </FormItem>
                <Row class="detail-btn-box" style="margin-top:20px;">
                    <Button type="primary" style="margin-right:10px;" @click="submitAdditionalOrder()" :disabled="isSubmit">确定</Button>
                    <Button @click="$emit('closeDrawer',false)">取消</Button>
                </Row>
            </Row>
        </Form>
        <!-- 添加案件 -->
        <Modal 
            v-model="addCaseModal" 
            :width="750"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">案件列表</div>
            <add-case-component v-if="addCaseModal" :defaultObj="defaultCaseObj" @refreshList="getIdList($event)"></add-case-component>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import addCaseComponent from './addCaseComponent.vue';
export default {
    data () {
        const saleFeeValid = (rule,value,callback)=>{
            console.log(value)
            if(!value){
                return callback(new Error('请填写金额'));
            }
            if(Number(value)>100000000){
                return callback(new Error('金额不能超过一亿'));
            }
            callback()
        }
        return {
            formData:{
                type:'',
                orderItemId:'', // 案件订单明细ID
                saleBagItemId:'',//案件包明细ID
                caseId:'', //案件id
                teamId:'',
                saleFee:'',
                remark:''
            },
            caseCode:'',
            teamName:'',
            typeArr:[],
            ruleValidate:{
                type:[{required:true,message:'请选择类型',trigger:'change'}],
                orderItemId:[{required:true,message:'请选择案件',trigger:'change'}],
                teamId:[{required:true,type:'number',message:'请选择律师团队',trigger:'change'}],
                saleFee:[{required:true,validator:saleFeeValid,trigger:'blur'}],
                remark:[
                    {required:true,message:'请填写备注',trigger:'blur'},
                    {max:512,message:'长度不能超过512个字符',trigger:'blur'}
                ]
            },
            defaultSalesFee:'',
            addCaseModal:false,
            defaultCaseObj:{},
            caseObj:{},
            isSubmit:false
        }
    },
    props: [''],
    methods: {
        //获取案件
        getIdList(data){
            this.caseObj = data;
        },
        // 确定
        confirm(){
            this.addCaseModal = false;
            this.defaultCaseObj = this.caseObj;
            this.formData.orderItemId = this.caseObj.orderItemId;
            this.formData.saleBagItemId = this.caseObj.saleBagItemId;
            this.formData.caseId = this.caseObj.caseId;
            this.formData.teamId = this.caseObj.teamId;
            this.teamName = this.caseObj.teamName;
            this.caseCode = this.caseObj.caseCode;
        },
        //取消
        cancel(){
            this.addCaseModal = false;
            this.caseObj = this.defaultCaseObj;
        },
        getInputValue(data){
            this.formData.saleFee = data;
        },
        // 提交
        submitAdditionalOrder(){
            let url = '/settlement/trade/sale/order/additional';
            this.$refs['formData'].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    this.$post(url,this.formData).then(res=>{
                        this.isSubmit = false;
                        if(res.code==0){
                            this.$emit('closeDrawer',true);
                            this.$Message.success('操作成功')
                        }else{
                            this.$Message.error('操作失败')
                        }
                    })
                }
            })
        },
        // 获取字典数据接口
        async getDictionary(){
            this.typeArr = await this.common.getDictionaryItems('order_additional_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {addCaseComponent},
    watch: {}
}
</script>
<style>
 
</style>
