<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <Row v-if="type!='add'&&type!='detail'">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="电话/邮箱" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    邮寄状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.isMailingState" clearable placeholder="请选择邮寄状态">
                                        <Option v-for="item in isMailingStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    寄件团队
                                </Col>
                                <Col span="18">
                                    <mySelect ref="teamSelect"
                                        :path="'/base/teams'"
                                        :placeholder="'请选择寄件团队'"
                                        :placeholderInput="'请输入寄件团队名称'"
                                        :keyName="'team'"
                                        :params="{platformSourceType:'I'}"
                                        @getValue="getTeamId">
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
                    <Table :columns="columns" :data="data" 
                        row-key="id" :loading="tableLoading">
                        <template slot-scope="{ row, index }" slot="action">
                            <Dropdown @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="detail">查看邮寄批次</DropdownItem>
                                    <DropdownItem v-if="row.caseNumber>0" name="add">待邮寄案件</DropdownItem>
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
            </Row>

            <!-- 新建邮寄信息 -->
            <mailing-apply-case v-if="type=='add'" :receiveId="id" @reloadList="reloadTable">
                <div class="close-icon" slot="close-icon">
                    <Icon type="md-close" @click="type=''" />
                </div>
            </mailing-apply-case>

            <!-- 邮件批次详情 -->
            <mailing-info v-if="type=='detail'" :receiveId="id">
                <div class="close-icon" slot="close-icon">
                    <Icon type="md-close" @click="type=''" />
                </div>
            </mailing-info>
        </div>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import mailingApplyCase from "./mailingApplyCase.vue";
import mailingInfo from "./mailingInfo.vue";
export default {
    data () {
        return {
            id:'',
            searchForm:{
                keyword:'',
                isMailingState:'',
                evidTeamId:''
            },
            isMailingStateArr:[
                {
                    value:0,
                    nameZh:"已邮寄"
                },
                {
                    value:1,
                    nameZh:"待邮寄"
                }
            ],
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
                    title:"收件人",
                    key:"receiverName",
                },
                {
                    title:"收件人地址",
                    key:"receiverProvinceName",
                    render:(h,params)=>{
                        let str = `${params.row.receiverProvinceName || ""}${params.row.receiverCityName || ""}${params.row.receiverAreaName || ""}${params.row.receiverAddress || ""}`;
                        return h("span",{
                            class:["textover"],
                            attrs:{
                                title:str
                            }
                        },str)
                    }
                },
                {
                    title:"寄件团队",
                    key:"sendTeam",
                },
                {
                    title:"电话",
                    key:"receiverMobile",
                },
                {
                    title:"邮箱",
                    key:"receiverEmail",
                },
                {
                    title:"待邮寄案件数量",
                    key:"caseNumber",
                    align:"center",
                    render:(h,params)=>{
                        let str = params.row.caseNumber || 0;
                        return h("span",`${str}件`)
                    }
                },
                {
                    title:"邮寄状态",
                    key:"caseNumber",
                    render:(h,params)=>{
                        let str="",color="";
                        if(params.row.caseNumber>0){
                            str = "待邮寄";
                            color = styles.warningColor;
                        }else{
                            str = "已邮寄";
                            color = styles.successColor;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{ color:color,title:str },
                            style:{ borderRadius:'11px' }
                        },str)
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            type:""
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/order-receiver-info';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize,
                isMailingState:this.searchForm.isMailingState?true:false,
                keyword:this.searchForm.keyword
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
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
            this.getData();
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.searchForm.isMailingState = '';
            this.$refs.teamSelect.clearSelected();
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
        },
        /*------------操作End-------------*/
        //选择团队
        getTeamId(data){
            if(data){
                this.searchForm.evidTeamId = data.teamId;
            }else{
                this.searchForm.evidTeamId = '';
            }
        },
    },
    created(){},
    activated(){
        this.getData();
        this.infoCtrl = false;
    },
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {
        mailingApplyCase,
        mailingInfo
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.close-icon{
    font-size: 20px;
    cursor: pointer;
}
</style>

