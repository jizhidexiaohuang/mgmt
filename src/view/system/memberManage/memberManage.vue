<template>
    <div class="member-big-box have-drawer-style">
        <!-- 左侧区域 -->
        <div class="content-left">
            <Row class="button-box" v-if="false">
                <Button type="primary" ghost icon="md-add" @click="openDepartMan" class="member-btn">新增部门</Button>
            </Row>
            <Row class="depart-box">
                <Tree 
                    ref="departTree"
                    class="content-left-tree" 
                    :data="departList"
                    :render="renderContent"
                    ></Tree>
            </Row>
        </div>
        
        <!--右侧区域 -->
        <div class="content-right">
            <!-- 操作按钮区域 -->
            <Row class="right-box clearfix header-common-right-box">
                <Col style="float:left;">
                    <span style="color:red;vertical-align:middle;">新增、修改、删除部门或员工请到企业微信进行操作！</span>
                    <Button @click="openAddUser" v-if="false" type="primary">新增员工</Button>
                    <Dropdown @on-click="option" v-if="false">
                        <Button style="padding:0 15px">
                            更多操作
                            <Icon type="ios-arrow-down"></Icon>
                        </Button>
                        <DropdownMenu slot="list">
                            <DropdownItem name="transfer">转移</DropdownItem>
                            <Dropdown placement="right-start" @on-click="exportOption">
                                <DropdownItem name="export">
                                    导出
                                    <Icon type="ios-arrow-forward"></Icon>
                                </DropdownItem>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="all">全部导出</DropdownItem>
                                    <DropdownItem :disabled="idList.length==0" name="part">勾选导出</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </DropdownMenu>
                    </Dropdown>
                </Col>
                <Col class="filter-col">
                    <Input v-model.trim="searchForm.keyword" placeholder="成员名称/联系方式" style="width: 250px;" 
                            @on-enter="getUserList">
                        <Icon type="ios-search" slot="suffix" @click="getUserList" />
                    </Input>
                    <!-- <span :class="['icon-more-01' ,'search-more-icon',{'active':searchBoxCtrl}]" @click="searchBoxCtrl=!searchBoxCtrl"></span>
                    <div class="container" v-show="searchBoxCtrl" v-if="false">
                        <Row class="header-common-right-box">
                            <Col span="6" class="header-common-col">
                                账号状态
                            </Col>
                            <Col span="18">
                                <Select v-model="searchForm.status" style="width:190px" clearable>
                                    <Option v-for="item in userStatusArr" :value="item.value" :key="item.value">{{ item.nameZh }}</Option>
                                </Select>
                            </Col>
                        </Row>
                        <Row class="header-common-right-box" style="text-align:right;margin-top:5px;">
                            <Button type="primary" size="small" @click="getUserList">确定</Button>
                            <Button size="small" @click="clearConditions">清空</Button>
                        </Row>
                    </div> -->
                </Col>
            </Row>
            <!-- 表格区域 -->
            <Row class="table-border">
                <checkbox-table :columns="tableColumns" :data="tableData" ref="checkboxTable"
                    :tableLoading="tableLoading" @refreshList="getIdList($event)">
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

        <!-- 新增or编辑 员工抽屉 -->
        <Drawer
            v-model="manageUser" 
            width="430"
            :mask-style="{background:'rgba(0,0,0,0)'}">
            <div slot="header" class="drawer-title">
                <span :title="drawerTitle">{{common.cutString(drawerTitle,23)}}</span>
                <!-- <span class="icon-edit-01 edit-icon" v-if="manageUser && userInfo && !userEdit" @click="userEdit=true;"></span> -->
                <Dropdown transfer @on-click="optionInfo(operaUserObj,$event)" class="edit-icon" v-if="userEdit || userInfo">
                    <a href="javascript:void(0)">
                        <Icon type="ios-more" size="20"/>
                    </a>
                    <DropdownMenu slot="list">
                        <DropdownItem v-if="!userEdit&&manageUser&&userInfo" name="edit">编辑</DropdownItem>
                        <DropdownItem v-if="operaUserObj.status" name="reject">禁用</DropdownItem>
                        <DropdownItem v-if="!operaUserObj.status" name="agree">启用</DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </div>
            <Row>
                <MemberForm v-if="manageUser && !userInfo" ref="memberForm" @closeModel="closeModel"></MemberForm>
                <MemberInfo v-if="manageUser && userInfo" ref="memberInfo" :id="operaUserObj.id" :isEdit="userEdit" @closeModel="closeModel"></MemberInfo>
            </Row>
        </Drawer>    

        <!-- 新增/编辑部门弹窗 -->
        <Modal v-model="departCtrl" :title="modalTitle" :footer-hide="true">
            <Form ref="departForm" :model="departForm" style="padding:0 20px;" :rules="departValidate" :label-width="70">
                <FormItem label="上级部门">
                    <InputTree transfer @returnData="setFormValideData" v-if="departCtrl" :value="departForm.parentId" ref="treeInputs"></InputTree>
                </FormItem>
                <FormItem label="部门名称" prop="name">
                    <Input v-model.trim="departForm.name" placeholder="请输入部门名称"></Input>
                </FormItem>
            </Form>
            <Row class="modal-btn-item">
                <Button type="primary" @click="confirmManage" :loading="manageLoading">确认</Button>
                <Button @click="departCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 人员转移弹窗 -->
        <Modal v-model="transferCtrl" title="组织转移" :footer-hide="true" :width="450">
            <Row>
                <span class="transfer-label">转移至:</span>
                <div class="transfer-input">
                    <InputTree transfer @returnData="setTransferData" v-if="transferCtrl" :value="1" ref="treeTransferInputs" :multiple="true"></InputTree>
                </div>
            </Row>
            <Row class="modal-btn-item">
                <Button type="primary" @click="confirmTransfer">确认</Button>
                <Button @click="closeTransfer" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>

        <!-- 删除部门提示弹窗 -->
        <Modal v-model="deleteComCtrl" width="360" :footer-hide="true" title="删除部门">
            <p class="modal-metion-tips">确认删除该部门吗？</p>
            <div class="modal-btn-item">
                <Button :loading="modal_loading" type="primary" @click="delComfrimBtn">删除</Button>
                <Button @click="deleteComCtrl=false">取消</Button>
            </div>
        </Modal>

        <!-- 禁用用户提示弹窗 -->
        <Modal
            v-model="forbidUserCtrl"
            title="禁用确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">确认禁用该用户吗？</Row>                                                                                                                                                                                      
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :loading="forbidUserIng" @click="forbidUser">确认</Button>
                <Button @click="forbidUserCtrl=false" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <Message ref="message" :message="'请先转移部门中的成员!'" :iconType="'error'"></Message>
    </div>
</template>
<script>
import styles from "./../../../assets/globalStyle.scss";
import InputTree from "@/components/common/inputSelect/inputSelect";
import Message from "@/components/common/message/message";
import MemberForm from "./memberForm";
import MemberInfo from "./memberInfo";
export default {
    data() {
        return {
            formItemStyles:{
                marginBottom:"20px"
            },
            globalMainColor:styles.globalMainColor,
            infoColor:styles.infoColor,
            textColor:styles.textColor,
            selectDepart:{},
            departEdit:false,
            searchBoxCtrl:false,
            searchForm:{
                keyword:"",
                status:"",
                organizationId:""
            },
            userStatusArr:[],
            departCtrl: false,           //打开部门管理ctrl
            forbidUserCtrl:false,        //禁用用户模态框ctrl
            forbidUserIng:false,         //禁用用户按钮loading
            operaDepartObj:{},           //操作中的部门
            operaUserObj:{},
            userEdit:false,
            userInfo:false,
            deleteComCtrl:false,         //删除部门确认框control
            modalTitle: "新增部门",       //部门管理模态框标题
            drawerTitle:"新增员工",       //右滑弹窗标题
            modal_loading:false,         //删除modal内的删除按钮loading
            manageUser:false,            //新增或编辑员工的右侧抽屉
            departList: [],              //部门数据
            departForm:{                 //部门form
                parentId:1,
                name:"",
                id:""
            },
            departValidate:{
                name:[{ required: true, message: "部门名称不能为空", trigger: "blur" }],
            },
            transferCtrl:false,
            tranferOrganIds:[],
            tableLoading:true,
            // 表格表头
            tableColumns:[
                {
                    type: 'selection',
                    width: 30,
                    align: 'center'
                },
                {
                    title: '成员名称',
                    key: 'name',
                    render:(h, params) => {
                        let dom = h("a",{
                            class:["textover"],
                            style:{
                                color:styles.$globalMainColor
                            },
                            attrs:{
                                title:params.row.name
                            },
                            on:{
                                "click":()=>{
                                    this.operaUserObj = params.row;
                                    this.manageUser = true;
                                    this.userInfo = true;
                                    this.userEdit = false;
                                    this.drawerTitle = params.row.name;
                                }
                            }
                        },params.row.name);
                        return dom
                    }
                },
                {
                    title: '成员职务',
                    key: 'position',
                    render:(h,params) => {
                        let spanDom = h("span",{
                            class:["textover"],
                            attrs:{
                                title:params.row.position
                            }
                        },params.row.position);
                        return spanDom
                    }
                },
                {
                    title: '所在部门',
                    key: 'organizationName',
                    render:(h,params) => {
                        let spanDom = h("span",{
                            class:["textover"],
                            attrs:{
                                title:params.row.organizationName
                            }
                        },params.row.organizationName);
                        return spanDom
                    }
                },
                {
                    title: '所属角色',
                    key: 'roleName',
                    render:(h,params) => {
                        let spanDom = h("span",{
                            class:["textover"],
                            attrs:{
                                title:params.row.roleName
                            }
                        },params.row.roleName);
                        return spanDom
                    }
                },
                {
                    title: '联系方式',
                    key: 'mobile'
                },
                // {
                //     title: '操作',
                //     width:100,
                //     render:(h, params) => {
                //         let arrs = [];
                //         let editBtn = h("span",{
                //                 class:'icon-edit-01',
                //                 style:{
                //                     cursor:'pointer',
                //                     fontSize:'16px',
                //                     marginLeft:'10px'
                //                 },
                //                 attrs:{title:'编辑'},
                //                 directives: [
                //                     {
                //                         name: 'permission',
                //                         value: ['system:staff:edit-'],
                //                     }
                //                 ],
                //                 on:{
                //                     click:()=>{
                //                         this.operaUserObj = params.row;
                //                         this.manageUser = true;
                //                         this.userInfo = true;
                //                         this.userEdit = true;
                //                         this.drawerTitle = "成员资料修改";
                //                     }
                //                 }
                //             });
                //         let startBtn = h("span",{
                //             class:'icon-enable-01',
                //             style:{
                //                 cursor:'pointer',
                //                 fontSize:'16px',
                //             },
                //             attrs:{ title:'启用' },
                //             directives: [
                //                 {
                //                     name: 'permission',
                //                     value: ['system:staff:disable-'],
                //                 }
                //             ],
                //             on:{
                //                 click:()=>{
                //                     this.enableUser(params.row.id);
                //                 }
                //             }
                //         });       
                //         let forbidBtn = h("span",{
                //             class:'icon-disable-01',
                //             style:{
                //                 cursor:'pointer',
                //                 fontSize:'16px'
                //             },
                //             attrs:{ title:'禁用' },
                //             directives: [
                //                 {
                //                     name: 'permission',
                //                     value: ['system:staff:disable-'],
                //                 }
                //             ],
                //             on:{
                //                 click:()=>{
                //                     this.forbidUserCtrl = true;
                //                     this.operaUserObj = params.row;
                //                 }
                //             }
                //         });
                //         if(params.row.status){
                //             arrs.push(forbidBtn);
                //         }else{
                //             arrs.push(startBtn);
                //         }
                //         arrs.push(editBtn);                                
                //         return h("div",arrs);
                //     }
                // }
            ],
            // 表格数据
            tableData:[],
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            manageLoading:false,
            exportLoading:false,
            idList:[],
        };
    },
    methods: {
        // 获取人员数据
        getUserList(){
            let url = "/base/mgmt-users";
            let ajaxData = {
                current:this.table.pageNum,
                size:this.table.pageSize
            }
            this.tableLoading = true;
            Object.assign(ajaxData,this.searchForm);
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.tableData = res.data.records || [];
                    this.table.totalRecords = res.data.total;
                }
            })
        },
        // 获取部门人员数据
        getDepartmentData(){
            let url = "/base/mgmt-users/organization";
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.departList = [];
                    this.checkIsPerson([res.data]);
                }
            })
        },
        //头部操作
        option(name){
            switch (name) {
                case 'transfer':
                    if(this.idList==0){
                        this.$Message.error("请先勾选要转移的员工");
                        return
                    }
                    this.transferCtrl = true;
                    break;
                case 'export': 
                    break;
            }
        },
        exportOption(name){
            if(name!="export"){
                this.exportExcel(name);
            }
        },
        optionInfo(row,name){
            switch (name) {
                case 'edit': 
                    this.manageUser = true;
                    this.userInfo = true;
                    this.userEdit = true;
                    this.drawerTitle = "成员资料修改";
                    break;
                case 'agree': 
                    this.enableUser(row.id);
                    break;
                case 'reject': 
                    this.forbidUserCtrl = true;
                    break;
            }
        },
        // 返回数组做处理
        checkIsPerson(orginArr){
            if(!orginArr){return}
            orginArr.forEach((item,index)=>{
                item.title = item.name;
                item.expand = item.open;
                if(item.children && item.children.length!=0){
                    this.checkIsPerson(item.children);
                }
                if(item.parentId==0){
                    this.departList.push(item);
                }
                if(item.id==1){
                    item.selected = true;
                }
            })
        },
        // 树形渲染数据方法
        renderContent(h, { root, node, data }) {
            let parentId = (data.parentId || data.parentId!=0) ? data.parentId : "";
            let firstTextStyle = {
                fontSize:"13px",
                lineHeight:"30px"
            }
            let firstBigIcon = h("div",{
                                    style:{
                                        background:this.globalMainColor,
                                        width:"30px",
                                        height:"30px",
                                        textAlign:"center",
                                        display:"inline-block",
                                        marginRight:"10px",
                                        verticalAlign:"middle"
                                    }
                                },[
                                    h("i",{
                                        attrs:{ 
                                            class:["icon-market-01"]
                                            },
                                        style:{ 
                                            color:"#fff", 
                                            fontSize:"18px",
                                            lineHeight:"30px"
                                        }
                                    })
                                ]);
            let iconDom = h("Icon", {
                            props: {
                                type:"ios-folder",
                                size:"18"
                            },
                            style: {
                                marginRight:"8px",
                                color:this.globalMainColor
                            }
                        });
            let dropdownMenu = h('DropdownMenu',{slot:"list"},
                            [
                                    h('DropdownItem',
                                        { props:{name:"edit"},
                                        directives: [
                                            {
                                                name: 'permission',
                                                value: ['system:organization:edit-'],
                                            }
                                        ],
                                    },"编辑"),
                                    h('DropdownItem',
                                        { props:{name:"delete" },
                                        directives: [
                                            {
                                                name: 'permission',
                                                value: ['system:organization:del-'],
                                            }
                                        ],
                                    },"删除"),
                                ]
                            );
            let dropdown =  h('Dropdown', {
                                class:["dropDown"],
                                props: {
                                    trigger: "click",
                                    placement: 'bottom-end'
                                },
                                on:{
                                    "on-click":(name,e)=>{
                                        this.operaDepartObj = data;
                                        if(name=="edit"){
                                            this.departForm.id = data.id;
                                            this.departForm.name = data.name;
                                            this.departForm.parentId = data.parentId;
                                            this.departEdit = true;
                                            this.modalTitle = "编辑部门";
                                            this.departCtrl = true;
                                        }else if(name=="delete"){
                                            if(data.userList && data.userList.length!=0){
                                                this.$refs.message.show();
                                            }else{
                                                if(data.children){
                                                    if(!this.checkHaveUser(data.children)){
                                                        this.deleteComCtrl=true;
                                                    }
                                                    return
                                                }
                                                this.deleteComCtrl=true;
                                            }
                                        }
                                    }
                                }
                            },
                            [
                                h('i',{
                                    class:["icon-operating-01"],
                                    style:{
                                        cursor:"pointer",
                                        fontSize:"15px"
                                    }
                                }),
                                dropdownMenu
                            ]);
            let contentBox = h("div",
                            {
                                style:{
                                    width:"calc(100% - 25px)",
                                },
                            },
                            [   
                                parentId==0?firstBigIcon:iconDom,
                                h("span",{
                                    style:parentId==0?firstTextStyle:{width: "calc(100% - 25px)",overflow:"hidden"},
                                    attrs:{
                                        title:data.title
                                    },
                                    class:{
                                        'ivu-tree-title-selected':node.node.selected,
                                        'ivu-tree-title':true,
                                    },
                                    on: {
                                        click: () => {
                                            if (!node.node.selected){
                                                this.$refs.departTree.handleSelect(node.nodeKey); //手动选择树节点
                                            }
                                            this.searchForm.organizationId = data.parentId == "0"?"":data.id;
                                            this.table.pageNum = 1;
                                            this.getUserList();
                                        }
                                    }
                                }, this.common.cutString(data.title,7)),
                                // parentId!=0?dropdown:""
                            ]);
            return h("div",{
                        style: {
                            display: "inline-block",
                            width: "100%",
                            marginLeft: 0,
                            position:"relative"
                        },
                    },[contentBox]
            );
        },
        // 翻页
        changePage(page){
            this.table.pageNum = page;   
            this.getUserList();   
        },
        // 切换表格每页显示多少条
        changeSize(size){
            this.table.pageNum = 1;
            this.table.pageSize = size;
            this.getUserList();
        },
        // 清除筛选
        clearConditions(){
            this.searchForm.keyword = "";
            this.searchForm.status = "";
            this.table.pageNum = 1;
            this.getUserList();
        },
        // 打开部门管理模态框
        openDepartMan() {
            this.departEdit = false;
            this.modalTitle = "新增部门";
            this.departCtrl = true;
            this.departForm = {
                parentId:1,
                name:"",
                id:""
            }
        },
        // 部门管理确认按钮
        confirmManage() {
            this.$refs["departForm"].validate((valid) => {
                if(valid){
                    this.departCtrl = false;
                    let url = '/base/organization';
                    let ajaxData = {
                        parentId: this.departForm.parentId,
                        name:this.departForm.name
                    }
                    if(this.departEdit){
                        ajaxData.id = this.departForm.id;
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                this.getDepartmentData();
                                this.$refs.treeInputs.getData();
                                this.departForm.name = "";
                                this.departForm.parentId = "1";
                                this.departForm.id = "";
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.$Message.success("操作成功");
                                this.getDepartmentData();
                                this.$refs.treeInputs.getData();
                                this.departForm.name = "";
                                this.departForm.parentId = "1";
                                this.departForm.id = "";
                            }
                        })
                    }
                    
                }
            });
        },
        // 删除部门按钮确认事件
        delComfrimBtn(){
            this.modal_loading = true;
            let url = "/base/organization/"+this.operaDepartObj.id;
            this.$del(url).then(res=>{
                this.modal_loading = false;
                if(res.code==0){
                    this.deleteComCtrl = false;
                    this.$Message.success("操作成功");
                    this.getDepartmentData();
                    this.$refs.treeInputs.getData();
                }
            })
        },
        checkHaveUser(arr){
            let bool = false;
            arr.forEach((item,index)=>{
                if(arr.userList){
                    bool = true;
                    return;
                }
                if(arr.children){
                    bool = this.checkHaveUser(arr.children);
                }
            });
            return bool
        },
        // 禁用用户
        forbidUser(){
            this.forbidUserIng = true;
            let url = `/base/mgmt-user/${this.operaUserObj.id}/disable`
            this.$patch(url).then(res=>{
                this.forbidUserIng = false;
                if(res.code==0){
                    this.forbidUserCtrl = false;
                    this.manageUser = false;
                    this.$Message.success("操作成功");
                    this.getUserList();
                }
            })
        },
        // 启用用户
        enableUser(id){
            let url = `/base/mgmt-user/${id}/enable`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.manageUser = false;
                    this.getUserList();
                }
            });
        },
        openAddUser(){
            this.drawerTitle = "新增员工";
            this.userEdit = false;
            this.userInfo = false;
            this.manageUser = true;
        },
        // 新增部门下拉组件返回值
        setFormValideData(parentId){
            this.departForm.parentId = parentId;
        },
        closeModel(bool){
            this.manageUser = false;
            this.getUserList(); 
        },
        closeTransfer(){
            this.transferCtrl = false;
            this.$refs.treeTransferInputs.clearSelect();
        },
        setTransferData(data){
            this.tranferOrganIds = data;
        },
        confirmTransfer(){
            let url = "/base/mgmt-user/transfer";
            let ajaxData = {
                userIds:this.idList || [],
                organizationIds:this.tranferOrganIds
            };
            this.$patch(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.idList = [];
                    this.$Message.success("操作成功");
                    this.table.pageNum = 1;
                    this.getUserList();
                    this.transferCtrl = false;
                    this.$refs.treeTransferInputs.clearSelect();
                }else{
                    this.$Message.error(res.message);
                }
            });
        },
        /*--------------------start---------------------*/
        getIdList(list){
            this.idList = list.map(item=>{
                return item.id
            })
        },
        /*--------------------end---------------------*/
        // 获取字典数据接口
        async getDictionary(){
            this.userStatusArr = await this.common.getDictionaryItems('lawteam_available');
        },
        exportExcel(type){
            let url = '/base/report/mgmt-users';
            let ajaxData = {}
            Object.assign(ajaxData,this.searchForm);
            if(type==='part'){
                ajaxData.ids = this.idList.join(',')
            }else{
                delete ajaxData.ids;
            }
            this.$exportGet(url,ajaxData).then(res=>{});
        }
    },
    created() {},
    beforeMount() {
        this.getDictionary();
    },
    mounted() {
        this.getDepartmentData();
        this.getUserList();
    },
    activated(){
        this.$refs.checkboxTable.clearSelected();
        this.getDepartmentData();
        this.getUserList();
    },
    updated() {},
    components: {
        InputTree,
        Message,
        MemberForm,
        MemberInfo
    },
    watch: {
        departCtrl(newVal,oldVal){
            if(!newVal){
                this.$refs.treeInputs.clearSelect(this.departList);
            }
        }
    }
};
</script>
<style scoped lang="sass">
@import "./memberManage"
</style>
<style lang="scss">
.member-big-box .content-left-tree{
    .ivu-tree-title{
        width:100%;
    }
}
.member-big-box .content-left-tree>ul{
    >li{
        &:first-child{
            >span.ivu-tree-arrow{
                display: none;
            }
        }
    }
    .dropDown{
        height:20px;
        position: absolute;
        right: 5px;
        -moz-user-select:none;/*火狐*/
        -webkit-user-select:none;/*webkit浏览器*/
        -ms-user-select:none;/*IE10*/
        -khtml-user-select:none;/*早期浏览器*/
        user-select:none;
    }
}
</style>
