<template>
    <div>
        <Row class="detail-content">
            <Row><Col span="5" class="left-label">付款金额：</Col><Col span="16" class="right-content">{{common.formateNumber(voucherDetail.amount)}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">付款凭证：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="voucherDetail.attachments || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">付款描述：</Col><Col span="16" class="right-content">{{voucherDetail.remark}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">审核状态：</Col>
                <Col span="16" class="right-content">
                    <Tag style="border-radius:11px;" v-if="voucherDetail.auditState=='P'" :color="styles['warningColor']">{{voucherDetail.auditStateName}}</Tag>
                    <Tag style="border-radius:11px;" v-if="voucherDetail.auditState=='E'" :color="styles['successColor']">{{voucherDetail.auditStateName}}</Tag>
                    <Tag style="border-radius:11px;" v-if="voucherDetail.auditState=='R'" :color="styles['errorColor']">{{voucherDetail.auditStateName}}</Tag>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">审核备注：</Col><Col span="16" class="right-content">{{voucherDetail.auditRemark}}</Col></Row>
            <Row style="text-align:center;margin:10px 0px 14px;" v-if="voucherDetail.auditState=='P'">
                <Button type="primary" @click="audit('agree')">通过</Button>
                <Button type="error" @click="audit('reject')" style="margin-left: 8px">驳回</Button>
            </Row>
        </Row>

        <!-- 同意/驳回 -->
        <Modal
            v-model="deleteModal"
            :title="type=='agree'?'审核通过':'审核驳回'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="type=='agree'">请问是否审核通过此付款凭证？</Row>
            <Form ref="formData" :key="type" :model="formData" :label-width="80" v-show="type=='reject'">
                <FormItem label="驳回原因" prop="auditRemark" v-if="type=='reject'"
                    :rules="[{ required:true,message:'驳回原因不能为空',trigger:'blur' },{ max:512,message:'不能超过512个字符',trigger:'blur' }]">
                    <Input v-model.trim="formData.auditRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注信息(不超过512个字符)'></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="comfirmSubmit">确认</Button>
                <Button @click="deleteModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            voucherDetail:'',
            styles:styles,
            deleteModal:false,
            type:'',
            formData:{
                auditRemark:''
            }
        }
    },
    props: ['voucherId'],
    methods: {
        // 查看付款凭证
        checkVoucher(){
            let url = `/settlement/payment/${this.voucherId}/voucher`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.voucherDetail = res.data;
                }
            })
        },
        audit(name){
            this.type = name;
            this.deleteModal = true;
        },
        comfirmSubmit(){
            let url = '/settlement/payment/offline/confirm';
            let ajaxData = {
                paymentId:this.voucherId,
            }
            if(this.type=='agree'){
                ajaxData.auditState = 'E';
            }else{
                ajaxData.auditState = 'R';
                ajaxData.auditRemark = this.formData.auditRemark;
            }
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.$patch(url,ajaxData).then(res=>{
                        this.deleteModal = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.$emit('refresh');
                        }else{
                            this.$Message.error(res.message);
                        }
                    })
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.checkVoucher()
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
