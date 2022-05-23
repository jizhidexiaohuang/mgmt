<template>
    <div>
        <Row class="detail-header">
            <Button style="float:right;" @click="editCtrl=true">新增拜访记录</Button>
        </Row>
        <Row>
            <Table :columns="columns" :data="data"></Table>
        </Row>

        <!-- 新增拜访记录弹窗 -->
        <Modal
            v-model="editCtrl"
            title="新增拜访记录"
            @on-ok="finishFunc"
            @on-cancel="cancelFunc">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="拜访日期" prop="date">
                    <DatePicker type="date" placeholder="请选择日期" style="width:380px;" v-model="formValidate.date"></DatePicker>
                </FormItem>
                <FormItem label="受访人" prop="person1">
                    <Input v-model="formValidate.person1" placeholder="请输入受访人姓名" style="width:380px;"></Input>
                </FormItem>
                <FormItem label="负责人" prop="person2">
                    <Input v-model="formValidate.person2" placeholder="请输入负责人姓名" style="width:380px;"></Input>
                </FormItem>
                <FormItem label="拜访方式" prop="way">
                    <Select v-model="formValidate.way" placeholder="Select your city" style="width:380px;">
                        <Option value="1">电话</Option>
                        <Option value="2">微信</Option>
                        <Option value="3">QQ</Option>
                        <Option value="4">邮箱</Option>
                        <Option value="5">登门拜访</Option>
                        <Option value="6">客户到访</Option>
                    </Select>
                </FormItem>
                <FormItem label="沟通内容">
                    <Input v-model="formValidate.content" type="textarea" :row="4" style="width:380px;"></Input>
                </FormItem>
            </Form>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            editCtrl:false,
            columns:[
                {
                    title:"拜访日期",
                    key:"date"
                },
                {
                    title:"受访人",
                    key:"person1"
                },
                {
                    title:"负责人",
                    key:"person2"
                },
                {
                    title:"拜访方式",
                    key:"way"
                },
                {
                    title:"沟通内容",
                    key:"content"
                },
            ],
            formValidate:{
                date:"",
                person1:"",
                person2:"",
                way:"",
                content:""
            },
            ruleValidate:{
                date:[{required: true, type: 'date', message: '拜访日期不能为空', trigger: 'change'}],
                person1:[{required: true, message: '受访人不能为空', trigger: 'blur'}],
                person2:[{required: true, message: '负责人不能为空', trigger: 'blur'}],
                way:[{required: true, message: '拜访方式不能为空', trigger: 'blur'}],
            }
        }
    },
    props: ['data'],
    methods: {
        finishFunc(){

        },
        cancelFunc(){}
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
