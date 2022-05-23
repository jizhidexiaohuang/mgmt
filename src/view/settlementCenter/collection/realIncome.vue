<template>
    <div class="have-drawer-style project-box">
        <div class="card-style">
            <!-- 批量操作区域 -->
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button type="primary" @click="addCollection">新增收款</Button>
                    <Button type="default" @click="importCtrl=true">导入</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="收款编号/付款人" style="width: 250px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                收款时间
                            </Col>
                            <Col span="18">
                                <DatePicker :value="collectionDate" 
                                    style="width:190px;"
                                    @on-change="getCollectionDate" 
                                    type="daterange" placement="bottom-end" 
                                    placeholder="请选择时间"></DatePicker>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                认领人
                            </Col>
                            <Col span="18">
                                <mySelect ref="claimantSelect"
                                    style="width:190px;"
                                    :path="'/base/mgmt-users'"
                                    :placeholder="'请选择认领人'"
                                    :placeholderInput="'请输入认领人'"
                                    :keyName="'name'"
                                    @getValue="getClaimantId">
                                </mySelect>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                认领状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.claimStatus" placeholder="请选择认领状态" style="width:190px">
                                    <Option v-for="item in claimStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
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
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" :loading="tableLoading">
                    <template slot-scope="{ row, index }" slot="action">
                        <Dropdown @on-click="option(row,$event)">
                            <a href="javascript:void(0)">
                                <Icon type="ios-more" size="20"/>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem name="info" v-if="row.claimStatus!=='TB'">认领明细</DropdownItem>
                                <DropdownItem name="delete" v-if="row.claimStatus=='TB'">删除</DropdownItem>
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
        <!-- 新增收款录入 -->
        <Drawer 
            width="600" 
            v-model="infoCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>新增收款</span>
                <Dropdown transfer @on-click="option(collectionDetail)" class="edit-icon" v-if="false">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="info">认领明细</DropdownItem>
                        <DropdownItem name="delete">删除</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <collection-form @changeCtrl="changeCtrl" v-if="infoCtrl"></collection-form>
        </Drawer>
        <!-- 查看认领记录 -->
        <Modal 
            v-model="claimDetailCtrl" 
            :width="800"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">认领明细</div>
            <claim-detail v-if="claimDetailCtrl" :incomeId="id"></claim-detail>
        </Modal>
        <!-- 导入 -->
        <Drawer 
            width="600" 
            v-model="importCtrl"
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">导入</div>
            <Row class="container">
                <div class="btn-img clearfix">
                    <div class="btn-box" @click="downloadTpl">
                        <img src="../../../assets/images/download.png" alt="">
                        <p>下载收款导入模板</p>
                        <p class="tips-p" style="visibility: hidden;">仅支持后缀.xls和.xlsx，且文件只允许上传一份</p>
                    </div>
                    <div class="btn-box" @click="$refs.inputer.click()">
                        <img src="../../../assets/images/upload.png" alt="">
                        <input type="file" id="fileExport" v-show="false" @change="handleFileChange" ref="inputer">
                        <p>上传文件</p>
                        <p class="tips-p">仅支持后缀.xls和.xlsx，且文件只允许上传一份</p>
                    </div>
                </div>
                <Row class="text-row">
                    <p class="notice">提示：</p>
                    <p>1. 请点击下载模板后并填好内容，再导入数据</p>
                    <p>2. 按模板中的格式填好数据</p>
                    <p>3. 选择编辑好的文件，点击上传</p>
                </Row>
            </Row>
        </Drawer>
        <!-- 删除/退款 -->
        <Modal
            v-model="deleteModal"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除此条实收录入？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="comfirmSubmit">确认</Button>
                <Button @click="deleteModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import collectionForm from './collectionForm.vue';
import claimDetail from './plugin/claimDetail.vue';
export default {
    data () {
        return {
            styles:styles,
            id:'',
            searchForm:{
                keyword:'',
                incomeStartDate:'',
                incomeEndDate:'',
                claimUserId:'',
                claimStatus:'',
            },
            claimStatusArr:[],
            collectionDate:[],
            searchBoxCtrl:false,
            tableLoading:false,
            table:{                     //表格数据接口的相关参数
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns: [
                {
                    title:"收款编号",
                    key:"caseCode",
                    render:(h, params) => {
                        let dom = h("span",{
                            class:{
                                "textover":true
                            },
                            attrs:{
                                title:params.row.code
                            },
                        },params.row.code);
                        return dom
                    }
                },
                {
                    title:"创建日期",
                    key:"createTime",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.createTime))
                    }
                },
                {
                    title:"收款日期",
                    key:"incomeDate",
                    render:(h,params)=>{
                        return h('span',this.common.formatTime(params.row.incomeDate))
                    }
                },
                {
                    title: '付款人',
                    key: 'payer',
                },
                {
                    title: '备注',
                    key: 'remark',
                    render:(h,params)=>{
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:params.row.remark
                            },
                        },params.row.remark)
                    }
                },
                {
                    title: '付款金额',
                    key: 'amount',
                    render:(h,params)=>{
                        let amount = this.common.formateNumber(params.row.amount);
                        return h('span',{
                            class:'textover',
                            attrs:{
                                title:amount
                            },
                        },amount)
                    }
                },
                {
                    title:"认领状态",
                    key:"claimStatus",
                    render:(h,params)=>{
                        let color = "";
                        switch(params.row.claimStatus){
                            case "TB": color = "expireColor"; break;
                            case "PR": color = "warningColor"; break;
                            case "PD": color = "successColor"; break;
                        }
                        return h("Tag",{
                            class:["textover"],
                            style:{
                                borderRadius:'11px'
                            },
                            attrs:{ color:styles[color] }
                        },params.row.claimStatusName)
                    }
                },
                {
                    title:"操作",
                    slot: 'action'
                },
            ],
            infoCtrl:false,
            deleteModal:false,
            importCtrl:false,
            claimDetailCtrl:false,
        }
    },
    props: [''],
    methods: {
        //获取列表数据
        getData(){
            let url = '/settlement/finance/income';
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
            this.collectionDate = [];
            this.$refs.claimantSelect.clearSelected();
            this.reloadTable();
        },
        getClaimantId(data){
            this.searchForm.claimUserId = data.id;
        },
        getCollectionDate(data){
            this.searchForm.incomeStartDate = data[0];
            this.searchForm.incomeEndDate = data[1];
        },
        // 新增收款
        addCollection(){
            this.infoCtrl = true;
        },
        comfirmSubmit(){
            let url = '/settlement/finance/income/'+this.id;
            this.$del(url).then(res=>{
                if(res.code==0){
                    this.deleteModal = false;
                    this.$Message.success('操作成功！');
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        /*------------操作Begin-------------*/
        option(row,name){
            this.id = row.id;
            switch (name) {
                case 'info': 
                    this.claimDetailCtrl = true;
                    break;
                case 'delete': 
                    this.deleteModal = true;
                    break;
            }
        },
        // 下载模板
        downloadTpl(){
            let url = '/settlement/finance/income/template';
            this.$exportGet(url).then(res=>{})
        },
        // 上传
        handleFileChange(){
            let inputDOM = this.$refs.inputer;
            if(inputDOM.files.length>1){
                this.$Message.error("只允许上传一份文件");
                inputDOM.value = null;
                return
            }
            this.file = inputDOM.files[0];                  // 通过DOM取文件数据
            let ajaxformData = new FormData();                   //new一个formData事件
            ajaxformData.append("file",this.file);         //将file属性添加到formData里
            let url = '/settlement/finance/income/import';
           
            this.$post(url,ajaxformData).then(res=>{
                inputDOM.value = null;
                if(res.code===0){
                    this.$Message.success('操作成功');
                    this.importCtrl = false;
                    this.reloadTable();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        /*------------操作End-------------*/
        //关闭弹框
        changeCtrl(isReload){
            if(isReload){
                this.reloadTable();
            }
            this.infoCtrl = false;
        },
        //获取字典数据接口
        async getDictionary(){
            this.claimStatusArr = await this.common.getDictionaryItems('claim_status');
        },
    },
    created(){},
    activated(){
        this.getData();
    },
    beforeMount(){
        this.getDictionary()
    },
    mounted(){
        
    },
    updated(){},
    components: {
        collectionForm,
        claimDetail
    },
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../../case/case.scss';
@import './realIncome.scss';
</style>