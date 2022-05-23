<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <ul class="case-tabs clearfix">
                <li @click="changeTableColumns('ALL')" :class="isSelected==='ALL'?'active':''">全部({{sumData.allNumber || 0}})</li>
                <li @click="changeTableColumns('PG')" :class="isSelected==='PG'?'active':''">
                    <!-- 待处理(300) -->
                    <Poptip trigger="click" style="width:100%;" transfer placement="bottom-start">
                        <div>待处理({{sumData.pendingTotal || 0}})</div>
                        <div slot="content">
                        <CheckboxGroup @on-change="changePendding" v-model="penddingArr">
                            <Checkbox label="isPendingMaterial"><span>材料待寄送({{sumData.pendingMaterialNumber || 0}})</span></Checkbox>
                            <Checkbox label="isPendingLitigant"><span>当事人待审核({{sumData.pendingLitigantNumber || 0}})</span></Checkbox>
                            <Checkbox label="isPendingTermination"><span>终止待审核({{sumData.pendingTerminationNumber || 0}})</span></Checkbox>
                        </CheckboxGroup>
                        </div>
                    </Poptip>
                </li>
                <li @click="changeTableColumns('T')" :class="isSelected==='T'?'active':''">已终止({{sumData.terminatedNumber || 0}})</li>
                <li @click="changeTableColumns('P')" :class="isSelected==='P'?'active':''">待取证({{sumData.pendingEvidenceNumber || 0}})</li>
                <li @click="changeTableColumns('W')" :class="isSelected==='W'?'active':''">已取证({{sumData.evidenceObtainedNumber || 0}})</li>
                <li @click="changeTableColumns('A')" :class="isSelected==='A'?'active':''">已出证({{sumData.issuedEvidenceNumber || 0}})</li>
                <li @click="changeTableColumns('CF')" :class="isSelected==='CF'?'active':''">已立案({{sumData.confirmFilingNumber || 0}})</li>
                <li @click="changeTableColumns('CC')" :class="isSelected==='CC'?'active':''">已结案({{sumData.closeCaseNumber || 0}})</li>
            </ul>
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
                                项目
                            </Col>
                            <Col span="9">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects/my'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                            <Col span="3" class="header-common-col">
                                承办团队
                            </Col>
                            <Col span="9">
                                <mySelect ref="caseTeamSelect"
                                    :path="'/base/teams'"
                                    :placeholder="'请选择承办团队'"
                                    :placeholderInput="'请输入团队名称'"
                                    :keyName="'team'"
                                    @getValue="getCaseTaker">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
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
                            <Col span="3" class="header-common-col">
                                案件区域
                            </Col>
                            <Col span="9">
                                <City ref="cityCascader" v-on:listenCity="getCity" style="width:100%;"></City>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                案件进度
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.progress" placeholder="请选择案件进度" clearable>
                                    <Option v-for="item in caseProgressArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                创建时间
                            </Col>
                            <Col span="9">
                                <DatePicker type="daterange" v-model="createTime"
                                    @on-change="getCreateTime" placement="bottom-end" placeholder="请选择时间" style="width:100%"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                案件类型
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.caseType" placeholder="请选择案件类型" clearable>
                                    <Option v-for="item in caseTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                是否有生厂商
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.isManufacturer" placeholder="请选择是否有生厂商" clearable>
                                    <Option value="1">是</Option>
                                    <Option value="0">否</Option>
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
                    <Dropdown @on-click="option(row,$event)" v-permission="['case:manage:my:manage-']">
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

        <list-options :id="id" :type="type" :applicationNote="applicationNote" @reloadList="changeCtrl"></list-options>
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
                projectId:'',
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
                property:'',
                taglibId:'',
                organizationId:'',
                startSales:'',
                endSales:''
            },
            createTime:[],
            caseTypeArr:[],
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
            columns:[],
            name:'全部项目',
            isSelected:'ALL',
            optionsCtrl:true,
            applicationNote:'',
            sumData:"",
            penddingArr:[],
            penddingObj:{
                isPendingMaterial:0,
                isPendingLitigant:0,
                isPendingTermination:0,
            }
        }
    },
    props: [''],
    methods: {
        changeTableColumns(type){
            this.isSelected = type;
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
                                color:styles.globalMainColor
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
                        return h('div',{
                            style:{
                                color:params.row.teamType==='L'?'#105cfb':'#6666ff',
                            }
                        },[
                            h('span',{
                                class:[params.row.teamType==='L'?'icon-lawyer-01':'icon-investigation-01'],
                                style:{
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
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.certState){
                            case "P": 
                                // 待取证
                                color = "orange"; 
                                break;
                            case "A": 
                                // 已出证
                                color = "blue"; 
                                break;
                            case "W": 
                                // 已取证
                                color = "green"; 
                                break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            attrs:{ color:color }
                        },params.row.certStateName)
                    }
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
                    slot: 'action'
                }
            }
            if(type!='T'){
                delete(columnsList.terminatedReason)
            }
            if(this.penddingArr.length==0){
                for(let key in this.penddingObj){
                    if(type=="PG"){
                        this.penddingArr.push(key);
                    }
                    this.penddingObj[key] = type=="PG"?1:0;
                }
            }
            this.columns = [];
            for(let key in columnsList){
                this.columns.push(columnsList[key])
            }
            this.$nextTick(()=>{
                this.reloadTable();
            })
        },
        changePendding(arr){
            for(let key in this.penddingObj){
                this.penddingObj[key] = 0;
            }
            this.penddingArr.forEach((item,index)=>{
                this.penddingObj[item] = 1;
            })
            this.reloadTable();
        },
        //获取统计数据
        getSumData(){
            let url = '/business/cases/statist';
            let ajaxData = {
                type:'AC'
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.sumData = res.data || "";
                }
            })
        },
        //获取列表数据
        getData(){
            let url = '/business/case/my/administrative';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
                category:this.isSelected
            }
            if(this.isSelected=="T"){
                ajaxData.terminateAuditState = "E"
            }
            if(this.isSelected=="PG"){
                Object.assign(ajaxData,this.penddingObj);
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
                    console.log(this.tagArr);
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
            this.$refs.inputEndSales.clearValue();
            this.$refs.cityCascader.clearSelect();
            this.$refs.projectSelect.clearSelected();
            this.$refs.teamSelect.clearSelected();
            this.$refs.caseTeamSelect.clearSelected();
            this.$refs.treeInput.clearOnly();
            this.createTime = [];
            this.reloadTable();
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            this.type = name;
            if(name==='auditStopApply'){
                this.applicationNote = row.applicationNote;
            }
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
        //关闭弹框
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.type = '';
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projectId = data.id;
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
            this.caseProgressArr = await this.common.getDictionaryItems('case_progress_administrative');
            this.caseTypeArr = await this.common.getDictionaryItems('inquiry_type');
            this.tortSubjArr = await this.common.getDictionaryItems('tort_subj_property');
        },
    },
    created(){},
    activated(){
        this.getSumData();
        this.getData();
        this.getTagList();
        this.infoCtrl = false;
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        this.changeTableColumns('ALL');
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