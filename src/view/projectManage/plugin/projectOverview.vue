<template>
    <div class="project-overview">
        <Row class="detail-header">
            <span>项目分析</span>
        </Row>
        <Row class="list" v-if="projectAnalysisData">
            <Col>
                <span class="header">线索结果未审核</span><br/>
                <span class="body">{{projectAnalysisData.cluePending || 0}}件</span><br/>
                <!-- <span class="header">（平均审核周期为16天）</span> -->
            </Col>
            <Col>
                <span class="header">案件未取证</span><br/>
                <span class="body">{{projectAnalysisData.caseForensics || 0}}件</span><br/>
                <!-- <span class="header">（平均提交取证周期为20天）</span> -->
            </Col>
            <Col>
                <span class="header">共参与团队</span><br/>
                <span class="body">{{projectAnalysisData.participateTeam || 0}}个</span><br/>
            </Col>
            <Col>
                <span class="header">案件诉讼参与度最高</span><br/>
                <span class="body">{{projectAnalysisData.lawyerTop && projectAnalysisData.lawyerTop.team || ''}}</span><br/>
                <span class="header">（共提交{{projectAnalysisData.lawyerTop && projectAnalysisData.lawyerTop.total || 0}}个案件）</span>
            </Col>
            <Col>
                <span class="header">调查参与度最高</span><br/>
                <span class="body">{{projectAnalysisData.surveyTop && projectAnalysisData.surveyTop.team || ''}}</span><br/>
                <span class="header">（共参与{{projectAnalysisData.surveyTop && projectAnalysisData.surveyTop.total || 0}}条线索）</span>
            </Col>
        </Row>
        <Row class="detail-header" v-show="false">
            <span>营收概况</span>
        </Row>
        <Row v-if="compensationOverview" v-show="false">
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">累计赔偿款</p>
                        <div class="item-content">
                            <strong>{{compensationOverview.total || 0}}</strong>
                            <span>万</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">新增赔偿款</p>
                        <div class="item-content">
                            <strong>{{compensationOverview.added || 0}}</strong>
                            <span>万</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="12" offset="12">
                        <span>月环比</span>
                        <span :class="compensationOverview.addedRate<=0?'success-color':'error-color'">{{transformPercentage(compensationOverview.addedRate,"%")}}</span>
                    </Col>
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="24">
                        <p class="secondary-title">平均赔偿款</p>
                        <div class="item-content">
                            <strong>{{compensationOverview.average || 0}}</strong>
                            <span>万</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    
                </Row>
            </div>
        </Row>
        <Row class="echarts-row" v-show="false">
            <div id="revenueSituation" class="echarts-box"></div>
        </Row>
        <Row class="detail-header">
            <span>线索概况</span>
        </Row>
        <Row v-if="clueOverview">
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">累计线索</p>
                        <div class="item-content">
                            <strong>{{clueOverview.total || 0}}</strong>
                            <span>条</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">新增线索</p>
                        <div class="item-content">
                            <strong>{{clueOverview.added || 0}}</strong>
                            <span>条</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="12" offset="12">
                        <span>月环比</span>
                        <span :class="clueOverview.addedRate<=0?'success-color':'error-color'">{{transformPercentage(clueOverview.addedRate,"%")}}</span>
                    </Col>
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="24">
                        <p class="secondary-title">新增线索审核通过率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(clueOverview.cluePassRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="24">
                        <span>月环比</span>
                        <span :class="clueOverview.cluePassRateMonth<=0?'success-color':'error-color'">{{transformPercentage(clueOverview.cluePassRateMonth,"%")}}</span>
                    </Col>
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="24">
                        <p class="secondary-title">线索转案件</p>
                        <div class="item-content">
                            <strong>{{clueOverview.conversionTotal || 0}}</strong>
                            <span>条</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="24">
                        <span>月环比</span>
                        <span :class="clueOverview.conversionTotalRate<=0?'success-color':'error-color'">{{transformPercentage(clueOverview.conversionTotalRate,"%")}}</span>
                    </Col>
                </Row>
            </div>
        </Row>
        <Row class="echarts-row">
            <Row>
                <Select v-model="clueSelected" @on-change="getChange($event,'clue')" placeholder="请选择维度" clearable style="width:200px">
                    <Option value="new-clue-trend">线索趋势</Option>
                    <Option value="new-clue-audit-trend">线索审核通过趋势</Option>
                </Select>
            </Row>
            <div id="clue" class="echarts-box"></div>
        </Row>
        <Row class="detail-header">
            <span>在办案件概况</span>
        </Row>
        <Row v-if="caseOverview">
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">在办案件数</p>
                        <div class="item-content">
                            <strong>{{caseOverview.total || 0}}</strong>
                            <span>件</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">新增在办案件数</p>
                        <div class="item-content">
                            <strong>{{caseOverview.added || 0}}</strong>
                            <span>件</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="12" offset="12">
                        <span>月环比</span>
                        <span :class="caseOverview.addedRate<=0?'success-color':'error-color'">{{transformPercentage(caseOverview.addedRate,"%")}}</span>
                    </Col>
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">案件转换率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(caseOverview.conversionRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">新增案件转换率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(caseOverview.addedConversionRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="12" offset="12">
                        <span>月环比</span>
                        <span :class="caseOverview.addedConversionRateOnMonth<=0?'success-color':'error-color'">{{transformPercentage(caseOverview.addedConversionRateOnMonth,"%")}}</span>
                    </Col>
                </Row>
            </div>
        </Row>
        <Row class="echarts-row">
            <Row>
                <Select v-model="missionSelected" @on-change="getChange($event,'mission')" placeholder="请选择维度" clearable style="width:200px">
                    <Option value="cases-in-process">案件趋势</Option>
                    <Option value="case-conversion-rate">案件转换率趋势</Option>
                </Select>
            </Row>
            <div id="mission" class="echarts-box"></div>
        </Row>
        <Row class="detail-header">
            <span>完结案件概况</span>
        </Row>
        <Row v-if="caseCloseOverview">
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">完结案件数</p>
                        <div class="item-content">
                            <strong>{{caseCloseOverview.total || 0}}</strong>
                            <span>件</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">新增完结案件数</p>
                        <div class="item-content">
                            <strong>{{caseCloseOverview.added || 0}}</strong>
                            <span>件</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col span="12" offset="12">
                        <span>月环比</span>
                        <span :class="caseCloseOverview.addedRate<=0?'success-color':'error-color'">{{transformPercentage(caseCloseOverview.addedRate,"%")}}</span>
                    </Col>
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="24">
                        <p class="secondary-title">案件折损率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(caseCloseOverview.discountRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                   
                </Row>
            </div>
            <div class="flex-item">
                <Row class="item-top">
                    <Col span="12">
                        <p class="secondary-title">结案率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(caseCloseOverview.closedRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                    <Col span="12">
                        <p class="secondary-title">季度库存结案率</p>
                        <div class="item-content">
                            <strong>{{transformPercentage(caseCloseOverview.stockClosedRate)}}</strong>
                            <span>%</span>
                        </div>
                    </Col>
                </Row>
                <Row class="item-bottom">
                    <Col offset="12" span="12">
                        <span>季度环比</span>
                        <span :class="caseCloseOverview.stockClosedRateMonth<=0?'success-color':'error-color'">{{transformPercentage(caseCloseOverview.stockClosedRateMonth,"%")}}</span>
                    </Col>
                </Row>
            </div>
        </Row>
        <Row class="echarts-row">
            <Row>
                <Select v-model="caseSelected" @on-change="getChange($event,'case')" placeholder="请选择维度" clearable style="width:200px">
                    <Option value="cases-completed">完结案件数趋势</Option>
                    <Option value="case-discount-rate">案件折损率趋势</Option>
                </Select>
            </Row>
            <div id="case" class="echarts-box"></div>
        </Row>
        <Row>
            <div class="echarts-border">
                <div id="caseInProgress" class="echarts-box"></div>
            </div>
            <div class="echarts-border">
                <div id="closingMethod" class="echarts-box"></div>
            </div>
        </Row>
        <Row>
            <div class="echarts-border">
                <div id="caseClue" class="echarts-box"></div>
            </div>
            <div class="echarts-border">
                <div id="caseType" class="echarts-box"></div>
            </div>
        </Row>
        <Row>
            <div class="echarts-border">
                <div class="echarts-box ranking">
                    <div class="ranking-header clearfix">
                        <div class="rank-header-left">参与团队</div>
                        <div class="rank-header-right">
                            <ButtonGroup size="small">
                                <Button @click="getTenTopTeam('lawyer')" :type="tabActive=='lawyer'?'primary':'default'">律师团队</Button>
                                <Button @click="getTenTopTeam('investigator')" :type="tabActive=='investigator'?'primary':'default'">调查团队</Button>
                            </ButtonGroup>
                        </div>
                    </div>
                    <ul class="ranking-list" v-if="tabActive=='lawyer'">
                        <li v-for="(item,index) in lawyerTeam" :key="index">
                            <span v-if="index==0" class="ranking-icon icon-gold">{{item.ranking}}</span>
                            <span v-else-if="index==1" class="ranking-icon icon-sliver">{{item.ranking}}</span>
                            <span v-else-if="index==2" class="ranking-icon icon-copper">{{item.ranking}}</span>
                            <span v-else class="ranking-radius">{{item.ranking}}</span>
                            <span class="ranking-team">{{item.team}}团队</span>
                            <span class="ranking-num">{{item.caseNum}}件</span>
                        </li>
                    </ul>
                    <ul class="ranking-list" v-if="tabActive=='investigator'">
                        <li v-for="(item,index) in investigatorTeam" :key="index">
                            <span v-if="index==0" class="ranking-icon icon-gold">{{item.ranking}}</span>
                            <span v-else-if="index==1" class="ranking-icon icon-sliver">{{item.ranking}}</span>
                            <span v-else-if="index==2" class="ranking-icon icon-copper">{{item.ranking}}</span>
                            <span v-else class="ranking-radius">{{item.ranking}}</span>
                            <span class="ranking-team">{{item.team}}团队</span>
                            <span class="ranking-num">{{item.caseNum}}件</span>
                        </li>
                    </ul>
                </div>
            </div>
            <div class="echarts-border">
                <div id="map" class="echarts-box"></div>
            </div>
        </Row>
    </div>
</template>
<script>
import "../../../../static/map/china.js";
export default {
    data () {
        return {
            year:'',
            projectAnalysisData:'', // 项目分析
            compensationOverview:'', // 营收概况
            clueOverview:'', //线索概况
            caseCloseOverview:'', //完结案件概况
            caseOverview:'', //在办案件概况
            revenueSituationOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'shadow'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['累计赔偿款','新增赔偿款']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: [
                    {
                        type: 'category',
                        data: []
                    }
                ],
                yAxis: [
                    {
                        type: 'value'
                    }
                ],
                series: [
                    {
                        name: '累计赔偿款',
                        type: 'line',
                        data: []
                    },
                    {
                        name: '新增赔偿款',
                        type: 'bar',
                        itemStyle: {
                            color: new this.$echarts.graphic.LinearGradient(
                                0, 0, 0, 1,
                                [
                                    {offset: 0, color: '#83bff6'},
                                    {offset: 0.5, color: '#188df0'},
                                    {offset: 1, color: '#188df0'}
                                ]
                            )
                        },
                        emphasis: {
                            focus: 'series'
                        },
                        data: []
                    }
                ]
            },
            clueOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                },
                legend: {
                    data: []
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            missionOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                },
                legend: {
                    data: []
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: []
                },
                yAxis: {
                    type: 'value'
                },
                series: []
            },
            caseOption: {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                },
                legend: {
                    data: ['案件折损率']
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: true,
                    data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
                },
                yAxis: {
                    type: 'value'
                },
                series: [
                    {
                        name:'案件折损率',
                        data: [820, 932, 901, 934, 1290, 1330, 1320],
                        type: 'line',
                        areaStyle: {},
                    }
                ]
            },
            clueSelected:'new-clue-trend',
            missionSelected:'cases-in-process',
            caseSelected:'cases-completed',
            caseInProgressOption: {
                title: {
                    text: '在办案件进度分布占比',
                    left: 'center'
                },
                legend: {
                    top: 'bottom'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(params){
                        return params.name.split('|')[0] + '<br/>' +params.percent +'%'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {}
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        label:{
                            formatter: function(params){
                                return params.name.split('|')[0] + '|' +params.percent +'%'
                            }
                        },
                        radius: [10, "50%"],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data:[],
                    }
                ]
            },
            closingMethodOption: {
                title: {
                    text: '结案方式分布占比',
                    left: 'center'
                },
                legend: {
                    top: 'bottom'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(params){
                        return params.name.split('|')[0] + '<br/>' +params.percent +'%'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {}
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        label:{
                            formatter: function(params){
                                return params.name.split('|')[0] + '|' +params.percent +'%'
                            }
                        },
                        radius: [10, "50%"],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data:[],
                    }
                ]
            },
            caseClueOption: {
                title: {
                    text: '案件状态分布占比',
                    left: 'center'
                },
                legend: {
                    top: 'bottom'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(params){
                        return params.name.split('|')[0] + '<br/>' +params.percent +'%'
                    }
                },
                toolbox: {
                    show: true,
                    feature: {}
                },
                series: [
                    {
                        name: '面积模式',
                        type: 'pie',
                        label:{
                            formatter: function(params){
                                return params.name.split('|')[0]
                            }
                        },
                        radius: [10, "40%"],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8
                        },
                        data:[],
                    }
                ]
            },
            caseTypeOption: {
                title: {
                    text: '案件类型分布占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:function(params){
                        return params.name + '<br/>' +params.percent +'%'
                    }
                },
                series: [
                    {
                        name: '总数',
                        type: 'pie',
                        radius: '50%',
                        label:{
                            formatter: '{b} | {d}%',
                        },
                        data: [],
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            },
            mapOption: {
                title: {
                    text: "线索区域分布",
                    textStyle:{
                        color: '#6a6c6f',
                        fontSize:16
                    },
                    padding: [5,24]
                },
                visualMap: {
                    min: 0,
                    max: 100,
                    left: 'left',
                    bottom : 20,
                    calculable: false,
                    itemWidth:'25',
                    itemHeight:'10',
                    orient:"horizontal",
                    itemSymbol:"rect",
                    splitNumber:4,
                    text:[1,1000],
                    inverse:true,
                    itemGap:1,
                    color: ['#F3CB70','#EFB941','#EBA811','#D18909'],
                    textStyle:{
                        color:"#000",
                        fontWeight:"bold"
                    }
                },
                tooltip: { trigger: 'item' },
                series: [{
                    name: '线索',
                    type: 'map',
                    mapType: 'china',
                    top:'15%',
                    itemStyle:{
                        borderColor:'#fff',
                        areaColor:"#F3CB70"
                    },
                    label: {
                        normal: { 
                            show: true,
                            color: '#fff'
                        },
                        emphasis: { show: true }
                    },
                    data: []
                }]
            },
            tabActive:'lawyer',
            lawyerTeam:[],
            investigatorTeam:[]
        }
    },
    props: ['projectId'],
    methods: {
        // 项目分析
        getProjectAnalysis(){
            let url = '/business/project/analysis';
            let ajaxData = {
                projId:this.projectId,
                year:this.year
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.projectAnalysisData = res.data;
                }
            })
        },
        // 营收概况
        getCompensationOverview(){
            let url = '/business/project/compensation-overview';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.compensationOverview = res.data;
                }
            })
        },
        // 线索概况
        getClueOverview(){
            let url = '/business/project/clue-overview';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.clueOverview = res.data;
                }
            })
        },
        // 在办案件概况
        getCaseOverview(){
            let url = '/business/project/case-overview';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseOverview = res.data;
                }
            })
        },
        // 完结案件概况
        getCaseCloseOverview(){
            let url = '/business/project/case-closed-overview';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseCloseOverview = res.data;
                }
            })
        },
        // 营收图表
        getRevenueSituation(){
            let url = '/business/project/compensation-analysis';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.revenueSituationOption.xAxis[0].data = res.data.map((item,index)=>{
                        if(index<9){
                            return item.month.slice(1,2) + '月';
                        }else {
                            return item.month + '月';
                        }
                    });
                    this.revenueSituationOption.series[0].data = res.data.map(item=>{
                        return item.added;
                    });
                    this.revenueSituationOption.series[1].data = res.data.map(item=>{
                        return item.total;
                    });
                    this.repaint('revenueSituation',this.revenueSituationOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 线索图表维度
        getClueSituation(name){
            let url = '' ;
            if(name=='new-clue-trend'){
                url = '/business/project/clue-analysis';
                this.clueOption.legend.data = ["新增线索","累计线索"];
                this.clueOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                }
                this.clueOption.series = [];
                this.clueOption.series.push({
                    name:'新增线索',
                    data: [],
                    type: 'line'
                },{
                    name:'累计线索',
                    data: [],
                    type: 'bar'
                })
                this.clueOption.yAxis.axisLabel = {
                    formatter:'{value}'
                }
            }else if(name=='new-clue-audit-trend'){
                url = '/business/project/clue-pass-rate';
                this.clueOption.legend.data = ["线索审核通过率"];
                this.clueOption.series = [];
                this.clueOption.series.push({
                    name:'线索审核通过率',
                    data: [],
                    type: 'line'
                })
                this.clueOption.yAxis.axisLabel = {
                    formatter:'{value}%'
                }
                this.clueOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    },
                    formatter:function (params) {
                        return params[0].name + '<br />' + params[0].data +'%';
                    }
                }
            }
            this.$post(url,{projId:this.projectId, year:this.year}).then(res=>{
                if(res.code==0){
                    this.clueOption.xAxis.data = res.data.map((item,index)=>{
                        if(index<9){
                            return item.month.slice(1,2) + '月';
                        }else {
                            return item.month + '月';
                        }
                    });
                    if(name=='new-clue-trend'){
                        this.clueOption.series[0].data = res.data.map(item=>{
                            return item.added;
                        });
                        this.clueOption.series[1].data = res.data.map(item=>{
                            return item.total;
                        });
                    }else{
                        this.clueOption.series[0].data = res.data.map(item=>{
                            return (item.passRate*100).toFixed(2);
                        });
                    }
                    this.repaint('clue',this.clueOption);
                }
            })
        },
        // 在办案件图表维度 案件趋势 | 案件转换率趋势
        getMissionSituation(name){
            let url = '';
            if(name=='cases-in-process'){
                url = '/business/project/case-analysis';
                this.missionOption.legend.data = ["新增在办案件","累计在办线索"];
                this.missionOption.series = [];
                this.missionOption.series.push({
                    name:'新增在办案件',
                    data: [],
                    type: 'line'
                },{
                    name:'累计在办线索',
                    data: [],
                    type: 'bar'
                })
                this.missionOption.yAxis.axisLabel = {
                    formatter:'{value}'
                }
                this.missionOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                }
            }else if('case-conversion-rate'){
                url = '/business/project/case-conversion-rate';
                this.missionOption.legend.data = ["案件转换率"];
                this.missionOption.series = [];
                this.missionOption.series.push({
                    name:'案件转换率',
                    data: [],
                    type: 'line'
                })
                this.missionOption.yAxis.axisLabel = {
                    formatter:'{value}%'
                }
                this.missionOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    },
                    formatter:function (params) {
                        return params[0].name + '<br />' + params[0].data +'%';
                    }
                }
            }
            this.$post(url,{projId:this.projectId, year:this.year}).then(res=>{
                if(res.code==0){
                    this.missionOption.xAxis.data = res.data.map((item,index)=>{
                        if(index<9){
                            return item.month.slice(1,2) + '月';
                        }else {
                            return item.month + '月';
                        }
                    });
                    if(name=='cases-in-process'){
                        this.missionOption.series[0].data = res.data.map(item=>{
                            return item.added;
                        });
                        this.missionOption.series[1].data = res.data.map(item=>{
                            return item.total;
                        });
                    }else{
                        this.missionOption.series[0].data = res.data.map(item=>{
                            return (item.conversionRate*100).toFixed(2);
                        });
                    }
                    this.repaint('mission',this.missionOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
            
        },
        // 完结案件图表维度  案件完结趋势 | 案件折损率趋势
        getCaseSituation(name){
            let url = '';
            if(name=='cases-completed'){
                url = '/business/project/case-closed-analysis';
                this.caseOption.legend.data = ["新增完结案件","完结案件数"];
                this.caseOption.series = [];
                this.caseOption.series.push({
                    name:'新增完结案件',
                    data: [],
                    type: 'line'
                },{
                    name:'完结案件数',
                    data: [],
                    type: 'bar'
                })
                this.caseOption.yAxis.axisLabel = {
                    formatter:'{value}'
                }
                this.caseOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    }
                }
            }else if('case-discount-rate'){
                url = '/business/project/case-discount-rate';
                this.caseOption.legend.data = ["案件折损率"];
                this.caseOption.series = [];
                this.caseOption.series.push({
                    name:'案件折损率',
                    data: [],
                    type: 'line'
                })
                this.caseOption.yAxis.axisLabel = {
                    formatter:'{value}%'
                }
                this.caseOption.tooltip = {
                    trigger: 'axis',
                    axisPointer: {
                        type: 'cross',
                    },
                    formatter:function (params) {
                        return params[0].name + '<br />' + params[0].data +'%';
                    }
                }
            }
            this.$post(url,{projId:this.projectId, year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseOption.xAxis.data = res.data.map((item,index)=>{
                        if(index<9){
                            return item.month.slice(1,2) + '月';
                        }else {
                            return item.month + '月';
                        }
                    });
                    if(name=='cases-completed'){
                        this.caseOption.series[0].data = res.data.map(item=>{
                            return item.added;
                        });
                        this.caseOption.series[1].data = res.data.map(item=>{
                            return item.total;
                        });
                    }else{
                        this.caseOption.series[0].data = res.data.map(item=>{
                            return (item.discountRate*100).toFixed(2);
                        });
                    }
                    this.repaint('case',this.caseOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 在办案件进度分布占比
        getCaseInProgress(){
            let url = '/business/project/case-process-rate';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseInProgressOption.series[0].data = res.data.map(item=>{
                        return {
                            name:item.processName +' | ' +item.total,
                            value:item.total
                        }
                    })
                    this.repaint('caseInProgress',this.caseInProgressOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 结案方式占比
        getClosingMethod(){
            let url = '/business/project/case-close-type-rate';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.closingMethodOption.series[0].data = res.data.map(item=>{
                        return {
                            name:item.processName + ' | ' + item.total,
                            value:item.total
                        }
                    })
                    this.repaint('closingMethod',this.closingMethodOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 案件状态分布占比
        getCaseClue(){
            let url = '/business/project/case-state-rate';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseClueOption.series[0].data = res.data.map(item=>{
                        return {
                            name:item.processName + ' | ' + item.total,
                            value:item.total
                        }
                    })
                    this.repaint('caseClue',this.caseClueOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 案件类型分布占比
        getCaseTypeOption(){
            let url = '/business/project/case-type-rate';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    this.caseTypeOption.series[0].data = res.data.map(item=>{
                        return {
                            name:item.processName,
                            value:item.total
                        }
                    })
                    this.repaint('caseType',this.caseTypeOption);
                }else{
                    this.$Message.error('操作失败')
                }
            })
        },
        // 排行榜
        getTenTopTeam(type){
            this.tabActive = type;
            let url = '',ajaxData = {
                projId: this.projectId,
                year: this.year
            }
            if(type=='lawyer'&&this.lawyerTeam.length>0){
                return;
            }
            if(type=='investigator'&&this.investigatorTeam.length>0){
                return;
            }
            url = type=='lawyer'?'/business/project/lawyer-ranking':'/business/project/investigator-ranking'
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    if(type=='lawyer'){
                        this.lawyerTeam = res.data;
                    }else{
                        this.investigatorTeam = res.data;
                    }
                }else{
                    this.$Message.error('操作失败');
                }
            })
        },
        // 线索区域分布
        getMapOption(){
            let url = '/business/project/clue-area';
            this.$post(url,{projId:this.projectId,year:this.year}).then(res=>{
                if(res.code==0){
                    let tempArr = [];
                    res.data.forEach((item,index)=>{
                        let obj = {
                            name:item.provinceName.split(/(省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区)/)[0],
                            value:item.clueResultNumber
                        }
                        tempArr.push(obj);
                    })
                    this.mapOption.series[0].data = tempArr;
                    let tempMax = tempArr[0].value
                    for (let i = 0; i < tempArr.length-1; i++) {
                        tempMax = tempMax < tempArr[i + 1].value ? tempArr[i + 1].value : tempMax
                    }
                    this.mapOption.visualMap.max = tempMax
                    this.repaint('map',this.mapOption);
                }
            })
            
        },
        repaint(mapId,option){
            let myChart =  this.$echarts.init(document.getElementById(mapId));
            myChart.clear();
            myChart.setOption(option);
            window.addEventListener("resize", myChart.resize);
        },
        getChange(value,type){
            switch (true) {
                case (value=='new-clue-trend') || (value=='new-clue-audit-trend') :
                    this.getClueSituation(value);
                    break;
                case (value=='cases-in-process') || (value=='case-conversion-rate') :
                    this.getMissionSituation(value)
                    break;
                case (value=='cases-completed') || (value=='case-discount-rate') :
                    this.getCaseSituation(value)
                    break;
            }
        },
        transformPercentage(num,unit){
            let number = num || 0;
            let str = Math.floor((Math.abs(number)*100));
            if(unit){
                str += unit;
            }
            return str
        },
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.year = new Date().getFullYear();
        this.getProjectAnalysis();
        this.getClueOverview();
        this.getRevenueSituation();
        this.getClueSituation('new-clue-trend');
        this.getMissionSituation('cases-in-process');
        this.getCaseSituation('cases-completed');
        this.getCaseInProgress();
        this.getClosingMethod();
        this.getCaseClue();
        this.getCaseTypeOption();
        this.getMapOption();
        this.getTenTopTeam('lawyer');
        this.getCaseCloseOverview();
        this.getCaseOverview();
        // this.getCompensationOverview();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import './projectOverview.scss';
</style>
