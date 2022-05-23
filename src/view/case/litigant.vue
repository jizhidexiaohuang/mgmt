<template>
    <div class="litigant">
        <Row class="detail-header">
            <span>对方当事人</span>
            <Row class="add-btn" v-if="false">
                <Button type="primary" @click="openAdd">新增对方当事人</Button>
            </Row>
        </Row>
        <Row class="table-box" style="margin-bottom:16px;">
            <Table :columns="columns" :row-class-name="isNeedError" :loading="tableLoading" :data="passData">
                <template slot-scope="{ row, index }" slot="action">
                    <Icon v-if="row.conflictCategory===1 || row.conflictCategory===3" type="ios-information-circle-outline" size="18" @click="rowOption(row,'conflict')" title="查看冲突" style="cursor:pointer"/>
                    <Icon v-if="row.conflictCategory===2 || row.conflictCategory===3" type="md-linek" size="18" title="查看关联" @click="rowOption(row,'relate')" style="cursor:pointer"/>
                </template> 
            </Table>
        </Row>
         <Row class="detail-header">
            <span>对方当事人（待审）</span>
        </Row>
        <Row class="table-box">
            <Table :columns="columns" :row-class-name="isNeedError" :loading="tableLoading" :data="unauditData">
                <template slot-scope="{ row, index }" slot="action">
                    <Row v-if="row.conflictCategory === 0">
                        <Icon type="md-checkmark" size="18" title="通过" style="cursor:pointer" @click="rowOption(row,'pass')"/>
                        <Icon type="md-close" size="18" title="驳回" style="cursor:pointer" @click="rowOption(row,'reject')"/>
                    </Row>
                    <Dropdown @on-click="rowOption(row,$event)" transfer v-else>
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="pass" v-permission="[$route.path]">通过</DropdownItem>
                            <DropdownItem name="reject" v-permission="[$route.path]">驳回</DropdownItem>
                            <DropdownItem name="conflict" v-permission="[$route.path]" v-if="row.conflictCategory===1 || row.conflictCategory===3">查看冲突</DropdownItem>
                            <DropdownItem name="relate" v-permission="[$route.path]" v-if="row.conflictCategory===2 || row.conflictCategory===3">查看关联</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
            </Table>
        </Row>

        <!-- 删除modal -->
        <Modal
            v-model="optionCtrl"
            :title="modalTitle+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="modalType!='reject'">请问是否{{modalTitle}}此对方当事人？</Row>
            <Form ref="formValidate" :model="formValidate" :label-width="80" v-else>
                <FormItem label="驳回原因" prop="auditRemark"
                    :rules="[{required: true, message: '驳回原因不能为空', trigger: 'blur'},{max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.auditRemark" type="textarea" :autosize="{minRows: 5,maxRows: 7}" placeholder="驳回原因不超过512个字符"></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :disabled="isSubmit" @click="optionConfrim">确认</Button>
                <Button @click="optionCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <!-- 详情抽屉 -->
        
        <Modal
            v-model="infoDrawerCtrl"
            :title="isAdd?(detailData.id?'编辑对方当事人':'新增对方当事人'):'对方当事人详情'"
            :width="(isAdd || !hasBussiness)?600:'90%'"
            :footer-hide="true">
            <Row v-if="!isAdd&&hasBussiness&&infoDrawerCtrl">
                <business-information :defaultObj="detailData">
                    <div slot="info-content" style="max-width:1200px;">
                        <tort-subject-info :defaultData="detailData"></tort-subject-info>
                    </div>
                </business-information>
            </Row>
            <Row v-if="!isAdd&&!hasBussiness&&infoDrawerCtrl">
                <tort-subject-info :defaultData="detailData" :double="false"></tort-subject-info>
            </Row>
            <Row class="detail-form" v-if="isAdd&&infoDrawerCtrl">
                <tort-subject-form ref="tortSubjectDom" @getList="getTortList" :labelWidth="110" :defaultData="detailData"></tort-subject-form>
                <Row class="detail-btn-box">
                    <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNew('productForm')">保存</Button>
                    <Button @click="infoDrawerCtrl=false">取消</Button>
                </Row>
            </Row>
        </Modal>

        <!-- 查看冲突/关联 -->
        <Modal
            v-model="conflictCtrl"
            :width="800"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">{{modalType=="conflict"?"查看冲突":"查看关联"}}</div>
            <compare-clue v-if="conflictCtrl" :defaultData="conflictData" :type="modalType"></compare-clue>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import tortSubjectForm from "./../clue/myManage/plugin/tortSubjectForm.vue";
import tortSubjectInfo from '@/view/clue/myManage/plugin/tortSubjectInfo.vue';
import businessInformation from '@/view/relationship/plugin/businessInformation/businessInformation.vue';
import compareClue from "./../clue/myManage/plugin/compareClue.vue";
export default {
    data () {
        return {
            styles:styles,
            modalTitle:"",
            modalType:"",
            activeObj:{},
            optionCtrl:false,
            tableLoading:false,
            isSubmit:false,
            infoDrawerCtrl:false,
            isAdd:false,
            conflictCtrl:false,
            formData:{},
            formValidate:{
                auditRemark:""
            },
            columns:[
                {
                    title:"主体名称",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{ title:params.row.name },
                            on:{
                                click:()=>{
                                    this.activeObj = params.row;
                                    this.getDetail();
                                }
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"主体类型",
                    key:"categoryName",
                },
                {
                    title:"经营性质",
                    key:"propertyName",
                },
                {
                    title:"主体区域",
                    key:"provinceName",
                    render:(h,params)=>{
                        let str = `${params.row.provinceName || ""}${params.row.cityName || ""}${params.row.areaName || ""}`
                        let strDom = h('span',{
                            class:["textover"],
                            attrs:{ title:str }
                        },str)
                        return strDom;
                    }
                },
                {
                    title:"操作",
                    key:"operate",
                    slot:'action',
                    width:160
                },
            ],
            tableData:[],
            detailData:{},
            hasBussiness:false,
            conflictData:""
        }
    },
    props: ['caseId'],
    computed:{
        passData(){
            if(!this.tableData || this.tableData.length==0){ return [] }
            return this.tableData.filter((item,index)=>{
                //P 待审核   E 已审核   R 驳回
                return item.auditState == "E"
            })
        },
        unauditData(){
            if(!this.tableData || this.tableData.length==0){ return [] }
            return this.tableData.filter((item,index)=>{
                //P 待审核   E 已审核   R 驳回
                return item.auditState == "P"
            })
        }
    },
    methods: {
        getData(){
            let url = '/business/litigants';
            let ajaxData = { caseId: this.caseId };
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.tableLoading = false;
                    this.tableData = res.data;
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getDetail(){
            let url = '/business/litigant/'+this.activeObj.id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.detailData = res.data;
                    this.detailData.cityList = [res.data.province,res.data.city,res.data.area];
                    //判断是否有统一信用代码，如果有信用代码则用信用代码查询工商信息，否则用名称查询工商信息
                    if(this.detailData.creditCode && this.detailData.creditCode.trim()){
                        this.hasBussiness = true;
                        this.infoDrawerCtrl = true;
                    }else{
                        this.hasBussiness = false;
                        this.getBusinessInfo(res.data.name);
                    }
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        rowOption(obj,type){
            this.modalType = type;
            this.activeObj = obj;
            switch(type){
                case "pass":
                    this.optionCtrl = true;
                    this.modalTitle = "审核通过";
                    break;
                case "reject":
                    this.formValidate.auditRemark = "";
                    this.optionCtrl = true;
                    this.modalTitle = "审核驳回";
                    break;
                case "conflict":
                    this.title = "查看冲突"
                    this.getConflict("conflict");
                    break;
                case "relate":
                    this.title = "查看关联";
                    this.getConflict("relate");
                    break;
            }
        },
        openAdd(){
            this.isAdd = true;
            this.infoDrawerCtrl = true;
        },
        optionConfrim(){
            let isGoOn = true;
            let url = "/business/litigant/"+this.activeObj.id;
            let ajaxData = { id:this.activeObj.id };
            if(this.modalType=="pass"){
                url += "/audit";
            }else if(this.modalType=="reject"){
                url += "/reject";
                ajaxData.auditRemark = this.formValidate.auditRemark;
                this.$refs['formValidate'].validate((valid)=>{
                    if(!valid){ isGoOn = false }
                })
            }
            if(!isGoOn){return}
            this.$patch(url,ajaxData).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    this.$Message.success('操作成功');
                    this.optionCtrl = false;
                    this.infoDrawerCtrl = false;
                    this.getData();
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        submitNew(){
            let url="/business/litigant";
            let item = this.formData;
            this.$refs["tortSubjectDom"].submitValid();
            if(!item || item=="{}"){
                return
            }
            let ajaxData = {
                caseId:this.caseId,
                category:item.category,
                name:item.name,
                creditCode:item.creditCode,
                legalRepresentative:item.legalRepresentative,
                province:item.province,
                city:item.city,
                area:item.area,
                address:item.address
            }
            if(item.category=="S"){
                ajaxData.property = item.property;
                ajaxData.type = item.type;
            }
            this.isSubmit = true;
            this.$post(url,ajaxData).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    this.$Message.success('操作成功');
                    this.getData();
                    this.infoDrawerCtrl=false;
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        getTortList(data){
            this.formData = data;
        },
        getBusinessInfo(name){
            let url = '/base/company/one-company-information';
            let ajaxData = {
                companyName:name
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code===0){
                    if(res.data){
                        this.hasBussiness = res.data;
                    }
                    this.infoDrawerCtrl = true;
                }
            })
        },
        //查询是否冲突/关联
        getConflict(type){
            let url = type=="conflict"?"/business/litigant/conflict":"/business/litigant/correlation";
            let ajaxData = { id:this.activeObj.id };
            this.$get(url,ajaxData).then(res=>{
                if(res.code===0){
                    this.conflictData = res.data;
                    this.conflictCtrl = true;
                }
            })
        },
        isNeedError(row,index){
            if(row.conflictCategory === 1 || row.conflictCategory===3){
                return "conflict-title"
            }else{
                return ""
            }
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    updated(){},
    components: {
        tortSubjectForm,
        tortSubjectInfo,
        businessInformation,
        compareClue
    },
    watch: {}
}
</script>
<style scoped lang="scss">
@import './../../assets/globalStyle.scss';
.litigant{
    margin:10px;
    .detail-header{
        background: #fff;
        padding:5px 0 5px 10px;
        &::before{
            left:0;
        }
    }
    .add-btn{
        float: right;
    }
    .table-box{
        border:1px solid #dcdee2;
        border-bottom:0;
    }
}
</style>
<style lang="scss">
.ivu-table{
    .conflict-title{
        td{
            background-color: #FFF1F0;
        }
    }
}
</style>
