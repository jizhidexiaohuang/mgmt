<template>
    <div class="setting-box">
        <Row class="detail-header">
            <span>测购配置</span>
        </Row>
        <Row v-if="!isInfo" class="detail-form">
            <Form ref="formValidate" :model="formData" :rules="ruleValidate" :label-width="100">
                <FormItem label="是否需要测购" prop="isTestPurchase">
                    <RadioGroup v-model="formData.isTestPurchase">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <Row v-if="formData.isTestPurchase===1">
                    <FormItem label="是否需要邮寄" prop="isMailingSample">
                        <RadioGroup v-model="formData.isMailingSample">
                            <Radio :label="1">是</Radio>
                            <Radio :label="0">否</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="商品邮寄给" v-if="formData.isMailingSample===1" prop="merchandiseMailing">
                        <RadioGroup v-model="formData.merchandiseMailing">
                            <Radio label="C">客户</Radio>
                            <Radio label="A">安盾</Radio>
                        </RadioGroup>
                    </FormItem>
                    <FormItem label="地址" v-if="formData.isMailingSample===1" prop="address" :rules="[{ max:128,message:'不能超过128个字符',trigger:'blur'}]">
                        <Input v-model="formData.address" type="textarea" :autosize="{minRows: 3,maxRows: 5}" placeholder="请输入地址" />
                    </FormItem>
                </Row>
            </Form>
            <Row class="btn-box">
                <Button @click="sumbitData" :disabled="isSumbit" type="primary">保存</Button>
            </Row>
        </Row>
        <Row v-else class="detail-content">
            <Row><Col span="5" class="left-label">是否需要测购：</Col><Col span="16" class="right-content">{{defaultData.isTestPurchase?"是":"否"}}</Col></Row>
            <Row v-if="defaultData.isTestPurchase">
                <Row><Col span="5" class="left-label">是否需要邮寄：</Col><Col span="16" class="right-content">{{defaultData.isMailingSample?"是":"否"}}</Col></Row>
                <Row v-if="defaultData.isMailingSample"><Col span="5" class="left-label">商品邮寄给：</Col><Col span="16" class="right-content">{{defaultData.merchandiseMailing=="C"?"客户":"安盾"}}</Col></Row>
                <Row v-if="defaultData.isMailingSample"><Col span="5" class="left-label">地址：</Col><Col span="16" class="right-content">{{defaultData.address || ""}}</Col></Row>
            </Row>
            <Row class="btn-box">
                <Button type="primary" @click="isInfo=false">修改</Button>
                <Button @click="deteleCtrl=true">删除</Button>
            </Row>
        </Row>

        <!-- 审核 -->
        <Modal
            v-model="deteleCtrl"
            title="确认删除"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除该测购配置？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeDelete">确认</Button>
                <Button @click="deteleCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            formData:{
                isTestPurchase:1,
                isMailingSample:1,
                merchandiseMailing:"C",
                address:""
            },
            ruleValidate:{
                isTestPurchase: [
                    { required: true,type:"number", message: '是否需要测购不能为空', trigger: 'blur' }
                ]
            },
            isSumbit:false,
            isInfo:false,
            defaultData:"",
            deteleCtrl:false
        }
    },
    props: ['projectId'],
    methods: {
        sumbitData(){
            let url = "/business/test-purchase-config";
            let ajaxData = {
                projectId:this.projectId
            };
            Object.assign(ajaxData,this.formData);
            this.$refs["formValidate"].validate((valid) => {
                if (valid) {
                    this.isSumbit = true;
                    if(this.defaultData){
                        ajaxData.id = this.defaultData.id;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSumbit = false;
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.getDetail();
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.isSumbit = false;
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.getDetail();
                            }
                        })
                    }
                }
            })
        },
        getDetail(){
            let url = `/business/test-purchase-config/${this.projectId}`;
            this.$get(url).then(res=>{
                if(res.code===0){
                    if(res.data){
                        this.isInfo = true;
                        this.defaultData = res.data;
                        this.giveDefaultData();
                    }else{
                        this.isInfo = false;
                    }
                }
            })
        },
        giveDefaultData(){
            this.formData.isTestPurchase = this.defaultData.isTestPurchase?1:0;
            this.formData.isMailingSample = this.defaultData.isMailingSample?1:0;
            this.formData.merchandiseMailing = this.defaultData.merchandiseMailing;
            this.formData.address = this.defaultData.address;
        },
        agreeDelete(){
            let url = `/business/test-purchase-config/${this.projectId}`;
            this.$del(url).then(res=>{
                if(res.code===0){
                    this.deteleCtrl = false;
                    this.$Message.success('操作成功!');
                    this.formData.isTestPurchase = 1;
                    this.formData.isMailingSample = 1;
                    this.formData.merchandiseMailing = "C";
                    this.formData.address = "";
                    this.defaultData = "";
                    this.isInfo = false;
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getDetail();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.setting-box{
    padding: 5px 15px 0px 15px;
    .detail-header{
        background: #fff;
    }
    .btn-box{
        text-align: center;
    }
}
</style>
