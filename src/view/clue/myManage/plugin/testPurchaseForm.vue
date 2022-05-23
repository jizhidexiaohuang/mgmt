<template>
    <div>
        <Row class="detail-header">
            <span>测购</span>
        </Row>
        <Row class="detail-form" v-if="!isInfo" style="padding-left:20px;">
            <Form ref="formData" :model="formData" :rules="ruleValidate" :label-width="110">
                <FormItem label="测购图片" prop="attachmentList">
                    <file-upload
                        :defaultList="defaultList || []"
                        :uploadConfig="{readOnly:true}"></file-upload>
                </FormItem>
                <FormItem label="上传备注" prop="remark">
                    {{defaultData.remark || ""}}
                </FormItem>
                <FormItem label="是否需要寄送样品">
                    <span v-if="formData.isSample===1&&projectConfigInfo.isMailingSample">是</span>
                    <RadioGroup v-else v-model="formData.isSample">
                        <Radio :label="1">是</Radio>
                        <Radio :label="0">否</Radio>
                    </RadioGroup>
                </FormItem>
                <Row v-if="formData.isSample">
                    <FormItem label="邮寄地址">
                        <Input v-model.trim="formData.address" placeholder="请填写邮寄地址"></Input>
                    </FormItem>
                    <FormItem label="测购备注">
                        <Input v-model.trim="formData.mgmtRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请填写备注"></Input>
                    </FormItem>
                    <FormItem label="样品名称" prop="sampleName">
                        {{defaultData.sampleName || ""}}
                    </FormItem>
                    <FormItem label="样品数量" prop="sampleNumber">
                        {{defaultData.sampleNumber || ""}}
                    </FormItem>
                    <FormItem label="邮寄公司" prop="company">
                        {{defaultData.companyName || ""}}
                    </FormItem>
                    <FormItem label="邮寄单号" prop="expressNo">
                        <a href="javascript:void(0);" @click="logisticsCtrl=true;">{{defaultData.expressNo}}</a>
                    </FormItem>
                </Row>
            </Form>
        </Row>
        <Row class="detail-content" v-if="isInfo&&defaultData">
            <Row>
                <Col span="5" class="left-label">测购图片：</Col>
                <Col span="16" class="right-content">
                    <file-upload
                        :defaultList="defaultList || []" 
                        :uploadConfig="{readOnly:true}"></file-upload>
                </Col>
            </Row>
            <Row><Col span="5" class="left-label">备注：</Col><Col span="16" class="right-content">{{defaultData.remark}}</Col></Row>
            <Row><Col span="5" class="left-label">是否需要寄送样品：</Col><Col span="16" class="right-content">{{defaultData.isSample?"是":"否"}}</Col></Row>
            <Row v-if="defaultData.isSample">
                <Row><Col span="5" class="left-label">邮寄地址：</Col><Col span="16" class="right-content">{{defaultData.address}}</Col></Row>
                <Row><Col span="5" class="left-label">样品名称：</Col><Col span="16" class="right-content">{{defaultData.sampleName}}</Col></Row>
                <Row><Col span="5" class="left-label">样品数量：</Col><Col span="16" class="right-content">{{defaultData.sampleNumber}}</Col></Row>
                <Row><Col span="5" class="left-label">邮寄公司：</Col><Col span="16" class="right-content">{{defaultData.companyName}}</Col></Row>
                <Row>
                    <Col span="5" class="left-label">邮寄单号：</Col>
                    <Col span="16" class="right-content">
                        <a href="javascript:void(0);" @click="logisticsCtrl=true;">{{defaultData.expressNo}}</a>
                    </Col>
                </Row>
            </Row>
            <Row v-if="defaultData.state=='E'||defaultData.state=='R'"><Col span="5" class="left-label">测购审核备注：</Col><Col span="16" class="right-content">{{defaultData.auditRemark}}</Col></Row>
            <Row>
                <Col span="5" class="left-label">测购审核结果：</Col>
                <Col span="16" class="right-content">
                    <Tag style="border:0;border-radius:11px;" :color="defaultData.state=='P'?mainColor.warningColor:(defaultData.state=='E'?mainColor.successColor:mainColor.errorColor)">
                            {{defaultData.state=='P'?'待审核':(defaultData.state=='E'?'审核通过':'审核驳回')}}
                    </Tag>
                </Col>
            </Row>
            <Row v-if="defaultData.customerOpinion!=null"><Col span="5" class="left-label">客户测购意见：</Col><Col span="16" class="right-content">{{defaultData.customerOpinion?"同意打击":"不同意打击"}}</Col></Row>
        </Row>
        <Row class="detail-btn-box" v-if="defaultData.state=='P'">
            <Button type="primary" v-if="!isInfo" :disabled="isSumbit" @click="sumbitData">保存</Button>
            <!-- <Button type="primary" v-if="isInfo" @click="isInfo=false">修改</Button> -->
            <Button v-if="defaultData.state!='P'" @click="isInfo=true">取消</Button>
            <Button v-if="isInfo" @click="confirmCtrl=true">测购审核</Button>
        </Row>
        <Row v-if="!defaultData" class="no-tips">暂无测购信息</Row>

        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+defaultData.expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="defaultData.expressNo" :company="defaultData.company"></logistics-information>
        </Modal>

         <!-- 物流信息 -->
        <Modal
            v-model="confirmCtrl"
            title="测购审核"
            width="400"
            :footer-hide="true">
            <Form ref="formValide" :model="formValide" :label-width="80">
                <FormItem label="">
                    <RadioGroup v-model="formValide.opearteType">
                        <Radio :label="1">测购通过</Radio>
                        <Radio :label="0">测购驳回</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="审核备注" prop="auditRemark" :rules="[{ max:256,message:'不能超过256个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValide.auditRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder="请填写审核备注"></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin-top:10px;">
                <Button type="primary" @click="sumbitAudit">确定</Button>
                <Button @click="confirmCtrl=false">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            mainColor:styles,
            uploadConfig:{
                fileName:'',
            },
            courierCompanyArr:[],
            projectConfigInfo:"",
            defaultList:[],
            isSumbit:false,
            confirmCtrl:false,
            formData:{
                mgmtRemark:"",
                isSample:"",
                address:""
            },
            formValide:{
                opearteType:1,
                auditRemark:""
            },
            ruleValidate:{
                mgmtRemark:[
                    { max:500,message:'不能超过500个字符',trigger:'blur'}
                ]
            },
            defaultData:"",
            logisticsCtrl:false,
            isInfo:true
        }
    },
    props: ['clueDetail'],
    methods: {
        getDetail(){
            let url = `/business/clueTestPurchase/test-purchase/${this.clueDetail.id}`;
            this.$get(url).then(res=>{
                this.defaultData = res.data || "";
                if(res.data){
                    this.giveDefaultData();
                }
            });
        },
        getProjectConfig(){
            let url = `/business/test-purchase-config/${this.clueDetail.projectId}`;
            this.$get(url).then(res=>{
                if(res.code===0){
                    if(res.data){
                        this.projectConfigInfo = res.data;
                        this.formData.address = res.data.address;
                        this.formData.isSample = res.data.isMailingSample?1:0;
                        this.getDetail();
                    }
                }
            })
        },
        giveDefaultData(){
            this.formData.address = this.defaultData.address;
            this.formData.mgmtRemark = this.defaultData.mgmtRemark;
            this.formData.isSample = this.defaultData.isSample?1:0;
            this.defaultList = [];
            this.defaultData.attachmentList.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.defaultList.push(obj);
            })
            this.isInfo = true;
        },
        sumbitData(){
            let url = "/business/clueTestPurchase/test-purchase";
            let ajaxData = {
                clueId:this.clueDetail.id,
                id:this.defaultData.id,
                attachmentList:this.defaultList
            };
            Object.assign(ajaxData,this.formData);
            this.$refs['formData'].validate((valid) => {
                if (valid) {
                    this.isSumbit = true;
                    this.$patch(url,ajaxData).then(res=>{
                        this.isSumbit = false;
                        if(res.code==0){
                            this.$Message.success("操作成功!");
                            this.getDetail();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            })
        },
        sumbitAudit(){
            let type = this.formValide.opearteType===1?"audit":"reject";
            let url = `/business/clueTestPurchase/test-purchase/${type}`;
            let ajaxData = {
                id:this.defaultData.id,
                auditRemark:this.formValide.auditRemark
            };
            this.$refs['formValide'].validate((valid) => {
                if(valid){
                    this.$patch(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.confirmCtrl = false;
                            this.$Message.success("操作成功!");
                            this.getDetail();
                        }else{
                            this.$Message.error(res.message);
                        }
                    });
                }
            })
        },
        //数据字典
        async getDictionary(){
            this.courierCompanyArr = await this.common.getDictionaryItems('courier_company');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getProjectConfig();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
.no-tips{
    padding: 10px 10px 10px 30px;
    font-size: 14px;
    font-weight: 500;
}
</style>