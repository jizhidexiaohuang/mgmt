<template>
    <div>
        <Row class="detail-header">
            <Button style="float:right;" @click="isEditDetail=true">新增计划111</Button>
        </Row>
        <Row v-if="!isEditDetail">
            <Row class="detail-content plan-content">
                <Col span="24" class="plan-title">
                    <span class="text-over" title="111奥术大师大所大所大所大所大所大大大所大所大所">111奥术大师大所大所大所大所大所大大大所大所大所</span>
                    <span class="icon-edit plan-btn" title="编辑" @click="openEditModel"></span>
                    <span class="icon-delete plan-btn" title="删除" @click="deleteCtrl=true"></span>
                </Col>
                <Col span="3" class="left-label">创建人：</Col>
                <Col span="19" class="right-content">管理员</Col>
                <Col span="3" class="left-label">计划内容：</Col>
                <Col span="19" class="right-content">大大</Col>
                <Col span="3" class="left-label">提醒人：</Col>
                <Col span="19" class="right-content">安江瑞</Col>
            </Row>
        </Row>
        <Row v-if="isEditDetail" class="form-plan">
            <Form :model="formData" :rules="ruleValidate" :label-width="80">
                <FormItem label="计划标题" prop="fileName">
                    <Input v-model="formData.fileName" placeholder="请输入计划标题"></Input>
                </FormItem>
                <FormItem label="计划内容" prop="customer">
                    <Input v-model="formData.fileName" placeholder="请输入计划内容"></Input>
                </FormItem>
                <FormItem label="计划时间" prop="customer">
                    <DatePicker type="date" placeholder="请选择计划时间" style="width:100%;"></DatePicker>
                </FormItem>
                <FormItem label="提醒人员" prop="customer">
                    <Input v-model="formData.fileName" placeholder="请输入提醒人员"></Input>
                </FormItem>
                <FormItem label="提醒方式" prop="customer">
                    <Select v-model="formData.metionWay">
                        <Option  value="1">半个小时前</Option>
                        <Option  value="2">一个小时前</Option>
                        <Option  value="3">二个小时前</Option>
                        <Option  value="4">五个小时前</Option>
                        <Option  value="5">一天前</Option>
                        <Option  value="6">自定义</Option>
                    </Select>
                </FormItem>
                <FormItem label="提醒时间" prop="customer" v-if="formData.metionWay == '6'">
                    <DatePicker type="date" placeholder="请选择提醒时间" style="width:100%;"></DatePicker>
                </FormItem>
                <FormItem label="提醒途径" prop="customer">
                    <CheckboxGroup v-model="formData.metionSendWay">
                        <Checkbox label="短信通知"></Checkbox>
                        <Checkbox label="邮件通知"></Checkbox>
                    </CheckboxGroup>
                </FormItem>
            </Form>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;">保存</Button>
                <Button @click="isEditDetail=false">取消</Button>
            </Row>
        </Row>
        <!-- 删除计划提示弹窗 -->
        <Modal v-model="deleteCtrl" :footer-hide="true" width="360">
            <p class="do-sn-p">确认删除该计划吗？</p>
            <div class="do-sn-div">
                <Button type="primary" class="do-div-btn" @click="deletePlan">删除</Button>
                <Button class="do-div-btn" @click="deleteCtrl=false">取消</Button>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            isEditDetail:false,
            deleteCtrl:false,
            formData:{
                fileName:"",
                metionWay:"",
                metionSendWay:[]
            },
            ruleValidate:{}
        }
    },
    props: [''],
    methods: {
        openEditModel(){
            this.isEditDetail = true;
        },
        deletePlan(){
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
@import "./plan"
</style>

