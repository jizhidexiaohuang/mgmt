<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Col style="float:left;">
                    <Button @click="openAddDrawer" type="primary">新增产品</Button>
                </Col>
                <!-- 筛选项 -->
                <Col class="filter-col search-box">
                    <Input v-model="searchForm.keyword" placeholder="产品名称" style="width: 280px;" 
                            @on-enter="reloadTable">
                        <Icon type="ios-search" slot="suffix" @click="reloadTable" />
                    </Input>
                    <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl" v-if="false"></span>
                    <div class="container" v-show="searchBoxCtrl" v-if="false">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                创建人
                            </Col>
                            <Col span="18">
                                <Input v-model="searchForm.name" placeholder="请输入创建人"></Input>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                协议状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.customerNature" style="width:190px;" clearable>
                                    <Option v-for="item in custPropertyArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                创建时间
                            </Col>
                            <Col span="18">
                                <DatePicker 
                                type="daterange"
                                v-model="createTime"
                                @on-change="getTime"
                                split-panels 
                                placeholder="请选择创建时间" 
                                style="width: 190px"></DatePicker>
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
                                <DropdownItem name="edit">编辑</DropdownItem>
                                <!-- <DropdownItem name="delete">删除</DropdownItem> -->
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

        <!-- 新增产品抽屉 -->
        <Drawer 
            width="600" 
            v-model="addDrawerCtrl" 
            :styles="{padding:'0px'}"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span>{{(!isInfo && !isEdit)?'新增产品':'产品详情'}}</span>
                <Dropdown transfer @on-click="option(productDetail,$event)" v-if="isInfo" class="edit-icon">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem name="edit">编辑</DropdownItem>
                        <!-- <DropdownItem name="delete">删除</DropdownItem> -->
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Form :model="productForm" ref="productForm" :rules="productRuleValidate" :label-width="100" v-if="!isInfo">
                <Row class="detail-form">
                    <FormItem label="产品名称" prop="name">
                        <Input v-model.trim="productForm.name" placeholder="请输入产品名称"></Input>
                    </FormItem>
                    <FormItem label="产品描述" prop="remark">
                        <Input v-model.trim="productForm.remark" type="textarea" :autosize="{minRows: 4,maxRows: 5}" placeholder="请填写产品描述"></Input>
                    </FormItem>
                    <Row class="detail-btn-box">
                        <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitNewProduct('productForm')">保存</Button>
                        <Button @click="addDrawerCtrl=false">取消</Button>
                    </Row>
                </Row>
            </Form>
            <Row class="detail-content" v-if="isInfo">
                <Row><Col span="5" class="left-label">产品名称：</Col><Col span="16" class="right-content">{{productDetail.name}}</Col></Row>
                <Row><Col span="5" class="left-label">产品描述：</Col><Col span="16" class="right-content">{{productDetail.remark}}</Col></Row>
            </Row>
        </Drawer>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            searchForm:{
                keyword:"",
                // startTime:"",
                // endTime:""
            },
            searchBoxCtrl:false,
            custPropertyArr:[],
            tableLoading:false,
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            data:[],
            columns:[
                {
                    title:"产品名称",
                    key:"name",
                    render:(h,params)=>{
                        return h('span',{
                            style:{
                                color:styles.globalMainColor,
                                cursor: 'pointer'
                            },
                            class:'textover',
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                click:()=>{
                                    this.getCustomerDetail(params.row,'info');
                                }
                            }
                        },params.row.name)
                    }
                },
                {
                    title:"描述",
                    key:"remark",
                },
                {
                    title:"操作",
                    key: 'action',
                    width:160,
                    slot:'action'
                }
            ],
            addDrawerCtrl:false,
            isEdit:false,
            isInfo:false,
            productDetail:'',
            id:"",
            createTime:[],
            isSubmit:false,
            productForm:{
                name:'',
                remark:''
            },
            productRuleValidate:{
                name:[
                    {required:true,message:'请填写产品名称',trigger:'change'},
                    {max:64,message:'不能超过64个字符',trigger:'change'}
                ],
                remark:[{required: true, message: '产品描述不能为空', trigger: 'change'}],
            }
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/base/products';
            let ajaxData = {
                current: this.table.pageNum,
                size: this.table.pageSize,
            }
            Object.assign(ajaxData,this.searchForm);
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                this.data = res.data.records;
                this.table.totalRecords = res.data.total;
            })
        },
        //重载table
        reloadTable(){
            this.table.pageNum = 1;
            this.getData();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        /***********操作************/
        submitNewProduct(name){
            let ajaxData = {
                name:this.productForm.name,
                remark:this.productForm.remark
            }
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.isSubmit = true;
                    if(this.type=='add'){
                        let url = '/base/product';
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.addDrawerCtrl = false;
                                this.isSubmit = false;
                                this.reloadTable()
                            }
                        })
                    }else if(this.type=='edit'){
                        let url = '/base/product/'+this.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code===0){
                                this.$Message.success('操作成功!');
                                this.addDrawerCtrl = false;
                                this.isSubmit = false;
                                this.reloadTable()
                            }
                        })
                    }
                }
            })
        },
        option(row,name){
            this.id = row.id;
            this.type = name;
            switch (name) {
                case 'edit': 
                    this.isInfo = false;
                    this.isEdit = true;
                    this.getCustomerDetail(row,"edit");
                break;
            }
        },
        //关闭侧边栏
        changeCtrl(data,isReload){
            if(!data){
                this.addDrawerCtrl = false;
            }
            if(isReload){
                this.reloadTable();
            }
        },
        //新增客户线索
        openAddDrawer(){
            if(this.$refs.productForm){
                this.$refs.productForm.resetFields();
            }
            this.addDrawerCtrl = true;
            this.isInfo = false;
            this.isEdit = false;
            this.type = 'add';
            this.productDetail = '';
        },
        getCustomerDetail(row,type){
            this.type = type;
            console.log(row)
            this.productDetail = row;
            if(type=="edit"){
                this.productForm.name = row.name;
                this.productForm.remark = row.remark;
                this.isEdit = true;
                this.isInfo = false;
            }else if(type=="info"){
                this.isInfo = true;
                this.isEdit = false;
            }
            this.addDrawerCtrl = true;
        },
        getTime(date){
            this.searchForm.startTime = date[0];
            this.searchForm.endTime = date[1];
        },
        //清除条件
        clearConditions(){
            this.searchForm.keyword = "";
            // this.createTime = [];
            this.reloadTable();
        },
        /************操作************/
        //获取字典数据接口
        async getDictionary(){
   
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
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
