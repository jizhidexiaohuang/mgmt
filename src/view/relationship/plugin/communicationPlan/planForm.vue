<template>
    <div class="plan-form">
        <Row>
            <Form :model="formItem" ref="planForm" :rules="formValidate" :label-width="70" style="padding:10px 20px;">
                <Col span="11">
                    <FormItem label="计划时间" prop="startTime">
                        <DatePicker 
                            type="datetimerange" 
                            format="yyyy-MM-dd HH:mm" 
                            placeholder="请选择计划时间" 
                            @on-change="getTime"
                            :value="timeRange"
                            style="width:100%;"></DatePicker>
                    </FormItem>
                </Col>
                <Col span="12" offset="1">
                    <FormItem label="提醒人员" prop="remindUserIds">
                        <!-- <Input readonly/> -->
                        <div class="tag">
                            <Tag 
                            class="render-tag-style tag-style" 
                            v-for="(item,index) in renderMetionArr" 
                            :key="index" 
                            type="border" 
                            :color="mainColor.globalMainColor" 
                            closable 
                            @on-close="clearMetionPerson(index)">{{common.cutString(item.name,4)}}</Tag>
                            <span class="add-btn add-tag" @click="metionPersonCtrl=true">
                                <Icon type="ios-add" />
                                <span>添加</span>
                            </span>
                        </div>
                            <!-- <div class="show-more-icon" v-if="renderMetionArr.length>2" @click="showMoreBox">
                                <Icon type="md-arrow-dropleft" size="16" :color="mainColor.globalMainColor"/>
                            </div> -->
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="计划名称" prop="name">
                        <Input placeholder="请输入计划名称" v-model.trim="formItem.name"/>
                    </FormItem>
                </Col>
                <Col span="24">
                    <FormItem label="计划内容" prop="content">
                        <Input type="textarea" placeholder="请输入计划内容" v-model.trim="formItem.content"/>
                    </FormItem>
                </Col>
            </Form>
        </Row>
        <Row class="plan-edit-form-btn">
            <Button type="primary" :disabled="submitLoading" :loading="submitLoading" @click="savePlan()">保存</Button>
            <Button type="default" @click="cancelSavePlan()">取消</Button>
        </Row>

        <Modal
            v-model="metionPersonCtrl"
            title="选择提醒人"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="TreePersonInCharge"
                :defaultData="formItem.remindUserIds"
                @getValue="getPersonInCharge"
            ></transfer-tree>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="metionPersonCtrl=false;">确认</Button>
                <Button @click="metionPersonCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>s
<script>
import transferTree from "@/components/common/transferTree/transferTree";
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        const validateTime = (rule, value, callback) => {
            if(!this.formItem.startTime){
                return callback(new Error('请选择计划开始时间'));
            }
            if(!this.formItem.endTime){
                return callback(new Error('请选择计划结束时间'));
            }
            if (!this.formItem.startTime && !this.formItem.endTime) {
                return callback(new Error('请选择计划时间'));
            } 
                
            callback();
        };
        return {
            mainColor:styles,
            metionPersonCtrl:false,
            renderMetionArr:[],
            timeRange:[],
            formItem:{
                startTime:"",
                endTime:"",
                remindUserIds:[],
                name:"",
                content:""
            },
            //表单验证规则
            formValidate: {
                name:[
                    { required: true, message: "请填写计划名称", trigger: "blur" },
                    { max:60,message:'不能超过60个字符',trigger:'blur'}
                ],
                startTime:[{ required: true,validator:validateTime, message: "请选择计划时间", trigger: "blur" }],
                remindUserIds:[{ required: true,type:"array", message: "请选择提醒人员", trigger: "blur" }],
                content:[
                    { required: true, message: "请填写计划内容", trigger: "blur" },
                    { max:1024,message:'不能超过1024个字符',trigger:'blur'}
                ],
            },
            submitLoading:false
        }
    },
    props: ['planId','index','custId'],
    methods: {
        // 获取提醒人员
        getPersonInCharge(data){
            this.formItem.remindUserIds = [];
            this.renderMetionArr = data;
            data.forEach((item,index)=>{
                this.formItem.remindUserIds.push(item.id);
            })
        },
        // 获取plan详情
        getPlanDetail(){
            let url = "/base/customer-plan/"+this.planId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.giveDefaultData(res.data);
                }
            })
        },
        giveDefaultData(data){
            this.timeRange.push(data.startTimeStr);
            this.timeRange.push(data.endTimeStr);
            this.formItem.startTime = data.startTimeStr;
            this.formItem.endTime = data.endTimeStr;
            this.formItem.name = data.name;
            this.formItem.content = data.content;
            data.users.forEach((item,index)=>{
                this.renderMetionArr.push(item);
                this.formItem.remindUserIds.push(item.id);
            })
        },
        getTime(date){
            this.formItem.startTime = date[0];
            this.formItem.endTime = date[1];
        },
        savePlan(){
            this.$refs["planForm"].validate((valid) => {
                if(valid){
                    let url = '/base/customer-plan';
                    let ajaxData = {
                        custId:this.custId
                    }
                    if(this.planId){
                        ajaxData.id = this.planId;
                    }
                    Object.assign(ajaxData,this.formItem);
                    this.submitLoading = true;
                    if(this.planId){
                        this.$patch(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.cancelSavePlan(true);
                                this.$Message.success("操作成功");
                            }else{
                                this.$Message.success(res.message);
                            }
                            this.submitLoading = false;
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            if(res.code==0){
                                this.cancelSavePlan(true);
                                this.$Message.success("操作成功");
                            }else{
                                this.$Message.success(res.message);
                            }
                            this.submitLoading = false;
                        })
                    }
                }
            });
        },
        clearMetionPerson(index){
            let id = this.renderMetionArr[index].id;
            this.$refs.TreePersonInCharge.clearOneSelect(id);
        },
        cancelSavePlan(bool){
            if(this.planId){
                this.$emit("closeEdit",this.index,bool);
            }else{
                this.$emit("closeEdit",null,bool);
            }
        },
        showMoreBox(){
            console.log("点击了");
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        if(this.planId){
            this.getPlanDetail();
        };
    },
    updated(){},
    components: {
        transferTree
    },
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./planForm.scss"
</style>
<style lang="scss">
.plan-form .render-tag-style{
    height: 20px;
    line-height: 20px;
}
</style>