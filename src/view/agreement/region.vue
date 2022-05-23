<template>
    <div class="have-drawer-style">
        <div class="card-style">
            <Row class="header-common-right-box">
                <Button class="fl" style="margin-right:15px;" @click="confirmCtrl=true" type="primary">保存</Button>
                <!-- 筛选项 -->
                <Col span="12" style="line-height:32px;">
                    <Select v-model="searchForm.provinceCode" style="width:190px;" clearable filterable @on-change="getProvinceCode">
                        <Option v-for="item in provinceArr" :value="item.code" :key="item.name">{{ item.name }}</Option>
                    </Select>
                </Col>
            </Row>
            <!-- 表格 -->
            <Row style="border:1px solid #dcdee2;border-bottom:0;">
                <Table :columns="columns" :data="data" :loading="tableLoading"></Table>
            </Row>
        </div>

        <!-- 确认modal -->
        <Modal
            v-model="confirmCtrl"
            title="操作确认"
            :width="360"
            :footer-hide="true">
            <Row class="modal-tips">请问是否保存此次修改？</Row>
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="confirmSubmit">确认</Button>
                <Button @click="confirmCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import styles from '@/assets/globalStyle.scss';
export default {
    data () {
        return {
            searchForm:{
                provinceCode:"",
            },
            provinceArr:[],
            tableLoading:false,
            data:[],
            columns:[
                {
                    title:"城市名称",
                    key:"cityName"
                },
                {
                    title:"发达地区",
                    key:"grade",
                    render:(h,params)=>{
                        return h('Radio',
                        {
                            props:{
                                value:params.row.grade=='DR'
                            },
                            on:{
                                "on-change":()=>{
                                    this.getRadio('DR',params.index);
                                }
                            }
                        },
                        [
                            h('span')
                        ])
                    }
                },
                {
                    title:"欠发达地区",
                    key:"grade",
                    render:(h,params)=>{
                        return h('Radio',
                        {
                            props:{
                                value:params.row.grade=='LA'
                            },
                            on:{
                                "on-change":()=>{
                                    this.getRadio('LA',params.index);
                                }
                            }
                        },
                        [
                            h('span')
                        ])
                    }
                },
            ],
            confirmCtrl:false,
        }
    },
    props: [''],
    methods: {
        getData(){
            let url = '/settlement/agreement-price-location-grades';
            let ajaxData = {
                provinceCode:this.searchForm.provinceCode
            }
            this.tableLoading = true;
            this.$get(url,ajaxData).then(res=>{
                this.tableLoading = false;
                if(res.code==0){
                    this.data = res.data;
                }
            })
        },
        getProvinceCode(data){
            if(data){
                this.getData();
            }
        },
        getRadio(value,index){
            this.data[index].grade = value;
        },
        // 确认保存
        confirmSubmit(){
            let url = '/settlement/agreement-price-location-grade';
            let locationGradeList = this.data.map(item=>{
                return {
                    id:item.id,
                    city:item.city,
                    province:item.province,
                    grade:item.grade
                }
            })

            this.$patch(url,locationGradeList).then(res=>{
                this.confirmCtrl = false;
                if(res.code==0){
                    this.$Message.success('操作成功')
                    this.getData();
                }else{
                    this.$$Message.error('操作失败')
                }
            })
        },
        // 获取全部省份
        getAllProvince(){
            let url = '/base/location/queryAllProvinces';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.provinceArr = res.data;
                }
            })
        }
    },
    created(){},
    beforeMount(){
        this.getAllProvince();
    },
    mounted(){
        
    },
    activated(){
        
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>

</style>