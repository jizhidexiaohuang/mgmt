<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button type="primary" v-if="false" @click="createProject">创建项目</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="项目名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                客户
                            </Col>
                            <Col span="18">
                                <mySelect ref="distributorSelect"
                                    :path="'/base/customers'"
                                    :placeholder="'请选择客户'"
                                    :params="{type:'G'}"
                                    :keyName="'name'"
                                    :inputKey="'name'"
                                    :pagingMode="true"
                                    @getValue="getCustomerId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" placeholder="请选择任务状态">
                                    <Option v-for="item in projectStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
            <Row v-show="!infoCtrl" style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" 
                    row-key="id" :loading="tableLoading">
                <template slot-scope="{ row, index }" slot="action">
                    <Dropdown @on-click="option(row,$event)" v-if="(row.state=='R'||row.state=='P')&&row.isManager" v-permission="['project:manage:all:manage-']">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="add" v-if="!row.parentId&&row.state=='R'">创建子项目</DropdownItem>
                            <DropdownItem name="edit" v-if="row.state=='R'||row.state=='P'">编辑</DropdownItem>
                            <DropdownItem name="suspend" v-if="row.state=='R'">暂停</DropdownItem>
                            <DropdownItem name="reset" v-if="row.state=='P'">重启</DropdownItem>
                            <DropdownItem name="archive" v-if="row.state=='R'||row.state=='P'">归档</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
                </Table>
            </Row>
            <Row v-show="!infoCtrl" style="margin-top:30px;text-align:center;">
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

        <!-- 创建项目 -->
        <Drawer 
            width="700" 
            v-model="addDrawerCtrl"
            :styles="{padding:'0px 0px 10px 0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>创建项目</span>
            </div>
            <project-form v-if="addDrawerCtrl" :projectDetail="projectDetail" :addType="addType" @changeEditCtrl="changeCtrl"></project-form>
        </Drawer>

        <!-- 暂停/重启项目/归档 -->
        <Modal
            v-model="confirmCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips" v-if="type==='suspend'||type==='reset'">请问是否{{title}}此项目？</Row>
            <Row class="modal-tips" v-if="type==='archive'">{{paragraph}}</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="agreeSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        
        <!-- 项目详情 -->
        <project-info v-if="infoCtrl" :detail="projectDetail">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
            <div slot="options-box" class="options">
                <Dropdown transfer class="edit-icon" @on-click="option(projectDetail,$event)" 
                    v-if="(projectDetail.state=='R'||projectDetail.state=='P')&&projectDetail.isManager" v-permission="['project:manage:all:manage-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="add" v-if="!projectDetail.parentId&&projectDetail.state=='R'">创建子项目</DropdownItem>
                        <DropdownItem name="edit" v-if="projectDetail.state=='R'||projectDetail.state=='P'">编辑</DropdownItem>
                        <DropdownItem name="suspend" v-if="projectDetail.state=='R'">暂停</DropdownItem>
                        <DropdownItem name="reset" v-if="projectDetail.state=='P'">重启</DropdownItem>
                        <DropdownItem name="archive" v-if="projectDetail.state=='R'||projectDetail.state=='P'">归档</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
        </project-info>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import projectForm from './projectForm.vue';
import projectInfo from './projectInfo.vue';
export default {
    data () {
        return {
            id:'',
            searchForm:{
                keyword:'',
                customerId:'',
                state:''
            },
            projectStateArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"项目名称",
                    key:"name",
                    tree:true,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{
                                "textover":true,
                                "table-sub-style":true,
                                "padding-left-28":params.row.parentId?false:true,
                                'has-sub-project':params.row.hasSubProject
                            },
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getProjectDetail(params.row.id,'info');
                                }
                            }
                        },params.row.name);
                        return dom
                    }
                },
                {
                    title:"客户名称",
                    key:"customerName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.customerName
                            },
                        },params.row.customerName)
                    }
                },
                {
                    title:"负责人",
                    key:"managerName",
                    width:100
                },
                {
                    title:"协作人",
                    key:"cooperatName",
                },
                {
                    title:'项目周期',
                    key:'startDateStr',
                    render:(h,params)=>{
                        return h('span',(params.row.startDateStr||'')+'--'+(params.row.endDateStr||''));
                    }
                },
                {
                    title:"项目状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='R':color = 'successColor';break;
                            case state=='P':color = 'errorColor';break;
                            case (state=='A'||state=='E'):color = 'expireColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.stateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            infoCtrl:false,
            addDrawerCtrl:false,
            addType:'',
            projectDetail:'',
            type:'',
            confirmCtrl:false,
            title:'',
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/business/projects';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records.map(item=>{
                        if(item.subProjectList&&item.subProjectList.length!==0){
                            return{
                                hasSubProject:false,
                                idStr:item.id.toString(),
                                children:item.subProjectList,
                                // _showChildren:true,
                                ...item
                            }
                        }else{
                            return {
                                hasSubProject:true,
                                ...item
                            }
                        }
                    });
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
            this.addDrawerCtrl = false;
            this.table.pageNum = 1;
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.customerId = "";
            this.searchForm.state = '';
            this.$refs.distributorSelect.clearSelected();
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            this.infoCtrl = false;
            switch (true) {
                case (name==='add'):
                    this.projectDetail = row;
                    this.addDrawerCtrl = true;
                    this.addType = "addSub";
                    break;
                case (name==='edit'): 
                    this.getProjectDetail(this.id,'edit');
                    this.addType = "edit";
                    break;
                case (name==='suspend'||name==='reset'):
                    this.confirmCtrl = true;
                    this.title = name==='suspend'?'暂停':'重启';
                    break;
                case (name==='archive'):
                    this.confirmCtrl = true;
                    this.title = '归档';
                    this.paragraph = '归档后，项目状态将更改为“归档”，并且不可编辑线索、案件等。归档项目后，项目不能再操作！';
                    break;
            }
        },
        agreeSubmit(){
            let url = '/business/project/'+this.id+'/'+this.type;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.confirmCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                    this.confirmCtrl = false;
                }
            })
        },
        /*------------操作End-------------*/
        //关闭侧边栏
        changeCtrl(isReload){
            this.addDrawerCtrl = false;
            if(isReload){
                this.reloadTable();
            }
        },
        //获取客户
        getCustomerId(data){
            this.searchForm.customerId = data.id;
        },
        //获取任务详情
        getProjectDetail(id,type){
            let url = '/business/project/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.projectDetail = res.data;
                    if(type==='info'){
                        this.infoCtrl = true;
                    }else{
                        this.addDrawerCtrl = true;
                    }
                }
            })
        },
        //创建任务
        createProject(){
            this.projectDetail = "";
            this.addDrawerCtrl = true;
            this.addType = '';
        },
        //获取字典数据接口
        async getDictionary(){
            this.projectStateArr = await this.common.getDictionaryItems('project_state');
        },
    },
    created(){},
    activated(){
        this.getData();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){},
    updated(){},
    components: {
        projectForm,
        projectInfo
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
</style>