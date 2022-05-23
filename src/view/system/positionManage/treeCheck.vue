<template>
    <div>
        <CheckboxGroup v-model="addPerson">
            <Tree :data="data"></Tree>
        </CheckboxGroup>
    </div>
</template>
<script>
export default {
    data () {
        return {
            addPerson:[],           //CheckboxGroup返回的数据，例如[178,672,192]
            addWithTitle:[],        //返回父组件需要用的对象数组(带有员工id以及title)
            allPerson:[]            //所有的可选的员工的对象数组，用于比对选择了哪些员工
        }
    },
    props: ['data'],
    methods: {
        //处理返回的tree数据，让可勾选的员工展示checkbox勾选框
        apartData(arr){
            for(let i=0 ;i < arr.length; i++){
                if(!arr[i].nocheck){
                    arr[i].render = (h, { root, node, data })=>{
                                            return h('Checkbox', {
                                                    props:{
                                                        label:data.id
                                                    }
                                                }, data.title)
                                        }
                    this.allPerson.push(arr[i]);
                }
                if(arr[i].children && arr[i].children.length!=0){
                    this.apartData(arr[i].children);
                }
            }
        },
        removeOne(id){
            if(this.addPerson.indexOf(id)!=-1){
                this.addPerson.splice(this.addPerson.indexOf(id),1)
            }
        },
        removeAll(){
            this.addPerson = [];
        }
    },
    created(){

    },
    beforeMount(){

    },
    mounted(){

    },
    updated(){

    },
    components: {

    },
    watch: {
        data(newVal,oldVal){
            this.apartData(newVal);
        },
        //用于比对勾选了哪些数据，返回给父组件
        addPerson(newVal,oldVal){
            this.addWithTitle = [];
            for(let i=0; i < newVal.length; i++){
                for(let k = 0;k<this.allPerson.length;k++){
                    if(this.allPerson[k].id === newVal[i]){
                        this.addWithTitle.push(this.allPerson[k]);
                        break;
                    }
                }
            }
            this.$emit("getValue",this.addWithTitle);
        }
    }
}
</script>
<style>
 
</style>
