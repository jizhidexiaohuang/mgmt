<template>
    <Cascader 
    v-model="areaList" 
    :data="data"
    change-on-select 
    :render-format="format"
    @on-change="getCity" 
    :load-data="loadData"
    placeholder="区域选择"></Cascader>
</template>
<script>
    export default {
        data(){
            return {
                areaList:[],
                data:[],
            }
        },
        props:['cityList'],
        methods:{
            //搜索条件省市区接口
            getAllProvince(){
                let vm = this;
                let url = '/base/location/queryAllProvinces';
                vm.$get(url).then(res=>{
                    if(res.code==0){
                        res.data.forEach((item,index)=>{
                            if(!item.isSublevel){
                                vm.data.push({
                                    value:item.code,
                                    label:item.name,
                                    level:item.level
                                })
                            }else{
                                vm.data.push({
                                    value:item.code,
                                    label:item.name,
                                    children: [],
                                    loading: false,
                                    level:item.level
                                })
                            }
                        })
                    }
                })
            },
            loadData (item, callback) {
                item.loading = true;
                if(item.level==1){
                    let vm = this;
                    let url = '/base/location/queryCityByProvinceCode/'+item.value;
                    vm.$get(url).then(res=>{
                        let oData = res.data;
                        if(res.code==0){
                            for(var i=0;i<oData.length;i++){
                                if(oData[i].isSublevel){
                                    item.children.push({
                                        value:oData[i].code,
                                        label:oData[i].name,
                                        children: [],
                                        loading: false,
                                        level:oData[i].level
                                    })
                                }else{
                                    item.children.push({
                                        value:oData[i].code,
                                        label:oData[i].name,
                                        level:oData[i].level
                                    })
                                }
                            }
                            item.loading = false;
                            callback();
                        }
                    })
                }else if(item.level==2){
                    let vm = this;
                    let url = '/base/location/queryAreaByCityCode/'+item.value;
                    vm.$get(url).then(res=>{
                        let oData = res.data;
                        if(res.code==0){
                            if(oData!=null){
                                for(var i=0;i<oData.length;i++){
                                    item.children.push({
                                        value:oData[i].code,
                                        label:oData[i].name,
                                        level:oData[i].level
                                    })
                                }
                                item.loading = false;
                            }else{
                                item.loading = false;
                                for(var i=0;i<vm.data.length;i++){
                                    if(item.value==vm.data[i].value){
                                        vm.data[i] = {
                                            value:item.value,
                                            label:item.label,
                                            level:oData[i].level
                                        }
                                    }
                                }
                            }
                            callback();
                        }
                    })
                }
            },
            getCity(value, selectedData){
                this.uploadData();
            },
            uploadData(){
                if(this.cityList){
                    let arr = this.cityList;
                    this.areaList = [arr[0],arr[1],arr[2]];
                }
            },
            format(labels, selectedData){
                let length = selectedData && selectedData.length;
                if(!!length){
                    switch (length) {
                        case 1:
                            if(selectedData[0].level==3){
                                selectedData.push(selectedData[0],selectedData[0])
                            }
                            break;
                        case 2:
                            if(selectedData[0].level==1&&selectedData[1].level==3){
                                selectedData.push(selectedData[1])
                            }else if(selectedData[0].level==2&&selectedData[1].level==3){
                                selectedData.unshift(selectedData[0])
                            }
                            break;
                    }
                }
                const index = labels.length - 1;
                let str = '';
                if(labels.length!=0){
                    for(var i=0;i<labels.length;i++){
                        str += labels[i] + '/';
                    }
                    str = str.slice(0,-1);
                    this.$emit('listenCity',selectedData);
                    return str;
                }
                this.$emit('listenCity',selectedData);
            },
            clearSelect(){
                this.areaList = [];
            }
        },
        mounted(){
            // console.log(this.cityList)
            this.getAllProvince();
            let arr = this.cityList;
            this.areaList = arr;
        },
        watch:{
        }
    }
</script>
