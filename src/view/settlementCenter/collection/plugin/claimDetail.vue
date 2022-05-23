<template>
    <div>
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <Table :columns="columnsA" :tableLoading="tableLoadingA" :data="claimList">
                <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row,$event)" v-if="row.cancelPermission">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="withdraw">撤回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
            </Table>
        </Row>
        <Row class="withdraw-title">撤回记录</Row>
        <Row style="border:1px solid #dcdee2;border-bottom:0;">
            <Table :columns="columnsB" :tableLoading="tableLoadingB" :data="withdrawList"></Table>
        </Row>
        <!-- 撤回 -->
        <Modal
            v-model="confirmCtrl"
            title="撤回确认"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="80">
                <FormItem label="撤回备注" prop="remark"
                    :rules="[{ max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.remark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写撤回备注(不超过512个字符)'></Input>
                </FormItem>
            </Form>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="comfirmSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            claimList:[],
            withdrawList:[],
            columnsA:[
                {
                    title:"认领时间",
                    key:"createTime",
                    render:(h, params) => {
                        return h('span',{
                            class:'textover'
                        },this.common.formatTime(params.row.createTime))
                    }
                },
                {
                    title:"认领人",
                    key:"creatorName",
                },
                {
                    title: '认领金额',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title:"认领类目",
                    key:"categoryName",
                },
                {
                    title:"认领项目",
                    key:"projectName",
                    render:(h,params)=>{
                        return h('div',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            }
                        },params.row.projectName)
                    }
                },
                {
                    title:"案件/结算单号",
                    key:"claimCode",
                    width:110,
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.claimCode
                            },
                        },params.row.claimCode);
                        return dom;
                    }
                },
                {
                    title: '操作',
                    slot: 'action',
                    width:60
                }
            ],
            columnsB:[
                {
                    title:"认领时间",
                    key:"createTime",
                    render:(h, params) => {
                        return h('span',{
                            class:'textover'
                        },this.common.formatTime(params.row.financeClaimInfo.createTime))
                    }
                },
                {
                    title:"撤回时间",
                    key:"cancelTime",
                    render:(h, params) => {
                        return h('span',{
                            class:'textover'
                        },this.common.formatTime(params.row.cancelTime))
                    }
                },
                {
                    title:"认领人",
                    key:"creatorName",
                    render:(h,params)=>{
                        return h('span',params.row.financeClaimInfo.creatorName)
                    }
                },
                {
                    title:"撤回人",
                    key:"cancelUserName",
                },
                {
                    title: '认领金额',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.financeClaimInfo.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title:"认领类目",
                    key:"categoryName",
                    render:(h,params)=>{
                        return h('span',params.row.financeClaimInfo.categoryName)
                    }
                },
                {
                    title:"认领项目",
                    key:"projectName",
                    render:(h,params)=>{
                        let projectName = params.row.financeClaimInfo.projectName;
                        return h('div',{
                            class:'textover',
                            attrs:{
                                title:projectName
                            }
                        },projectName)
                    }
                },
                {
                    title:"案件/结算单号",
                    key:"claimCode",
                    width:110,
                    render:(h, params) => {
                        let claimCode = params.row.financeClaimInfo.claimCode
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:claimCode
                            },
                        },claimCode);
                        return dom;
                    }
                },
                {
                    title: '备注',
                    key: 'remark',
                    width:60,
                    render:(h,params)=>{
                        return h('Poptip',{
                            props: {placement: 'bottom',trigger:"hover",width:'100px',wordWrap:true},
                        },[
                            h('Icon',{
                                attrs:{
                                    type:'ios-information-circle',
                                },
                                style:{
                                    fontSize:'16px',
                                    cursor: 'pointer'
                                }
                            }),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },params.row.remark)
                        ])
                    }
                },
            ],
            tableLoadingA:false,
            tableLoadingB:false,
            confirmCtrl:false,
            formValidate:{
                remark:''
            }
        }
    },
    props: ['incomeId'],
    methods: {
        option(row,name){
            this.id = row.id;
            switch (name) {
                case 'withdraw': 
                    this.confirmCtrl = true;
                    break;
            }
        },
        comfirmSubmit(){
            let url = '/settlement/finance/claim';
            let ajaxData = {
                claimId: this.id,
                remark: this.formValidate.remark
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.confirmCtrl = false;
                    this.$Message.success('操作成功！');
                    this.getClaimRecord();
                    this.getCancelRecord();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        // 获取认领记录
        getClaimRecord(){
            this.tableLoadingA = true;
            let url = '/settlement/finance/claim/'+this.incomeId;
            this.$get(url).then(res=>{
                this.tableLoadingA = false;
                if(res.code==0){
                    this.claimList = res.data;
                }
            })
        },
        // 获取撤回记录
        getCancelRecord(){
            this.tableLoadingB = true;
            let url = '/settlement/finance/claim/cancel/'+this.incomeId;
            this.$get(url).then(res=>{
                this.tableLoadingB = false;
                if(res.code==0){
                    this.withdrawList = res.data;
                }
            })
        }
    },
    created(){},
    beforeMount(){
        
    },
    mounted(){
        this.getClaimRecord();
        this.getCancelRecord();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
 .withdraw-title{
     padding:10px 0px;
     font-size: 14px;
     font-weight: 600;
 }
</style>
