<template>
    <div class="contract-subject-block clearfix">
        <div class="prev-slot">
            <Select 
                class="prev-select"
                placeholder="选择"
                v-model="selectSubject"
                @on-change="getValue">
                <Option v-for="item in subjectList" :value="item.value" :disabled="disableType==item.value" :key="item.value">{{ item.nameZh }}</Option>
            </Select>
        </div>
        <div class="append-slot">
            <Select placeholder="请选择" 
                v-if="selectSubject=='A'"
                :value="selectAndunSubject"
                @on-change="getValue">
                <Option v-for="item in andunSubjectList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select>
            <!-- <Select placeholder="请选择" 
                v-if="selectSubject=='O'"
                :value="selectOthierSubject"
                @on-change="getValue">
                <Option v-for="item in otherSubjectList" :value="item.id" :key="item.id">{{ item.name }}</Option>
            </Select> -->
            <my-select
                v-if="selectSubject!='A' && selectSubject!='O' && isShow"
                ref="selfselect"
                :path="selectPath"
                :keyName="'name'"
                :inputKey="selectSubject=='C'?'name':'keyword'"
                :params="mySelectParams"
                :placeholder="'请选择'"
                :defaultObj="selectCustObj"
                @getValue="getCode"
            ></my-select>
            <Input v-model="otherName" v-if="selectSubject=='O'" @on-change="getValue" placeholder="请输入"/>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            selectSubject:"C",
            selectDefaultObj:{},
            subjectList:[],
            andunSubjectList:[],
            otherSubjectList:[],
            mySelectParams:{},
            selectAndunSubject:"",
            selectOthierSubject:"",
            selectCustObj:{},
            otherName:"",
            selectPath:"/base/customers",
            isShow:false,
        }
    },
    props: ['defaultData','disableType','defaultSubject'],
    methods: {
        getValue(id){
            let obj = {
                type:this.selectSubject
            };
            let arr;
            if(this.selectSubject=='A'){
                arr = this.andunSubjectList;
            }else if(this.selectSubject=='O'){
                obj.id = "0",
                obj.name = this.otherName;
            }
            if(arr){
                arr.forEach((item,index)=>{
                    if(id==item.id){
                        obj.id = item.id + "",
                        obj.name = item.name
                    }
                })
            }
            this.$emit("getValue",obj);
        },
        getCode(data){
            let obj = {
                type:this.selectSubject,
                id:data.id,
                name:data.name
            };
            this.$emit("getValue",obj);
        },
        //获取安盾主体信息
        getAndunSubject(){
            let url = '/base/suppliers';
            let params = {
                type:1
            }
            this.$get(url,params).then(res=>{
                if(res.code==0){
                    this.andunSubjectList = res.data;
                }
            })
        },
        //获取安盾其他主体信息
        getOtherSubject(){
            let url = '/base/suppliers';
            let params = {
                type:2
            }
            this.$get(url,params).then(res=>{
                if(res.code==0){
                    this.otherSubjectList = res.data;
                }
            })
        },
        getCustomerDetail(){
            this.selectSubject = this.defaultData.type;
            if(this.selectSubject == "A"){
                this.selectAndunSubject = this.defaultData.id;
            }else if(this.selectSubject == "O"){
                this.$nextTick(()=>{
                    this.otherName = this.defaultData.name;
                })
            }else{
                this.selectCustObj.id = this.defaultData.id;
                this.selectCustObj.name = this.defaultData.name;
                this.isShow = true;
                this.$nextTick(()=>{
                    this.$refs.selfselect.voluation();
                })
            }
        },
        // 获取字典数据接口
        async getDictionary(){
            this.subjectList = await this.common.getDictionaryItems('contract_partner');
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.getAndunSubject();
        this.getDictionary();
        if(this.defaultData.type){
            this.getCustomerDetail();
        }else{
            this.selectSubject = this.defaultSubject || "C";
            this.isShow = true;
        }
    },
    updated(){},
    components: {},
    watch: {
        selectSubject(newVal,oldVal){
            if(newVal=="L"){
                if(this.$refs.selfselect){
                    this.$refs.selfselect.clearSelected();
                }
                this.selectPath = "/base/lawyer-teams";
                this.mySelectParams = {state:"E"};
            }else if(newVal=="I"){
                if(this.$refs.selfselect){
                    this.$refs.selfselect.clearSelected();
                }
                this.selectPath = "/base/investigator-teams";
                this.mySelectParams = {state:"E"};
            }else if(newVal=="C"){
                if(this.$refs.selfselect){
                    this.$refs.selfselect.clearSelected();
                }
                this.selectPath = "/base/customers";
                this.mySelectParams = {};
            }else if(newVal=="O"){
                this.otherName = "";
            }
        },
        disableType(newVal,oldVal){
            
        }
    }
}
</script>
<style lang="sass">
@import "./contractSubject"
</style>
