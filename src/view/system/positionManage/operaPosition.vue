<template>
   <div>
       <Row class="header-box">
            <Button to="/system/positionManage/main">返回</Button>
            <Form ref="formValidate" :model="formValidate" :rules="ruleValidate" :label-width="80" class="form-box">
                <FormItem label="职务名称" prop="name">
                    <Input v-model="formValidate.name" placeholder="请输入职务" class="header-input"></Input>
                </FormItem>
                <FormItem label="职务描述" prop="describe">
                    <Input v-model="formValidate.describe" type="textarea" placeholder="" class="header-input"></Input>
                </FormItem>
            </Form>
       </Row>
       <Row>
            <Table :columns="columns" :data="data"></Table>
       </Row>
       <Row class="btn-box">
            <Button type="primary" class="add-btn">保存</Button>
            <Button to="/system/positionManage" class="add-btn">取消</Button>
       </Row>
   </div>
</template>
<script>
export default {
    data () {
        return {
            aparmentId:"",
            formValidate:{
                name:"",
                describe:""
            },
            ruleValidate:{
                name:[{required: true, message: '职务名称不能为空', trigger: 'blur'}]
            },
            columns:[
                {
                    title:'功能名称',
                    key:'name',
                    width:300
                },
                {
                    title: '权限',
                    key: 'childNodeList',
                    render:(h,params)=>{
                        let t = this;
                        let childList = params.row.childNodeList;
                        let data = this.dueData(params.row.childNodeList);
                        return h("Tree",{
                            props:{
                                data:data,
                                "show-checkbox":true,
                                multiple:true
                            },
                            on:{
                                "on-check-change":(dataArr)=>{
                                    if(dataArr.length!=0 && !data[0].checked){
                                        t.$set(data[0],"checked",true);
                                        t.$set(data[0],"indeterminate",false);
                                        dataArr.push(data[0]);
                                    }
                                }
                            }
                        })
                    }
                },
                {
                    title: '权限描述',
                    key: 'describe',
                    render:(h,params)=>{
                        let childList = params.row.childNodeList;
                        let arrs = [];
                        arrs = this.renderPerson(h,childList,[]);
                        return h("div",{
                            style:{
                                padding:"10px 0"
                            }
                        },arrs)
                    }
                }
            ],
            data:[
                {
                    name: "客户管理",
                    childNodeList:[
                        {
                            name:"客户信息查看",
                            remark:"查看客户信息功能权限",
                            childNodeList:null
                        },
                        {
                            name:"客户信息管理",
                            remark:"具有新增、修改、启用、禁用客户信息功能权限",
                            childNodeList:[
                                {
                                    name:"新增/修改",
                                    childNodeList:null,
                                    remark:"具有新增、修改客户功能权限"
                                },
                                {
                                    name:"启用/禁用",
                                    childNodeList:null,
                                    remark:"具有启用、禁用功能权限"
                                }
                            ]
                        },
                        {
                            name:"客户信息维护",
                            remark:"维护客户相关信息功能权限",
                            childNodeList:[
                                {
                                    name:"知识产权管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"联系人管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"拜访记录管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"合同管理",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "律师团队",
                    childNodeList:[
                        {
                            name:"律师团队信息查看",
                            remark:"查看律师团队信息功能权限",
                            childNodeList:null
                        },
                        {
                            name:"律师团队信息管理",
                            remark:"具有新增、修改、启用、禁用律师团队信息功能权限",
                            childNodeList:[
                                {
                                    name:"新增/修改",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"启用/禁用",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"审核",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        },
                        {
                            name:"律师团队信息维护",
                            remark:"维护律师团队相关信息功能权限",
                            childNodeList:[
                                {
                                    name:"拜访记录管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"合同管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"计划管理",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"合同管理",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "调查团队",
                    childNodeList:[
                        {
                            name:"调查团队信息查看",
                            remark:"查看调查团队信息功能权限",
                            childNodeList:null
                        },
                        {
                            name:"调查团队信息管理",
                            remark:"具有新增、修改、启用、禁用调查团队信息功能权限",
                            childNodeList:[
                                {
                                    name:"新增/修改调查信息",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"启用禁用",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"审核",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        },
                        {
                            name:"调查团队信息维护",
                            remark:"维护调查团队相关信息功能权限",
                            childNodeList:[
                                {
                                    name:"合同管理",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "调查团队",
                    childNodeList:[
                        {
                            name:"调查团队信息查看",
                            remark:"查看调查团队信息功能权限",
                            childNodeList:null
                        },
                        {
                            name:"调查团队信息管理",
                            remark:"具有新增、修改、启用、禁用调查团队信息功能权限",
                            childNodeList:[
                                {
                                    name:"新增/修改调查信息",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"启用禁用",
                                    childNodeList:null,
                                    remark:null
                                },
                                {
                                    name:"审核",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        },
                        {
                            name:"调查团队信息维护",
                            remark:"维护调查团队相关信息功能权限",
                            childNodeList:[
                                {
                                    name:"合同管理",
                                    childNodeList:null,
                                    remark:null
                                }
                            ]
                        }
                    ]
                },
            ],
        }
    },
    props: [''],

    methods: {
        //数据处理(后期与后端商量返回字段参数，以便不用调用这个方法)
        dueData(data){
            for(let i=0;i<data.length;i++){
                data[i].title = data[i].name;
                data[i].children = data[i].childNodeList;
                if(data[i].childNodeList && data[i].childNodeList.length!=0){
                    data[i].expand = true;
                    this.dueData(data[i].childNodeList);
                }
            }
            return data
        },
        //渲染权限表格第三栏的内容
        renderPerson(h,arr,resultArr){
            for(let i = 0;i < arr.length; i++){
                let remarkP = h("p",{
                    attrs:{
                        title:arr[i].remark
                    },
                    class:{
                        "draw-one-line":true
                    },
                    style:{
                        height:"18px"
                    }
                }, arr[i].remark);
                resultArr.push(remarkP);
                if(arr[i].childNodeList && arr[i].childNodeList.length!=0){
                    this.renderPerson(h,arr[i].childNodeList,resultArr);
                }
            }
            return resultArr
        }
    },
    created(){

    },
    beforeMount(){
        this.aparmentId = this.$route.params.aparmentId;
    },
    mounted(){
        if(this.aparmentId!="null"){
            //调用接口，获取该部门的权限数据
        }
    },
    updated(){

    },
    components: {

    },
    watch: {

    }
}
</script>
<style lang="sass" scoped>
@import "./operaPosition"
</style>
<style lang="scss">
// 表格render内的class写了scoped不生效，不写才生效
.draw-one-line{
    margin-bottom:8px;
    display:-webkit-box;
    -webkit-box-orient:vertical;
    -webkit-line-clamp:1;
    overflow:hidden;
}
</style>

