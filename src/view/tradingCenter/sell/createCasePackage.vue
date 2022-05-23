<template>
    <div>
        <Form :model="formData" ref="formData" :label-width="80">
            <FormItem label="出售类型" prop="type">
                <RadioGroup v-model="formData.type">
                    <Radio label="P" :disabled="!opertePermission && formData.type=='A'">公共包</Radio>
                    <Radio label="A" :disabled="!opertePermission && formData.type=='P'">指派包</Radio>
                </RadioGroup>
            </FormItem>
            <FormItem label="案件区域" prop="location" v-if="formData.type=='P'"
                :rules="[{required: true,type:'array',message: '调查区域不能为空',trigger: 'blur' }]">
                <chooseCity v-show="detailsCtrl && opertePermission" v-on:listenLocation="getLocation" :defaultLocation="defaultLocation"></chooseCity>
                <Row v-show="!opertePermission">{{location}}</Row>
            </FormItem>
            <FormItem label="起批量" prop="batchNum" v-if="formData.type=='P'"
                :rules="[{validator:caseNumValid,trigger:'blur'}]">
                <InputNumber :disabled="!opertePermission" v-model="formData.batchNum" style="width:100%" :min="0" :max="99999999" placeholder="请输入起批量"></InputNumber>
            </FormItem>
            <FormItem label="指派团队" prop="teamId" v-if="formData.type=='A'"
                :rules="[{required:true,type:'number',message:'指派团队不能为空',trigger:'change'}]">
                <mySelect v-show="opertePermission" ref="lawyerSelect" style="width:100%"
                    :path="'/base/lawyer-teams'"
                    :keyName="'name'"
                    :defaultObj="defaultlawyerTeam"
                    :width="190"
                    placeholder="请选择律师团队"
                    @getValue="getLawyerTeamsId">
                </mySelect>
                <Row v-show="!opertePermission">{{dataList.caseSaleBagLicensor && dataList.caseSaleBagLicensor.teamName}}</Row>
            </FormItem>
            <FormItem label="截止时间" prop="dueTime" v-if="formData.type=='A'"
                :rules="[{validator:dueTimeValid,trigger:'change'}]">
                <DatePicker type="datetime" :disabled="!opertePermission"
                    :options="dateOption" :value="formData.dueTime" format="yyyy-MM-dd HH:mm"
                    @on-change="getEndDate" placeholder="请选择购买截止时间" style="width: 100%"></DatePicker>
            </FormItem>
            <FormItem label="备注信息" prop="remark">
                <Input :disabled="!opertePermission" v-model.trim="formData.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注信息"></Input>
            </FormItem>
            <Row class="total-row">此案件中包含&nbsp;
                <strong class="error-color">{{data ? data.length:0}}</strong>&nbsp;个案件（总价：
                <span class="money">{{common.formateNumber(totalFee.toFixed(2))}}</span>元 &nbsp;定金：<span class="money">{{common.formateNumber((totalFee*depositScale).toFixed(2))}}</span>元）
                <Button class="add-case-btn" type="primary" v-if="operation=='edit'" @click="addCaseModal=true">添加案件</Button>
            </Row>
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action" v-if="row.modifyPermission || row.removePermission">
                        <Dropdown @on-click="option(index,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="editFee" v-if="row.modifyPermission">修改附加费</DropdownItem>
                                <DropdownItem name="delete" v-if="row.removePermission">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </template>
                </Table>
            </Row>
            <Row class="detail-btn-box btn-row">
                <Button type="primary" style="margin-right:10px;" v-if="operation=='add'" :disabled="isSubmit" @click="submitNewBag('P')">存为草稿</Button>
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewBag('E')">发布</Button>
                <Button @click="$emit('reloadList',false)">取消</Button>
            </Row>
        </Form>
        <!-- 修改附加费 -->
        <Modal 
            v-model="surchargeModal" 
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">修改附加费</div>
            <Form :model="formSurcharge" ref="formSurcharge" v-if="surchargeModal">
                <Row class="content">
                    <FormItem label="" :label-width=0>
                        <CheckboxGroup v-model="collection" @on-change="reCalculate">
                            <Checkbox style="width:100%;" :label="'baseFee'" v-if="false">
                                <span class="checkbox-label">基础费：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.baseFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'capitalExcessFee'" v-if="tortCategory=='1'">
                                <span class="checkbox-label">注册资本超过500W：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.capitalExcessFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'disclosureTimelyFee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">披露及时奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.disclosureTimelyFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'evidFee'" v-show="false">
                                <span class="checkbox-label">公证费：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.evidFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'evidTimelyFee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">取证及时奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.evidTimelyFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'firstReportManufactureFee'">
                                <span class="checkbox-label">首报生产商费：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.firstReportManufactureFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'infringProductFee'">
                                <span class="checkbox-label">侵权产品费：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.infringProductFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'notarialTimelyFee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">出书及时奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.notarialTimelyFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'salesRewardFee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">销售额奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.salesRewardFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'salesVolumeExceed10Fee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">销量超过10W奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.salesVolumeExceed10Fee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'salesVolumeExceed30Fee'" v-if="tortCategory=='2'">
                                <span class="checkbox-label">销量超过30W奖励：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.salesVolumeExceed30Fee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'shoppingFee'">
                                <span class="checkbox-label">购物费：</span>
                                <span class="checkbox-text">{{common.formateNumber(surchargeObj.shoppingFee)}}</span>
                            </Checkbox>
                            <Checkbox style="width:100%;" :label="'otherFee'">
                                <span class="checkbox-label">其他费用：</span>
                                <span class="checkbox-text">
                                    <my-input ref="myInput" class="num-input"
                                        appendText="￥" 
                                        :defaultData="defaultOtherFee"
                                        :toFixed="2"
                                        @getValue="getInputValue($event)"
                                    ></my-input>
                                </span>
                            </Checkbox>
                        </CheckboxGroup>
                    </FormItem>
                    <FormItem label="" prop="remark" :label-width=0 v-if="collection.indexOf('otherFee')!=-1"
                        :rules="[{required:true,message:'备注不能为空',trigger:'blur'},{max:512,message:'长度不能超过512个字符',trigger:'blur'}]">
                        <Input v-model.trim="formSurcharge.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请输入备注"></Input>
                    </FormItem>
                    <FormItem label="" :label-width=0 class="total-surcharge">
                        附加费合计：<strong class="checkbox-text">{{common.formateNumber(surchargeFee.toFixed(2))}}</strong>
                    </FormItem>
                </Row>
            </Form>
            <Row class="btn-row"><Button type="primary" @click="resetSurcharge">确定</Button></Row>
        </Modal>
        <!-- 添加案件 -->
        <Modal 
            v-model="addCaseModal" 
            :width="750"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">案件列表</div>
            <add-case-component v-if="addCaseModal" :defaultObjList="defaultCaseList" @refreshList="getIdList($event)"></add-case-component>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import addCaseComponent from './addCaseModal.vue';
import surchargeFeeExpand from './surchargeFeeExpand.vue';
export default {
    data () {
        const caseNumValid = (rule,value,callback)=>{
            if(value!==0){
                if(!!value){
                    if(!(/(^[1-9]\d*$)/.test(value))){
                        return callback(new Error('起批量为正整数'))
                    }
                    if(Number(value)>this.data.length){
                        return callback(new Error('起批量不能超过案件总数'))
                    }
                }
            }
            callback()
        }
        const dueTimeValid = (rule,value,callback)=>{
            if(!value){
                return callback(new Error('截止时间不能为空'))
            }else if(value){
                if(new Date(value).getTime() - Date.now() < 0){
                    return callback(new Error('截止时间应该晚于今天'))
                }
            }
            callback();
        }
        return {
            caseNumValid:caseNumValid,
            dueTimeValid:dueTimeValid,
            styles:styles,
            formData:{
                type:'P',
                dueTime:'',
                teamId:'',
                batchNum:0,
                location:[],
                remark:''
            },
            dateOption:{
                disabledDate (date) {
                    return date && date.valueOf() < Date.now();
                }
            },
            isSubmit:false,
            id:'',
            type:'',
            data:[],
            columns:[
                {
                    title:"案件编号",
                    key:"caseCode",
                    width:120,
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
                    title: '注册资本',
                    key: 'regCapital',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.regCapital
                            },
                        },params.row.regCapital)
                    }
                },
                {
                    title: '产品',
                    key: 'productName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.productName
                            },
                        },params.row.productName)
                    }
                },
                {
                    title: '基础费用',
                    key: 'baseFee',
                    render:(h,params)=>{
                        let baseFee = this.common.formateNumber(params.row.baseFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:baseFee
                            },
                        },baseFee)
                    }
                },
                {
                    title: '案件类型',
                    key: 'tortCategoryName',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.tortCategoryName
                            },
                        },params.row.tortCategoryName)
                    }
                },
                {
                    title: '案件性质',
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
                    title: '附加费用',
                    key: 'surchargeFee',
                    render:(h,params)=>{
                        let index = params.index;
                        return h(surchargeFeeExpand,{
                            props: {
                                row: this.data[index]
                            }
                        })
                    }
                },
                {
                    title: '售价',
                    key: 'sellFee',
                    render:(h,params)=>{
                        let sellFee = this.common.formateNumber(params.row.sellFee);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:sellFee
                            },
                        },sellFee)
                    }
                },
                {
                    title: '操作',
                    slot:'action'
                }
            ],
            tableLoading:false,
            detailsCtrl:false,
            defaultLocation:[],//城市list
            defaultlawyerTeam:{}, //指派团队
            surchargeModal:false, //修改附加费modal
            surchargeObj:{}, //附加费对象
            tortCategory:1, //线上2 线下1
            collection:[], //已经选中的附加费
            surchargeFee:0, //附加费合计
            formSurcharge:{
                otherFee:0,
                remark:''
            },
            defaultOtherFee:0, //默认的其他费用
            index:'',
            depositScale:0, //案件包的比率
            opertePermission:true, //案件包的基本信息是否可编辑
            editId:'',
            addCaseModal:false,
            defaultCaseList:[],
            caseList:[],
            deleteBagItemIdList:[], //要删除的案件包已存在的案件明细记录id
        }
    },
    props:{
        operation:{ //操作 add edit
            type:String
        },
        dataList:{ //新增传id  编辑传list
            type:Object | Array
        }
    },
    computed:{
        // 总价
        totalFee(){
            if(!this.data){
                return 0;
            }
            let total = this.data.map(item=>{
                return item.sellFee;
            }).reduce(function(total,item){
                return Number(total) + Number(item);
            },0)
            return total;
        },
        location(){
            if(this.dataList.caseSaleBagLocationList&&this.dataList.caseSaleBagLocationList.length>0){
                let location = [],json={};
                this.dataList.caseSaleBagLocationList.forEach(item=>{
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
                return location.join('，');
            }else{
                return '';
            }
        }
    },
    methods: {
        // 列表操作
        option(index,name){
            let row = this.data[index];
            this.index = index;
            switch (name) {
                case 'delete':
                    this.data.splice(index,1);
                    if(row.id){
                        this.deleteBagItemIdList.push(row.id);
                    }else{
                        for(let i=0;i<this.caseList.length;i++){
                            if(this.caseList[i].caseId==row.caseId){
                                this.caseList.splice(i,1);
                                this.defaultCaseList = this.caseList;
                            }
                        }
                    }
                    this.$refs.formData.validateField('batchNum');
                    break;
                case 'editFee':
                    this.surchargeObj = row.caseSaleBagItemExtend;
                    this.tortCategory = row.tortCategory; // 线下1 线上2
                    this.formSurcharge.otherFee = row.caseSaleBagItemExtend.otherFee;
                    this.defaultOtherFee = row.caseSaleBagItemExtend.otherFee;
                    
                    this.formSurcharge.remark = row.caseSaleBagItemExtend.remark;
                    this.surchargeFee = row.surchargeFee; //单个案件附加费
                    
                    this.surchargeObj.collection = this.initCollection(row);
                    this.collection = this.surchargeObj.collection;
                    this.reCalculate();
                    this.surchargeModal = true;
                    break;
            }
        },
        // 其他费用
        getInputValue(data){
            this.formSurcharge.otherFee = data;
            this.surchargeObj.otherFee = data;
            this.reCalculate();
        },
        // 重新计算附加费总价
        reCalculate(){
            this.surchargeFee = 0;
            for(let i=0;i<this.collection.length;i++){
                let key = this.collection[i];
                this.surchargeFee += Number(this.surchargeObj[key]);
            }
        },
        // 修改附加费  确定
        resetSurcharge(){
            this.$refs['formSurcharge'].validate((valid)=>{
                if(valid){
                    if(this.collection.indexOf('otherFee')!=-1){
                        this.surchargeObj.remark = this.formSurcharge.remark;
                        this.surchargeObj.otherFee = this.formSurcharge.otherFee;
                        this.surchargeObj.collection = this.collection.join(',');
                    }else{
                        this.surchargeObj.remark = '';
                        this.surchargeObj.otherFee = 0;
                        this.surchargeObj.collection = this.collection.join(',');
                    }
                    this.data[this.index].caseSaleBagItemExtend = this.surchargeObj;
                    this.data[this.index].sellFee = (this.data[this.index].baseFee + this.surchargeFee)*this.data[this.index].scale;
                    this.data[this.index].sellFee = Number(this.data[this.index].sellFee).toFixed(2);
                    this.data[this.index].surchargeFee = this.surchargeFee;
                    this.surchargeModal = false;
                }
            })
        },
        //获取截止时间
        getEndDate(value){
            this.formData.dueTime = value;
        },
        // 获取指派团队
        getLawyerTeamsId(data){
            this.formData.teamId = data.id;
        },
        //新增/编辑 案件包
        submitNewBag(state){
            let url = '/settlement/trade/sale/bag';
            let ajaxData = {
                publishState:state,
                type:this.formData.type,
                remark:this.formData.remark,
                caseNum:this.data.length,
                sellFee:this.totalFee.toFixed(2),
                caseSaleBagItemList:this.data,
                caseSaleBagLicensor:{}
            }
            if(this.formData.type=='P'){
                ajaxData.caseSaleBagLocationList = this.formData.location;
                ajaxData.batchNum = this.formData.batchNum;
            }else{
                ajaxData.caseSaleBagLicensor = {
                    teamId:this.formData.teamId,
                    dueTime:this.common.formatTime(this.formData.dueTime,5)
                }
            }
            console.log(ajaxData)
            this.$refs['formData'].validate((valid)=>{
                if(valid){
                    this.isSubmit = true;
                    if(this.operation==='add'){
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功')
                                this.$emit('reloadList',true)
                            }else{
                                this.$Message.error(res.message)
                                this.$emit('reloadList',false)
                            }
                        })
                    }else if(this.operation=='edit'){
                        ajaxData.id = this.editId;
                        ajaxData.deleteBagItemIdList = this.deleteBagItemIdList;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code==0){
                                this.$Message.success('操作成功')
                                this.$emit('reloadList',true)
                            }else{
                                this.$Message.error(res.message)
                                this.$emit('reloadList',false)
                            }
                        })
                    }
                    
                }
            })
        },
        /************begin****************/
        //获取指派团队
        getIdList(data){
            this.caseList = data;
        },
        // 确定
        confirm(){
            this.addCaseModal = false;
            this.defaultCaseList = this.caseList;
            let caseIdList = this.caseList.map(item=>{
                return item.caseId;
            })
            this.previewCase(caseIdList);
        },
        //取消
        cancel(){
            this.addCaseModal = false;
            this.caseList = this.defaultCaseList;
        },
        /*************end****************/
        // 获取location
        getLocation(data){
            this.formData.location = [];
            if(data.length>0){
                data.forEach(item=>{
                    item.cities.forEach(city=>{
                        this.formData.location.push({province:item.provinceCode,city:city.code})
                    })
                })
            }else{
                this.formData.location = [];
            }
        },
        //初始化附加费collection
        initCollection(row){
            let collection = row.caseSaleBagItemExtend.collection;
            let tortCategory = row.tortCategory;
            let collectionList = [];
            if(collection){
                if(typeof(collection)=='string'){
                    collectionList = row.caseSaleBagItemExtend.collection.split(',');
                }else{
                    collectionList = row.caseSaleBagItemExtend.collection;
                }
            }else{
                collectionList = ['firstReportManufactureFee','infringProductFee','shoppingFee']
                if(tortCategory===1){
                    collectionList.push('capitalExcessFee');
                }else if(tortCategory===2){
                    let online = [
                        'disclosureTimelyFee',
                        'evidTimelyFee',
                        'notarialTimelyFee',
                        'salesRewardFee',
                        'salesVolumeExceed10Fee',
                        'salesVolumeExceed30Fee'
                    ]
                    collectionList = collectionList.concat(online);
                }
            }
            return collectionList;
        },
        // 通过caseId预览案件
        previewCase(caseIdList){
            this.tableLoading = true;
            let url = '/settlement/trade/sale/bag/preview';
            this.$patch(url,caseIdList).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    let caseSalesList = res.data.caseSaleBagItemList;
                    // 先初始化一遍collection
                    for(let i=0;i<caseSalesList.length;i++){
                        caseSalesList[i].caseSaleBagItemExtend.collection = this.initCollection(caseSalesList[i]).join(',');
                    }
                    if(this.operation=='add'){
                        this.data = caseSalesList;
                        this.depositScale = res.data.depositScale;
                    }else{
                        if(this.deleteBagItemIdList.length>0){
                            let list = [];
                            let dataList = this.dataList.caseSaleBagItemList;
                            for(let i=0;i<dataList.length;i++){
                                for(let j=0;j<this.deleteBagItemIdList.length;j++){
                                    if(dataList[i].id!=this.deleteBagItemIdList[j] && j==this.deleteBagItemIdList.length-1){
                                        list.push(dataList[i])
                                    }
                                }
                            }
                            this.data = list.concat(caseSalesList);
                        }else{
                            this.data = this.data.concat(caseSalesList);
                        }
                    }
                }
            })
        }
    },
    created(){},
    beforeMount(){

    },
    mounted(){
        if(this.operation=='add'){
            this.previewCase(this.dataList);
            this.detailsCtrl = true;
        }else if(this.operation=='edit'){
            this.data = this.dataList.caseSaleBagItemList;
            this.depositScale = this.dataList.depositScale;
            this.opertePermission = this.dataList.opertePermission;
            this.editId = this.dataList.id;
            this.formData.type = this.dataList.type;
            if(this.dataList.type=='P'){
                this.formData.batchNum = this.dataList.batchNum;
                this.defaultLocation = this.dataList.caseSaleBagLocationList.length>0?this.dataList.caseSaleBagLocationList.map(item=>{
                    return {
                        code:item.city,
                        name:item.cityName,
                        provinceCode:item.province,
                        province:item.provinceName
                    }
                }):[];
            }else{
                this.formData.dueTime = this.dataList.caseSaleBagLicensor.dueTime;
                this.formData.teamId = this.dataList.caseSaleBagLicensor.teamId;
                this.defaultlawyerTeam = {
                    name:this.dataList.caseSaleBagLicensor.teamName,
                    id:this.dataList.caseSaleBagLicensor.teamId
                }
                this.$nextTick(function(){
                    this.$refs.lawyerSelect.voluation()
                })
            }
            this.formData.remark  = this.dataList.remark;
            this.detailsCtrl = true;
        }
    },
    updated(){},
    components: {addCaseComponent},
    watch: {}
}
</script>
<style scoped lang="scss">
@import './createCasePackage.scss';
</style>
