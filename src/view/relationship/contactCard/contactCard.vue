<template>
    <div>
        <!-- 内容区域 -->
        <Row class="contact-box">
            <Row class="detail-header">
                <Button style="float:right;" @click="openAddModel">新增联系人</Button>
            </Row>
            <div class="contact-card" v-for="(item,index) in data" :key="index">
                <Row class="contact-card-title">
                    <span class="text-over" :title="item.name">{{item.name}}</span>
                    <span class="icon-edit contact-card-btn" title="编辑" @click="openEditModel"></span>
                    <span class="icon-delete contact-card-btn" title="删除" @click="deleteCtrl=true"></span>
                </Row>
                <Row class="contact-card-content">
                    <p>职务:{{item.position}}</p>
                    <p>手机号:{{item.tellphone}}</p>
                    <p>电话:{{item.phone}}</p>
                    <p>邮箱:{{item.email}}</p>
                </Row> 
            </div>
        </Row>
        <!-- 新增or编辑联系人弹窗 -->
        <Modal 
            v-model="modalCtrl" 
            :title="isEdit?'编辑联系人':'新增联系人'"
            @on-ok="confirm"
            @on-cancel="cancel">
            <Form ref="formValidate" :model="formValidate" style="padding-right:20px;" :rules="ruleValidate" :label-width="70">
                <FormItem label="姓名">
                    <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="性别" prop="departmentName">
                    <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="职务">
                    <Input v-model="formValidate.remark" type="textarea" :autosize="{minRows: 2,maxRows: 5}"></Input>
                </FormItem>
                <FormItem label="电话" prop="departmentName">
                    <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="手机号码" prop="departmentName">
                    <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
                </FormItem>
                <FormItem label="邮箱" prop="departmentName">
                    <Input v-model="formValidate.name" placeholder="请输入部门名称"></Input>
                </FormItem>
            </Form>
        </Modal>
        <!-- 删除联系人提示弹窗 -->
        <Modal v-model="deleteCtrl" :footer-hide="true" width="360">
            <p class="do-sn-p">确认删除该联系人吗？</p>
            <div class="do-sn-div">
                <Button type="primary" class="do-div-btn" @click="deleteContact">删除</Button>
                <Button class="do-div-btn" @click="deleteCtrl=false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            modalCtrl:false,
            deleteCtrl:false,
            isEdit:true,
            formValidate:{
                name:"",
                remark:""
            },
            ruleValidate:{

            }
        }
    },
    props: ['data'],
    methods: {
        openAddModel(){
            this.modalCtrl = true;
            this.isEdit = false;
        },
        openEditModel(){
            this.modalCtrl = true;
            this.isEdit = true;
        },
        confirm(){},
        cancel(){},
        deleteContact(){
            this.deleteCtrl = false;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./contactCard"
</style>

