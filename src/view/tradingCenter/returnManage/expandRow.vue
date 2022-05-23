<template>
    <div>
        <Row class="title">退款信息</Row>
        <Row v-for="(item,index) in defaultData" :key="index" class="expand-row">
            <Col span="3" class="list-item">
                <span class="expand-key">{{index+1}}. 款项类型:</span>
                <span class="expand-value">{{item.payTypeName}}</span>
            </Col>
            <Col span="2" class="list-item">
                <span class="expand-key">是否退款: </span>
                <span class="expand-value">{{item.isRefund?'是':'否'}}</span>
            </Col>
            <Col span="4" style="max-width:200px">
                <span class="expand-key">退款金额: </span>
                <span class="expand-value">{{common.formateNumber(item.amount)}}</span>
            </Col>
            <Col span="3" class="list-item">
                <span class="expand-key">退款方式: </span>
                <span class="expand-value">{{item.payModeName}}</span>
            </Col>
            <Col span="3" class="list-item">
                <span class="expand-key">确认状态: </span>
                <span class="expand-value">
                    <Tag v-if="item.auditState=='P'" color="orange">待确认</Tag>
                    <Tag v-if="item.auditState=='E'" color="green">已确认</Tag>
                    <Tag v-if="item.auditState=='R'" color="red">已驳回</Tag>
                </span>
            </Col>
            <Col span="3" class="list-item">
                <span class="expand-key">退款状态: </span>
                <span class="expand-value">
                    <Tag v-if="item.state=='R'" color="orange">{{item.stateName}}</Tag>
                    <Tag v-if="item.state=='S'" color="green">{{item.stateName}}</Tag>
                    <Tag v-if="item.state=='F'" color="green">{{item.stateName}}</Tag>
                </span>
            </Col>
            <Col span="4">
                <span class="expand-key">退款完成时间: </span>
                <span class="expand-value">{{common.formatTime(item.payTime,1)}}</span>
            </Col>
            <Col span="2" v-if="type=='refund'&& item.auditState=='P'">
                <Dropdown @on-click="option(item.id,$event)" v-if="(needFillExpress&&mailingId) || !needFillExpress" :transfer="true">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="agree">确认付款</DropdownItem>
                        <!-- <DropdownItem name="reject">驳回</DropdownItem> -->
                    </DropdownMenu>
                </Dropdown>
            </Col>
        </Row>

        <!-- 同意/驳回 -->
        <Modal
            v-model="deleteModal"
            :title="auditType=='agree'?'审核通过':'审核驳回'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="auditType=='agree'">请问是否审核通过退款申请？</Row>
            <Form ref="formData" :key="auditType" :model="formData" :label-width="80" v-show="auditType=='reject'">
                <FormItem label="驳回原因" prop="auditRemark" v-if="auditType=='reject'"
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
export default {
    data () {
        return {
            id:'',
            deleteModal:false,
            auditType:'',
            formData:{
                auditRemark:''
            }
        }
    },
    props: ['defaultData','type','needFillExpress','mailingId'],
    methods: {
        option(id,name){
            this.id = id;
            this.auditType = name;
            this.deleteModal = true;
        },
        comfirmSubmit(){
            let url , ajaxData = {};
            if(this.auditType=='agree'){
                url = `/settlement/case-sale-refund/${this.id}/audit`;
            }else{
                url = `/settlement/case-sale-refund/reject`;
                ajaxData = {
                    id:this.id,
                    auditRemark:this.formData.auditRemark
                }
            }
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.$patch(url,ajaxData).then(res=>{
                        this.deleteModal = false;
                        if(res.code==0){
                            this.$Message.success('操作成功');
                            this.$emit('reloadList');
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
    mounted(){
        console.log(this.defaultData);
    },
    updated(){},
    components:{},
    watch:{}
}
</script>
<style scoped lang="scss">
@import '@/assets/globalStyle.scss';
.title{
    line-height: 24px;
}
.expand-row{
    line-height: 30px;
}
.check-voucher{
    cursor: pointer;
    color:$globalMainColor;
}
.code-span{
    color:$globalMainColor;
    cursor: pointer;
}
.list-item{
    max-width: 150px;
}
</style>