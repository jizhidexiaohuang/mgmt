<template>
    <div>
        <div class="card-style">
            <Row v-if="!infoCtrl">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <Col style="float:left;">
                        <ButtonGroup>
                            <Button :type="tableType=='line'?'primary':'default'" @click="tableType='line'" icon="md-list"></Button>
                            <Button :type="tableType=='block'?'primary':'default'" @click="tableType='block'" icon="md-apps"></Button>
                        </ButtonGroup>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="案件包编号/案件编号/当事人" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    出售状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.saleState" placeholder="请选择出售状态">
                                        <Option v-for="item in saleStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                    </Select>
                                </Col>
                            </Row>
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    发布状态
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.publishState" placeholder="请选择发布状态">
                                        <Option v-for="item in publishStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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

                <Row v-show="tableType=='line'" style="border:1px solid #dcdee2;border-bottom:0;">
                    <Table :columns="columns" :data="data" 
                        :loading="tableLoading">
                        <template slot-scope="{ row, index }" slot="action">
                            <Dropdown @on-click="option(row,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem v-if="row.modifyPermission" name="edit">编辑</DropdownItem>
                                    <DropdownItem v-if="row.publishState=='P'" name="publish">发布</DropdownItem>
                                    <DropdownItem v-if="row.removePermission" name="remove">删除</DropdownItem>
                                    <DropdownItem v-if="row.cancelPermission" name="cancel">撤回</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </template>
                    </Table>
                </Row> 
                <Row v-show="tableType=='block'">
                    <div class="case-package-box">
                        <div class="case-package-item" v-for="(item,index) in data" :key="index">
                            <div class="package-header">
                                <span class="package-title" @click="getBagDetail(item,'info')">{{item.code || ""}}</span>
                                <Tag v-if="item.saleState=='P'" color="orange">{{item.saleStateName}}</Tag>
                                <Tag v-if="item.saleState=='PR'" color="blue">{{item.saleStateName}}</Tag>
                                <Tag v-if="item.saleState=='S'" color="green">{{item.saleStateName}}</Tag>
                                <Row style="float:right">
                                    <Dropdown @on-click="option(item,$event)">
                                        <a href="javascript:void(0)">
                                            <Icon type="ios-more" size="20"/>
                                        </a>
                                        <DropdownMenu slot="list">
                                            <DropdownItem v-if="item.modifyPermission" name="edit">编辑</DropdownItem>
                                            <DropdownItem v-if="item.publishState=='P'" name="publish">发布</DropdownItem>
                                            <DropdownItem v-if="item.removePermission" name="remove">删除</DropdownItem>
                                            <DropdownItem v-if="item.cancelPermission" name="cancel">撤回</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </Row>
                            </div>
                            <div class="package-content">
                                <Row class="package-row">
                                    <span class="left-label">指派团队:</span>
                                    <span>{{item.caseSaleBagLicensor?item.caseSaleBagLicensor.teamName:""}}</span>
                                </Row>
                                <Row class="package-row">
                                    <Col span="12">
                                        <span class="left-label">案件数量:</span>
                                        <span>{{item.caseNum || 0}}件</span>
                                    </Col>
                                    <Col span="12" style="text-align:right;">
                                        <span class="left-label">购买状态:</span>
                                        <span v-if="item.caseSaleBagLicensor">
                                            <span v-if="item.caseSaleBagLicensor.acceptState=='P'" style="color:orange">{{item.caseSaleBagLicensor.acceptStateName}}</span>
                                            <span v-if="item.caseSaleBagLicensor.acceptState=='A'" style="color:green">{{item.caseSaleBagLicensor.acceptStateName}}</span>
                                            <span v-if="item.caseSaleBagLicensor.acceptState=='R'" style="color:red">{{item.caseSaleBagLicensor.acceptStateName}}</span>
                                        </span>
                                    </Col>
                                </Row>
                                <Row class="package-row">
                                    <Col span="15">
                                        <span class="left-label">售价:</span>
                                        <span class="large-text">
                                            <Tooltip theme="light">
                                                <span>{{common.formateNumber(item.sellFee || 0)}}</span>
                                                <div slot="content" style="font-weight:normal">
                                                    <p>基础价格：{{common.formateNumber(item.baseFee || 0)}}</p>
                                                    <p>附加费用：{{common.formateNumber(item.surchargeFee || 0)}}</p>
                                                </div>
                                            </Tooltip>
                                        </span>
                                    </Col>
                                    <Col span="9" class="error-time">
                                        <Icon type="md-alarm" />
                                        <count-down :key="item.publishState" :time="item.caseSaleBagLicensor.dueSeconds" style="vertical-align: middle;"></count-down>
                                    </Col>
                                </Row>
                            </div>
                        </div>
                    </div>
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

            <package-detail v-if="infoCtrl" :defaultData="bagDetail">
                <div class="operate-box" slot="operate-box">
                    <Icon class="close-icon" @click="closeModal"  type="md-close"/>
                </div>
            </package-detail>
        </div>

        <!-- 案件包编辑modal -->
        <Modal 
            v-model="salesModal" 
            :width="860"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">编辑案件包</div>
            <create-case-package v-if="salesModal" :dataList="bagDetail" operation="edit" @reloadList="closeModal"></create-case-package>
        </Modal>

        <!-- 发布/删除/撤回modal -->
        <Modal
            v-model="opearteCtrl"
            title="提示"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否{{title}}该案件包？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :disabled="isSumbit" @click="operateSubmit">确认</Button>
                <Button @click="opearteCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import createCasePackage from './createCasePackage.vue';
import packageDetail from "./packageDetail.vue";
export default {
    data () {
        return {
            styles:styles,
            searchBoxCtrl:false,
            tableLoading:false,
            infoCtrl:false,
            searchForm:{
                keyword:"",
                publishState:"",
                saleState:""
            },
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"案件包编号",
                    key:"code",
                    width:140,
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.code
                            },
                            on:{
                                "click":()=>{
                                    this.getBagDetail(params.row,'info')
                                }
                            }
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"购买剩余时间",
                    key:"caseSaleBagLicensor",
                    render:(h,params)=>{
                        return h("countDown",{
                            class:'textover',
                            props:{
                                time:params.row.caseSaleBagLicensor.dueSeconds,
                            },
                        },"")
                    }
                },
                {
                    title:"案件数量",
                    key:"caseNum",
                    align:"center",
                    render:(h,params)=>{
                        return h("span",`${params.row.caseNum || 0}件`)
                    }
                },
                {
                    title:"案件总价",
                    key:"sellFee",
                    render:(h,params)=>{
                        let baseFee = this.common.formateNumber(params.row.baseFee || 0);
                        let surchargeFee = this.common.formateNumber(params.row.surchargeFee || 0);
                        let sellFee = this.common.formateNumber(params.row.sellFee || 0);
                        let sellFeeDom = h("span",sellFee);
                        let contentDom = h("div",{slot:"content"},[
                            h("p",{ style:{ marginBottom:"5px" } },`基础价格：${baseFee}`),
                            h("p",`附加费用：${surchargeFee}`),
                        ])
                        let toolTip = h("Tooltip",{
                            props:{ theme:"light" }
                        },[sellFeeDom,contentDom])
                        return toolTip
                    }
                },
                {
                    title:"发布状态",
                    key:"publishState",
                    render:(h,params)=>{
                        let color;
                        let state = params.row.publishState;
                        switch (true){
                            case state=='P':color = 'default';break;
                            case state=='E':color = 'green';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.publishStateName,
                                color:color
                            },
                        },params.row.publishStateName)
                    }
                },
                {
                    title:"出售状态",
                    key:"saleState",
                    render:(h,params)=>{
                        let color;
                        let state = params.row.saleState;
                        switch (true){
                            case state=='P':color = 'warningColor';break;
                            case state=='PR':color = 'successColor';break;
                            case state=='S':color = 'infoColor';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.saleStateName,
                                color:styles[color]
                            },
                            style:{
                                borderRadius:'11px'
                            }
                        },params.row.saleStateName)
                    }
                },
                {
                    title:"购买状态",
                    key:"caseSaleBagLicensor",
                    render:(h,params)=>{
                        if(!params.row.caseSaleBagLicensor){
                            return h("span","")
                        }
                        let color;
                        let state = params.row.caseSaleBagLicensor.acceptState;
                        switch (true){
                            case state=='P':color = 'orange';break;
                            case state=='A':color = 'green';break;
                            case state=='R':color = 'red';break;
                        }
                        return h('Tag',{
                            class:'textover',
                            attrs:{
                                title:params.row.caseSaleBagLicensor.acceptStateName,
                                color:color
                            },
                        },params.row.caseSaleBagLicensor.acceptStateName)
                    }
                },
                {
                    title:"指派团队",
                    key:"caseSaleBagLicensor",
                    render:(h,params)=>{
                        return h("span",params.row.caseSaleBagLicensor.teamName);
                    }
                },
                {
                    title:"操作",
                    width:120,
                    slot: 'action'
                },
            ],
            publishStateArr:[],
            saleStateArr:[],
            tableType:"line",
            salesModal:false,
            type:"",
            title:"",
            opearteCtrl:false,
            isSumbit:false
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/settlement/trade/sale/bag/appoint';
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize, 
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch (name){
                case 'edit':
                    this.getBagDetail(row,'edit');
                    break;
                case 'publish':
                    this.title = "发布";
                    this.opearteCtrl = true;
                    break;
                case 'remove':
                    this.title = "删除";
                    this.opearteCtrl = true;
                    break;
                case 'cancel':
                    this.title = "撤回";
                    this.opearteCtrl = true;
                    break;
            }
        },
        getBagDetail(row,type){
            let url = '/settlement/trade/sale/bag/'+row.id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.bagDetail = res.data;
                    if(type=='edit'){
                        this.salesModal = true;
                    }else if(type=='info'){
                        this.infoCtrl = true;
                    }
                }
            })  
        },
        operateSubmit(){
            let url = `/settlement/trade/sale/bag/${this.type}/${this.id}`;
            this.isSumbit = true;
            if(this.type=="remove"){
                this.$del(url).then(res=>{
                    this.isSumbit = false;
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.opearteCtrl = false;
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }else{
                this.$patch(url).then(res=>{
                    this.isSumbit = false;
                    if(res.code==0){
                        this.$Message.success("操作成功!");
                        this.opearteCtrl = false;
                        this.reloadTable();
                    }else{
                        this.$Message.error(res.message);
                    }
                })
            }
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        // 关闭编辑框
        closeModal(data){
            if(data){
                this.reloadTable();
            }
            this.infoCtrl = false;
            this.salesModal = false;
        },
        clearConditions(){
            for(let key in this.searchForm){
                this.searchForm[key] = '';
            }
            this.reloadTable();
        },
        getLocationStr(arr){
            let location = [],json={},str;
            arr.forEach(item=>{
                if(item.flag){
                    if(!json[item.province]){
                        json[item.province] = item.provinceName;
                    }
                }else{
                    location.push(item.cityName)
                }
            })
            for(let key in json){
                location.push(json[key]);
            }
            str = location.join('，');
            return str
        },
        //获取字典数据接口
        async getDictionary(){
            this.publishStateArr = await this.common.getDictionaryItems('case_bag_publish_state');
            this.saleStateArr = await this.common.getDictionaryItems('case_bag_sale_state');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getData();
    },
    mounted(){},
    updated(){},
    components: {
        createCasePackage,
        packageDetail
    },
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./package.scss";
.operate-box{
    position: absolute;
    right:15px;
    top:3px;
    font-size:20px;
    cursor: pointer;
    .close-icon{
        margin-left: 10px;
    }
}
</style>
