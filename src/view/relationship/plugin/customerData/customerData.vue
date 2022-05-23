<template>
    <div class="customer-data">
        <Row class="search-header">
            <Col style="float:right;">
                <DatePicker type="daterange" placement="bottom-end" placeholder="选择日期" style="width: 200px"></DatePicker>
            </Col>
        </Row>
        <Row class="sub-title">
            <span>客户专利类型分布</span>
        </Row>
        <div class="data-content">
            <table>
                <thead>
                    <tr>
                        <th>专利类型</th>
                        <th>商标</th>
                        <th>著作权</th>
                        <th>专利</th>
                        <th>不正当竞争</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>专利数量</td>
                        <td>1</td>
                        <td>2</td>
                        <td>1</td>
                        <td>0</td>
                    </tr>
                </tbody>
            </table>
            <Row class="btn-combination">
                <Button :type="btnCtrl1=='bar1'?'primary':'default'" @click="drawBar('bar1','myChart1')">柱状图</Button>
                <Button :type="btnCtrl1=='pie1'?'primary':'default'" @click="drawBar('pie1','myChart1')">饼状图</Button>
            </Row>
            <div class="echarts" id="myChart1"></div>
        </div>
        <Row class="sub-title">
            <span>调查任务状态分布</span>
        </Row>
        <div class="data-content">
            <table>
                <thead>
                    <tr>
                        <th>任务状态</th>
                        <th>待审核</th>
                        <th>进行中</th>
                        <th>暂停</th>
                        <th>过期</th>
                        <th>结束</th>
                        <th>草稿</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>任务数量</td>
                        <td>10</td>
                        <td>12</td>
                        <td>1</td>
                        <td>1</td>
                        <td>6</td>
                        <td>1</td>
                    </tr>
                </tbody>
            </table>
            <Row class="btn-combination">
                <Button :type="btnCtrl2=='bar2'?'primary':'default'" @click="drawBar('bar2','myChart2')">柱状图</Button>
                <Button :type="btnCtrl2=='pie2'?'primary':'default'" @click="drawBar('pie2','myChart2')">饼状图</Button>
                <Button :type="btnCtrl2=='line2'?'primary':'default'" @click="drawBar('line2','myChart2')">折线图</Button>
            </Row>
            <div class="echarts" id="myChart2"></div>
        </div>
    </div>
</template>
<script>
export default {
    data () {
        return {
            btnCtrl1:'bar1',
            btnCtrl2:'bar2',
            bar1Option:{
                title: {
                    text: '专利类型分布',
                    textStyle:{
                        fontSize:14,
                        color: '#6a6c6f'
                    },
                    padding:[22,0,0,25]
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['不正当竞争','专利','著作权','商标'],
                },
                grid: {
                    left: 70
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                },
                series: [{
                    data: ['1','2','1','0'],
                    color:['#2d8cf0'],
                    barWidth:20,
                    type: 'bar'
                }]
            },
            pie1Option:{
                title : {
                    text: '客户专利类型分布',
                    x:'center',
                    top:20,
                    textStyle:{
                        fontWeight:'normal'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:1, name:'商标',itemStyle:{color:'#2d8cf0'}},
                            {value:2, name:'著作权',itemStyle:{color:'#a5a5a5'}},
                            {value:1, name:'专利',itemStyle:{color:'#4472c4'}},
                            {value:0, name:'不正当竞争',itemStyle:{color:'#ed7d31'}}
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }
                ]
            },
            bar2Option:{
                title: {
                    text: '调查任务状态分布',
                    textStyle:{
                        fontSize:14,
                        color: '#6a6c6f'
                    },
                    padding:[22,0,0,25]
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['草稿','结束','过期','暂停','进行中','待审核'],
                },
                grid: {
                    left: 70
                },
                xAxis: {
                    type: 'value',
                    boundaryGap: [0, 0.1]
                },
                series: [{
                    data: ['10','12','1','1','6','1'],
                    color:['#2d8cf0'],
                    barWidth:20,
                    type: 'bar'
                }]
            },
            pie2Option:{
                title : {
                    text: '调查任务状态分布',
                    x:'center',
                    top:20,
                    textStyle:{
                        fontWeight:'normal'
                    }
                },
                tooltip : {
                    trigger: 'item',
                    formatter: "{a} <br/>{b} : {c} ({d}%)"
                },
                series : [
                    {
                        name: '访问来源',
                        type: 'pie',
                        radius : '55%',
                        center: ['50%', '60%'],
                        data:[
                            {value:10, name:'草稿',itemStyle:{color:'#2d8cf0'}},
                            {value:12, name:'结束',itemStyle:{color:'#a5a5a5'}},
                            {value:1, name:'过期',itemStyle:{color:'#4472c4'}},
                            {value:1, name:'暂停',itemStyle:{color:'#ed7d31'}},
                            {value:6, name:'进行中',itemStyle:{color:'#edb023'}},
                            {value:1, name:'待审核',itemStyle:{color:'#4cd6bd'}},
                        ],
                        itemStyle: {
                            emphasis: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.3)'
                            }
                        }
                    }
                ]
            },
            line2Option:{
                title: {
                    text: '调查任务状态分布',
                    textStyle:{
                        fontSize:14,
                        color: '#6a6c6f'
                    },
                    padding:[22,0,0,25]
                },
                tooltip : {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                        label: {
                            backgroundColor: '#6a7985'
                        }
                    }
                },
                yAxis: {
                    type: 'category',
                    data: ['草稿','结束','过期','暂停','进行中','待审核'],
                },
                xAxis: {
                    type: 'value'
                },
                series: [{
                    data: ['10','12','1','1','6','1'],
                    type: 'line'
                }]
            }
        }
    },
    props: ['id'],
    methods: {
        drawBar(btnCtrl,id){
            let index = btnCtrl.slice(-1);
            this['btnCtrl'+index] = btnCtrl;
            this.drawEcharts(id,this[btnCtrl+'Option']);
        },
        //半年案件趋势图
        getCaseLine(){
            let url = '/home/caseTrendEcharts';
            // this.$get(url).then(res=>{
            //     console.log(res);
            //     this.option.xAxis.data = [];
            //     this.option.series[0].data = [];
            //     this.option.title.text = '案件结果趋势';
            //     if(res.status=='SUCCESS'){
            //         if(res.data.echartsCaseTrend.length>0){
            //             res.data.echartsCaseTrend.forEach((item,index)=>{
            //                 this.option.xAxis.data.push(item.caseDate)
            //                 this.option.series[0].data.push(item.caseCount)
            //             })
            //         }
            //         this.drawEcharts('myChart1',this.option);
            //     }
            // })
            this.drawEcharts('myChart1',this.bar1Option);
        },
        drawEcharts(id,option){
            console.log(option)
            let myChart =  this.$echarts.init(document.getElementById(id));
            myChart.setOption(option,true);
            window.addEventListener("resize", myChart.resize);
        },
    },
    created(){},
    beforeMount(){
        console.log(this.id);
    },
    activated:function(){
        this.getCaseLine();
    },
    mounted(){
        this.drawBar('bar1','myChart1');
        this.drawBar('bar2','myChart2');
    },
    updated(){},
    components: {},
    watch: {
       
    }
}
</script>
<style lang="sass" scoped>
 @import "./customerData"
</style>
