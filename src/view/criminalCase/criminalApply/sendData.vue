<template>
    <div>
        <Button class="add-btn" type="primary" v-if="detail.sentList&&detail.sentList.length==0" @click="addCtrl=true">新建寄送</Button>
        <Row style="margin-top:10px;padding-left:10px;">
            <Row class="list" v-for="item in detail.sentList" :key="item.id">
                <div class="list-tag">寄出的</div>
                <Col>
                    <span class="body">{{item.sender}}</span><br/>
                    <span class="header">寄件人</span>
                </Col>
                <Col>
                    <span class="body">{{item.recipient}}</span><br/>
                    <span class="header">收件人</span>
                </Col>
                <Col>
                    <span class="body">{{item.sentTime}}</span><br/>
                    <span class="header">寄件时间</span>
                </Col>
                <Col>
                    <span class="body">{{item.courierCompanyName}}</span><br/>
                    <span class="header">快递公司</span>
                </Col>
                <Col>
                    <span class="body">{{item.expressNo}}</span><br/>
                    <span class="header">快递单号</span>
                </Col>
                <Col>
                    <span class="body">
                        <Tooltip max-width="200" :content="getContentStr(item.contentList)">
                            <div class="textover" style="width:200px;">{{getContentStr(item.contentList)}}</div>
                        </Tooltip>
                    </span><br/>
                    <span class="header">快递内容</span>
                </Col>
                <Col>
                    <span class="body check-express-mes" @click="getExpressMes(item.courierCompany,item.expressNo)">查看物流</span><br/>
                    <span class="header">物流信息</span>
                </Col>
                <Col>
                    <span class="body icon icon-edit-01" @click="edit(item)"></span><br/>
                </Col>
            </Row>
            <Row class="list" v-for="item in detail.reciveList" :key="item.id">
                <div class="list-tag">收到的</div>
                <Col>
                    <span class="body">{{item.sender}}</span><br/>
                    <span class="header">寄件人</span>
                </Col>
                <Col>
                    <span class="body">{{item.recipient}}</span><br/>
                    <span class="header">收件人</span>
                </Col>
                <Col>
                    <span class="body">{{item.sentTime}}</span><br/>
                    <span class="header">寄件时间</span>
                </Col>
                <Col>
                    <span class="body">{{item.courierCompanyName}}</span><br/>
                    <span class="header">快递公司</span>
                </Col>
                <Col>
                    <span class="body">{{item.expressNo}}</span><br/>
                    <span class="header">快递单号</span>
                </Col>
                <Col>
                    <span class="body">
                        <Tooltip max-width="200" :content="getContentStr(item.contentList)">
                            <div class="textover" style="width:200px;">{{getContentStr(item.contentList)}}</div>
                        </Tooltip>
                    </span><br/>
                    <span class="header">快递内容</span>
                </Col>
                <Col>
                    <span class="body check-express-mes" @click="getExpressMes(item.courierCompany,item.expressNo)">查看物流</span><br/>
                    <span class="header">物流信息</span>
                </Col>
                <Col>
                    <span class="body icon icon-edit-01" v-show="false" @click="edit(item)"></span><br/>
                </Col>
            </Row>
        </Row>
        <!-- 新建寄送 -->
        <Modal
            v-model="addCtrl"
            title="新建寄送"
            :width="450"
            :footer-hide="true">
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80">
                <FormItem label="收件人" prop="recipient">
                    <Input v-model="formValidate.recipient" placeholder="请填写收件人的名称"></Input>
                </FormItem>
                <FormItem label="寄件时间" prop="sentTime">
                    <DatePicker :value="formValidate.sentTime" @on-change="getSentTime" style="width:100%" type="date" placeholder="请填写寄件时间"></DatePicker>
                </FormItem>
                <FormItem label="快递公司" prop="courierCompany">
                    <Select v-model="formValidate.courierCompany" placeholder="请选择快递公司">
                        <Option v-for="item in courierCompanyArr" :value="item.value" :key="item.id">{{item.nameZh}}</Option>
                    </Select>
                </FormItem>
                <FormItem label="快递单号" prop="expressNo">
                    <Input v-model="formValidate.expressNo" placeholder="请填写快递单号"></Input>
                </FormItem>
                <FormItem 
                    v-for="(item,index) in formValidate.contentList" 
                    :label="index==0?'邮寄内容':''"
                    :prop="'contentList.' + index"
                    :rules="ruleValidate.subject"
                    :key="index">
                    <Row class="clearfix">
                        <div class="file-name">
                            <Input v-model="item.name" placeholder="请填写文件名称"></Input>
                        </div>
                        <div class="file-num">
                            <InputNumber v-model="item.num" :max="9999" :min="1" style="width:60px" placeholder="份数"></InputNumber><span>份</span>
                        </div>
                        <div class="add-icon">
                            <span v-if="index==0" class="icon-increase-01" @click="addFile()"></span>
                            <span v-else class="icon-down-01" @click="removeFile(index)"></span>
                        </div>
                    </Row>
                </FormItem>
                <FormItem style="text-align:center;">
                    <Button type="primary" :disabled="isSubmit" @click="add('formValidate')">确认</Button>
                    <Button @click="addCtrl=false;" style="margin-left: 8px">取消</Button>
                </FormItem>
            </Form>
        </Modal>
        <!-- 物流信息 -->
        <Modal
            v-model="logisticsCtrl"
            :title="'快递单号'+this.expressNo"
            width="550"
            :footer-hide="true">
            <logistics-information v-if="logisticsCtrl" :expressNo="expressNo" :company="company"></logistics-information>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        const rulesValid = (rule,value,callback) => {
            let arr = rule.fullField.split(".");
            let key = arr[0];
            let index = arr[1];
            if(!this.formValidate[key][index].name){
                return callback(new Error('请输入文件名称'));
            }
            if(this.formValidate[key][index].name&&this.formValidate[key][index].name.length>32){
                return callback(new Error('长度不能超过32个字符'));
            }
            if(!this.formValidate[key][index].num){
                return callback(new Error('请输入文件份数'));
            }
            callback();
        }
        return {
            styles:styles,
            courierCompanyArr:[],
            formValidate:{
                recipient:'',
                sentTime:'',
                courierCompany:'',
                expressNo:'',
                contentList:[
                    {
                        name:'',
                        num:1
                    }
                ]
            },
            ruleValidate:{
                recipient:[
                    { required: true, message: '收件人不能为空', trigger: 'blur' },
                    { max:32, message: '长度不能超过32个字符', trigger: 'blur' }
                ],
                sentTime:[{ required: true, message: '寄送时间不能为空', trigger: 'change' }],
                courierCompany:[{ required: true, message: '快递公司不能为空', trigger: 'change' }],
                expressNo:[
                    { required: true, message: '快递单号不能为空', trigger: 'blur' },
                    { max:16, message: '长度不能超过16个字符', trigger: 'blur' }
                ],
                subject:[{required: true,validator:rulesValid}]
            },
            addCtrl:false,
            detail:'',
            logisticsCtrl:false,
            expressNo:'',
            company:'',
            editId:'',
            isSubmit:false
        }
    },
    props: ['processId','caseId'],
    methods: {
        getContentStr(arr){
            let str = '';
            for(let i=0; i<arr.length; i++){
                str += arr[i].name +' X '+ arr[i].num +' , ';
            }
            return str.slice(0,-2);
        },
        add(name){
            this.$refs[name].validate((vaild)=>{
                if(vaild){
                    let url = '/business/case/criminal/material-sent';
                    let ajaxData = {};
                    Object.assign(ajaxData,this.formValidate)
                    ajaxData.processId = this.processId;
                    ajaxData.caseId = this.caseId;
                    this.isSubmit = true;
                    if(this.editId){
                        ajaxData.id = this.editId;
                        this.$patch(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code===0){
                                this.$emit('reloadProcess');
                                this.$Message.success('操作成功');
                                this.getData();
                            }
                        })
                    }else{
                        this.$post(url,ajaxData).then(res=>{
                            this.isSubmit = false;
                            if(res.code===0){
                                this.$emit('reloadProcess');
                                this.$Message.success('操作成功');
                                this.getData();
                            }
                        })
                    }
                }
            })
        },
        //获取详情
        getData(){
            this.addCtrl = false;
            let url = `/business/case/criminal/material-sent?processId=${this.processId}`;
            this.$get(url).then(res=>{
                if(res.code===0){
                    if(res.data){
                        this.detail = res.data;
                    }else{
                        this.detail = {
                            sentList:[]
                        };
                    }
                }
            })
        },
        edit(item){
            let data = JSON.parse(JSON.stringify(item));
            this.editId = data.id;
            for(let key in this.formValidate){
                if(key==='contentList'){
                    this.formValidate.contentList = data.contentList.map(item=>{
                        return {
                            name:item.name,
                            num:item.num
                        }
                    })
                }else{
                    this.formValidate[key] = data[key];
                }
            }
            this.formValidate.sentTime = data.sentTime;
            this.addCtrl = true;
        },
        //获取物流信息
        getExpressMes(courierCompany,expressNo){
            this.company = courierCompany;
            this.expressNo = expressNo;
            this.logisticsCtrl = true;
        },
        getSentTime(value){
            this.formValidate.sentTime = value;
        },
        addFile(){
            this.formValidate.contentList.push({
                name:'',
                num:1
            })
        },
        removeFile(index){
            this.formValidate.contentList.splice(index,1);
        },
        //获取字典数据接口
        async getDictionary(){
            this.courierCompanyArr = await this.common.getDictionaryItems('courier_company');
        },
    },
    created(){},
    beforeMount(){
        this.getDictionary();
        this.getData()
    },
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style scoped lang="scss">
@import '../../civilCase/lawsuitProgramme/sendData.scss';
@import '../../civilCase/caseCommon.scss';
</style>
