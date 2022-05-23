<template>
    <div class="customer-manage have-drawer-style relationship">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button v-if="false" @click="addDrawerCtrl=true" type="primary">新增渠道</Button>
                    <Button v-permission="['market-center:channel:all:manage-']" :disabled="idList.length==0" @click="transferCustomerCtrl=true">转移</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="keyword" placeholder="渠道名称" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                合作进度
                            </Col>
                            <Col span="18">
                                <Select v-model="coopProgress" style="width:190px;" clearable>
                                    <Option v-for="item in newCoopProgressArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                到期时间
                            </Col>
                            <Col span="18">
                                <DatePicker v-model="cooperationDate" type="daterange" placement="bottom-end" @on-change="getTime" placeholder="请选择时间" style="width:190px"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                渠道来源
                            </Col>
                            <Col span="18">
                                <Select v-model="customerSource" style="width:190px;" clearable>
                                    <Option v-for="item in customerSourceArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                所属行业
                            </Col>
                            <Col span="18">
                                <mySelect ref="industrySelect"
                                    :path="'/base/industry'"
                                    :placeholder="'请选择行业名称'"
                                    :placeholderInput="'请输入行业名称'"
                                    :keyName="'industryName'"
                                    @getValue="getIndustryId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                所属区域
                            </Col>
                            <Col span="18">
                                <City ref="transEvent" v-on:listenCity="getCity" style="width:190px;"></City>
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
                <checkbox-table :columns="columns" :data="customeList" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
                    <template slot-scope="{ row, index }" slot="more-actions">
                        <Dropdown @on-click="option(row,$event)" v-permission="['market-center:channel:all:manage-']">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="edit">编辑</DropdownItem>
                                <DropdownItem name="followUp">发起跟进</DropdownItem>
                                <DropdownItem name="manage">管理</DropdownItem>
                                <DropdownItem v-if="coopProgressState(row.coopProgress)" name="account">账号管理</DropdownItem>
                                <DropdownItem name="termination" v-if="row.coopProgress.indexOf('T')==-1">终止</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </checkbox-table>
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

        <!-- 新增渠道抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">新增渠道</div>
            <Row class="detail-header">
                <span>基本信息</span>
            </Row>
            <editChannel v-if="addDrawerCtrl" @closeDrawer="closeDrawer"></editChannel>
        </Drawer>

        <!-- 管理抽屉 -->
        <Drawer 
            width="800" 
            v-model="manageDrawerCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{custName}}</span>
                <Dropdown transfer @on-click="option({id:id},'termination')" class="edit-icon"  
                    v-if="custCoopProgress&&custCoopProgress.indexOf('T')===-1" v-permission="['market-center:channel:all:manage-']">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="delete">终止</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <channel-manage v-if="manageDrawerCtrl" :id="id" 
                :editFlag="isEditDetail" :followFlag="followFlag" @closeDrawer="closeDrawer"></channel-manage>
        </Drawer>

        <!-- 转移渠道 -->
        <Modal
            v-model="transferCustomerCtrl"
            title="转移渠道"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="transferCustomer"
                @getValue="getTreeValue"
                :single="true"
                :rightHide="false"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="transferCustomerSubmit()">确认</Button>
                <Button @click="transferCustomerCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <Message ref="message" :iconType="'error'" :message="message"></Message>

        <!-- 终止客户 -->
        <Modal
            v-model="terminationCtrl"
            title="终止客户"
            :width="350"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate">
                <FormItem label="终止方">
                    <RadioGroup v-model="terminationObject">
                        <Radio label="andun">安盾</Radio>
                        <Radio label="customer">客户</Radio>
                    </RadioGroup>
                </FormItem>
                <FormItem label="终止原因" prop="terminateReason" 
                    :rules="[{required: true, message: '请填写终止原因', trigger: 'blur'},
                            { max:512,message:'不能超过512个字符',trigger:'blur'}]">
                    <Input v-model.trim="formValidate.terminateReason" type="textarea" :autosize="{minRows: 3,maxRows: 8}" placeholder='终止原因(不超过512个字符)'></Input>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" @click="terminationCustomerSubmit('formValidate')">确认</Button>
                    <Button @click="terminationCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
import editChannel from "@/view/relationship/channelManage/channelForm";
import channelManage from "../plugin/channelManage.vue";
import Message from '@/components/common/message/message';
export default {
    data () {
        return {
            id:'',
            isEditDetail:false,
            addDrawerCtrl:false,
            manageDrawerCtrl:false,
            custName:'',
            columns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title:"渠道名称",
                    key:"name",
                    width:200,
                    render:(h,params)=>{
                        return h('Tooltip', {
                            props: { placement: 'right' },
                            style:{width:'100%'},
                            class:'textover'
                        }, [
                            h('span', { 
                                class:['textover','customer-name'],
                                on:{
                                    click:()=>{
                                        this.custName = params.row.name;
                                        this.custCoopProgress = params.row.coopProgress;
                                        this.getCustomerDetail(params.row.id,'info');
                                    }
                                }
                            },params.row.name),
                            h('span', { 
                                slot: 'content', 
                                style: { whiteSpace: 'normal', wordBreak: 'break-all' }
                            },params.row.name)
                        ])
                    }
                },
                {
                    title:"合作进度",
                    key:"coopProgressName"
                },
                {
                    title:"合作到期时间",
                    key:"expireDate"
                },
                {
                    title:"是否维权",
                    key:"safeguardLegelRightsName"
                },
                {
                    title:"渠道来源",
                    key:"sourceName"
                },
                {
                    title:"所属行业",
                    key:"industryName",
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.industryName
                            },
                        },params.row.industryName)
                    }
                },
                {
                    title:"所属区域",
                    key:"province",
                    width:150,
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
                    title:"操作",
                    width:150,
                    slot:'action'
                },
            ],
            customeList:[],
            searchBoxCtrl:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            tableLoading:false,
            followFlag:'',
            idList:[],
            keyword:'',  //关键字
            coopProgress:'',
            coopProgressArr:[],//合作进度
            customerSource:'',
            customerSourceArr:[], //渠道来源
            industry:'',
            cooperationDate:[], //合作期限
            province:'',
            city:'',
            area:'',
            transferCustomerCtrl:false,
            personInChargeArr:[],//负责人list
            message:'',
            terminationCtrl:false,
            formValidate:{
                terminateReason:''
            },
            terminationObject:'andun',
            custCoopProgress:'',
            coopStartDate:'',
            coopEndDate:''
        }
    },
    props: [''],
    methods: {
        coopProgressState(data){
            let bool ;
            switch (true) {
                case (data=='P'||data=='I'): bool = false; break;
                case (data=='R'||data=='S'||data=='E'||data=='T'): bool = true; break;
            }
            return bool;
        },
        getTime(date){
            this.coopStartDate = date[0];
            this.coopEndDate = date[1];
        },
        //获取列表
        getData(){
            let url = '/base/customers';
            let ajaxData = {
                type:'C',
                name:this.keyword,
                coopProgress:this.coopProgress,
                coopStartDate:this.coopStartDate,
                coopEndDate:this.coopEndDate,
                source:this.customerSource,
                industryId:this.industry,
                province:this.province,
                city:this.city,
                area:this.area, 
                current: this.table.pageNum,
                size: this.table.pageSize
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.customeList = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },
        //关闭侧边栏
        closeDrawer(reload){
            this.isEditDetail = false;
            this.addDrawerCtrl = false;
            if(reload){
                this.manageDrawerCtrl = false;
                this.reloadTable();
            }
        },
        //获取渠道详情
        getCustomerDetail(id,type){
            this.id = id;
            this.manageDrawerCtrl = true;
            this.isEditDetail = type==='info'?false:true;
            this.followFlag = 'customerInfo';
        },
        //获取负责人的id
        getTreeValue(data){
            this.personInChargeArr = [];
            if(data){
                this.personInChargeArr.push(data.id)
            }
        },
        //转移渠道
        transferCustomerSubmit(){
            if(this.personInChargeArr.length==0){
                this.message = '请选择负责人！';
                this.$refs.message.show();
                return;
            }
            let url = '/base/customer/transfer';
            let ajaxData = {
                principalIds:this.personInChargeArr,
                custIds:this.idList
            }
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.$Message.success('操作成功！');
                    this.transferCustomerCtrl = false;
                    this.$refs.transferCustomer.clearSelect();
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //列表排序change方法
        sortChange(data){
            console.log(data);
        },
        option(row,name){
            this.id = row.id;
            if(name!=='termination'){
                this.custCoopProgress = row.coopProgress;
            }
            this.$refs['formValidate'].resetFields();
            switch (name) {
                case 'edit':
                    this.custName = row.name;
                    this.getCustomerDetail(row.id,'edit');
                    break;
                case 'followUp': 
                    this.followUp(row);
                    break;
                case 'manage': 
                    this.manage(row);
                    break;
                case 'account': 
                    this.accountManage(row)
                    break;
                case 'termination':
                    this.terminationCtrl = true;
                    break;
            }
        },
        //发起跟进
        followUp(row){
            this.custName = row.name;
            this.id = row.id;
            this.followFlag = 'followRecord';
            this.manageDrawerCtrl = true;
        },
        //管理
        manage(row){
            this.custName = row.name;
            this.id = row.id;
            this.followFlag = 'customerInfo';
            this.getCustomerDetail(row.id,"info");
        },
        //创建账号
        accountManage(row){
            this.custName = row.name;
            this.id = row.id;
            this.manageDrawerCtrl = true;
            this.followFlag = 'accountCard';
        },
        //终止
        terminationCustomerSubmit(){
            let url;
            if(this.terminationObject==='andun'){
                url = '/base/customer/terminate/andun';
            }else{
                url = '/base/customer/terminate';
            }
            this.formValidate.id = this.id;
            this.$refs['formValidate'].validate((valid) => {
                if(valid){
                    this.$patch(url,this.formValidate).then(res=>{
                        if(res.code===0){
                            this.terminationCtrl = false;
                            this.manageDrawerCtrl = false;
                            this.$Message.success('操作成功！');
                            this.reloadTable();
                        }else{
                        this.$Message.error(res.message); 
                        }
                    })
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
            this.keyword = '';
            this.province = '';
            this.city = '';
            this.area = '';
            this.$refs.transEvent.clearSelect();
            this.coopProgress = '';
            this.customerSource = '';
            this.industry = '';
            this.$refs.industrySelect.clearSelected();
            this.cooperationDate = [];
            this.coopStartDate = '';
            this.coopEndDate = '';
            this.reloadTable();
        },
        // 获取行业id
        getIndustryId(data){
            this.industry = data.id;
        },
        // 搜索条件省市区接口
        getCity(data){
            let area;
            if(data.length!=0){
                if(data.length==1){
                    this.province = data[0].value;
                    this.city = '';
                    this.area = '';
                    area = data[0].label;
                }else if(data.length==2){
                    this.province = data[0].value;
                    this.city = data[1].value;
                    this.area = '';
                    area = data[0].label+data[1].label;
                }else if(data.length==3){
                    this.province = data[0].value;
                    this.city = data[1].value;
                    this.area = data[2].value;
                    area = data[0].label+data[1].label+data[2].label;
                }
            }else{
                this.province = '';
                this.city = '';
                this.area = '';
                area = '';
            }
        },
        /*--------------------start---------------------*/
        getIdList(list){
            this.idList = list.map(item=>{
                return item.id
            })
        },
        /*--------------------end---------------------*/
        //获取字典数据接口
        async getDictionary(){
            this.coopProgressArr = await this.common.getDictionaryItems('coop_progress');
            this.customerSourceArr = await this.common.getDictionaryItems('customer_source');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary()
    },
    activated(){
        this.reloadTable();
    },
    mounted(){
        this.getData()
    },
    computed:{
        newCoopProgressArr(){
            let newArr = [];
            this.coopProgressArr.forEach((item,index)=>{
                if(item.value=="TC" || item.value=="TA"){return}
                if(item.value=="T"){
                    item.nameZh = "已终止";
                    newArr.push(item);
                    return
                }
                newArr.push(item);
            })
            return newArr
        }
    },
    updated(){},
    components: {
        editChannel,
        channelManage,
        Message
    },
    watch: {
        
    }
}
</script>
<style lang="sass" scoped>
@import "../customerManage/myClient"
@import "../customerManage/drawerManage"
</style>