<template>
    <div>
         <Form :model="formData" ref="formData" :rules="ruleValidate" :label-width="100">
            <Row class="detail-form">
                <FormItem label="公告名称" prop="title">
                    <Input v-model.trim="formData.title" type="text" placeholder="请输入公告名称"></Input>
                </FormItem>
                <FormItem label="公告内容" prop="text">
                    <!-- <Input v-model.trim="formData.text" type="textarea" :autosize="{minRows: 2,maxRows: 5}" placeholder="请填写公告内容"></Input> -->
                    <Ckeditor :defaultData="formData.text" :placeholder="'请输入公告内容'" @input="getCkeditorData"></Ckeditor>
                </FormItem>
                <FormItem label="上传附件" prop="attachmentList">
                    <file-upload
                        :defaultList="defaultList || []" 
                        :uploadConfig="uploadConfig"
                        @getFileList="getAttachmentList"></file-upload>
                </FormItem>
                <FormItem label="发布平台" prop="platform">
                    <CheckboxGroup v-model="formData.platform">
                        <Checkbox v-for="item in bulletinPlatformArr" :key="item.value" :label="item.value"><span>{{item.nameZh}}</span></Checkbox>
                    </CheckboxGroup>
                </FormItem>
                <FormItem label="指派团队" prop="bulletinTeamList" v-if="formData.platform.length==1">
                    <div class="tag">
                        <Tag class="tag-style" v-for="(item,index) in assignTeamArr" :key="index" type="border" 
                            :color="styles.globalMainColor" closable @on-close="clearAssignTeam(item,index)">{{item.team}}</Tag>
                        <Button icon="ios-add" type="dashed" size="small" @click="assignTeamCtrl=true">选择团队</Button>
                    </div>
                </FormItem>
                <FormItem label="发布日期" prop="startTime">
                    <DatePicker type="datetime" 
                        style="width:100%"
                        :value="formData.startTime"
                         @on-change="getTime($event,'startTime')"
                        placeholder="请选择发布日期"></DatePicker>
                </FormItem>
                <FormItem label="截止日期" prop="endTime">
                    <DatePicker type="datetime" 
                        style="width:100%"
                        :value="formData.endTime"
                         @on-change="getTime($event,'endTime')"
                        placeholder="请选择截止日期"></DatePicker>
                </FormItem>
            </Row>
            <Row class="detail-btn-box">
                <Button type="primary" style="margin-right:10px;" :disabled="isSubmit" @click="submitAnnouncement('formData','E')">发布</Button>
                <Button @click="submitAnnouncement('formData','D')" :disabled="isSubmit">存为草稿</Button>
            </Row>
        </Form>
        <!-- 指派团队 -->
        <Modal
            v-model="assignTeamCtrl"
            title="选择指派团队"
            :width="800"
            :footer-hide="true">
            <assignTeam ref="AssignTeam" :defaultObjList="defaultTeamList" v-if="assignTeamCtrl"
                :params="{'teamType':this.formData.platform[0]}" @refreshList="getIdList($event)"></assignTeam>
            <Row style="text-align:center;margin:30px 0px 14px;">
                <Button type="primary" @click="confirm">确认</Button>
                <Button @click="cancel" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
import assignTeam from './assignTeam.vue';
export default {
    data () {
        return {
            styles:styles,
            defaultList:[],
            uploadConfig:{
                multiple:false,
                fileName:'',
                readOnly:false,
                maxNum:1
            },
            bulletinPlatformArr:[],
            formData:{
                title:'',
                text:'',
                platform:[],
                bulletinTeamList:[],
                startTime:'',
                endTime:'',
                attachmentList:[]
            },
            ruleValidate:{
                title:[
                    { required:true, message:'公告名称不能为空', trigger:'blur' },
                    { max:32, message:'不能超过32个字符', trigger:'blur' }
                ],
                text:[{ required:true, message:'公告内容不能为空', trigger:'blur' }],
                platform:[{ required:true,type:"array", message:'发布平台不能为空', trigger:'blur' }],
                startTime:[{ required:true, message:'发布日期不能为空', trigger:'blur' }],
                endTime:[{ required:true, message:'截止日期不能为空', trigger:'blur' }]
            },
            isSubmit:false,
            assignTeamCtrl:false,
            assignTeamArr:[],
            defaultTeamList:[]
        }
    },
    props: [''],
    methods: {
        //获取图片列表
        getAttachmentList (arr) {
            this.formData.attachmentList = [];
            arr.forEach((item,index)=>{
                let obj = {
                    fileName:item.fileName,
                    mediaType:item.mediaType,
                    smallUrl:item.smallUrl,
                    url:item.url
                }
                this.formData.attachmentList.push(obj);
            })
        },
        // 获取时间
        getTime(date,name){
            this.formData[name] = date;
        },
        // 获取ckeditor内容
        getCkeditorData(value){
            this.formData.text = value;
        },
        //获取指派团队
        getIdList(data){
            this.assignTeamArr = data;
        },
        // 确定
        confirm(){
            this.assignTeamCtrl = false;
            this.defaultTeamList = this.assignTeamArr;
        },
        //取消
        cancel(){
            this.assignTeamCtrl = false;
            this.assignTeamArr = this.defaultTeamList;
        },
        //清除指派团队
        clearAssignTeam(item,index){
            this.assignTeamArr.splice(index,1);
            this.defaultTeamList = this.assignTeamArr;
        },
        submitAnnouncement(name,state){
            let url = '/business/bulletin';
            let ajaxData = {};
            this.formData.bulletinTeamList = this.assignTeamArr.map(item=>{
                return {teamId:item.teamId,teamType:item.platformSourceType}
            })
            Object.assign(ajaxData,this.formData)
            ajaxData.platform = ajaxData.platform.join(',');
            ajaxData.state = state;
            this.$refs[name].validate((valid) => {
                if(valid){
                    this.$post(url,ajaxData).then(res=>{
                        if(res.code==0){
                            this.$Message.success('操作成功')
                            this.$emit('changeEditCtrl',true);
                        }else{
                            this.$message.error(res.message);
                        }
                    })
                }
            })
        },
        //获取字典数据接口
        async getDictionary(){
            this.bulletinPlatformArr = await this.common.getDictionaryItems('bulletin_platform');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
    },
    mounted(){},
    updated(){},
    components: {assignTeam},
    watch: {}
}
</script>
<style >
 .detail-form .tag{
    height: auto;
    border: 1px solid #ebeaf0;
    padding: 4px 7px;
}
</style>
