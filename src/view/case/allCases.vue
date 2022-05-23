<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
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
                                承办团队
                            </Col>
                            <Col span="9">
                                <mySelect ref="undertakeSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择承办团队'"
                                    :placeholderInput="'请输入团队名称'"
                                    :keyName="'team'"
                                    @getValue="getCaseTaker">
                                </mySelect>
                            </Col>
                            <Col span="3" class="header-common-col">
                                报备团队
                            </Col>
                            <Col span="9">
                                <mySelect ref="teamSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择报备团队'"
                                    :placeholderInput="'请输入团队名称'"
                                    :keyName="'team'"
                                    @getValue="getReportTeam">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                案件区域
                            </Col>
                            <Col span="9">
                                <City ref="cityCascader" v-on:listenCity="getCity" style="width:100%;"></City>
                            </Col>
                            <Col span="3" class="header-common-col">
                                案件进度
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.progress" placeholder="请选择案件进度" clearable>
                                    <Option v-for="item in caseProgressArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                创建时间
                            </Col>
                            <Col span="9">
                                <DatePicker type="daterange" v-model="createTime"
                                    @on-change="getCreateTime" placement="bottom-end" placeholder="请选择时间" style="width:100%"></DatePicker>
                            </Col>
                            <Col span="3" class="header-common-col">
                                案件类型
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.caseType" placeholder="请选择案件类型" clearable>
                                    <Option v-for="item in caseTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                是否有生厂商
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.isManufacturer" placeholder="请选择是否有生厂商" clearable>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                案件性质
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.type" placeholder="请选择案件性质" clearable>
                                    <Option v-for="item in typeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                         <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                销售额区间
                            </Col>
                            <Col span="9" style="display: flex;">
                                <my-input
                                ref="inputStartSales"
                                style="width: 110px;"
                                appendText="￥" 
                                :defaultData="searchForm.startSales"
                                @getValue="getInputValue($event,'startSales')"
                            ></my-input><span style="line-height: 28px;"> - </span><my-input
                                ref="inputEndSales"
                                style="width: 110px;"
                                appendText="￥" 
                                :defaultData="searchForm.endSales"
                                @getValue="getInputValue($event,'endSales')"
                            ></my-input>
                            </Col>
                            <Col span="3" class="header-common-col">
                                当事人类型
                            </Col>
                            <Col span="9" style="line-height:32px;">
                                <span v-for="item in tortSubjArr" :key="item.value"
                                    style="margin-right:6px;" :class="['conditions-option',searchForm.property==item.value&&'active']" 
                                    @click="searchForm.property=item.value">{{item.nameZh}}</span>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                标签
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.taglibId" placeholder="请选择标签">
                                    <Option v-for="item in tagArr" :value="item.taglibId" :key="item.taglibId">{{ item.tagName }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                部门筛选
                            </Col>
                            <Col span="9" style="line-height:32px;">
                                <InputTree transfer @returnData="setOrganizationData" ref="treeInput" :value="searchForm.organizationId"></InputTree>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                项目
                            </Col>
                            <Col span="9">
                                <mySelect ref="projectsSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目名称'"
                                    :keyName="'name'"
                                    @getValue="getProjects">
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
            <Row v-show="!infoCtrl" style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" row-key="indexId" :data="data" :loading="tableLoading">
                <template slot-scope="{ row, index }" slot="action" v-if="row.subCaseInfoList">
                    <Dropdown @on-click="option(row,$event)" v-permission="['case:manage:all:manage-']">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="terminated" v-if="row.state==='HH'">终止</DropdownItem>
                            <DropdownItem name="recovery" v-if="row.state==='TN'">恢复</DropdownItem>
                            <DropdownItem name="auditStopApply" v-if="row.terminationState==='P'">审核终止申请</DropdownItem>
                            <DropdownItem name="related">关联案件</DropdownItem>
                            <DropdownItem name="caseNotes">备忘</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </template>
                </Table>
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
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import caseDetail from './caseDetail.vue';
import listOptions from './plugins/listOptions.vue';
import InputTree from "@/components/common/inputSelect/inputSelect";
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                caseTaker:'',
                caseTakerType:'',
                reportTeam:'',
                reportTeamType:'',
                startTime:'',
                endTime:'',
                province:'',
                city:'',
                area:'',
                progress:'',
                caseType:'',
                isManufacturer:'',
                type:'',
                property:'',
                taglibId:'',
                organizationId:'',
                startSales:'',
                endSales:'',
                projectId:''
            },
            createTime:[],
            caseTypeArr:[],
            typeArr:[],
            caseProgressArr:[],
            tortSubjArr:[],
            tagArr:[],
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
            confirmCtrl:false,
            title:'',
            columns:[],
            name:'全部项目',
            isSelected:'tabs-1',
            optionsCtrl:true,
            disabledcaseList:[]
        }
    },
    props: [''],
    methods: {
        changeTableColumns(type,tabCtrl){
            this.isSelected = tabCtrl;
            const columnsList = {
                name:{
                    title:"案件编号",
                    key:"code",
                    tree:true,
                    width:145,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:{
                                "textover":true,
                                "table-sub-style":true,
                                'has-sub-project':params.row.hasSubCase
                            },
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.state = params.row.state || "";
                                    this.getCaseDetail(params.row.id,'info',params.row.subCaseInfoList);
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                project:{
                    title:"项目",
                    key:"projectName",
                    width:180,
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.projectName
                            },
                        },params.row.projectName)
                    }
                },
                cooperatName:{
                    title:"对方当事人",
                    key:"caseExtend",
                    width:180,
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
                area:{
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
                team:{
                    title:"承办团队",
                    key:"caseTakerName",
                    render:(h,params)=>{
                        return h('div',[
                            h('span',{
                                class:[params.row.teamType==='L'?'icon-lawyer-01':'icon-investigation-01'],
                                style:{
                                    color:styles.globalMainColor,
                                    marginRight:'3px'
                                }
                            }),
                            h('span',params.row.caseTakerName)
                        ])
                    }
                },
                state:{
                    title:"案件状态",
                    key:"state",
                    render:(h,params)=>{
                        let color ;
                        let state = params.row.state;
                        switch (true){
                            case state=='HH':color = 'successColor';break;
                            case (state=='RT'||state=='AT'||state=='RA'||state=='TN'):color = 'errorColor';break;
                            case (state=='ED'):color = 'expireColor';break;
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
                caseState:{
                    title:"取证状态",
                    key:"certStateName",
                },
                caseProgress:{
                    title:"案件进度",
                    key:"progressName",
                },
                terminatedReason:{
                    title:"终止原因",
                    key:"stopRemark",
                },
                action:{
                    title:"操作",
                    width:120,
                    slot: 'action'
                }
            }
            if(type==='Terminated'){
                delete(columnsList.state)
            }else if(type==='Filed'){
                delete(columnsList.state)
                delete(columnsList.terminatedReason)
            }else{
                delete(columnsList.terminatedReason)
            }
            this.columns = [];
            for(let key in columnsList){
                this.columns.push(columnsList[key])
            }
        },
        headerOption(name){
            this.name = name;
        },
        //获取列表数据
        getData(){
            let url = '/business/cases';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    let list = res.data.records.map(item=>{
                        if(item.subCaseInfoList&&item.subCaseInfoList.length!=0){
                            return{
                                hasSubCase:false,
                                children:item.subCaseInfoList,
                                ...item
                            }
                        }else{
                            return {
                                hasSubCase:true,
                                ...item
                            }
                        }
                    });
                    this.data = this.getMapList(list,null)
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        //获取标签数据
        getTagList(){
            let url ='/business/taglib';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.tagArr = res.data;
                }
            })
        },
        getMapList(arr,indexStr){
            let list = arr.map((item,index)=>{
                let obj = {
                    indexId:indexStr!==null?(item.id+String(index)+indexStr):(item.id+String(index)),
                    ...item
                }
                if(item.children){
                    obj.children = this.getMapList(item.children,String(index))
                }
                return obj;
            })
            return list;
        },
        getInputValue(data,name){
            this.searchForm[name] = data;
        },
        setOrganizationData(data){
            this.searchForm.organizationId = data;
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
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.$refs.inputStartSales.clearValue();
            this.$refs.projectsSelect.clearSelected();
            this.$refs.inputEndSales.clearValue();
            this.$refs.cityCascader.clearSelect();
            this.$refs.teamSelect.clearSelected();
            this.$refs.undertakeSelect.clearSelected();
            this.$refs.treeInput.clearOnly();
            this.createTime = [];
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
        },
        //获取案件详情
        getCaseDetail(id,type,isRelatedCase){
            this.optionsCtrl = isRelatedCase;
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
        //关闭侧边栏
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.type = '';
        },
        //承办团队
        getCaseTaker(data){
            this.searchForm.caseTaker = data.teamId;
            this.searchForm.caseTakerType = data.platformSourceType;
        },
        //获取团队id
        getReportTeam(data){
            this.searchForm.reportTeam = data.teamId;
            this.searchForm.reportTeamType = data.platformSourceType;
        },
        //项目
        getProjects(data){
            this.searchForm.projectId = data.id;
        },
        //获取创建时间
        getCreateTime(data){
            this.searchForm.startTime = data[0];
            this.searchForm.endTime = data[1];
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
        //获取字典数据接口
        async getDictionary(){
            this.caseProgressArr = await this.common.getDictionaryItems('case_progress');
            this.caseTypeArr = await this.common.getDictionaryItems('inquiry_type');
            this.typeArr = await this.common.getDictionaryItems('case_type');
            this.tortSubjArr = await this.common.getDictionaryItems('tort_subj_property');
        },
    },
    created(){},
    activated(){
        this.getData();
        this.getTagList();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        this.changeTableColumns(null,'tabs-1');
    },
    updated(){},
    components: {
        caseDetail,
        listOptions,
        InputTree
    },
    watch: {}
}
</script>
<style scoped lang="scss">
.project-box{
    position: relative;
}
@import './case.scss';
</style>