<template>
    <div class="choose-city">
        <div class="city-select active" @click="tabCtrl=!tabCtrl">
            <span class="tag" v-for="item in tagArr" :key="item.code">{{item.name}}<Icon type="ios-close" @click.stop="deleteTag(item.code,item.type,item.provinceCode)" size="16" /></span>
        </div>  
        <ul class="city-list active" v-if="cityList.length>0&&tabCtrl">
            <div class="clearfix">
            <li v-for="(item,index) in cityLevel2" :key="'level2-'+index"
            @click="getCityLevel2(item.code,item.name)"
            :class="['third-city',allCityCode.indexOf(item.code)!=-1?'active':'']">{{item.name}}</li>

            <li v-for="(item,index) in cityLevel1" :key="'level1-'+index" 
            @click="unwrapOptions(item.code)"
            :class="['first-city',levelCtrl==item.code?'active':'',allProvinceCode.indexOf(item.code)!=-1?'city-selected':'']">
                <span>{{item.name}}</span>

                <ul class="second-city">
                    <li @click.stop="checkAll(item,item.cities)"
                    :class="['select-all',allProvinceCheck.indexOf(item.code)!=-1?'active':'']">{{allProvinceCheck.indexOf(item.code)!=-1?'取消全选':'全选'}}</li>

                    <li v-for="(secondItem,index) in item.cities" :key="index" 
                    @click.stop="selectCity(secondItem,item)"
                    :class="[allCityCode.indexOf(secondItem.code)!=-1?'active':'']">{{secondItem.name}}</li>
                </ul>
            </li>
            </div>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
            tabCtrl:true,
            cityList:[],         //初始化数组
            selectedList:[],     //主要数组
            allCityCode:[],      //所有选中的城市的code
            allProvinceCode:[],  //有一个城市选中的省份
            allProvinceCheck:[], //所有全选的省份
            tagArr:[],           //tag的数组
            levelCtrl:'',       //二级显示隐藏的控制变量
        }
    },
    props: ['defaultLocation'],
    methods: {
        //初始化数据
        getAllCity(){
            let url = '/base/location/queryProvinceWithCities';
            this.$get(url).then(res=>{
                console.log(res);
                if(res.code==0){
                    this.cityList = res.data;
                    let tempArr = [];
                    for(let i=0;i<this.defaultLocation.length;i++){
                        if(tempArr.length>0){
                            let index = tempArr.indexOf(this.defaultLocation[i].provinceCode);
                            if(index==-1){
                                tempArr.push(this.defaultLocation[i].provinceCode);
                                this.selectedList.push({
                                    provinceCode:this.defaultLocation[i].provinceCode,
                                    province:this.defaultLocation[i].province,
                                    flag:false,
                                    cities:[{code:this.defaultLocation[i].code,name:this.defaultLocation[i].name}]
                                })
                            }else{
                                this.selectedList[index].cities.push({code:this.defaultLocation[i].code,name:this.defaultLocation[i].name})
                            }
                        }else{
                            tempArr.push(this.defaultLocation[i].provinceCode);
                            this.selectedList.push({
                                provinceCode:this.defaultLocation[i].provinceCode,
                                province:this.defaultLocation[i].province,
                                flag:false,
                                cities:[{code:this.defaultLocation[i].code,name:this.defaultLocation[i].name}]
                            })
                        }
                    }
                    //两个数组比较是否全选
                    this.isCheckAll();
                }
            })
        },
        isCheckAll(){
            for(let i=0;i<this.cityList.length;i++){
                for(let j=0;j<this.selectedList.length;j++){
                    if(this.cityList[i].code==this.selectedList[j].provinceCode){
                        if(!this.cityList[i].cities){
                            this.selectedList[j].flag = true;
                            break;
                        }else if(this.selectedList[j].cities.length==this.cityList[i].cities.length&&this.cityList[i].cities){
                            this.selectedList[j].flag = true;
                        }
                    }
                }
            }
        },
        //打开有二级城市的省份
        unwrapOptions(code){
            if(this.levelCtrl&&this.levelCtrl==code){
                this.levelCtrl = '';
            }else{
                this.levelCtrl = code;
            }
        },
        //选中直辖市or只有一级的城市
        getCityLevel2(code,name){
            // console.log(code);
            // console.log(name);
            if(this.selectedList.length>0){
                for(let i=0;i<this.selectedList.length;i++){
                    if(this.selectedList[i].provinceCode==code){
                        this.selectedList.splice(i,1);
                        break;
                    }else if(this.selectedList[i].provinceCode!=code&&i==this.selectedList.length-1){
                        this.selectedList.push({
                            provinceCode:code,
                            province:name,
                            flag:true,
                            cities:[{code:code,name:name}]
                        })
                        break;
                    }
                }
            }else{
                this.selectedList.push({
                    provinceCode:code,
                    province:name,
                    flag:true,
                    cities:[{code:code,name:name}]
                })
            }
        },
        //选择二级城市
        selectCity(city,province){
            // console.log(city)
            console.log('单个选中or单个取消')
            let index = this.allCityCode.indexOf(city.code);

            if(this.selectedList.length>0){
                if(index==-1){ //单个选中
                    for(let i=0;i<this.selectedList.length;i++){
                        if(this.selectedList[i].provinceCode==province.code){
                            this.selectedList[i].cities.push({code:city.code,name:city.name})
                            if(this.selectedList[i].cities.length==province.cities.length){ //是否是最后一个选中
                                this.selectedList[i].flag = true;
                                break;
                            }
                            break;
                        }else if(this.selectedList[i].provinceCode!=province.code&&i==this.selectedList.length-1){  //是否是第一个选中
                            this.selectedList.push({
                                provinceCode:province.code,
                                province:province.name,
                                flag:false,
                                cities:[{code:city.code,name:city.name}]
                            })
                            break;
                        }
                    }
                }else{ //单个取消
                    for(let i=0;i<this.selectedList.length;i++){
                        if(this.selectedList[i].provinceCode==province.code){
                            this.selectedList[i].cities.forEach((item,index)=>{
                                if(item.code==city.code){
                                    this.selectedList[i].cities.splice(index,1);
                                    this.selectedList[i].flag = false;
                                }
                            })
                            break;
                        }
                    }
                }
            }else{
                this.selectedList.push({
                    provinceCode:province.code,
                    province:province.name,
                    flag:false,
                    cities:[{code:city.code,name:city.name}]
                })
            }

        },
        //全选or反选
        checkAll(province,cities){
            console.log('全选or反选')
            cities = cities.map(item=>{
                return {code:item.code,name:item.name}
            })
            if(this.selectedList.length>0){
                for(let i=0;i<this.selectedList.length;i++){
                    if(this.selectedList[i].provinceCode==province.code&&this.selectedList[i].flag){
                        this.selectedList.splice(i,1); //全部取消
                        break;
                    }else if(this.selectedList[i].provinceCode==province.code&&(!this.selectedList[i].flag)){
                        this.selectedList[i].cities = cities;  //半选的时候全部选中
                        this.selectedList[i].flag = true;
                        break;
                    }else if(this.selectedList[i].provinceCode!=province.code&&i==this.selectedList.length-1){
                        this.selectedList.push({
                            provinceCode:province.code,
                            province:province.name,
                            flag:true,
                            cities:cities
                        })
                        break;
                    }
                }
            }else{
                this.selectedList.push({
                    provinceCode:province.code,
                    province:province.name,
                    flag:true,
                    cities:cities
                })
            }
        },
        //删除联动
        deleteTag(code,type,provinceCode){
            let index;
            for(let i=0;i<this.selectedList.length;i++){
                if(this.selectedList[i].provinceCode==provinceCode){
                    index = i;
                    break;
                }
            }
            if(type=='P'){
                this.selectedList.splice(index,1);
            }else{
                for(let j=0;j<this.selectedList[index].cities.length;j++){
                    if(this.selectedList[index].cities[j].code==code){
                        this.selectedList[index].cities.splice(j,1);
                        break;
                    }
                }
            }
        }
    },
    computed: {
        //计算属性，避免v-for和v-if同时使用
        cityLevel1: function () {
            return this.cityList.filter(function (item) {
                return item.level==1&&item.code!='710000'&&item;
            })
        },
        cityLevel2: function () {
            return this.cityList.filter(function (item) {
                return item.level!=1||item.code=='710000'&&item;
            })
        },
    },
    created(){},
    beforeMount(){
        // console.log(this.defaultLocation)
        this.getAllCity();
    },
    mounted(){
        document.addEventListener('click',e => {
            if(!this.$el.contains(e.target)){
                this.tabCtrl = false//点击其他区域关闭
            }
        })
    },
    updated(){},
    components: {},
    watch: {
        selectedList:{
            deep:true,
            handler(val,oldVal){
                this.$emit('listenLocation',val);
                this.allProvinceCode = [];
                this.allProvinceCheck = [];
                this.tagArr = [];
                this.allCityCode = [];
                if(val.length>0){
                    val.forEach((item,index)=>{
                        if(item.cities.length==0){
                            val.splice(index,1);
                        }
                    })
                    this.allProvinceCode = val.map(item=>{
                        return item.provinceCode;
                    })
                    this.allProvinceCheck = val.map(item=>{
                        return item.flag&&item.provinceCode;
                    })
                    val.forEach(item=>{
                        if(item.flag){
                            this.tagArr.push({code:item.provinceCode,name:item.province,type:'P',provinceCode:item.provinceCode})
                        }else{
                            item.cities.forEach(city=>{
                                this.tagArr.push({code:city.code,name:city.name,type:'C',provinceCode:item.provinceCode})
                            })
                        }
                        item.cities.forEach(city=>{
                            this.allCityCode.push(city.code);
                        })
                    })
                }else{
                    this.allProvinceCode = [];
                    this.allProvinceCheck = [];
                    this.tagArr = [];
                    this.allCityCode = [];
                }              
            }
        },
        allCityCode(val,oldVal){
            // console.log(val)
        },
    }
}
</script>
<style scoped lang="sass">
@import './chooseCity.scss';
</style>
