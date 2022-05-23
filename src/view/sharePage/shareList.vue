<template>
    <div class="share-page my-clue-result">
        <Header :style="{position: 'relative', top:0, width: '100%',minWidth: '1024px'}">
            <!-- 切换按钮 -->
            <div class="logo-large-icon">
                <div class="fl logo-div">
                    <img :src="imgLogo" key="max-logo" />
                    <p>安盾管理平台</p>
                </div>
            </div>
        </Header>
        <div style="padding:15px 15px 0px 15px;height:calc(100% - 50px)">
        <div class="share-container">
            <div class="card-style">
                <!-- 批量操作区域 -->
                <Row class="header-common-right-box">
                    <Col style="float:left;margin-left:10px;">
                        <Checkbox v-model="isCheckedAll" :indeterminate="indeterminate" @on-change="checkAll"></Checkbox>
                        <Dropdown @on-click="headerOption">
                            <Button style="padding:0 15px">
                                批量操作
                                <Icon type="ios-arrow-down"></Icon>
                            </Button>
                            <DropdownMenu slot="list">
                                <DropdownItem :disabled="idList.length==0" name="agree">批量通过</DropdownItem>
                                <DropdownItem :disabled="idList.length==0" name="reject">批量驳回</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </Col>
                    <!-- 筛选项 -->
                    <Col class="filter-col search-box">
                        <Input v-model="searchForm.keyword" placeholder="请输入关键字" style="width: 250px;" 
                                @on-enter="reloadTable">
                            <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                        </Input>
                        <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                        <div class="container" v-show="searchBoxCtrl">
                            <Row class="header-common-right-box">
                                <Col span="6" class="header-common-col">
                                    平台审核
                                </Col>
                                <Col span="18">
                                    <Select v-model="searchForm.state" placeholder="请选择客户审核状态">
                                        <Option v-for="item in stateArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
                <ul class="list">
                    <Spin fix v-if="tableLoading"></Spin>
                    <li v-for="(item,index) in data" :key="index">
                        <div class="result-title">
                            <Checkbox :value="idList.indexOf(item.id)>=0?true:false" @on-change="checkOption(item.id)"></Checkbox>
                            <span class="result-time">{{item.submitTime.slice(0,10)}}</span>
                            <span class="result-name" @click="getClueDetail(item.id)">
                                <!-- <span class="push-icon" v-if="item.custState">推</span> -->
                                <span class="text-icon" v-if="item.isTestPurchase">测</span>
                                <span class="result-code">[编号：{{item.code}}]</span>
                            </span>
                            <span class="result-title-option">
                                <Dropdown @on-click="listOption(item.id,$event)" v-if="item.custState=='C'">
                                    <a href="javascript:void(0)">
                                        <Icon type="ios-more" size="20"/>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="agree">通过</DropdownItem>
                                        <DropdownItem name="reject">驳回</DropdownItem>
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
                                        <span v-if="item.teamType=='I'" class="icon-investigation-01" :style="{color:mainColor.globalMainColor}"></span>
                                        <span v-if="item.teamType=='L'" class="icon-lawyer-01" :style="{color:mainColor.globalMainColor}"></span>
                                        {{item.reportTeam}}
                                    </span>
                                </Col>
                                </Row>
                                <Row style="line-height:30px;">
                                    <Col span="8">平台审核：
                                        <Tag style="border:0;border-radius:11px;" :color="item.state=='P'?mainColor.warningColor:(item.state=='E'?mainColor.successColor:mainColor.errorColor)">
                                            {{item.state=='P'?'待审核':(item.state=='E'?'审核通过':'审核驳回')}}
                                        </Tag></Col>
                                    <Col span="8" v-if="item.state==='E'||item.state==='R'"><span class="textover result-text" :title="item.note">[ 审核备注 ]：{{item.note}}</span></Col>
                                    <Col span="8" v-if="item.custState&&item.custState.indexOf('C')!=-1"><span class="textover result-text" :title="item.custNote">[ 客户{{item.custState=='CP'?'通过':'驳回'}} ]：{{item.custNote}}</span></Col>
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
                </ul>
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
                    <span>{{clueDetail.code}}</span>
                    <Dropdown @on-click="listOption(clueDetail.id,$event)" class="edit-icon" v-if="clueDetail.custState=='C'">
                        <a href="javascript:void(0)">
                            <Icon type="ios-more" size="20"/>
                        </a>
                        <DropdownMenu slot="list">
                            <DropdownItem name="agree">通过</DropdownItem>
                            <DropdownItem name="reject">驳回</DropdownItem>
                        </DropdownMenu>
                    </Dropdown>
                </div>
                <clue-Info :clueDetail="clueDetail"></clue-Info>
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
                    <FormItem label="审核原因" prop="reasonId" v-if="!rejectCtrl"
                        :rules="[{required: true, message: '审核原因不能为空', trigger: 'blur'}]">
                        <Select v-model="formValidate.reasonId" placeholder="请选择审核原因" label-in-value @on-change="getLabel">
                            <Option v-for="item in clueAgreeReasonArr" :value="item.id" :key="item.value">{{ item.nameZh }}</Option>
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
            <!-- 输入验证码 -->
            <Modal
                v-model="linkCtrl"
                title="请输入提取码"
                :width="350"
                :footer-hide="true">
                <Row>
                    <Col>
                        <Input v-model="verifyCode" placeholder="请输入提取码"></Input>
                    </Col>
                    <Col style="text-align:center;margin-top:20px;">
                        <Button type="primary" @click="getData">打开链接</Button>
                    </Col>
                </Row>
            </Modal>
        </div>
        </div>
    </div>
</template>
<script>
import clueInfo from './../clue/myManage/clueInfo';
import businessInformation from '@/view/relationship/plugin/businessInformation/businessInformation.vue';
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            imgLogo:require('@/assets/images/logoComputer.png'),
            mainColor:styles,
            businessModal:false,
            single:false,
            searchForm:{
                keyword:'',
                state:'',
            },
            stateArr:[],
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
            clueAgreeReasonArr:[],
            clueDetail:'',
            linkCtrl:true,
            verifyCode:'',
            activeObj:""
        }
    },
    props: [''],
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
            }
        },
        listOption(id,name){
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
            }
        },
        examineSubmit(){
            let url = '/business/clue/cust/audit';
            let ajaxData = {
                clueIds:[],
                remark:this.formValidate.examineRemark,
                reasonId:this.formValidate.reasonId
            }
            if(this.rejectCtrl){
                url = '/business/clue/cust/reject';
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
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        getClueDetail(id){
            this.clueDetailCtrl = true;
            let url = '/business/clue/view/'+id;
            this.$get(url).then(res=>{
                if(res.code===0){
                    this.clueDetail = res.data;
                }
            })
        },
        getLabel(data){
            this.formValidate.examineRemark = data.label;
        },
        getData(){
            let url = '/business/clues/customer/push/list';
            let ajaxData = {
                verifyCode:this.verifyCode,
                current: this.table.pageNum,
                size: this.table.pageSize
            };
            Object.assign(ajaxData,this.searchForm);
            console.log(ajaxData)
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                console.log(res)
                this.linkCtrl = false;
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
            this.searchForm.state = '';
            this.reloadTable();
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
        getDictionaryItems(code){
            let _this = this;
            let url = '/base/dictionaryItem/open/'+code;
            return new Promise(function(resolve,reject){
                _this.$get(url).then(res=>{
                    if(res.code==0){
                        resolve(res.data)
                    }else{
                        reject(res)
                    }
                })
            })
        },
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
            this.stateArr = await this.getDictionaryItems('clue_state');
            this.clueRejectReasonArr = await this.getDictionaryItems('cust_reject');
            this.clueAgreeReasonArr = await this.getDictionaryItems('cust_agree');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        console.log(111)
    },
    mounted(){
        
    },
    updated(){},
    components: {
        clueInfo,
    },
    watch: {
        idList(val,oldval){
            console.log(val)
            this.judgeChecked()
        }
    }
}
</script>
<style scoped lang="scss">
@import "../clue/myManage/clue.scss";
@import "./shareList.scss";
</style>
