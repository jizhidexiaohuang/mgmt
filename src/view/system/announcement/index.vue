<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="addDrawerCtrl=true;type='add'" type="primary">新增公告</Button>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row,$event)" v-if="row.state!=='C'">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem v-if="row.state=='D'" name="publish">发布</DropdownItem>
                                <DropdownItem v-if="row.state=='E'||row.state=='D'" name="cancel">作废</DropdownItem>
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

        <!-- 新增客户抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{type=='add'?'新增公告':'公告详情'}}</span>
            </div>
            <add-announcement v-if="addDrawerCtrl&&type=='add'" @changeEditCtrl="changeCtrl"></add-announcement>
            <announcement-info v-if="addDrawerCtrl&&type=='info'" :detail="detail"></announcement-info>
        </Drawer>

        <!-- 操作modal -->
        <Modal
            v-model="agreeCtrl"
            :title="operationType=='publish'?'发布公告':'作废公告'"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否将此公告{{operationType=="publish"?"发布":"作废"}}？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="operateTask">确认</Button>
                <Button @click="agreeCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
    
</template>
<script>
import styles from './../../../assets/globalStyle.scss';
import addAnnouncement from './addAnnouncement.vue';
import announcementInfo from './announcementInfo.vue';
export default {
    data () {
        return {
            styles:styles,
            agreeCtrl:false,
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"公告名称",
                    key:"title",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.title
                            },
                            on:{
                                click:()=>{
                                    this.getDetail(params.row.id,'info');
                                }
                            }
                        },params.row.title)
                    }
                },
                {
                    title:"发布时间",
                    key:"startTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.startTime,5))
                    }
                },
                {
                    title:"发布人",
                    key:"publishUserName"
                },
                {
                    title:"发布平台",
                    key:"platformName"
                },
                {
                    title:"状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case (state=='D'):color = 'globalMainColor';break;
                            case (state=='C'):color = 'errorColor';break;
                            case (state=='E'):color = 'successColor';break;
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
                    key: 'action',
                    slot:'action'
                },
            ],
            addDrawerCtrl:false,
            operationType:"",
            id:'',
            type:'',
            detail:''
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/business/bulletin';
            this.tableLoading = true;
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records;
                    this.table.totalRecords = res.data.total;
                }
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
        option(row,name){
            console.log(name)
            this.operationType = name;
            this.id = row.id;
            this.agreeCtrl = true;
        },
        //关闭侧边栏
        changeCtrl(isReload){
            this.addDrawerCtrl = false;
            if(isReload){
                this.reloadTable();
            }
        },
        // 查看详情
        getDetail(id,type){
            let url = `/business/bulletin/${id}/mgmt`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.addDrawerCtrl = true;
                    this.type = type;
                    this.detail = res.data;
                }
            })
        },
        operateTask(){
            let url = "";
            if(this.operationType=="publish"){
                url = `/business/bulletin/${this.id}/release`;
            }else if(this.operationType=="cancel"){
                url = `/business/bulletin/${this.id}/cancel`;
            }
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.agreeCtrl=false;
                    this.getData();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getData();
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        addAnnouncement,
        announcementInfo
    },
    watch: {}
}
</script>
<style>
 
</style>
