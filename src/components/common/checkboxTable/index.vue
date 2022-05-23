<template>
    <div>
        <Table :columns="columns" :data="data" :loading="tableLoading" :show-summary="showSummary" :summary-method="handleSummary" :row-key="rowKey"
            @on-select-cancel="fnCancel"
            @on-select-all-cancel="fnCancelAll"
            @on-select="fnSelect"
            @on-select-all="fnSelectAll">
            <template slot-scope="{ row }" slot="action">
                <slot name="more-actions" :row="row"></slot>
            </template>
        </Table>
    </div>
</template>
<script>
export default {
    data () {
        return {
            idList:[],
            idObjList:[],
        }
    },
    props:{
        columns:{ //列数据(表头)
            type:Array
        },
        data:{ // 数据
            type:Array
        },
        keyId:{ // 主键
            type:String,
            default:'id'
        },
        rowKey:{
            type:Boolean|String,
            default:false
        },
        showSummary:{
            type:Boolean,
            default:false
        },
        tableLoading:{
            type:Boolean,
            default:false
        },
        defaultObjList:{
            type:Array,
            default:()=>{
                return []
            }
        },
        handleSummary:{
            type:Function
        }
    },
    methods: {
        /*--------------------批量操作start---------------------*/
        //获取批量操作勾选中的数据
        fnSelectAll(selection){
            if(this.idList.length==0){
                for(var i=0;i<selection.length;i++){
                    this.idList.push(selection[i][this.keyId]);
                    this.idObjList.push(selection[i]);
                }
            }else{
                for(var i=0;i<selection.length;i++){
                    for(var j=0;j<this.idList.length;j++){
                        if(this.idList[j] == selection[i][this.keyId]){
                            break;
                        }
                        if(this.idList[j] != selection[i][this.keyId]){
                            if(j==this.idList.length-1){
                                this.idList.push(selection[i][this.keyId]);
                                this.idObjList.push(selection[i]);
                            }
                        }
                    }
                }
            }
        },
        // selection:已选项数据 row:刚选择的项数据
        fnSelect(selection,row){
            this.idList.push(row[this.keyId]);
            this.idObjList.push(row);
        },
        // selection:已选项数据 row:取消选择的项数据
        fnCancel(selection,row){
            this.remove(row[this.keyId]);
        },
        // 取消全选
        fnCancelAll(selection){
            if(selection.length==0){
                for(var i=0;i<this.data.length;i++){
                    this.remove(this.data[i][this.keyId]);
                } 
            }
        },
        // 删除特定的id
        remove(id){
            let index = this.idList.indexOf(id);
            if (index > -1) {
                this.idList.splice(index, 1);
                this.idObjList.splice(index, 1);
            }
        },
        // 每请求一页的时候判断是否被选中
        selectOrNo(){
            let data = this.data;
            let idList = this.idList;
            for(var i=0;i<data.length;i++){
                for(var j=0;j<idList.length;j++){
                    data[i]._checked = false;
                    // console.log(idList[j]+'==='+data[i][this.keyId])
                    if(idList[j]==data[i][this.keyId]){
                        data[i]._checked = true;
                        break;
                    }
                }
            }
        },
        // 清楚所有选中
        clearSelected(){
            this.idList.splice(0);
            this.idObjList.splice(0);
            this.selectOrNo();
        },
        // 更新默认值
        voluation(){
            if(this.defaultObjList){
                this.idObjList = [];
                this.idList = this.defaultObjList.map(item=>{
                    this.idObjList.push(item);
                    return item[this.keyId]
                })
            }
        }
        /*--------------------批量操作end---------------------*/
    },
    created(){},
    beforeMount(){
        if(this.defaultObjList){
            this.voluation();
        }
    },
    mounted(){
        this.selectOrNo();
    },
    activated(){
        
    },
    updated(){},
    components: {},
    watch: {
        idObjList:{
            deep:true,
            handler(val,oldVal){
                if(val){
                    this.$emit('refreshList',this.idObjList)
                }
            }
        },
        tableLoading(newVal,oldVal){},
        data:{
            deep:true,
            handler(val,oldVal){
                if(val){
                    this.selectOrNo();
                }
            }
        }
    }
}
</script>
<style>
 
</style>
