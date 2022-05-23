<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="openAddDrawer" type="primary">新增案例</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="请输入关键字" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                行业名称
                            </Col>
                            <Col span="18">
                                <mySelect ref="industrySelect"
                                    :path="'/base/industry'"
                                    :placeholder="'请选择二级行业'"
                                    :placeholderInput="'请输入二级行业名称'"
                                    :keyName="'industryName'"
                                    @getValue="getIndustryId">
                                </mySelect>
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
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit">编辑</DropdownItem>
                                <DropdownItem name="delete">删除</DropdownItem>
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

        <!-- 新增案例抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{(!isInfo && !isEdit)?'新增案例':'案例详情'}}</span>
                <Dropdown transfer @on-click="option(detail,$event)" v-if="isInfo" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit">编辑</DropdownItem>
                        <DropdownItem name="delete">删除</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <case-form v-if="!isInfo && addDrawerCtrl" :caseDetail="detail" @changeEditCtrl="changeCtrl"></case-form>
            <case-info v-if="isInfo && addDrawerCtrl" :caseDetail="detail"></case-info>
        </Drawer>

        <!-- 删除modal -->
        <Modal
            v-model="delCtrl"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除此案例？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="delSubmit">确认</Button>
                <Button @click="delCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseForm from './caseForm.vue';
import caseInfo from './caseInfo.vue';
export default {
    data () {
        return {
            searchForm:{
                keyword:'',
                industryId:''
            },
            searchBoxCtrl:false,
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"案例名称",
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
                                    this.getDetail(params.row,'info');
                                }
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"案例类型",
                    key:"typeName",
                },
                {
                    title:"上传人",
                    key:"creatorName",
                },
                {
                    title:"上传时间",
                    key:"createTime",
                    render:(h,params)=>{
                        return h('span',params.row.createTime&&params.row.createTime.slice(0,-9))
                    }
                },
                {
                    title:"最后修改时间",
                    key:"remark",
                },
                {
                    title:"修改人",
                    key:"remark",
                },
                {
                    title:"操作",
                    width:160,
                    slot:'action'
                }
            ],
            addDrawerCtrl:false,
            isEdit:false,
            isInfo:false,
            detail:'',
            delCtrl:false,
            id:''
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/base/cust-case';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
            }
            Object.assign(ajaxData,this.searchForm);
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
        //关闭侧边栏
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.addDrawerCtrl = false;
        },
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.industryId = "";
            this.$refs.industrySelect.clearSelected();
            this.reloadTable();
        },
        /***********操作************/
        option(row,name){
            this.id = row.id;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getDetail(row,"edit");
                    break;
                case 'delete':
                    this.delCtrl = true;
            }
        },
        //新增客户线索
        openAddDrawer(){
            this.addDrawerCtrl = true;
            this.isInfo = false;
            this.isEdit = false;
            this.detail = '';
        },
        getDetail(row,type){
            let url = '/base/cust-case/'+row.id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.detail = res.data;
                    if(type=="edit"){
                        this.isEdit = true;
                        this.isInfo = false;
                    }else if(type=="info"){
                        this.isInfo = true;
                        this.isEdit = false;
                    }
                }else{
                    this.$Message.error('操作失败')
                }
                this.addDrawerCtrl = true;
            })
        },
        // 删除确认
        delSubmit(){
            let url = `/base/cust-case/${this.id}`;
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
        /************操作************/
        // 获取行业id
        getIndustryId(data){
            this.searchForm.industryId = data.id;
        }
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
        caseForm,
        caseInfo
    },
    watch: {}
}
</script>
<style>
 
</style>