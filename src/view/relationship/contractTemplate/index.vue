<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button type="primary" v-permission="['market-center:contract_template:manage-']" @click="openAddDrawer">创建合同模版</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.name" placeholder="合同模版名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                合同类型
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.type" placeholder="请选择合同类型">
                                    <Option v-for="item in contractTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                    <Dropdown @on-click="option(row,$event)" v-if="row.state!=='TM'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="edit" v-permission="['market-center:contract_template:manage-']">编辑</DropdownItem>
                            <DropdownItem name="checkWps">查看模板</DropdownItem>
                            <DropdownItem name="editWps" v-permission="['market-center:contract_template:manage-']">修改模板</DropdownItem>
                            <DropdownItem name="delete" v-permission="['market-center:contract_template:manage-']">删除</DropdownItem>
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

            <!-- 新增/编辑合同抽屉 抽屉详情 -->
            <Drawer 
                width="600" 
                v-model="addDrawerCtrl"
                :styles="{padding:'0px'}"
                :mask-style="{background:'rgba(0,0,0,0)'}">
                <div slot="header" class="drawer-title">
                    <span>{{(!isInfo && !isEdit)?"新增合同模版":"合同模版详情"}}</span>
                    <Dropdown transfer @on-click="option(contractDetail,$event)" v-if="state!=='TM' && isInfo" class="edit-icon">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="edit" v-permission="['market-center:contract_template:manage-']">编辑</DropdownItem>
                            <DropdownItem name="checkWps">查看模板</DropdownItem>
                            <DropdownItem name="editWps" v-permission="['market-center:contract_template:manage-']">修改模板</DropdownItem>
                            <DropdownItem name="delete" v-permission="['market-center:contract_template:manage-']">删除</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <contract-template-form v-if="!isInfo && addDrawerCtrl" :contractDetail="contractDetail" @changeEditCtrl="changeCtrl"></contract-template-form>
                <contract-template-info v-if="isInfo" :defaultData="contractDetail"></contract-template-info>
            </Drawer>
        </div>

        <!-- 删除modal -->
        <Modal
            v-model="delCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除本合同模版？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="delSubmit">确认</Button>
                <Button @click="delCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <Modal 
            v-model="onlineWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">在线文档</div>
            <div style="height:calc(100% - 42px);">
                <wps-file 
                    :fileUrl="onlineFileUrl"
                    :fileId="onlineFileId"
                    operate="edit"
                    :readOnly="wpsReadOnly"
                    v-if="onlineWordModal"></wps-file>
            </div>    
            <Row style="text-align:right;margin-top:10px;">
                <Button type="default" @click="onlineWordModal=false;">关闭</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import contractTemplateForm from './contractTemplateForm';
import contractTemplateInfo from './contractTemplateInfo';
export default {
    data () {
        return {
            userId:"",
            searchForm:{
                name:'',
                type:""
            },
            state:"",
            createTime:[],
            searchBoxCtrl:false,
            addDrawerCtrl:false,
            isInfo:false,
            isEdit:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            data:[],
            contractDetail:"",
            columns:[
                {
                    title:"合同模版名称",
                    key:"name",
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getContractDetail(params.row.id,"info");
                                }
                            }
                        },params.row.name);
                        return dom
                    }
                },
                {
                    title:"创建人",
                    key:"userName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.userName
                            }
                        },params.row.userName)
                    }
                },
                {
                    title:"创建时间",
                    key:"createTimeStr"
                },
                {
                    title:"合同类型",
                    key:"typeName"
                },
                {
                    title:"描述",
                    key:"remark",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            }
                        },params.row.remark)
                    }
                },
                {
                    title:"操作",
                    width:160,
                    slot: 'action'
                },
            ],
            id:'',
            type:'',
            rejectTitle:'驳回',
            formValidate:{
                contractName:''
            },
            delCtrl:false,
            onlineWordModal:false,
            onlineFileUrl:"",
            onlineFileId:"",
            wpsReadOnly:true,
            contractTypeArr:[]
        }
    },
    props: [''],
    methods: {
        //获取数据
        getData(){
            let url = '/base/contract-templates';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.data.forEach(item=>{
                        if(item.state!='P'){
                            item._disabled = true;
                        }
                    })
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
        //关闭侧边栏
        changeCtrl(data,isReload){
            if(!data){
                this.addDrawerCtrl = false;
            }
            if(isReload){
                this.reloadTable();
            }
        },
        //重载table
        reloadTable(){
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.name = "";
            this.searchForm.type = "";
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(data,name){
            this.id = data.id;
            this.type = name;
            switch (true) {
                 case (name=='edit'): 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getContractDetail(this.id,"edit");
                    break;
                case (name=='checkWps'): 
                    this.wpsReadOnly = true;
                    this.onlineFileId = data.docId;
                    this.onlineWordModal = true;
                    break;
                case (name=='editWps'): 
                    this.wpsReadOnly = false;
                    this.onlineFileId = data.docId;
                    this.onlineWordModal = true;
                    break;
                case (name=='delete'): 
                    this.delCtrl = true;
                    break;
            }
        },
        delSubmit(){
            let url = `/base/contract-template/${this.id}/remove`;
            this.$del(url).then(res=>{
                if(res.code==0){
                    this.delCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //获取合同详情
        getContractDetail(id,type){
            let url = '/base/contract-template/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.contractDetail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                    }else if(type=="info"){
                        this.isInfo = true;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        /*------------操作End-------------*/
        //打开新增抽屉
        openAddDrawer(){
            this.contractDetail = "";
            this.isEdit = false;
            this.addDrawerCtrl=true;
            this.isInfo=false;
        },
        //获取字典数据接口
        async getDictionary(){
            this.contractTypeArr = await this.common.getDictionaryItems('contract_type');
        },
    },
    created(){},
    beforeMount(){
        this.userId = JSON.parse(window.localStorage.getItem('account')).id;
        this.getDictionary();
    },
    mounted(){},
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        contractTemplateForm,
        contractTemplateInfo
    },
    watch: {
        
    }
}
</script>
<style>
 
</style>
