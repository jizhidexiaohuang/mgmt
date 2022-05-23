<template>
    <div>
        <Form ref="serviceform" :model="form" :rules="formValidate" :label-width="80">
            <FormItem label="任务名称" prop="jobDesc">
                <Input v-model.trim="form.jobDesc" placeholder="请输入任务名称"></Input>
            </FormItem>
            <FormItem label="执行器" prop="jobGroup">
                <Select v-model="form.jobGroup" placeholder="请选择执行器">
                    <Option v-for="item in jobGroupArr" :value="item.id" :key="item.id">{{ item.title }}</Option>
                </Select>
            </FormItem>
            <FormItem label="执行规则" prop="jobCron">
                <Input v-model.trim="form.jobCron" placeholder="请输入执行规则"></Input>
            </FormItem>
            <FormItem label="任务参数" prop="executorParam">
                <Input v-model="form.executorParam" type="textarea" placeholder="任务参数" :rows="5"/>
            </FormItem>
        </Form>
        <div class="drawer-style drawer-btn" style="text-align:center;">
            <Button type="primary" class="drawer-add-btn" :disabled="confirmLoading" :loading="confirmLoading" @click="addConfirm">确认</Button>
            <Button class="drawer-add-btn" @click="cancelAdd">取消</Button>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            form:{
                jobDesc:"",
                jobCron:"",
                executorParam:"",
                jobGroup:""
            },
            formValidate:{
                jobDesc:[
                    {required: true,message:"任务名称不能为空", trigger: "blur" },
                ],
                jobCron:[
                    {required: true,message:"执行规则不能为空", trigger: "blur" },
                ],
                executorParam:[
                    {required: true,message:"任务参数不能为空", trigger: "blur" },
                ]
            },
            jobGroupArr:[],
            confirmLoading:false
        }
    },
    props: [''],
    methods: {
        getJobGroup(){
            let url = "/task/tasks/actuators";
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.jobGroupArr = res.data;
                }
                this.confirmLoading = false;
            });
        },
        addConfirm(){
            this.$refs["serviceform"].validate((valid) => {
                if(valid){
                    let url = "/task/task";
                    let ajaxData = this.form;
                    this.confirmLoading = true;
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$Message.success("操作成功");
                            this.$emit("changeEditCtrl",false,true);
                        }else{
                            this.$Message.error(res.message);
                        }
                        this.confirmLoading = false;
                    });
                }
            });
        },
        cancelAdd(){
            this.$emit("changeEditCtrl",false);
        }
    },
    created(){},
    beforeMount(){
        this.getJobGroup();
    },
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
