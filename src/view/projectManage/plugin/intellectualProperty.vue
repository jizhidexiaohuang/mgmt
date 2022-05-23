<template>
    <div>
        <Row class="intellectual-box">
            <Row class="btn-box" v-if="isAdd">
                <Button type="primary" @click="openAdd" v-permission="[$route.path]">新增</Button>
            </Row>
            <Row class="card-list-box clearfix">
                <Row class="card-block-item" v-for="(item,index) in intellectualList" :key="index">
                    <Row class="card-list-item">
                        <div :class="['card-header' ,'clearfix']">
                            <span class="textover contract-title" :title="item.name || ''">{{item.name || ""}}</span>
                            <Row style="float:right;">
                                <Dropdown
                                    @on-click="option(item,$event)"
                                    style="margin-right: 10px" 
                                    placement="bottom-end" v-permission="[$route.path]">
                                    <a href="javascript:void(0)">
                                        <i class="icon-omitted-01"></i>
                                    </a>
                                    <DropdownMenu slot="list">
                                        <DropdownItem name="info">查看</DropdownItem>
                                        <DropdownItem name="edit">编辑</DropdownItem>
                                        <DropdownItem name="delete">删除</DropdownItem>
                                    </DropdownMenu>
                                </Dropdown>
                            </Row>
                            <Tag :style="contractState" type="border" 
                            :color="contractStateCtrl(item.state)?mainColor.successColor:mainColor.errorColor">{{item.ipStateZh}}</Tag>
                        </div>
                        <div class="card-content">
                            <Row class="card-content-item textover" :title='item.ipNumber || ""'>
                                权利编号：{{item.ipNumber || ""}}
                            </Row>
                            <Row class="card-content-item textover" :title='item.ipTypeZh || ""'>
                                权利类型：{{item.ipTypeZh || ""}}
                            </Row>
                            <Row class="card-content-item textover" v-if="item.ipType=='P' || item.ipType=='T'" :title='item.ipSpecialTypeZh || ""'>
                                {{item.ipType=='T'?'商标分类':'专利分类'}}：{{item.ipSpecialTypeZh || ""}}
                            </Row>
                            <Row class="card-content-item textover" :title="item.holder || ''">
                                权利人：{{item.holder || ""}}
                            </Row>
                        </div>
                    </Row>
                </Row>
            </Row>
        </Row>
        <!-- 详情||编辑||新增 -->
        <Modal 
            v-model="addModal"
            :title="modalTitle"
            :footer-hide="true">
            <div :style="{'max-height':clientHeight+'px','overflow-y':'auto'}" v-if="addModal">
                <intellectual-info :detail="activeObj || {}" v-if="operateName=='info'"></intellectual-info>
                <intellectual-form v-if="(operateName=='add' || operateName=='edit')" :projectId="projectId" :defaultData="activeObj" @closeModal="closeModal"></intellectual-form>
            </div>
        </Modal>

        <!-- 删除 -->
        <Modal
            v-model="delModal"
            title="删除确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否删除此知识产权？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" :disabled="isSubmit" @click="delSumbit">确认</Button>
                <Button :disabled="isSubmit" @click="delModal=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import fileContainer from '@/components/common/fileContainer/fileContainer.vue';
import intellectualForm from './intellectualForm.vue';
import intellectualInfo from "./intellectuallInfo.vue";
export default {
    data () {
        return {
            mainColor:styles,
            isSubmit:false,
            addModal:false,
            delModal:false,
            intellectualList:[],
            operateName:"info",
            activeObj:"",
            clientHeight:500,
            contractState:{
                float:'right',
                marginTop:'7px',
                marginRight:'10px',
                borderRadius:'11px'
            }
        }
    },
    props: ["projectId","isAdd"],
    methods: {
        getIntellectualList(){
            let url = '/business/ipRights?projectId='+this.projectId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.intellectualList = res.data || [];
                }
            })
        },
        openAdd(){
            this.operateName = "add";
            this.addModal = true;
        },
        closeModal(bool){
            this.addModal = false;
            if(bool){
                this.getIntellectualList();
            }
        },
        option(item,name){
            this.activeObj = item;
            this.operateName = name;
            switch(name){
                case "info":
                    this.addModal = true;
                    break;
                case "edit":
                    this.addModal = true;
                    break;
                case "delete":
                    this.delModal = true;
                    break;
            }
        },
        delSumbit(){
            let url = '/business/ipRight/'+this.activeObj.id;
            this.isSubmit = true;
            this.$del(url).then(res=>{
                this.isSubmit = false;
                if(res.code==0){
                    this.delModal = false;
                    this.getIntellectualList();
                    this.$Message.success("操作成功！");
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        contractStateCtrl(state){
            if(state=='N'){
                return true;
            }else if(state=='S'||state=='T'||state=='U'){
                return false;
            }
        },
    },
    created(){},
    beforeMount(){
        // 100为modal距离顶部的距离
        this.clientHeight = (document.body.clientHeight)*0.8-100;
    },
    mounted(){
        this.getIntellectualList();
    },
    updated(){},
    components: {
        fileContainer,
        intellectualForm,
        intellectualInfo
    },
    computed:{
        modalTitle(){
            let str = "";
            switch(this.operateName){
                case "add":
                    str = "新增知识产权";
                    break;
                case "edit":
                    str = "编辑知识产权";
                    break;
                case "info":
                    str = "详情";
                    break;
            }
            return str
        }
    },
    watch: {
        addModal(newVal,oldVal){
            if(!newVal){
                this.activeObj = "";
            }
        },
        delModal(newVal,oldVal){
            if(!newVal){
                this.activeObj = "";
            }
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./../../relationship/plugin/contractAward/contractAward.scss";
@import "./intellectualProperty.scss";
</style>
