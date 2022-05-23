<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="openAddDrawer" type="primary">新增调查配置</Button>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" :loading="tableLoading"></Table>
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

        <!-- 新增客户抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{configDetail.name}}</span>
                <Dropdown transfer @on-click="option(configDetail.id,$event)" v-if="!isEdit" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit">编辑</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <config-form v-if="!isInfo && addDrawerCtrl" :configDetail="configDetail" @changeEditCtrl="changeCtrl"></config-form>
            <config-info v-if="isInfo && addDrawerCtrl" :configDetail="configDetail"></config-info>
        </Drawer>
        <!-- 新增调查配置 -->
        <Drawer 
            width="600" 
            v-model="newDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>新增调查协议配置</span>
            </div>
            <!-- 新增调查配置 -->
            <config-new v-if="newDrawerCtrl" @changeNewCtrl="changeCtrl"></config-new>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import configForm from './configForm.vue';
import configInfo from './configInfo.vue';
import configNew from './configNew.vue';
export default {
    data () {
        return {
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"协议名称",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                click:()=>{
                                    this.getConfigDetail(params.row.id,'info');
                                }
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"创建时间",
                    key:"createTime",
                    render:(h,params)=>{
                        let createTimeStr = this.common.formatTime(new Date(params.row.createTime));
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:createTimeStr
                            },
                        },createTimeStr)
                    }
                },
                {
                    title:"创建者",
                    key:"creatorName",
                    render:(h,params)=>{
                        let createCreator = params.row.creatorName;
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:createCreator
                            },
                        },createCreator)
                    }
                },
                {
                    title:"操作",
                    key: 'action',
                    width:160,
                    render:(h,params)=>{
                        let editButton = h("span",{
                            class:'icon-edit-01',
                            style:{
                                cursor:'pointer',
                                fontSize:'16px',
                                marginLeft:'10px'
                            },
                            attrs:{title:'编辑'},
                            directives: [
                                {
                                    name: 'permission',
                                    value: ['agreement:investigator:config:modify-'],
                                }
                            ],
                            on:{
                                click:()=>{
                                    this.getConfigDetail(params.row.id,'edit');
                                }
                            }
                        });
                        return [editButton];
                    }
                },
            ],
            addDrawerCtrl:false,
            newDrawerCtrl:false, // 新增调查配置
            isEdit:false,
            isInfo:false,
            configDetail:'',
            id:"",
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/settlement/agreementPriceInvestigatorConfigs';
            let ajaxData = {
                condition:this.searchForm, 
                page: {current: this.table.pageNum,size: this.table.pageSize}
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        /***********操作************/
        option(id,name){
            this.id = id;
            this.type = name;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getConfigDetail(this.id,"edit");
                break;
            }
        },
        //关闭侧边栏
        changeCtrl(isReload){
            this.addDrawerCtrl = false;
            this.newDrawerCtrl = false;
            if(isReload){
                this.reloadTable();
            }
        },
        //新增调查配置
        openAddDrawer(){
            this.newDrawerCtrl = true;
        },
        getConfigDetail(id,type){
            let url = '/settlement/agreementPriceInvestigatorConfig/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.configDetail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                        this.isInfo = false;
                    }else if(type=="info"){
                        this.isInfo = true;
                        this.isEdit = false;
                    }
                    this.addDrawerCtrl = true;
                }
            })
        },
        /************操作************/
    },
    created(){},
    beforeMount(){
        
    },
    mounted(){
        this.getData();
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        configForm,
        configInfo,
        configNew
    },
    watch: {}
}
</script>
<style>
 
</style>
