<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button type="primary" @click="addSales('batch')" :disabled="idList.length==0">批量出售</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="案件编号/对方当事人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container container-lg" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                取证团队
                            </Col>
                            <Col span="9">
                                <mySelect ref="lawyerSelect" style="width:100%"
                                    :path="'/base/teams'"
                                    :keyName="'team'"
                                    :width="190"
                                    :params="{teamType:'I'}"
                                    placeholder="请选择取证团队"
                                    @getValue="getTeamsId">
                                </mySelect>
                            </Col>
                            <Col span="3" class="header-common-col">
                                所属项目
                            </Col>
                            <Col span="9">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目名称'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                案件区域
                            </Col>
                            <Col span="9">
                                <City ref="transEvent" v-on:listenCity="getCity" style="width:100%;"></City>
                            </Col>
                            <Col span="3" class="header-common-col">
                                证据审核状态
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.evidAuditState" placeholder="请选择证据审核状态" style="width:100%">
                                    <Option v-for="item in evidAuditStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                取证状态
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.certState" placeholder="请选择任务类型" style="width:100%">
                                    <Option v-for="item in certStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                案件类型
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.tortCategory" placeholder="请选择任务类型" style="width:100%">
                                    <Option v-for="item in tortCategoryArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                出售状态
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.saleState" placeholder="请选择出售状态" clearable>
                                    <Option v-for="item in saleStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                <checkbox-table :columns="columns" :data="data" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="sales" v-if="row.saleState=='P'">出售</DropdownItem>
                                <DropdownItem name="caseNotes">备忘</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </checkbox-table>
            </Row>
            <Row v-if="!infoCtrl" style="margin-top:30px;text-align:center;">
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
        
        <!-- 案件详情 -->
        <case-detail v-if="infoCtrl" :caseDetail="caseDetail" :optionsCtrl="optionsCtrl">
            <div class="close-icon" slot="close-icon" @click="infoCtrl=false;"><Icon type="md-close" /></div>
        </case-detail>

        <list-options :id="id" :type="type" @reloadList="changeCtrl"></list-options>

        <!-- 出售modal -->
        <Modal 
            v-model="salesModal" 
            :width="860"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">新建案件包</div>
            <create-case-package v-if="salesModal" :dataList="salesBagList" operation="add" @reloadList="closeModal"></create-case-package>
        </Modal>

        <!-- 标签modal -->
        <Modal 
            v-model="tagModal" 
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">已订阅标签</div>
            <tag-manage :defaultList="defaultList" v-if="tagModal" @changeTag="getTag"></tag-manage>
        </Modal>

        <!-- 查看备忘 -->
        <Modal 
            v-model="caseNotesModal" 
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">备忘信息</div>
            <case-notes style="max-height:500px;overflow:auto;margin:-16px;" v-if="caseNotesModal" :caseId="caseId"></case-notes>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseDetail from '../../case/caseDetail.vue';
import listOptions from '../../case/plugins/listOptions.vue';
import caseNotes from '../../case/caseNotes.vue';
import createCasePackage from './createCasePackage.vue';
import expandRow from './expandRow.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                evidTeamId:'',
                projectId:'',
                province:'',
                city:'',
                area:'',
                evidAuditState:'',
                certState:'',
                tortCategory:'',
                saleState:'',
            },
            evidAuditStateArr:[],
            certStateArr:[],
            tortCategoryArr:[],
            saleStateArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            infoCtrl:false,
            caseDetail:'',
            type:'',
            columns: [
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    type: 'expand',
                    width: 30,
                    render: (h, params) => {
                        return h(expandRow, {
                            props: {
                                list: params.row.subCaseInfoList
                            },
                            on:{
                                'clickCaseCode':(item)=>{
                                    this.state = item.state || "";
                                    this.getCaseDetail(item.id,'info');
                                }
                            }
                        })
                    }
                },
                {
                    title:"案件编号",
                    key:"caseCode",
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{
                                "textover":true
                            },
                            style:{
                                color:styles.globalMainColor
                            },
                            attrs:{
                                title:params.row.caseCode
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getCaseDetail(params.row.caseId,'info');
                                }
                            }
                        },params.row.caseCode);
                        return dom
                    }
                },
                {
                    title:"项目",
                    key:"projectName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                {
                    title:'案件区域',
                    key:'cityName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:(params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||'')
                            },
                        },
                        (params.row.provinceName||'')+(params.row.cityName||'')+(params.row.areaName||''))
                    }
                },
                {
                    title:"对方当事人",
                    key:"caseExtend",
                    render:(h,params)=>{
                        let domArr = [];
                        let idArr = params.row.caseExtend.litigantIds?params.row.caseExtend.litigantIds.split(",") : [];
                        let categoryArr = params.row.caseExtend.litigantCategories?params.row.caseExtend.litigantCategories.split(",") : [];
                        let nameArr = params.row.caseExtend.litigantNames?params.row.caseExtend.litigantNames.split(",") : [];
                        nameArr.forEach((item,index)=>{
                            let iconDom = h('span',{
                                class:'descripe-icon',
                                style:{
                                    "marginRight":"5px"
                                }
                            },categoryArr[index]&&categoryArr[index]==="M"?"生":"销");
                            let spanDom = h('span',item);
                            let pDom = h('p',{
                                class:"textover",
                                attrs:{ title:item },
                                style:{
                                    "marginBottom":index!=nameArr.length-1?"5px":"0"
                                }
                            },[iconDom,spanDom]);
                            domArr.push(pDom)
                        })
                        return h("div",{
                            style:{ 
                                "padding":nameArr.length>1?"5px 0":"0" 
                            }
                        },domArr);
                    }
                },
                {
                    title: '项目负责人',
                    key: 'projectManager',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectManager
                            },
                        },params.row.projectManager)
                    }
                },
                {
                    title: '取证团队',
                    key: 'evidTeamName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.evidTeamName
                            },
                        },params.row.evidTeamName)
                    }
                },
                {
                    title:"取证状态",
                    key:"certState",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.certState){
                            case "P": color = "warning"; break;
                            case "W": color = "blue"; break;
                            case "A": color = "green"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            attrs:{ color:color }
                        },params.row.certStateName)
                    }
                },
                {
                    title: '出售状态',
                    key: 'saleState',
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.saleState){
                            case "P": color = "warningColor"; break;
                            case "B": color = "expireColor"; break;
                            case "Y": color = "infoColor"; break;
                            case "S": color = "successColor"; break;
                        }
                        return h('Tag',{
                            attrs:{
                                title:params.row.stateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.saleStateName)
                    }
                },
                {
                    title: '标签',
                    key: 'taglibList',
                    render:(h,params)=>{
                        let tagList = params.row.taglibList;
                        return h('Poptip',{
                            props: {placement: 'bottom',trigger:"hover"},
                            style:{width:'100%'},
                            style:{
                                fontSize:'16px',
                                cursor: 'pointer'
                            }
                        },[
                            h('Icon',{
                                attrs:{
                                    type:'ios-pricetags',
                                    title:'标签'
                                },
                                style:{
                                    fontSize:'16px',
                                    cursor: 'pointer'
                                }
                            }),
                            h('span', {
                                slot: 'title', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },[
                                tagList.map(item=>{
                                    return h("Tag",{
                                        class:["textover"],
                                        attrs:{ color: item.color }
                                    },item.tagName)
                                })
                            ]),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },[
                                h('a',{
                                    on:{
                                        click:()=>{
                                            this.tagModal = true;
                                            this.defaultList = JSON.parse(JSON.stringify(tagList));
                                            this.caseId = params.row.caseId;
                                        }
                                    }
                                },[
                                    h('Icon',{
                                        attrs:{ type:'ios-build'},
                                        style:{fontSize:'14px'}
                                    }),
                                    h('span','标签管理'),
                                ])
                            ]),
                        ])
                    }
                },
                {
                    title: '备忘',
                    key: 'stateName',
                    render:(h,params)=>{
                        return h('Icon',{
                            attrs:{
                                type:'ios-information-circle',
                                title:'备忘'
                            },
                            style:{
                                fontSize:'16px',
                                cursor: 'pointer'
                            },
                            on:{
                                "click":()=>{
                                    this.caseId = params.row.caseId;
                                    this.caseNotesModal = true;
                                }
                            }
                        },params.row.stateName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                },
            ],
            name:'全部项目',
            isSelected:'tabs-1',
            optionsCtrl:true,
            idList:[],
            salesModal:false,
            tagModal:false,
            defaultList:[],
            salesBagList:[],
            caseId:'',
            caseNotesModal:false,
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/trade/sale/all-sale';
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
                        if(item.saleState!='P'){
                            item._disabled = true;
                        }
                        if(!item.subCaseInfoList || item.subCaseInfoList.length==0){
                            item._disableExpand = true;
                        }
                        return item;
                    }) || [];
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
            this.$refs.checkboxTable.clearSelected();
            this.getData();
        },
        //清除条件
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.lawyerSelect.clearSelected();
            this.$refs.projectSelect.clearSelected();
            this.$refs.transEvent.clearSelect();
            this.reloadTable();
        },
        getTeamsId(data){
            this.searchForm.evidTeamId = data.teamId;
        },
        getProjectId(data){
            this.searchForm.projectId = data.id;
        },
        //搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
                area = '';
            }
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.caseId;
            this.type = name;
            switch (name) {
                case 'sales': 
                    this.addSales();
                    break;
            }
        },
        // 添加出售
        addSales(type){
            this.salesModal = true;
            this.salesBagList = type=='batch'?this.idList:[this.id];
        },
        // 修改tag
        getTag(data){
            let url = '/business/taglib/case';
            let ajaxData = {
                caseId:this.caseId,
                taglibIdList:data.map(item=>{
                    return item.taglibId;
                })
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.tagModal = false;
                    this.$Message.success('操作成功');
                    this.reloadTable();
                }
            })
        },
        //获取案件详情
        getCaseDetail(id,type){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    if(type==='info'){
                        this.infoCtrl = true;
                    }
                }
            })
        },
        /*------------操作End-------------*/
        //关闭弹框
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.type = '';
        },
        closeModal(data){
            if(data){
                this.reloadTable();
            }
            this.salesModal = false;
        },
        //搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = '';
                    this.searchForm.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.searchForm.province = data[0].value;
                    this.searchForm.city = data[1].value;
                    this.searchForm.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.searchForm.province = '';
                this.searchForm.city = '';
                this.searchForm.area = '';
                area = '';
            }
        },
        getIdList(list){
            this.idList = list.map(item=>{
                return item.caseId;
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.evidAuditStateArr = await this.common.getDictionaryItems('audit_state');
            this.certStateArr = await this.common.getDictionaryItems('case_evid_cert_state');
            this.tortCategoryArr = await this.common.getDictionaryItems('tort_category');
            this.saleStateArr = await this.common.getDictionaryItems('case_sale_state');
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
    mounted(){
        
    },
    updated(){},
    components: {
        caseDetail,
        listOptions,
        caseNotes,
        createCasePackage
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
@import '../../case/case.scss';
</style>