<template>
    <div class="my-clue-result have-drawer-style">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;margin-left:10px;" v-if="false">
                    <Checkbox v-model="isCheckedAll" :indeterminate="indeterminate" @on-change="checkAll"></Checkbox>
                    <!-- <Dropdown @on-click="headerOption">
                        <Button style="padding:0 15px">
                            批量操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem :disabled="idList.length==0" name="agree">批量通过</DropdownItem>
                            <DropdownItem :disabled="idList.length==0" name="reject">批量驳回</DropdownItem>
                            <DropdownItem :disabled="idList.length==0" name="push">批量推送</DropdownItem>
                        </DropdownMenu>
                    </Dropdown> -->
                    <Button type="primary" @click="exportExcel">导出</Button>
                    <Dropdown @on-click="changeDropDown">
                        <Button style="padding-right:16px;">
                            排序方式
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="default">默认排序</DropdownItem>
                            <Dropdown placement="right-start">
                                <DropdownItem>
                                    按照线索报备时间
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="C">从早到晚</DropdownItem>
                                    <DropdownItem name="CD">从晚到早</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown placement="right-start">
                                <DropdownItem>
                                    按照线索调查时间
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="S">从早到晚</DropdownItem>
                                    <DropdownItem name="SD">从晚到早</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown placement="right-start">
                                <DropdownItem>
                                    按照线索修改时间
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="M">从早到晚</DropdownItem>
                                    <DropdownItem name="MD">从晚到早</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                            <Dropdown placement="right-start">
                                <DropdownItem>
                                    按照线索审核时间
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="A">从早到晚</DropdownItem>
                                    <DropdownItem name="AD">从晚到早</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="任务/项目/店铺名称/线索编号/侵权主体" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container container-lg" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                报备时间
                            </Col>
                            <Col span="9">
                                <DatePicker type="daterange" v-model="reportTime"
                                    @on-change="getReportTime" placement="bottom-end" placeholder="请选择时间" style="width:100%"></DatePicker>
                            </Col>
                            <Col span="3" class="header-common-col">
                                调查区域
                            </Col>
                            <Col span="9">
                                <City ref="cityCascader" v-on:listenCity="getCity" style="width:100%;"></City>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                客户
                            </Col>
                            <Col span="9">
                                <mySelect ref="customerSelect"
                                    :path="'/base/customers'"
                                    :placeholder="'请选择客户'"
                                    :params="{type:'G'}"
                                    :keyName="'name'"
                                    :inputKey="'name'"
                                    @getValue="getCustomerId">
                                </mySelect>
                            </Col>
                            <Col span="3" class="header-common-col">
                                项目
                            </Col>
                            <Col span="9">
                                <mySelect ref="projectSelect"
                                    :path="'/business/projects'"
                                    :placeholder="'请选择项目'"
                                    :placeholderInput="'请输入项目'"
                                    :keyName="'name'"
                                    @getValue="getProjectId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                任务名称
                            </Col>
                            <Col span="9">
                                <mySelect ref="taskSelect"
                                    :path="'/business/missions'"
                                    :placeholder="'请选择任务名称'"
                                    :keyName="'name'"
                                    :params="{'queryType':'A'}"
                                    @getValue="getTaskId">
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
                                    @getValue="getTeamId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                客户审核
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.custState" placeholder="请选择客户审核状态">
                                    <Option v-for="item in custStateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                平台审核
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.state" placeholder="请选择平台审核状态">
                                    <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                推送状态
                            </Col>
                            <Col span="9" style="line-height:32px;">
                                <span v-for="item in pushStateArr" :key="item.value"
                                    style="margin-right:6px;" :class="['conditions-option',searchForm.pushState==item.value&&'active']" 
                                    @click="searchForm.pushState=item.value">{{item.nameZh}}</span>
                            </Col>
                            <Col span="3" class="header-common-col">
                                侵权方式
                            </Col>
                            <Col span="9" style="line-height:32px;">
                                <span style="margin-right:6px;" :class="['conditions-option',searchForm.type=='onLine'&&'active']" @click="searchForm.type='onLine'">线上侵权</span>
                                <span :class="['conditions-option',searchForm.type=='offLine'&&'active']" @click="searchForm.type='offLine'">线下侵权</span>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="3" class="header-common-col">
                                报备团队类型
                            </Col>
                            <Col span="9">
                                <Select v-model="searchForm.teamTypeQ" placeholder="请选择报备团队类型">
                                    <Option v-for="item in teamTypeArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                            <Col span="3" class="header-common-col">
                                主体类型
                            </Col>
                            <Col span="9" style="line-height:32px;">
                                <span v-for="item in tortSubjArr" :key="item.value"
                                    style="margin-right:6px;" :class="['conditions-option',searchForm.property==item.value&&'active']" 
                                    @click="searchForm.property=item.value">{{item.nameZh}}</span>
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
                        </Row>
                        <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                            <Button type="primary" size="small" @click="reloadTable">确定</Button>
                            <Button size="small" @click="clearConditions">清空</Button>
                        </Row>
                    </div>
                </Col>
            </Row>

            <!-- 表格 -->
            <ul class="list">
                <Spin fix v-if="tableLoading"></Spin>
                <li v-for="(item,index) in data" :key="index">
                    <div class="result-title">
                        <Checkbox :value="idList.indexOf(item.id)>=0?true:false" @on-change="checkOption(item.id)" v-if="false"></Checkbox>
                        <span class="result-time">{{item.submitTime.slice(0,10)}}</span>
                        <span class="result-name" @click="getClueDetail(item.id)">
                            <span class="text-icon" v-if="item.isTestPurchase">测</span>
                            <span class="push-icon" v-if="item.custState">推</span>
                            <span class="result-code">[编号：{{item.code}}]</span> &nbsp;&nbsp;&nbsp;{{item.missionName}}
                            <span v-if="item.isTestPurchase">
                                <Tag v-if="!item.testPurchaseState" color="orange">待测购</Tag>
                                <Tag v-if="item.testPurchaseState=='P'" color="blue">测购待审核</Tag>
                                <Tag v-if="item.testPurchaseState=='R'" color="red">测购驳回</Tag>
                                <Tag v-if="item.testPurchaseState=='E'" color="green">测购通过</Tag>
                            </span>
                        </span>
                        <span class="result-title-option" v-if="item.state=='E'">
                            <Dropdown @on-click="listOption(item.id,$event)">
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <Dropdown placement="left-start" transfer-class-name="dropdown-style" v-if="common.strMapArr({code:item.caseCodes,id:item.caseIds}).length">
                                        <DropdownItem>
                                            查看案件
                                            <Icon type="ios-arrow-forward"></Icon>
                                        </DropdownItem>
                                        <DropdownMenu slot="list">
                                            <DropdownItem v-for="(item,index) in common.strMapArr({code:item.caseCodes,id:item.caseIds})" :key="index" :name="item.id">{{item.code}}</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                    <!-- <DropdownItem name="edit">编辑</DropdownItem>
                                    <DropdownItem name="agree" v-if="item.state=='P'">通过</DropdownItem>
                                    <DropdownItem name="reject" v-if="item.state=='P'">驳回</DropdownItem>
                                    <DropdownItem name="push" v-if="!item.custState">推送</DropdownItem> -->
                                </DropdownMenu>
                            </Dropdown>
                        </span>
                    </div>
                    <div class="result-main clearfix">
                        <div class="result-main-left">
                            <Row style="line-height:30px;">
                                <Col span="8"><span class="textover result-text" :title="storeName(item)">店铺名称：{{storeName(item)}}</span></Col>
                                <Col span="8">
                                    <Row v-if="item.tortSubject">
                                        <span class="textover result-text block-shop-text">
                                            销售商：
                                            <span>
                                                <a v-for="(itemTortSubject,indexTortSubject) in item.tortSubject.split(',')" href="javascript:void(0);" :key="itemTortSubject" @click="getBusinessInfo(itemTortSubject)">
                                                    {{itemTortSubject}}
                                                    {{indexTortSubject==item.tortSubject.split(',').length-1?"":","}}
                                                </a>
                                            </span>
                                        </span>
                                        <fold-block v-if="item.tortSubject" :text="item.tortSubject" :allowClick="true" :maxNum="0" @clickEvent="getBusinessInfo"></fold-block>
                                    </Row>
                                    <Row v-else>
                                        <span class="textover result-text">销售商：</span>
                                    </Row>
                                </Col>
                                <Col span="8" v-if="item.tortType.indexOf('E')!=-1"><span class="textover result-text" :title="item.clueProduct?item.clueProduct.productUrl:''">产品链接：<a :href="item.clueProduct?item.clueProduct.productUrl:''" target="_blank">{{item.clueProduct?item.clueProduct.productUrl:""}}</a></span></Col>
                                <Col span="8" v-if="item.tortType.indexOf('S')!=-1"><span class="textover result-text" :title="(item.provinceName || '')+(item.cityName || '')+(item.areaName || '')+(item.address || '')">调查地址：{{item.provinceName || ""}}{{item.cityName || ""}}{{item.areaName || ""}}{{item.address || ""}}</span></Col>
                            </Row>
                            <Row style="line-height:30px;">
                                <Col span="8"><span class="textover result-text" :title="item.clueProduct?item.clueProduct.productName:''">产品名称：{{item.clueProduct?item.clueProduct.productName:""}}</span></Col>
                                <Col span="8">
                                    <Row v-if="item.manufacturerName">
                                        <span class="textover result-text block-shop-text">
                                            生产商：
                                            <span>
                                                <a v-for="(itemManufacture,indexManufacture) in item.manufacturerName.split(',')" href="javascript:void(0);" :key="itemManufacture" @click="getBusinessInfo(itemManufacture)">
                                                    {{itemManufacture}}
                                                    {{indexManufacture==item.manufacturerName.split(',').length-1?"":","}}
                                                </a>
                                            </span>
                                        </span>
                                        <fold-block :text="item.manufacturerName" :allowClick="true" :maxNum="0" @clickEvent="getBusinessInfo"></fold-block>
                                    </Row>
                                    <Row v-else>
                                        <span class="textover result-text">生产商：</span>
                                    </Row>
                                </Col>
                                <Col span="8">
                                    <span class="textover result-text">报备团队：
                                        <span v-if="item.teamType=='L'" class="icon-lawyer-01" :style="{color:'#105cfb'}"></span>
                                        <span v-if="item.teamType=='I'" class="icon-investigation-01" :style="{color:'#6666ff'}"></span>
                                        <span :style="{color:item.teamType=='L'?'#105cfb':'#6666ff'}">{{item.reportTeam}}</span>
                                    </span>
                                </Col>
                            </Row>
                            <Row style="line-height:30px;">
                                <Col span="8">平台审核：
                                    <Tag style="border:0;border-radius:11px;" :color="item.state=='P'?mainColor.warningColor:(item.state=='E'?mainColor.successColor:mainColor.errorColor)">
                                        {{item.state=='P'?'待审核':(item.state=='E'?'审核通过':'审核驳回')}}
                                    </Tag></Col>
                                <Col span="8" v-if="item.state==='E'||item.state==='R'"><span class="textover result-text" :title="item.note">[ 审核备注 ]：{{item.note}}</span></Col>
                                <Col span="8" v-if="item.custState&&item.custState=='CP'||item.custState=='CD'"><span class="textover result-text" :title="item.custNote">[ 客户{{item.custState=='CP'?'通过':'驳回'}} ]：{{item.custNote}}</span></Col>
                            </Row>
                        </div>
                        <div class="result-main-right">
                            <my-viewer
                                v-if="!tableLoading"
                                :width="80"
                                :height="80"
                                :listData="item.attachmentList"
                                :clueId="item.id"
                                :isSort="true"
                                style="margin-top:5px;"
                                :maxShowLength="3">
                            </my-viewer>
                        </div>
                    </div>
                </li>
                <li v-if="data.length==0" class="no-data-tips">暂无数据</li>
            </ul>
            </CheckboxGroup>
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

        <!-- 线索详情 -->
        <Drawer 
            title="线索详情" 
            v-model="clueDetailCtrl"
            width="800"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{clueDetail.code}}---{{clueDetail.missionName}}</span>
                <Dropdown @on-click="listOption(clueDetail.id,$event)" class="edit-icon" v-if="false&&clueDetail.state=='E'">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit">编辑</DropdownItem>
                        <DropdownItem name="agree" v-if="clueDetail.state=='P'">通过</DropdownItem>
                        <DropdownItem name="reject" v-if="clueDetail.state=='P'">驳回</DropdownItem>
                        <DropdownItem name="push" v-if="!clueDetail.custState">推送</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <clue-Info v-if="clueDetailCtrl" :clueDetail="clueDetail"></clue-Info>
            <test-purchase-form v-if="clueDetail.state!='P'&&clueDetail.isTestPurchase&&clueDetailCtrl" :clueDetail="clueDetail"></test-purchase-form>
        </Drawer>

        <Modal 
            v-model="businessModal" 
            width="80%"
            class="business-modal"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">工商信息</div>
            <div style="height:100%">
                <business-information :defaultObj="activeObj" v-if="businessModal"></business-information>
            </div>
        </Modal>

        <!-- 审核操作 -->
        <Modal
            v-model="examineCtrl"
            :title="title"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :label-width="80">
                <FormItem label="驳回原因" prop="reasonId" v-if="rejectCtrl"
                    :rules="[{required: true, message: '驳回原因不能为空', trigger: 'blur'}]">
                    <Select v-model="formValidate.reasonId" placeholder="请选择驳回原因" label-in-value @on-change="getLabel">
                        <Option v-for="item in clueRejectReasonArr" :value="item.id" :key="item.value">{{ item.nameZh }}</Option>
                    </Select>
                </FormItem>
                <FormItem label="备注" prop="examineRemark" 
                    :rules="[{required: false, message: '请填写备注', trigger: 'blur'},
                            { max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.examineRemark" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='请填写备注信息(不超过512个字符)'></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="examineSubmit('formValidate')">确认</Button>
                    <Button @click="examineCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>

        <!-- 推送 -->
        <Modal
            v-model="pushCtrl"
            title="推送链接"
            :width="400"
            :footer-hide="true">
                <Row style="line-height:30px;">
                    <Col>链接：{{link}}</Col>
                </Row>
                <Row style="line-height:30px;">
                    <Col>密码：{{verifyCode}}</Col>
                </Row>
                <Row style="text-align:center;">
                    <Button v-clipboard:copy="copyText"
                            v-clipboard:success="onCopy"
                            v-clipboard:error="onError" type="primary">复制</Button>
                </Row>
        </Modal>

        <!-- 案件详情 -->
        <case-detail v-if="caseInfoCtrl" :caseDetail="caseDetail" :optionsCtrl="false">
            <div class="close-icon" slot="close-icon" @click="caseInfoCtrl=false;"><Icon type="md-close" /></div>
        </case-detail>
    </div>
</template>
<script>
import clueInfo from './myManage/clueInfo';
import testPurchaseForm from './myManage/plugin/testPurchaseForm.vue';
import businessInformation from '@/view/relationship/plugin/businessInformation/businessInformation.vue';
import styles from "@/assets/globalStyle.scss";
import caseDetail from '../case/caseDetail.vue';
export default {
    data () {
        return {
            mainColor:styles,
            businessModal:false,
            single:false,
            searchForm:{
                keyword:'',
                startTime:'',
                endTime:'',
                custId:'',
                projId:'',
                missionId:'',
                teamId:'',
                province:'',
                city:'',
                area:'',
                custState:'',
                state:'',
                pushState:'',
                type:'',
                teamType:'',
                teamTypeQ:'',
                property:'',
                startSales:'',
                endSales:''
            },
            reportTime:[],
            custStateArr:[],
            stateArr:[],
            pushStateArr:[],
            tortTypeArr:[],
            tortSubjArr:[],
            teamTypeArr:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            clueDetailCtrl:false,
            indeterminate:false,
            isCheckedAll: false,
            pageIdList:[], //每一页的id选项
            idList:[], //选中的id列表
            examineCtrl:false,
            batchCtrl:false,
            formValidate:{
                examineRemark:'',
                reasonId:''
            },
            id:'',
            title:'审核通过',
            rejectCtrl:false,
            clueRejectReasonArr:[],
            clueDetail:'',
            pushCtrl:false,
            link:'',
            verifyCode:'',
            copyText:'',
            activeObj:"",
            caseInfoCtrl:false,
            caseDetail:'',
        }
    },
    props: [''],
    computed:{},
    methods: {
        storeName(item){
            switch (true){
                case (item.tortType==='E_EC'):
                    return this.$t('ec_channel.'+item.channelType)+'--' +item.storeName;
                case (item.tortType==='E_EC'&&item.channelType==='TT'):
                    return this.$t('ec_channel.'+item.channelType)+'--' +item.storeName +'--'+item.dispenser;
                default :
                    return item.storeName;
            }
        },
        headerOption(name){
            this.$refs['formValidate'].resetFields();
            switch (name) {
                case 'agree': 
                    this.examineCtrl = true;
                    this.rejectCtrl = false;
                    this.title = '审核通过';
                    this.batchCtrl = true;
                    break;
                case 'reject': 
                    this.examineCtrl = true;
                    this.rejectCtrl = true;
                    this.title = '审核驳回';
                    this.batchCtrl = true;
                    break;
                case 'push': 
                    this.batchCtrl = true;
                    this.getPushLink();
                    break;
            }
        },
        changeDropDown(name){
            console.log(name)
            if(name=='default'||name==undefined){
                this.searchForm.sortState = '';
                this.searchForm.orderState = '';
            }else{
                let arr = name.split('');
                if(arr.length>1){
                    this.searchForm.sortState = name.split('')[0];
                    this.searchForm.orderState = name.split('')[1];
                }else{
                    this.searchForm.sortState = name.split('')[0];
                    this.searchForm.orderState = '';
                }
            }
            this.getData()
        },
        listOption(id,name){
            if(typeof name==='number'){
                this.getCaseDetail(name);
            }
            this.$refs['formValidate'].resetFields();
            this.id = id;
            this.batchCtrl = false;
            switch (name) {
                case 'agree': 
                    this.examineCtrl = true;
                    this.title = '审核通过';
                    this.rejectCtrl = false;
                    break;
                case 'reject': 
                    this.examineCtrl = true;
                    this.title = '审核驳回';
                    this.rejectCtrl = true;
                    break;
                case 'push':
                    this.getPushLink();
                    break;
            }
        },
        //获取案件详情
        getCaseDetail(id){
            let url = '/business/case/'+id;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.caseDetail = res.data;
                    this.caseInfoCtrl = true;
                }
            })
        },
        getInputValue(data,name){
            this.searchForm[name] = data;
        },
        examineSubmit(){
            let url = '/business/clue/audit';
            let ajaxData = {
                clueIds:[],
                remark:this.formValidate.examineRemark
            }
            if(this.rejectCtrl){
                url = '/business/clue/reject';
                ajaxData.reasonId = this.formValidate.reasonId;
            }
            if(this.batchCtrl){
                ajaxData.clueIds = this.idList
            }else{
                ajaxData.clueIds.push(this.id);
            }
            this.$patch(url,ajaxData).then(res=>{
                this.examineCtrl = false;
                if(res.code===0){
                    this.$Message.success('操作成功!');
                    this.idList = [];
                    this.getData();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getPushLink(){
            let url = '/business/clue/push';
            let clueIds = [];
            if(this.batchCtrl){
                clueIds = this.idList
            }else{
                clueIds.push(this.id);
            }
            this.$patch(url,clueIds).then(res=>{
                if(res.code===0){
                    this.pushCtrl = true;
                    this.link = res.data.url;
                    this.verifyCode = res.data.verifyCode;
                    this.copyText = '链接：'+this.link+' '+'密码：'+this.verifyCode;
                    this.idList = [];
                    this.id = ''
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //复制链接
        onCopy(e){
            console.log(e);
            this.pushCtrl = false;
            this.$Message.success('复制成功！');
            if(this.idList.length>0){
                this.idList.splice(0,this.idList.length);
            }
            this.isCheckedAll = false;
        },
        // 复制失败
        onError(e){
            this.$Message.error('复制失败!')
        },
        getClueDetail(id){
            let url = '/business/clue/view/'+id;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.clueDetailCtrl = true;
                    this.clueDetail = res.data;
                    this.clueDetailCtrl = true;
                }
            })
        },
        getLabel(data){
            if(!!data){
                this.formValidate.examineRemark = data.label;
            }
        },
        getData(){
            let url = '/business/clues';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize
            };
            Object.assign(ajaxData,this.searchForm);
            if(ajaxData.type=='onLine'){
                ajaxData.onLine = 'E_';
            }else if(ajaxData.type=='offLine'){
                ajaxData.offLine = 'S_';
            }
            delete ajaxData.type;
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                console.log(res)
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
                //查看已经勾选项,默认勾选
                this.pageIdList = this.data.map(item=>{
                    return item.id;
                })
                this.judgeChecked();
            })
        },
        exportExcel(){
            let url = '/business/clues/export';
            let ajaxData = {};
            Object.assign(ajaxData,this.searchForm);
            if(ajaxData.type=='onLine'){
                ajaxData.onLine = 'E_';
            }else if(ajaxData.type=='offLine'){
                ajaxData.offLine = 'S_';
            }
            delete ajaxData.type;
            console.log(ajaxData)
            this.$exportGet(url,ajaxData).then(res=>{
                
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
            this.clueDetailCtrl = false;
            this.table.pageNum = 1;
            this.getData();
            //刷新线索待处理总数徽标
            this.$store.dispatch('getUnauditCluesCount');
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = '';
            this.reportTime = [];
            this.searchForm.startTime = '';
            this.searchForm.endTime = '';
            this.searchForm.province = '';
            this.searchForm.city = '';
            this.searchForm.area = '';
            this.$refs.cityCascader.clearSelect();
            this.searchForm.custId = "";
            this.searchForm.projId = '';
            this.searchForm.missionId = '';
            this.searchForm.teamId = '';
            this.searchForm.custState = '';
            this.searchForm.state = '';
            this.searchForm.pushState = '';
            this.searchForm.type = '';
            this.searchForm.teamType = '';
            this.searchForm.teamTypeQ = '';
            this.searchForm.property = '';
            this.$refs.inputStartSales.clearValue();
            this.$refs.inputEndSales.clearValue();
            this.$refs.customerSelect.clearSelected();
            this.$refs.projectSelect.clearSelected();
            this.$refs.taskSelect.clearSelected();
            this.$refs.teamSelect.clearSelected();
            this.reloadTable();
        },
        //获取截止时间
        getReportTime(data){
            console.log(data)
            this.searchForm.startTime = data[0];
            this.searchForm.endTime = data[1];
        },
        //获取委托人
        getCustomerId(data){
            this.searchForm.custId = data.id;
        },
        //选择所属项目
        getProjectId(data){
            this.searchForm.projId = data.id;
        },
        //选择任务
        getTaskId(data){
            this.searchForm.missionId = data.id;
        },
        //选择团队
        getTeamId(data){
            if(data.id){
                let str = data.id;
                let idStr = str.slice(0,str.length-1);
                this.searchForm.teamId = idStr;
                this.searchForm.teamType = data.platformSourceType;
            }else{
                this.searchForm.teamId = '';
                this.searchForm.teamType = '';
            }
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
        /*************全选Begin***************/
        //选中多选框
        checkOption(id){
            let idIndex = this.idList.indexOf(id)
            if (idIndex >= 0) {//如果已经包含就去除
                this.idList.splice(idIndex, 1)
            } else {//如果没有包含就添加
                this.idList.push(id)
            }
        },
        //全选
        checkAll(){
            if(this.isCheckedAll){
                if(this.idList.length>0){
                    for(var i=0;i<this.pageIdList.length;i++){
                        for(var j=0;j<this.idList.length;j++){
                            if(this.pageIdList[i]==this.idList[j]){
                                break;
                            }else if(this.pageIdList[i]!=this.idList[j]&&j==this.idList.length-1){
                                this.idList.push(this.pageIdList[i])
                            }
                        }
                    }
                }else{
                    this.pageIdList.forEach((item,index)=>{
                        this.idList.push(item)
                    })
                }
            }else{
                for(var i=0;i<this.pageIdList.length;i++){
                    for(var j=0;j<this.idList.length;j++){
                        if(this.pageIdList[i]==this.idList[j]){
                            this.idList.splice(j,1);
                        }
                    }
                }
            }
        },
        //判断是否是全选
        judgeChecked(){
            let count = 0;
            for(var i=0;i<this.pageIdList.length;i++){
                for(var j=0;j<this.idList.length;j++){
                    if(this.pageIdList[i]==this.idList[j]){
                        count++;
                    }
                }
            }
            // console.log(count)
            if(count!=0&&count==this.pageIdList.length){
                this.isCheckedAll = true;
                this.indeterminate = false;
            }else if(count!=0&&count<this.pageIdList.length){
                this.isCheckedAll = false;
                this.indeterminate = true;
            }else{
                this.isCheckedAll = false;
                this.indeterminate = false;
            }
        },
        /*************全选End***************/
        getBusinessInfo(name){
            let url = '/base/company/one-company-information';
            let ajaxData = {
                companyName:name
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code===0){
                    if(!res.data){
                        this.$Message.error("未拉取到该主体的工商信息！");
                        return
                    }
                    this.activeObj = {
                        creditCode:(res.data.creditCode?res.data.creditCode.trim():""),
                        name:res.data.compayName || ""
                    }
                    this.businessModal = true;
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.custStateArr = await this.common.getDictionaryItems('clue_cust_audit_state');
            this.stateArr = await this.common.getDictionaryItems('clue_state');
            this.pushStateArr = await this.common.getDictionaryItems('clue_push_state');
            this.tortTypeArr = await this.common.getDictionaryItems('tort_type');
            this.clueRejectReasonArr = await this.common.getDictionaryItems('clue_reject_reason');
            this.tortSubjArr = await this.common.getDictionaryItems('tort_subj_property');
            this.teamTypeArr = await this.common.getDictionaryItems('team_type');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){
        this.getData();
    },
    activated(){
        this.getData();
    },
    updated(){},
    components: {
        clueInfo,
        testPurchaseForm,
        businessInformation,
        caseDetail
    },
    watch: {
        idList(val,oldval){
            console.log(val)
            this.judgeChecked()
        }
    }
}
</script>
<style scoped lang="sass">
@import "./myManage/clue.scss";
</style>
<style lang="scss">
.ivu-select-dropdown.dropdown-style{
    width:auto;
}
</style>