<template>
    <div class="tort-map-box">
        <Row class="filter-box">
            <Row class="select-box">
                <my-select ref="projectSelect"
                    :path="'/business/missions'"
                    :placeholder="'请选择任务'"
                    :placeholderInput="'任务名称/客户名称/任务编号'"
                    :keyName="'name'"
                    :params="{projectId:projectId}"
                    @getValue="getMissionId">
                </my-select>
            </Row>
            <Row class="count-box">线索数量：{{clueData?clueData.length:0}}</Row>
        </Row>
        <Row class="map-box">
            <div id="tort-map"></div>
        </Row>
    </div>
</template>
<script>
export default {
    data () {
        return {
            clueData:[],
            table:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            center:{}
        }       
    },
    props: ['projectId'],
    methods: {
        //根据任务id获取线索
        getData(){
            let url = '/business/clue/coordinates';
            let ajaxData = {
                missionId:this.missionId,
                projectId:this.projectId
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.clueData = res.data;
                    this.clueData.forEach((item,index)=>{
                        this.makerPoint(item);
                    })
                }else{
                    this.$Message.error(res.message);
                }
            })
        },
        //选择所属任务
        getMissionId(data){
            this.missionId = data.id;
            this.getData();
        },
        changePage(page){
            this.table.pageNum = page;   
            this.getData();   
        },
        changeSize(size){
            this.table.pageSize = size;
            this.getData();
        },
        /********  地图 start  ********/
        // 初始化地图
        initMap(){
            this.map = new BMap.Map("tort-map",{minZoom:4,maxZoom:15});
            this.getMyIpCity();
            let point = new BMap.Point(this.center.lng,this.center.lat);
            this.map.centerAndZoom(point,12); // 初始化地图,设置中心点坐标和地图级别
            this.map.enableScrollWheelZoom(true); // 开启鼠标滚轮缩放

            let size = new BMap.Size(10, 50); // 控件基于停靠位置的偏移量（可选）
            this.map.addControl(new BMap.CityListControl({
                anchor: BMAP_ANCHOR_TOP_LEFT, // 控件的停靠位置（可选，默认左上角）
                offset: size,
                // 切换城市之前事件
                // onChangeBefore: function(){
                //    alert('before');
                // },
                // 切换城市之后事件
                // onChangeAfter:function(){
                //   alert('after');
                // }
            }));
        },
        //根据ip定位当前城市
        getMyIpCity(){
            let myCity = new BMap.LocalCity();
            myCity.get(this.myLoacation);
        },
        //传入百度事例将地图中心移至ip定位城市的回调方法
        myLoacation(result){
            let cityName = result.name;
            this.center.lng = result.center.lng;
            this.center.lat = result.center.lat;
            this.map.setCenter(cityName);
        },
        //传入经纬度描点
        makerPoint(obj){
            let point = new BMap.Point(obj.xattr, obj.yattr);   
            let marker = new BMap.Marker(point);        
            this.map.addOverlay(marker); 
        },
        /********  地图 end  **********/
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.initMap();
        this.getData();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./tortMap.scss";
</style>
<style lang="scss">
@import "@/assets/globalStyle.scss";
.map-box{
    #tort-map{
        .citylist_popup_main{
            .city_content_top{
                box-sizing: content-box;
            }
        }
    }
}
</style>