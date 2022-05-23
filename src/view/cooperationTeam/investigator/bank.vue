<template>
    <div class="customer-manage have-drawer-style relationship">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="律师名称/律所机构/开户人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                审核状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" style="width:190px;" clearable>
                                    <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                            <Button type="primary" size="small" @click="reloadTable">确定</Button>
                            <Button size="small" @click="clearConditions">清空</Button>
                        </Row>
                    </div>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" 
                :loading="tableLoading">
                <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row,$event)" v-if="row.state=='P'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="agree">通过</DropdownItem>
                            <DropdownItem name="reject">驳回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
                </Table>
            </Row>
            <Row style="margin-top:30px;text-align:center;">
                <Page :total="table.totalRecords" show-total
                size="small"
                :current="table.pageNum"
                :page-size-opts="config.pageSizeOpts"
                :page-size="config.pageSize"
                prev-text="上一页" next-text="下一页"
                @on-change="changePage"
                @on-page-size-change="changeSize"
                show-sizer show-elevator />
            </Row>
        </div>

        <!-- 通过modal -->
        <Modal
            v-model="auditCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认{{title}}该律师的银行卡账号信息？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="auditSubmit">确认</Button>
                <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <preview-file ref="perviewFile"></preview-file>
    </div>
</template>
<script>
import styles from '../../../assets/globalStyle.scss';
export default {
    data () {
        return {
            styles:styles,
            tabsActive:'baseInfo',
            infoDrawerCtrl:false,
            columns:[
                {
                    title:"调查员团队",
                    key:"teamName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.investigatorName
                            },
                        },params.row.investigatorName)
                    }
                },
                {
                    title:"公司",
                    key:"company",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.company
                            }
                        },params.row.company)
                    }
                },
                {
                    title:"开户人",
                    key:"accountOwner",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.accountOwner
                            }
                        },params.row.accountOwner)
                    }
                },
                {
                    title:"开户行",
                    key:"bank",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.bank
                            }
                        },params.row.bank)
                    }
                },
                {
                    title:"银行卡号",
                    key:"account",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.account
                            }
                        },params.row.account)
                    }
                },
                {
                    title:"纳税人级别",
                    key:"taxpayerTypeName"
                },
                {
                    title:"纳税人证明",
                    key:"attachmentList",
                    render:(h,params)=>{
                        let arrs = [];
                        if(!params.row.attachmentList || params.row.attachmentList.length==0){return h('span','')}
                        params.row.attachmentList.forEach((item)=>{
                            let type = this.common.getFileType(item.mediaType);
                            let spanDom = h("span",{
                                class:["textover"],
                                style:{
                                    display:"block",
                                    color:styles.globalMainColor,
                                    cursor:"pointer"
                                },
                                attrs:{ title:item.fileName },
                                on:{
                                    click:()=>{
                                        this.$refs.perviewFile.preview(item);
                                    }
                                }
                            },item.fileName)
                            let linkDom = h("a",{
                                class:["textover"],
                                style:{ display:"block" },
                                attrs:{
                                    title:item.fileName,
                                    href:item.url,
                                    target:"_blank"
                                }
                            },item.fileName)
                            if(type==="image" || type==="wps"){
                                arrs.push(spanDom);
                            }else if(type==="other"){
                                arrs.push(linkDom);
                            }
                        })
                        return arrs;
                    }
                },
                {
                    title:"联系电话",
                    key:"mobile"
                },
                {
                    title:"审核状态",
                    key:"stateName",
                    render:(h,params)=>{
                        return h('Tag',{
                            attrs:{
                                color:params.row.state=='E'?'success':(params.row.state=='R'?'error':'warning')
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    width:160,
                    slot:'action',
                },
            ],
            data:[],
            searchBoxCtrl:false,
            searchForm:{
                keyword:'',
                state:''
            },
            stateArr:[],
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            auditCtrl:false,
            id:'',
            title:'通过',
            type:''
        }
    },
    props: [''],
    methods: {
        inited(viewer) {
            this.$viewer = viewer;
        },
        //获取数据
        getData(){
            this.infoDrawerCtrl = false;
            let url = '/base/investigator-banks';
            let ajaxData = {
                current: this.table.pageNum,        
                size: this.table.pageSize,         
                keyword:this.searchForm.keyword,  
                state:this.searchForm.state,  
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                console.log(res);
                if(res.code==0){
                    this.data = res.data.records;
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.idList = [];
            this.getData();
            //刷新律师银行结算账号待审核总数徽标
            this.$store.dispatch('getUnauditInvestAccountCount');
        },
        //列表操作
        option(row,name){
            this.id = row.id;
            this.auditCtrl = true;
            this.type = name;
            switch (name) {
                case 'agree': 
                    this.title = '通过';
                    break;
                case 'reject': 
                    this.title = '驳回';
                    break;
            }
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.state = '';
            this.reloadTable();
        },
        auditSubmit(){
            let url;
            if(this.type==='agree'){
                url = `/base/investigator-bank/${this.id}/audit`;
            }else{
                url = `/base//investigator-bank/${this.id}/reject`;
            }
            this.$patch(url).then(res=>{
                console.log(res);
                if(res.code==0){
                    this.auditCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.stateArr = await this.common.getDictionaryItems('audit_state');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getData();
    },
    mounted(){
        
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>

