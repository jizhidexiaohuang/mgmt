<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <!-- 筛选框 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="关键字" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click.stop="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                律师团队
                            </Col>
                            <Col span="18">
                                <mySelect ref="lawyerSelect"
                                    :path="'/base/lawyer-teams'"
                                    :keyName="'name'"
                                    :width="190"
                                    placeholder="请选择律师团队"
                                    @getValue="getLawyerTeamsId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                审核状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.state" placeholder="请选择审核状态" clearable>
                                    <Option v-for="item in auditStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row }" slot="action">
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
                show-elevator show-sizer />
            </Row>
        </div>

        <!-- 审核modal -->
        <Modal
            v-model="auditCtrl"
            :title="title+'确认'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否确认{{title}}该律师办案区域？</Row> 
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="auditSubmit">确认</Button>
                <Button @click="auditCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

    </div>
</template>
<script>
export default {
    data () {
        return {
            searchBoxCtrl:false,
            tableLoading:false,
            table:{
                recordsTotal:100,
                pageNum:1,
                pageSize:this.config.pageSize
            },
            searchForm:{
                keyword:'',
                teamId:"",
                state:"",
            },
            auditStatusArr:[],
            columns: [
                {
                    title: '律师团队',
                    key: 'teamName',
                    width:120,
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.teamName
                            },
                        },params.row.teamName)
                    }
                },
                {
                    title: '办案区域',
                    key: 'locationName',
                    render:(h,params)=>{
                        return h('div',{
                            class:'textover',
                            attrs:{
                                title:params.row.locationName
                            },
                        },params.row.locationName)
                    }
                },
                {
                    title: '提交日期',
                    key: 'submitTime',
                    render:(h,params)=>{
                        return h('span',params.row.submitTime && params.row.submitTime.slice(0,10))
                    }
                },
                {
                    title: '审核状态',
                    key: 'stateName',
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
                    width:120,
                    slot: 'action'
                },
            ],
            data: [],
            type:'',
            auditCtrl:false,
            title:''
        }
    },
    props: [''],
    methods: {
        //筛选律师团队
        getLawyerTeamsId(data){
            this.searchForm.teamId = data.id;
        },
        getData(){
            this.tableLoading = true;
            let url = "/base/lawyer-undertake-location/mgmt";
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize
            };
            Object.assign(ajaxData,this.searchForm);
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code===0){
                    this.data = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }else{
                    this.$Message.error(res.message); 
                }
            })
        },
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.teamId = "";
            this.searchForm.state = "";
            this.$refs.lawyerSelect.clearSelected();
            this.reloadTable();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        option(row,name){
            this.id = row.id;
            this.type = name;
            this.auditCtrl = true;
            switch(name){
                case "agree":
                    this.title = '通过';
                    break;
                case "reject":
                    this.title = '驳回';
                    break;
            }
        },
        auditSubmit(){
            let url = this.type=='agree'?`/base/lawyer-undertake-location/${this.id}/audit`:`/base/lawyer-undertake-location/${this.id}/reject`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.auditCtrl = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        // 获取字典数据接口
        async getDictionary(){
            this.auditStatusArr = await this.common.getDictionaryItems('audit_state');
        },
    },
    created(){

    },
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    updated(){

    },
    activated(){
        this.getData();
    },
    components: {
        
    },
    watch: {}
}
</script>
