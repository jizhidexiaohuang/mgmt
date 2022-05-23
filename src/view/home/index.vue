<template>
    <div class="customer-manage have-drawer-style">
        <div class="card-style" v-if="false">
            <Button @click="payment">支付</Button>
            <Button @click="refund">退款</Button>
            <Button @click="getPayMes">查询订单支付信息</Button>
            <Button @click="getRefund">查看退款信息</Button>
            <div id="qrCode"></div>
        </div>
        <Row class="home-box">
            <Row class="home-left">
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-01 global-main-color"></i>
                        <span>数据概览</span>
                    </Row>
                    <div class="flex-content">
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">年度赔偿款回款</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.payBackOverviewVO.annual || 0}}</strong>
                                        <span>万</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">月度赔偿款回款</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.payBackOverviewVO.monthly || 0}}</strong>
                                        <span>万</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>年度目标达成率</span>
                                    <span class="error-color">{{transformPercentage(summaryData.payBackOverviewVO.achievementRate || 0)}}</span>
                                </div>
                                <div class="item-right item-compare">
                                    <span>月环比</span>
                                    <span v-if="summaryData.payBackOverviewVO.monthOnYear>=0" class="error-color">
                                        {{transformPercentage(summaryData.payBackOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-up" />
                                    </span>
                                    <span v-else class="success-color">
                                        {{transformPercentage(summaryData.payBackOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-down" />
                                    </span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">已签约客户</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.customerData.contracted || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增签约客户</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.customerData.annualContract || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>年度目标达成率</span>
                                    <span class="error-color">{{transformPercentage(summaryData.customerData.achievementRate || 0)}}</span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">已签约律所</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.lawyerData.contracted || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增签约律所</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.lawyerData.annualContract || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>年度目标达成率</span>
                                    <span class="error-color">{{transformPercentage(summaryData.lawyerData.achievementRate || 0)}}</span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">已签约调查团队</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.investData.contracted || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增签约调查团队</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.investData.annualContract || 0}}</strong>
                                        <span>家</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>年度目标达成率</span>
                                    <span class="error-color">{{transformPercentage(summaryData.lawyerData.achievementRate || 0)}}</span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">线索总数</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.clueOverviewVO.total || 0}}</strong>
                                        <span>条</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增线索</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.clueOverviewVO.annualAdded || 0}}</strong>
                                        <span>条</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>月新增线索</span>
                                    <span class="error-color">{{summaryData.clueOverviewVO.monthlyAdded || 0}}</span>
                                </div>
                                <div class="item-right item-compare">
                                    <span>月环比</span>
                                    <span v-if="summaryData.clueOverviewVO.monthOnYear>=0" class="error-color">
                                        {{transformPercentage(summaryData.clueOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-up" />
                                    </span>
                                    <span v-else class="success-color">
                                        {{transformPercentage(summaryData.clueOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-down" />
                                    </span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">案件总数</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.caseOverviewVO.total || 0}}</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增案件</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.caseOverviewVO.annualAdded || 0}}</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>月新增案件</span>
                                    <span class="error-color">{{summaryData.caseOverviewVO.monthlyAdded || 0}}</span>
                                </div>
                                <div class="item-right item-compare">
                                    <span>月环比</span>
                                    <span v-if="summaryData.caseOverviewVO.monthOnYear>=0" class="error-color">
                                        {{transformPercentage(summaryData.caseOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-up" />
                                    </span>
                                    <span v-else class="success-color">
                                        {{transformPercentage(summaryData.caseOverviewVO.monthOnYear || 0)}}
                                        <Icon type="md-arrow-down" />
                                    </span>
                                </div>
                            </Row>
                        </div>
                        <div class="flex-item">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">在办案件</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.caseOverviewVO.processing || 0}}</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">已结案案件</p>
                                    <div class="item-content">
                                        <strong>{{summaryData.caseOverviewVO.closed || 0}}</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom"></Row>
                        </div>
                        <div class="flex-item disabled-block">
                            <Row class="item-top">
                                <div class="item-left">
                                    <p class="secondary-title">重案总数量</p>
                                    <div class="item-content">
                                        <!-- <strong>{{summaryData.caseOverviewVO.totalImportant || 0}}</strong> -->
                                        <strong>0</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                                <div class="item-right">
                                    <p class="secondary-title">年新增重案数</p>
                                    <div class="item-content">
                                        <!-- <strong>{{summaryData.caseOverviewVO.annualAddedImportant || 0}}</strong> -->
                                        <strong>0</strong>
                                        <span>件</span>
                                    </div>
                                </div>
                            </Row>
                            <Row class="item-bottom">
                                <div class="item-left item-compare">
                                    <span>月新增重案量</span>
                                    <!-- <span class="error-color">{{summaryData.caseOverviewVO.monthlyAddedImportant || 0}}</span> -->
                                    <span class="error-color">0</span>
                                </div>
                                <div class="item-right item-compare">
                                    <span>月环比</span>
                                    <span v-if="summaryData.caseOverviewVO.monthOnYearImportant>=0" class="error-color">
                                        <!-- {{transformPercentage(summaryData.caseOverviewVO.monthOnYearImportant || 0)}} -->
                                        0
                                        <Icon type="md-arrow-up" />
                                    </span>
                                    <span v-else class="success-color">
                                        <!-- {{transformPercentage(summaryData.caseOverviewVO.monthOnYearImportant || 0)}} -->
                                        0
                                        <Icon type="md-arrow-down" />
                                    </span>
                                </div>
                            </Row>
                        </div>
                    </div>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-02 global-main-color"></i>
                        <span>待办事项</span>
                    </Row>
                    <div class="bg-white left-block top-border">
                        <div class="left-block-item" @click="linkToRoute('/relationship/projectReview')">
                            <img src="./../../assets/images/home-icon-01.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewOpportunities || 0}}</strong>
                                    <span>项</span>
                                </p>
                                <p class="secondary-title">待审商机</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/contract/contractReview')">
                            <img src="./../../assets/images/home-icon-02.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewContract || 0}}</strong>
                                    <span>份</span>
                                </p>
                                <p class="secondary-title">待审合同</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/task/auditTask')">
                            <img src="./../../assets/images/home-icon-03.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewMission || 0}}</strong>
                                    <span>个</span>
                                </p>
                                <p class="secondary-title">待审线索任务</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/clue/myManage/reviewedClue')">
                            <img src="./../../assets/images/home-icon-04.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewClue || 0}}</strong>
                                    <span>个</span>
                                </p>
                                <p class="secondary-title">待审线索</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/agreement/lawyer/pending')">
                            <img src="./../../assets/images/home-icon-05.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.lawyerAgreement || 0}}</strong>
                                    <span>份</span>
                                </p>
                                <p class="secondary-title">待审律师协议</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/agreement/investigator/pending')">
                            <img src="./../../assets/images/home-icon-06.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.investigatorAgreement || 0}}</strong>
                                    <span>份</span>
                                </p>
                                <p class="secondary-title">待审调查协议</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/cooperationTeam/lawyer/examine')">
                            <img src="./../../assets/images/home-icon-07.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewLawyer || 0}}</strong>
                                    <span>个</span>
                                </p>
                                <p class="secondary-title">待审律师账号</p>
                            </div>
                        </div>
                        <div class="left-block-item" @click="linkToRoute('/cooperationTeam/investigator/examine')">
                            <img src="./../../assets/images/home-icon-08.png" alt="">
                            <div class="item-content item-text-box">
                                <p>
                                    <strong>{{pendingData.reviewInvestigator || 0}}</strong>
                                    <span>个</span>
                                </p>
                                <p class="secondary-title">待审调查账号</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="unit-margin" v-show="false">
                    <Row class="main-title">
                        <i class="icon-home-03 global-main-color"></i>
                        <span>财务数据分析</span>
                        <div class="fr" v-if="false">
                            <DatePicker type="year" :clearable="false" :value="yearObj.financeYear" @on-change="getTime($event,'financeYear')" placeholder="请选择年份" style="width:100px"></DatePicker>
                        </div>
                    </Row>
                    <Row class="bg-white top-border">
                        <Col span="15">
                            <div id="finance-polygonal-line" class="echarts-box"></div>
                        </Col>
                        <Col span="9">
                            <div id="finance-radius-ring" class="echarts-box"></div>
                        </Col>
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-04 global-main-color"></i>
                        <span>客户数据分析</span>
                        <div class="fr" v-if="false">
                            <DatePicker type="year" :clearable="false" :value="yearObj.customerYear" @on-change="getTime($event,'customerYear')" placeholder="请选择年份" style="width:100px"></DatePicker>
                        </div>
                    </Row>
                    <Row class="bg-white top-border">
                        <Col span="15">
                            <div id="customer-bar" class="echarts-box"></div>
                        </Col>
                        <Col span="9">
                            <div id="customer-pie" class="echarts-box"></div>
                        </Col>
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-05 global-main-color"></i>
                        <span>合作团队数据分析</span>
                        <div class="fr" v-if="false">
                            <DatePicker type="year" :clearable="false" :value="yearObj.teamYear" @on-change="getTime($event,'teamYear')" placeholder="请选择年份" style="width:100px"></DatePicker>
                        </div>
                    </Row>
                    <Row class="bg-white top-border">
                        <Col span="9">
                            <div id="lawyer-map" class="echarts-box"></div>
                        </Col>
                        <Col span="15">
                            <div id="lawyer-polygonal-line" class="echarts-box"></div>
                        </Col>
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-06 global-main-color"></i>
                        <span>线索数据分析</span>
                        <div class="fr" v-if="false">
                            <DatePicker type="year" :clearable="false" :value="yearObj.clueYear" @on-change="getTime($event,'clueYear')" placeholder="请选择年份" style="width:100px"></DatePicker>
                        </div>
                    </Row>
                    <Row class="bg-white top-border">
                        <Col span="15">
                            <div id="clue-bar" class="echarts-box"></div>
                        </Col>
                        <Col span="9">
                            <div id="clue-pie" class="echarts-box"></div>
                            <div style="text-align:center">
                                <ButtonGroup>
                                    <Button :type="tortType=='E'?'primary':'default'" @click="reloadCluePie('E')">线上</Button>
                                    <Button :type="tortType=='S'?'primary':'default'" @click="reloadCluePie('S')">线下</Button>
                                </ButtonGroup>
                            </div>
                        </Col>
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-lawyer-04 global-main-color"></i>
                        <span>案件数据分析</span>
                        <div class="fr" v-if="false">
                            <DatePicker type="year" :clearable="false" :value="yearObj.caseYear" @on-change="getTime($event,'caseYear')" placeholder="请选择年份" style="width:100px"></DatePicker>
                        </div>
                    </Row>
                    <Row class="bg-white top-border">
                        <Col span="15">
                            <div id="case-bar" class="echarts-box"></div>
                        </Col>
                        <Col span="9">
                            <div id="case-radius-pie" class="echarts-box"></div>
                        </Col>
                    </Row>
                </div>
            </Row>
            <Row class="home-right">
                <div class="unit-margin" v-if="false">
                    <Row class="main-title">
                        <i class="icon-home-08 global-main-color"></i>
                        <span>每周简报</span>
                    </Row>
                    <Row class="block-content">
                        敬请期待！
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-09 global-main-color"></i>
                        <span>通知（{{unReadSum || 0}}）</span>
                        <span class="title-option">
                            <Dropdown @on-click="option($event)" transfer>
                                <a href="javascript:void(0)">
                                    <Icon type="ios-more" size="20"/>
                                </a>
                                <DropdownMenu slot="list">
                                    <DropdownItem name="clearAll">清空已读</DropdownItem>
                                </DropdownMenu>
                            </Dropdown>
                        </span>
                    </Row>
                    <Row class="block-content scroll-list">
                        <Scroll v-if="adviseData.length!=0" :on-reach-bottom="handleReachBottom" :loading-text="loadingText" height="160" :distance-to-edge="5">
                            <ul>
                                <li v-for="(item,index) in adviseData" :key="index" :class="{'has-read':item.readState}">
                                    <i :class="{'icon-absolute':true,'icon-dot':true}"></i>
                                    <span class="block-item-text click-text global-main-color textover" @click="routerTo(item)" :title="item.content || ''">{{item.content || ""}}</span>
                                    <span class="fr time-text">{{common.formatTime(item.createTime)}}</span>
                                </li>
                            </ul>
                        </Scroll>
                        <p class="no-advise" v-else>暂无通知</p>
                    </Row>
                </div>
                <div class="unit-margin">
                    <Row class="main-title">
                        <i class="icon-home-10 global-main-color"></i>
                        <span>案件榜单/线索榜单</span>
                        <span class="title-option">
                            <ButtonGroup size="small">
                                <Button :type="dateType=='M'?'primary':'default'" @click="dateType='M'">月度</Button>
                                <Button :type="dateType=='Q'?'primary':'default'" @click="dateType='Q'">季度</Button>
                                <Button :type="dateType=='Y'?'primary':'default'" @click="dateType='Y'">年度</Button>
                            </ButtonGroup>
                        </span>
                    </Row>
                    <Row class="inside-list bg-white">
                        <div>
                            <Row class="main-title">
                                <i class="icon-home-lawyer-09 global-main-color"></i>
                                <span>赔偿款回款排行榜</span>
                                <span class="title-option" v-if="false">
                                    <Dropdown @on-click="option($event)" transfer>
                                        <a href="javascript:void(0)">
                                            <Icon type="ios-more" size="20"/>
                                        </a>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="seemore">查看更多</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </span>
                            </Row>
                            <Row class="block-content">
                                <ul>
                                    <li class="li-img" v-for="(item,index) in payBackData" :key="index" v-if="payBackData.length!=0">
                                        <i :class="['icon-radius','icon-absolute',...rankClass(index+1)]">{{index+1}}</i>
                                        <span class="block-item-text textover">{{item.team || ""}}</span>
                                        <span class="fr time-text pay-text rank-text">
                                            {{common.formateNumber(item.payBack || 0,'')}}
                                        </span>
                                    </li>
                                    <li style="text-align:center;" v-if="payBackData.length==0">暂无数据</li>
                                </ul>
                            </Row>
                        </div>
                        <div>
                            <Row class="main-title">
                                <i class="icon-home-lawyer-10 global-main-color"></i>
                                <span>新增取证案件排行榜</span>
                                <span class="title-option" v-if="false">
                                    <Dropdown @on-click="option($event)" transfer>
                                        <a href="javascript:void(0)">
                                            <Icon type="ios-more" size="20"/>
                                        </a>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="seemore">查看更多</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </span>
                            </Row>
                            <Row class="block-content">
                                <ul>
                                    <li class="li-img" v-for="(item,index) in caseRankData" :key="index" v-if="caseRankData.length!=0">
                                        <i :class="['icon-radius','icon-absolute',...rankClass(index+1)]">{{index+1}}</i>
                                        <span class="block-item-text textover">{{item.team || ""}}</span>
                                        <span class="fr time-text pay-text rank-text">
                                            {{item.caseNum || 0}}
                                        </span>
                                    </li>
                                    <li style="text-align:center;" v-if="caseRankData.length==0">暂无数据</li>
                                </ul>
                            </Row>
                        </div>
                        <div>
                            <Row class="main-title">
                                <i class="icon-home-lawyer-11 global-main-color"></i>
                                <span>结案量排行榜</span>
                                <span class="title-option" v-if="false">
                                    <Dropdown @on-click="option($event)" transfer>
                                        <a href="javascript:void(0)">
                                            <Icon type="ios-more" size="20"/>
                                        </a>
                                        <DropdownMenu slot="list">
                                            <DropdownItem name="seemore">查看更多</DropdownItem>
                                        </DropdownMenu>
                                    </Dropdown>
                                </span>
                            </Row>
                            <Row class="block-content">
                                <ul>
                                    <li class="li-img" v-for="(item,index) in caseClosedRankData" :key="index" v-if="caseClosedRankData.length!=0">
                                        <i :class="['icon-radius','icon-absolute',...rankClass(index+1)]">{{index+1}}</i>
                                        <span class="block-item-text textover">{{item.team || ""}}</span>
                                        <span class="fr time-text pay-text rank-text" v-if="dateType!='M'">
                                            {{item.rate?`${(item.rate*100).toFixed(2)}%`:""}}
                                        </span>
                                        <span class="fr time-text pay-text rank-text" v-else>
                                            {{item.caseNum || 0}}
                                        </span>
                                    </li>
                                    <li style="text-align:center;" v-if="caseClosedRankData.length==0">暂无数据</li>
                                </ul>
                            </Row>
                        </div>
                    </Row>
                </div>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
import QRCode from 'qrcodejs2';
import "../../../static/map/china.js";
export default {
    data () {
        return {
            styles:styles,
            tortType:"E",
            adviseData:[],
            unReadSum:"",
            adviseObj:{
                pageSize:this.config.pageSize,
                pageNum:1,
                totalRecords:1
            },
            pendingData:{},
            loadingText:"",
            summaryData:{
                clueOverviewVO:"",
                caseOverviewVO:"",
                payBackOverviewVO:"",
                lawyerData:"",
                customerData:"",
                investData:""
            },
            yearObj:{
                financeYear:"",
                customerYear:"",
                teamYear:"",
                clueYear:"",
                caseYear:"",
            },
            echartsObj:{
                finance:{},
                customer:{},
                team:{},
                clue:{},
                case:{}
            },
            payBackData:[],
            caseRankData:[],
            caseClosedRankData:[],
            dateType:"M",
            menu:[]
        }
    },
    props: [''],
    methods: {
        rankClass(index){
            let nameArr = [];
            switch(index){
                case 1:
                    nameArr = ['icon-img','icon-gold']
                    break;
                case 2:
                    nameArr = ['icon-img','icon-sliver']
                    break;
                case 3:
                    nameArr = ['icon-img','icon-copper']
                    break;
                default:
                    break;
            }
            return nameArr
        },
        payment(){
            let url = '/paycenter/payment/unifiedOrder';
            let ajaxData = {
                payType: 'WEPAY',
                appId: 'wx50a7372171309dc9',
                paySource: 1001,
                orderNo: 'TEST202006091604012',
                totalFee: 1,
                userId: 1,
                platformSourceType: 'M',
                productName:'支付中心-测试商品'
            }
            this.$post(url,ajaxData).then(res=>{
                this.useQrCode(res.data.codeUrl)
            })
        },
        refund(){
            let url = '/paycenter/payment/refund';
            let ajaxData = {
                refundType: 'WEPAY',
                appId: 'wx50a7372171309dc9',
                refundSource: 1001,
                orderNo: 'TEST202006091604012',
                totalFee: 1,
                refundDesc: '测试退款',
                userId: 1,
                platformSourceType: 'M'
            }
            this.$post(url,ajaxData).then(res=>{
                console.log(res)
            })
        },
        //动态生成二维码
        useQrCode(copyText) {
            let qrcode = new QRCode(document.getElementById('qrCode'), {
                width: 200,
                height: 200,
                text: copyText, // 二维码地址
                colorDark : "#000",
                colorLight : "#fff",
            })
        },
        //查询支付状态
        getPayMes(){
            let url = '/paycenter/payment/queryOrder?orderNo=TEST202006091604012';
            this.$get(url).then(res=>{
                console.log(res)
            })
        },
        //查看退款信息
        getRefund(){
            let url = '/paycenter/payment/queryRefund?orderNo=TEST202006091604012';
            this.$get(url).then(res=>{
                console.log(res)
            })
        },
        //获取对应的时间点
        getTime(time,key){
            this.yearObj[key] = time;
            switch(key){
                case "financeYear":
                    break;
                case "customerYear":
                    this.getCustBarData();
                    this.getCustPieData();
                    break;
                case "teamYear":
                    this.getTeamMapData();
                    this.getTeamLineData();
                    break;
                case "clueYear":
                    this.getClueBarData();
                    this.getCluePieData();
                    break;
                case "caseYear":
                    this.getCaseBarData();
                    this.getCasePieData();
                    break;
            }
        },
        /**** 页面代码正式开始 ****/
        //标记已读
        readAdvise(data){
            let url = `/business/notify/${data.id}/read`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.getUnReadNum();
                    this.$set(data,"readState",true);
                }
            })
        },
        //清空所有已读
        clearAllAdvise(){
            let url = `/business/notify/all/read`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.getUnReadNum();
                    this.adviseData.forEach((item,index)=>{
                        this.$set(item,"readState",true);
                    })
                }
            })
        },
        //路由跳转
        routerTo(data){
            let code = data.code;
            this.readAdvise(data);
            switch (code){
                case "case_settle_payment":
                    this.$router.push({
                        path:`/case/civilCase`,
                        query: { id: data.bizId }
                    });
                    break;
            }
        },
        // 判断是否有页面权限
        linkToRoute(path){
            let arr = this.$store.state.permission.menu;
            this.getMenuList(arr);
            if(this.menu.indexOf(path)==-1){
                this.$Message.warning('您没有访问权限，请联系管理员')
                return;
            }
            this.$router.push(path);
        },
        getMenuList(arr){
            arr.forEach((item)=>{
                if(item.href){
                    this.menu.push(item.href);
                }else if(Array.isArray(item.childList)){
                    return this.getMenuList(item.childList)
                }
            })
        },
        //获取通知
        getAdvise(resolve){
            let url = '/business/notify';
            let ajaxData = {
                current:this.adviseObj.pageNum,
                size:this.adviseObj.pageSize
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    if(res.data.records.length==0){
                        this.loadingText = "暂无更多数据";
                    }
                    this.adviseData = this.adviseData.concat(res.data.records || []);
                    if(resolve){
                        resolve();
                    }
                }
            })
        },
        //获取未读公告数量
        getUnReadNum(){
            let url = '/business/notify/unread/count';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.unReadSum = res.data;
                }
            })
        },
        //清空所有已读
        clearAllAdvise(){
            let url = `/business/notify/all/read`;
            this.$patch(url).then(res=>{
                if(res.code==0){
                    this.getUnReadNum();
                    this.adviseData.forEach((item,index)=>{
                        this.$set(item,"readState",true);
                    })
                }
            })
        },
        //通知栏移动到底部加载更多
        handleReachBottom() {
            let t = this;
            this.adviseObj.pageNum++;
            //必须返回一个promise
            return new Promise(resolve => {
                this.loadingText = "正在加载中";
                this.getAdvise(resolve);
            });
        },
        option(name){
            switch(name){
                case "clearAll":
                    this.clearAllAdvise();
                    break;
            }
        },
        reloadCluePie(keyType){
            this.tortType = keyType;
            this.getCluePieData();
        },
        getData(){
            let url = '/business/mgmt/workbench/overview-data';
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.summaryData.clueOverviewVO = res.data.clueOverviewVO;
                    this.summaryData.caseOverviewVO = res.data.caseOverviewVO;
                    this.summaryData.payBackOverviewVO = res.data.payBackOverviewVO;
                    this.summaryData.lawyerData = this.filterData(res.data.overviewDTOList,"L");
                    this.summaryData.customerData = this.filterData(res.data.overviewDTOList,"C");
                    this.summaryData.investData = this.filterData(res.data.overviewDTOList,"I");
                }
            })
        },
        getPenddingData(){
            let url = '/base/mgmt/workbench/base-todo';
            this.$post(url,{}).then(res=>{
                if(res.code==0){
                    for(let key in res.data){
                        this.pendingData[key] = res.data[key];
                    }
                }
            })
            let urlT = '/business/mgmt/workbench/business-todo';
            this.$post(urlT,{}).then(res=>{
                if(res.code==0){
                    for(let key in res.data){
                        this.pendingData[key] = res.data[key];
                    }
                }
            })
            let urlI = '/settlement/agreement-price-investigator/count-pending';
            this.$get(urlI).then(res=>{
                if(res.code==0){
                    this.pendingData["investigatorAgreement"] = res.data;
                }
            })
            let urlL = '/settlement/agreement-price-lawyers/count-pending';
            this.$get(urlL).then(res=>{
                if(res.code==0){
                    this.pendingData["lawyerAgreement"] = res.data;
                }
            })
        },
        //获取客户分析柱状图数据
        getCustBarData(){
            let url = '/base/mgmt/workbench/customer-analysis';
            let ajaxData = {
                year:this.yearObj.customerYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initCustomerBar(res.data);
                }
            })
        },
        //获取客户行业占比饼图
        getCustPieData(){
            let url = '/base/mgmt/workbench/customer-industry';
            let ajaxData = {
                year:this.yearObj.customerYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initCustomerPie(res.data);
                }
            })
        },
        //获取合作团队数据分析
        getTeamLineData(){
            let url = '/base/mgmt/workbench/team-analysis';
            let ajaxData = {
                year:this.yearObj.teamYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initTeamBar(res.data);
                }
            })
        },
        getTeamMapData(){
            let url = '/base/mgmt/workbench/lawyer-area';
            let ajaxData = {
                year:this.yearObj.teamYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    let tempArr = [];
                    res.data.forEach((item,index)=>{
                        let obj = {
                            name:item.province.split(/(省|市|自治区|壮族自治区|回族自治区|维吾尔自治区|特别行政区)/)[0],
                            value:item.num
                        }
                        tempArr.push(obj);
                    })
                    this.initTeamMap(tempArr);
                }
            })
        },
        //获取线索柱状图数据
        getClueBarData(){
            let url = '/business/mgmt/workbench/clue-analysis';
            let ajaxData = {
                year:this.yearObj.clueYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initClueBar(res.data);
                }
            })
        },
        //获取线索分布占比饼图数据
        getCluePieData(){
            let url = '/business/mgmt/workbench/clue-rate';
            let ajaxData = {
                tortType:this.tortType,
                year:this.yearObj.clueYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initCluePie(res.data);
                }
            })
        },
        //获取案件柱状图数据
        getCaseBarData(){
            let url = '/business/mgmt/workbench/case-analysis';
            let ajaxData = {
                year:this.yearObj.caseYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initCaseBar(res.data);
                }
            })
        },
        //获取案件分布饼图数据
        getCasePieData(){
            let url = '/business/mgmt/workbench/case-progress';
            let ajaxData = {
                year:this.yearObj.caseYear
            }
            this.$post(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.initCaseRadiusPie(res.data);
                }
            })
        },
        //获取赔偿款排行
        getPaybackRank(){
            let url = '/business/mgmt/workbench/rank/pay-back';
            let ajaxData = {
                dateType:this.dateType
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0 && res.data && res.data.length>0){
                    this.payBackData = res.data.filter((item,index)=>{
                        if(index<15){
                            return item
                        }
                    }) || [];
                }else{
                    this.payBackData = [];
                }
            })
        },
        //获取取证案件排行
        getCaseRank(){
            let url = '/business/mgmt/workbench/rank/forensics';
            let ajaxData = {
                dateType:this.dateType
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0 && res.data && res.data.length>0){
                    this.caseRankData = res.data.filter((item,index)=>{
                        if(index<15){
                            return item
                        }
                    }) || [];
                }else{
                    this.caseRankData = [];
                }
            })
        },
        //获取结案量排行
        getCaseClosedRank(){
            let url = '/business/mgmt/workbench/rank/closed';
            let ajaxData = {
                dateType:this.dateType
            };
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0 && res.data && res.data.length>0){
                    this.caseClosedRankData = res.data.filter((item,index)=>{
                        if(index<15){
                            return item
                        }
                    }) || [];
                }else{
                    this.caseClosedRankData = [];
                }
            })
        },
        filterData(arr,type){
            let tempArr = arr || [];
            let temObj = {};
            tempArr.forEach((item,index)=>{
                if(item.type==type){
                    temObj = item;
                    return 
                }
            })
            return temObj
        },
        transformPercentage(num){
            return Math.floor((Math.abs(num)*100)) + "%"
        },
        // 财务数据分析分布图
        initFinancePolygonalLine(){
            let option = {
                tooltip: {
                    trigger: 'axis'
                },
                legend: {
                    data: ['总回款收入', '新增回款', '2020收入趋势']
                },
                grid: {
                    left: '3%',
                    right: '4%',
                    bottom: '3%',
                    containLabel: true
                },
                xAxis: {
                    type: 'category',
                    boundaryGap: false,
                    data: ['1月', '2月', '3月', '4月', '5月', '6月', '7月','8月', '9月', '10月', '11月', '12月']
                },
                yAxis: {
                    type: 'value',
                    name:"万元",
                    axisLine:{ show:false }
                },
                series: [
                    {
                        name: '总回款收入',
                        type: 'line',
                        stack: '总量',
                        data: [120, 132, 101, 134, 90, 230, 210]
                    },
                    {
                        name: '新增回款',
                        type: 'line',
                        stack: '总量',
                        data: [220, 182, 191, 234, 290, 330, 310]
                    },
                    {
                        name: '2020收入趋势',
                        type: 'line',
                        stack: '总量',
                        data: [150, 232, 201, 154, 190, 330, 410]
                    }
                ],
            };
            this.echartsObj.finance.polygonalLine = this.$echarts.init(document.getElementById('finance-polygonal-line'));
            this.echartsObj.finance.polygonalLine.setOption(option);
        },
        initFinanceRadiusRing(){
            let option = {
                title:{
                    text:'回款行业分布占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:`{b}<br/>总数：{c}<br/>占比：{d}%`
                },
                legend: {
                    bottom: '0',
                    show:true,
                    type:"scroll"
                },
                series: [
                    {
                        name: '回款行业分布占比',
                        type: 'pie',
                        radius: ['40%', '70%'],
                        size:"80%",
                        itemStyle: {
                            borderRadius: 10,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: { 
                            show: true,
                            formatter:`{b}\n{d}%`
                        },
                        labelLine: { 
                            show: true
                        },
                        data: [
                            {value: 1048, name: '旅游酒店行业'},
                            {value: 735, name: '教育行业'},
                            {value: 580, name: '餐饮行业'},
                            {value: 484, name: '建材行业'},
                            {value: 300, name: '机械行业'}
                        ]
                    }
                ]
            };
            this.echartsObj.finance.radiusRing = this.$echarts.init(document.getElementById('finance-radius-ring'));
            this.echartsObj.finance.radiusRing.setOption(option);
        },
        initCustomerBar(dataArr){
            let monthData = [],addData = [],allCustomerArr=[],addChannelData = [],contractData = [],contractChannelData = [];
            dataArr.forEach((item,index)=>{
                monthData.push(Number(item.month)+'月');
                addData.push(item.add);
                addChannelData.push(item.addChannel);
                contractData.push(item.contract);
                contractChannelData.push(item.contractChannel);
                allCustomerArr.push(item.total);
            })
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['总客户数','已签约普通客户', '已签约渠道客户', '新增普通客户数', '新增渠道客户数'],
                    type:"scroll"
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
                        data: monthData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        minInterval: 1,
                        position: 'right',
                        name:"总客户数"
                    },
                    {
                        type: 'value',
                        name:"数量",
                        position: 'left',
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '总客户数',
                        type: 'line',
                        data: allCustomerArr
                    },
                    {
                        name: '已签约普通客户',
                        type: 'bar',
                        stack: '总数',
                        emphasis: { focus: 'series' },
                        yAxisIndex: 1,
                        data: contractData
                    },
                    {
                        name: '已签约渠道客户',
                        type: 'bar',
                        stack: '总数',
                        emphasis: { focus: 'series' },
                        yAxisIndex: 1,
                        data: contractChannelData
                    },
                    {
                        name: '新增普通客户数',
                        type: 'bar',
                        stack: '新增',
                        emphasis: { focus: 'series' },
                        yAxisIndex: 1,
                        data: addData
                    },
                    {
                        name: '新增渠道客户数',
                        type: 'bar',
                        stack: '新增',
                        emphasis: { focus: 'series'},
                        yAxisIndex: 1,
                        data: addChannelData
                    },
                ]
            };
            this.echartsObj.customer.customerBar = this.$echarts.init(document.getElementById('customer-bar'));
            this.echartsObj.customer.customerBar.setOption(option);
        },
        initCustomerPie(dataArr){
            let tempArr = [];
            dataArr.forEach((item,index)=>{
                let obj = {
                    name:item.industry || "",
                    value:item.total || 0
                }
                tempArr.push(obj);
            })
            let option = {
                title: {
                    text: '客户行业分布占比',
                    left:'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:`{b}<br/>总数：{c}<br/>占比：{d}%`
                },
                legend: {
                    top: 'bottom',
                    type:"scroll"
                },
                series: [
                    {
                        name: '客户行业分布占比',
                        type: 'pie',
                        radius: [50, "70%"],
                        roseType: 'area',
                        itemStyle: {
                            borderRadius: 8,
                            borderColor: '#fff',
                            borderWidth: 2
                        },
                        label: { 
                            show: true,
                            formatter:`{b}\n{d}%`
                        },
                        labelLine: { show: true },
                        data:tempArr
                    }
                ]
            };
            this.echartsObj.customer.customerPie = this.$echarts.init(document.getElementById('customer-pie'));
            this.echartsObj.customer.customerPie.setOption(option);
        },
        initTeamMap(dataArr){
            let option = {
                title: {
                    text: "年度新增律师团队分布",
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
                    name: '律师团队',
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
                    data: dataArr
                }]
            };
            this.echartsObj.team.myMapChart = this.$echarts.init(document.getElementById('lawyer-map'));
            this.echartsObj.team.myMapChart.setOption(option);
        },
        initTeamBar(dataArr){
            let monthData = [],addInvestigateData = [],addLawyerData = [],investigateReviewData = [],lawyerReviewData = [];
            dataArr.forEach((item,index)=>{
                monthData.push(Number(item.month)+'月');
                addInvestigateData.push(item.addInvestigate);
                addLawyerData.push(item.addLawyer);
                investigateReviewData.push(item.investigateReview);
                lawyerReviewData.push(item.lawyerReview);
            })
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                legend: {
                    data: ['新增调查团队', '审核调查团队', '新增律师团队', '审核律师团队'],
                    type:"scroll"
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
                        data: monthData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:"数量",
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '新增调查团队',
                        type: 'bar',
                        stack: '调查',
                        emphasis: { focus: 'series' },
                        data: addInvestigateData
                    },
                    {
                        name: '审核调查团队',
                        type: 'bar',
                        stack: '调查',
                        emphasis: { focus: 'series' },
                        data: investigateReviewData
                    },
                    {
                        name: '新增律师团队',
                        type: 'bar',
                        stack: '律师',
                        emphasis: { focus: 'series' },
                        data: addLawyerData
                    },
                    {
                        name: '审核律师团队',
                        type: 'bar',
                        stack: '律师',
                        emphasis: { focus: 'series' },
                        data: lawyerReviewData
                    }
                ]
            };
            this.echartsObj.team.lawyerLine = this.$echarts.init(document.getElementById('lawyer-polygonal-line'));
            this.echartsObj.team.lawyerLine.setOption(option);
        },
        initClueBar(dataArr){
            let monthData = [],passedData = [],pendingData = [],refuseData = [],sumData = [];
            dataArr.forEach((item,index)=>{
                monthData.push(Number(item.month)+'月');
                passedData.push(item.passed);
                pendingData.push(item.pending);
                refuseData.push(item.refuse);
                sumData.push(item.total);
            })
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: {            // 坐标轴指示器，坐标轴触发有效
                        type: 'cross'        // 默认为直线，可选为：'line' | 'shadow'
                    }
                },
                legend: {
                    data: ['线索总数','已审核', '未审核', '驳回']
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
                        data: monthData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:"数量",
                        minInterval: 1
                    },
                    {
                        type: 'value',
                        name:"线索总数",
                        minInterval: 1
                    }
                ],
                series: [
                    {
                        name: '线索总数',
                        type: 'line',
                        yAxisIndex:1,
                        data: sumData
                    },
                    {
                        name: '已审核',
                        type: 'bar',
                        stack: '总数',
                        emphasis: {
                            focus: 'series'
                        },
                        data: passedData
                    },
                    {
                        name: '未审核',
                        type: 'bar',
                        stack: '总数',
                        emphasis: {
                            focus: 'series'
                        },
                        data: pendingData
                    },
                    {
                        name: '驳回',
                        type: 'bar',
                        stack: '总数',
                        emphasis: {
                            focus: 'series'
                        },
                        data: refuseData
                    }
                ]
            };
            this.echartsObj.clue.clueBar = this.$echarts.init(document.getElementById('clue-bar'));
            this.echartsObj.clue.clueBar.setOption(option);
        },
        initCluePie(dataObj){
            let arr = [];
            let keyObj = {
                CC:"刑事",
                AC:"行政",
                CL:"民事"
            }
            for(let key in dataObj){
                let obj = {
                    value:dataObj[key],
                    name:keyObj[key]
                }
                arr.push(obj);
            }
            let option = {
                title: {
                    text: '线索分布占比',
                    left: 'center'
                },
                tooltip: {
                    trigger: 'item',
                    formatter:`{b}<br/>总数：{c}<br/>占比：{d}%`
                },
                series: [
                    {
                        name: '总数',
                        type: 'pie',
                        radius: '50%',
                        data: arr,
                        label: { 
                            show: true,
                            formatter:`{b}\n{d}%`
                        },
                        emphasis: {
                            itemStyle: {
                                shadowBlur: 10,
                                shadowOffsetX: 0,
                                shadowColor: 'rgba(0, 0, 0, 0.5)'
                            }
                        }
                    }
                ]
            };
            this.echartsObj.clue.cluePie = this.$echarts.init(document.getElementById('clue-pie'));
            this.echartsObj.clue.cluePie.setOption(option);
        },
        initCaseBar(dataArr){
            let addArr = [],monthData = [],sumData = [];
            dataArr.forEach((item,index)=>{
                monthData.push(Number(item.month)+'月');
                addArr.push(item.added);
                sumData.push(item.total);
            })
            let option = {
                tooltip: {
                    trigger: 'axis',
                    axisPointer: { type: 'cross' }
                },
                legend: {
                    data: ['案件总数','新增案件数']
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
                        data: monthData
                    }
                ],
                yAxis: [
                    {
                        type: 'value',
                        name:'案件总数'
                    },
                    {
                        type: 'value',
                        name:'新增案件数'
                    }
                ],
                series: [
                    {
                        name: '案件总数',
                        type: 'line',
                        data: sumData
                    },
                    {
                        name: '新增案件数',
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
                        yAxisIndex:1,
                        emphasis: { focus: 'series' },
                        data: addArr
                    }
                ]
            };
            this.echartsObj.case.caseBar = this.$echarts.init(document.getElementById('case-bar'));
            this.echartsObj.case.caseBar.setOption(option);
        },
        initCaseRadiusPie(dataArr){
            let temArr = [];
            dataArr.forEach((item,index)=>{
                if(item.processName){
                    let obj = {
                        name:item.processName,
                        value:item.total
                    }
                    temArr.push(obj);
                }
            })
            let option = {
                title: {
                    text: '在办案件进度分布占比',
                    left: 'center'
                },
                legend: {
                    top: 'bottom',
                    type: 'scroll',
                },
                tooltip: {
                    trigger: 'item',
                    formatter:`{b}<br/>总数：{c}<br/>占比：{d}%`
                },
                series: [
                    {
                        name: '总数',
                        type: 'pie',
                        radius: [50, "70%"],
                        center: ['50%', '50%'],
                        roseType: 'area',
                        label: { 
                            show: true,
                            formatter:`{b}\n{d}%`
                        },
                        itemStyle: {
                            borderRadius: 8
                        },
                        data:temArr,
                    }
                ]
            };
            this.echartsObj.case.caseRadiusPie = this.$echarts.init(document.getElementById('case-radius-pie'));
            this.echartsObj.case.caseRadiusPie.setOption(option);
        }
    },
    created(){},
    beforeMount(){
        let date = new Date;
        let currentYear = date.getFullYear();
        for(let key in this.yearObj){
            this.yearObj[key] = currentYear + "";
        }
    },
    mounted(){
        this.getData();
        this.getPenddingData();
        this.getCustBarData();
        this.getCustPieData();
        this.getTeamLineData();
        this.getTeamMapData();
        this.getClueBarData();
        this.getCluePieData();
        this.getCaseBarData();
        this.getCasePieData();
        this.getUnReadNum();
        this.getAdvise();
        this.getPaybackRank();
        this.getCaseRank();
        this.getCaseClosedRank();

        this.initFinancePolygonalLine(); 
        this.initFinanceRadiusRing();

        window.addEventListener("resize", function () {
            for(let key in this.echartsObj){
                for(let insideKey in this.echartsObj[key]){
                    if(this.echartsObj[key][insideKey]){
                        this.echartsObj[key][insideKey].resize();
                    }
                }
            }
        }.bind(this));
    },
    updated(){},
    components: {},
    watch: {
        dateType(){
            this.getPaybackRank();
            this.getCaseRank();
            this.getCaseClosedRank();
        }
    }
}
</script>
<style lang="scss" scoped>
@import "./home.scss";
</style>
