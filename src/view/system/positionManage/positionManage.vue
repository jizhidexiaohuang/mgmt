<template>
   <div class="position-manage-box have-drawer-style">
        <div class="content-left">
            <div class="content-title">
                <p>角色目录</p>
                <span class="icon-cooperation-01 add-role" @click="addRole"></span>
            </div>
            <div class="content-left-box">
                <Input type="text" placeholder="角色名称" class="search-input" v-model="keyword" @on-enter="getRoleList">
                    <Icon type="ios-search" slot="suffix" @click="getRoleList" />
                </Input>
                <ul class="role-list">
                    <li :class="[index==activeLi?'active':'','role-list-li']" 
                        v-for="(item,index) in roleList" :key="index" 
                        @click.stop="handleClick(item,index)">
                        <span class="icon-lawyer-01"></span>
                        <span class="role-name textover" :title="item.name">{{item.name}}</span>
                        <span class="role-remark textover" :title="item.remark">{{item.remark}}</span>
                        <Dropdown class="dropdown" trigger="click">
                            <a href="javascript:void(0)">
                                <span class="icon-dot">...</span>
                            </a>
                            <DropdownMenu slot="list">
                                <DropdownItem @click.native="editRole(item)">编辑</DropdownItem>
                                <DropdownItem @click.native="deleteRole(item)">删除</DropdownItem>
                            </DropdownMenu>
                        </Dropdown>
                    </li>
                </ul>
            </div>
        </div>
        <div class="content-right">
            <div class="content-title">
                <p>人员目录</p>
                <div class="add-member" @click="addMemberCtrl=true">
                    <span class="icon-add-01"></span>
                    <span class="add-member-text">添加成员</span>
                </div>
            </div>
            <div class="content-right-top">
                <div class="contanier">
                    <!-- <p class="title">成员目录</p> -->
                    <ul class="member-list">
                        <li v-for="item in memberList" :key="item.id">
                            <span class="member-name textover" :title="item.name">{{item.name}}</span>
                            <span class="icon-trash-01" @click="deleteMember(item.id)"></span>
                        </li>
                    </ul>
                    <!-- <p class="show-all"><span class="icon-drop-01"></span>显示全部</p> -->
                </div>
            </div>
            <div class="content-title" style="background:#f7f7f7;">
                <p>权限列表</p>
            </div>
            <div class="content-right-bottom" :style="{height:'calc(100% - 246px)'}">
                <div class="table-block" ref="tableBlock" :style="{height:'calc(100% - 50px)'}">
                    <table v-for="(item,index) in permissionData" :key="index" v-if="isShowTable">
                        <tr width="120">
                            <td :rowspan="item.subPermissions?item.subPermissions.length+1:1" width="120">
                                <Checkbox
                                    :indeterminate="item.isIndeterminate"
                                    v-model="item.isChecked"
                                    @on-change="checkChange(item,{})"
                                    ><span>{{item.name}}</span>
                                </Checkbox>
                            </td>
                        </tr>
                        <tr width="100%" v-for="(spec,index) in item.subPermissions" :key="index">
                            <td width="150">
                                <Checkbox
                                    :indeterminate="spec.isIndeterminate"
                                    v-model="spec.isChecked"
                                    @on-change="checkChange(spec,item,null,$event)">
                                    <span>{{spec.name}}</span>
                                </Checkbox>
                            </td>
                            <td>
                                <Checkbox 
                                    style="width:160px"
                                    v-for="(permission2 ,index) in spec.subPermissions"
                                    v-model="permission2.isChecked"
                                    @on-change="checkChange(permission2,spec)"
                                    :key="index"><span>{{permission2.name}}</span></Checkbox>
                            </td>
                        </tr>
                    </table>
                </div>
                <div class="btn-block">
                    <Button type="primary" @click="savePemission" :loading="saveLoading">保存</Button>
                </div>
            </div>
        </div>
        <!-- 新增编辑角色 -->
        <Modal
            v-model="addRoleCtrl"
            :title="modalTitle"
            :width="360"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="角色名称" prop="name">
                    <Input v-model.trim="formValidate.name" type="text" placeholder="角色名称"></Input>
                </FormItem>
                <FormItem label="角色介绍" prop="remark">
                    <Input v-model.trim="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="角色介绍"></Input>
                </FormItem>
                <div style="text-align:center;">
                    <Button type="primary" @click="handleSubmit('formValidate')">确认</Button>
                    <Button @click="addRoleCtrl=false;" style="margin-left: 8px">取消</Button>
                </div>
            </Form>
        </Modal>
        <!-- 删除成员or角色 -->
        <Modal
            v-model="deleteCtrl"
            :title="modalDelete"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">{{deleteWarnning}}</Row>                                                                                                                                                                                  
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="deleteSubmit">确认</Button>
                <Button @click="deleteCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <!-- 添加成员 -->
        <Modal
            v-model="addMemberCtrl"
            title="添加成员"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="transferTree"
                @getValue="getTreeValue"
                :rightHide="false"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="addMemberSubmit">确认</Button>
                <Button @click="addMemberCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
        <Message ref="message" :message="message" :iconType="'error'"></Message>
   </div>
</template>
<script>
import Message from '@/components/common/message/message';
import transferTree from "@/components/common/transferTree/transferTree";
export default {
    data () {
        return {
            memberList:[],
            addRoleCtrl:false,
            formValidate:{
                name:'',
                remark:''
            },
            ruleValidate:{
                name: [{ required: true, message: '请填写用户名称', trigger: 'blur' }]
            },
            modalTitle:'新增角色',
            roleList:[],
            activeLi:0,
            deleteCtrl:false,
            modalDelete:'人员删除确认',
            deleteWarnning:'请问是否确认删除该人员？',
            keyword:'',
            editId:'',
            deleteId:'',
            roleId:'',
            addMemberList:[], //给角色添加成员
            errorMessage:false,
            addMemberCtrl:false, //添加成员
            indeterminate:false,
            checkAll:false,
            permissionData:[],
            message:'',
            allPermissionArr:[],
            isShowTable:true,
            saveLoading:false
        }
    },
    props: [''],
    computed:{},
    methods: {
        getList(arr){
            return arr.filter((item,index)=>{
                return index>0
            })
        },
        handleCheckAll(){
            if (this.indeterminate) {
                this.checkAll = false;
            } else {
                this.checkAll = !this.checkAll;
            }
            this.indeterminate = false;

            if (this.checkAll) {
                this.checkAllGroup = ['2','3','4','5','6','7','8','9','10','11','12','13','14'];
            } else {
                this.checkAllGroup = [];
            }
        },
        checkAllGroupChange(data){
            console.log(data)
            if (data.length === 6) {
                this.indeterminate = false;
                this.checkAll = true;
            } else if (data.length > 0) {
                this.indeterminate = true;
                this.checkAll = false;
            } else {
                this.indeterminate = false;
                this.checkAll = false;
            }
        },
        handleSubmit(name){
            let url = '/base/mgmt-role'
            let ajaxData;
            if(this.modalTitle=='编辑角色'){
                ajaxData = {
                    id:this.editId,
                    name:this.formValidate.name,
                    remark:this.formValidate.remark
                }
            }else{
                ajaxData = {
                    name:this.formValidate.name,
                    remark:this.formValidate.remark
                }
            }
            console.log(ajaxData);
            this.$refs[name].validate((valid) => {
                if (valid) {
                    if(this.modalTitle==='编辑角色'){
                        this.$patch(url,ajaxData).then(res=>{
                            console.log(res);
                            if(res.code==0&&res.data){
                                this.addRoleCtrl = false;
                                this.$Message.success('操作成功！');
                                this.keyword = '';
                                this.getRoleList();
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.$refs[name].resetFields();
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            console.log(res);
                            if(res.code==0&&res.data){
                                this.addRoleCtrl = false;
                                this.$Message.success('操作成功！');
                                this.keyword = '';
                                this.getRoleList();
                            }else{
                                this.$Message.error(res.message);
                            }
                            this.$refs[name].resetFields();
                        })
                    }
                }
            })
        },
        //编辑角色
        editRole(item){
            this.$refs.formValidate.resetFields();
            this.addRoleCtrl = true;
            this.modalTitle = '编辑角色';
            this.formValidate = {
                name:item.name,
                remark:item.remark
            }
            this.editId = item.id;
        },
        //新增角色
        addRole(){
            this.$refs.formValidate.resetFields();
            this.addRoleCtrl = true;
            this.modalTitle = '新增角色';
        },
        //删除角色
        deleteRole(item){
            if(item.userList.length>0){
                this.message = '请先删除角色中的成员!';
                this.$refs.message.show();
            }else{
                this.deleteId = item.id;
                this.deleteCtrl = true;
                this.modalDelete = '角色删除确认';
                this.deleteWarnning = '请问是否确认删除该角色？';
            }
        },
        //删除成员
        deleteMember(id){
            this.deleteId = id;
            this.deleteCtrl = true;
            this.modalDelete = '人员删除确认';
            this.deleteWarnning = '请问是否确认删除该人员？';
        },
        //删除确认
        deleteSubmit(){
            let url,ajaxData;
            if(this.modalDelete=='角色删除确认'){
                url = '/base/mgmt-role/delete';
                ajaxData = {
                    id:this.deleteId
                }
            }else{
                url = '/base/mgmt-role/user/delete'
                ajaxData = {
                    roleId: this.roleId,
                    userId: this.deleteId
                }
            }
            console.log(ajaxData);
            this.$post(url,ajaxData).then(res=>{
                console.log(res);
                if(res.code==0){
                    this.deleteCtrl = false;
                    this.$Message.success('操作成功！');
                    this.keyword = '';
                    if(this.modalDelete=='角色删除确认'){
                        this.getRoleList();
                    }else{
                        this.getMemberByRoleId(this.roleId);
                    }
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //获取角色列表
        getRoleList(){
            let url = '/base/mgmt-roles';
            let ajaxData = {
                keyword:this.keyword
            }
            this.$get(url,ajaxData).then(res=>{
                console.log(res);
                if(res.code==0){
                    if(res.data.length!=0){
                        this.roleList = res.data;
                        this.memberList = this.roleList[0].userList||[];
                        this.roleId = this.roleList[0].id;
                        this.getPermissionByRoleId();
                    }
                }
            })
        },
        getTreeValue(data){
            console.log(data);
            this.addMemberList = data.map(item=>{
                return item.id;
            })
        },
        addMemberSubmit(){
            if(this.addMemberList.length==0){
                this.message = '请选择要添加的角色!';
                this.$refs.message.show();
                return ;
            }
            let url = '/base/mgmt-role/user';
            let ajaxData = {
                userIds:this.addMemberList,
                roleId:this.roleId
            }
            this.$post(url,ajaxData).then(res=>{
                console.log(res);
                if(res.code==0){
                    this.$Message.success('操作成功！');
                    this.addMemberCtrl = false;
                    this.getMemberByRoleId(this.roleId);
                    this.$refs.transferTree.clearSelect();
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //通过角色id获取成员
        getMemberByRoleId(id){
            let url = `/base/mgmt-roles/${id}/users`;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.memberList = res.data;
                }
            })
        },
        //查看角色所有权限
        getPermissionByRoleId(){
            let url = '/base/mgmt-permissions/role/'+this.roleId;
            this.$get(url).then(res=>{
                this.$refs.tableBlock.scrollTop = 0;
                this.allPermissionArr = [];
                this.permissionData = res.data;
                this.duePermissonData(this.permissionData);
            })
        },
        //点击li标签
        handleClick(item,index){
            this.activeLi = index;
            this.roleId=item.id;
            this.getMemberByRoleId(item.id)
            this.getPermissionByRoleId();
        },
        //权限列表数据处理
        duePermissonData(arr,parentObj){
            if(!arr){return}
            arr.forEach((item,index)=>{
                this.allPermissionArr.push(item);

                // 处理默认值 start
                item.isChecked = item.hasPermission;
                if(item.hasPermission && item.subPermissions){
                    item.subPermissions.forEach((itemChildren,indexChildren)=>{

                        if(itemChildren.hasPermission && itemChildren.subPermissions){
                            itemChildren.subPermissions.forEach((itemLast,indexLast)=>{
                                itemLast.isChecked = itemLast.hasPermission;
                                this.checkChange(itemLast,itemChildren);
                            })
                        }

                        if(!itemChildren.subPermissions){
                            itemChildren.isChecked = itemChildren.hasPermission;
                            this.checkChange(itemChildren,item);
                        }

                    })
                }
                // 处理默认值 end
                if(item.subPermissions){
                    this.duePermissonData(item.subPermissions,item);
                }
            });
        },
        //反向处理父级元素
        checkParentStatus(obj,parentId){
            if(parentId==1){return}
            this.allPermissionArr.forEach((item,index)=>{
                if(item.id==parentId){
                    this.checkChange(obj,item,true);
                    return
                }
            });
        },
        //正向处理子级元素
        checkChildrenStatus(selfObj){
            if(!selfObj){return}
            // 遍历该元素的子元素
            selfObj.subPermissions.forEach((item,index)=>{
                // 如果该元素是选中状态则将子集ischecked都置为true
                if(selfObj.isChecked){
                    item.isChecked = true;
                    item.hasPermission = true;
                    item.isIndeterminate = false;
                }else{
                    item.isChecked = false;
                    item.hasPermission = false;
                    item.isIndeterminate = false;
                }
                //如果该元素的子集还有子集，则继续调用该方法
                if(item.subPermissions){
                    this.checkChildrenStatus(item);
                }
            })
        },
        //勾选
        checkChange(selfObj,parentObj,bool){
            this.isShowTable = false;
            // 将需要提交的数据的hasPermission置为勾选的状态
            selfObj.hasPermission = (selfObj.isChecked || selfObj.isIndeterminate)?true:false;

            // 勾选子集联动控制
            if(!selfObj.subPermissions){
                let reg = /project:manage:|market-center:customer:|market-center:channel:|project:agreement:|clue:mission:|clue:result:/;
                let reg2 = /project:agreement:/;
                let keyArr = selfObj.code.split(":");
                let keyType = "";
                if(!selfObj.code.match(reg2)){
                    keyType = keyArr[2] && keyArr[2].replace("-","");
                }else{
                    keyType = keyArr[3] && keyArr[3].replace("-","");
                }
                if(selfObj.isChecked){  //勾选
                    parentObj.subPermissions.forEach((item,index)=>{
                        if(selfObj.code.match(reg)!=-1){
                            if(item.code.indexOf(keyType)!=-1 && item.code.indexOf("view")!=-1){
                                item.hasPermission = true;
                                item.isChecked = true;
                                return
                            }
                        }
                        if(!selfObj.code.match(reg) && item.code.indexOf("view")!=-1){
                            item.hasPermission = true;
                            item.isChecked = true;
                            return
                        }
                    })
                }else if(!selfObj.isChecked){  //取消勾选
                    if(selfObj.code.indexOf("view")!=-1){
                        parentObj.subPermissions.forEach((item,index)=>{
                            if(selfObj.code.match(reg)!=-1 && item.code.indexOf(keyType)!=-1){
                                item.hasPermission = false;
                                item.isChecked = false;
                            }
                            if(!selfObj.code.match(reg)){
                                item.hasPermission = false;
                                item.isChecked = false;
                            }
                        })
                    }
                }
            }

            // 如果该项勾选了并且底下还有子节点，将半选状态取消
            if(selfObj.isChecked){
                selfObj.isIndeterminate = false;
            }

            // 如果该项不是第一级则判断该项父级元素的状态
            if(selfObj.parentId!=1){
                // 如果该项是勾选状态或者是半勾选状态
                if(selfObj.isChecked || selfObj.isIndeterminate){
                    let checkLength = 0;
                    // 将父节点的提交状态变为true
                    parentObj.hasPermission = true;
                    // 判断同级节点勾选的有多少个
                    parentObj.subPermissions.forEach((item,index)=>{
                        if(item.isChecked){
                            checkLength++;
                        }
                    });
                    // 如果同级节点全部勾选则将父级勾选状态置为true,半勾选状态置为false
                    if(checkLength==parentObj.subPermissions.length){
                        parentObj.isIndeterminate = false;
                        parentObj.isChecked = true;
                    }else{
                        parentObj.isIndeterminate = true;
                        parentObj.isChecked = false;
                    }
                }else{
                    // 如果该项是不勾选状态，将父节点的勾选状态
                    let checkLength = 0;
                    parentObj.subPermissions.forEach((item,index)=>{
                        if(item.isChecked || item.isIndeterminate){
                            checkLength++;
                            parentObj.isChecked = false;
                            parentObj.isIndeterminate = true;
                        }
                    });
                    if(checkLength!=0){
                        parentObj.isChecked = false;
                        parentObj.isIndeterminate = true;
                    }else{
                        parentObj.isChecked = false;
                        parentObj.hasPermission = false;
                        parentObj.isIndeterminate = false;
                    }
                }
                // 如果父级节点还有父级节点，则重新调用该方法
                this.checkParentStatus(parentObj,parentObj.parentId);
            }

            // 如果该节点有子节点，则处理子节点的状态，如果已经是从该方法过来的，则不需要重复处理子集状态
            if(selfObj.subPermissions && !bool){
                this.checkChildrenStatus(selfObj);
            }
            this.isShowTable = true;
        },
        savePemission(){
            let url = '/base/mgmt-role/permission';
            let ajaxData = {
                roleId:this.roleId,
                permissionIds:[]
            }
            this.allPermissionArr.forEach((item,index)=>{
                if(item.hasPermission){
                    ajaxData.permissionIds.push(item.id);
                }
            })
            this.saveLoading = true;
            this.$post(url,ajaxData).then(res=>{
                this.saveLoading = false;
                if(res.code==0){
                    this.$Message.success("操作成功");
                    this.getPermissionByRoleId();
                }else{
                    this.$Message.error(res.message);
                }
            })
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getRoleList();
    },
    updated(){},
    components: {
        Message,
        transferTree
    },
    watch: {
        permissionData:{
            deep:true,
            handler:(val,oldVal)=>{

            }
        }
    }
}
</script>
<style lang="sass" scoped>
@import "./positionManage"
</style>
<style lang="scss">
.position-manage-box .permission-tree{
    // >.ivu-tree-children{
    //     position: relative;
    //     >li>.ivu-tree-children{
    //         position: absolute;;
    //     }
    // }
}
</style>


