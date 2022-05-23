<template>
    <div class="business-info" :style="blockStyle">
        <!-- 详情头部 -->
        <div class="subject-header">
            <div class="subject-header-name clearfix">
                <h2>{{information.compayName || ""}}</h2>
                <div v-if="information.regStatus" style="display:inline;">
                    <i :class="['subject-i-block',stateColor(information.regStatus)]">{{information.regStatus || ""}}</i>
                </div>
                <span class="subject-update-time">更新时间：{{information.updateTimes || ""}}</span>
            </div>
            
            <div>
                <slot name='info-content'></slot>
            </div>
        </div>
        <!-- 详情内容 -->
        <div class="subject-content">
            <!-- 导航栏 -->
            <ul class="subject-content-navigation clearfix">
                <li :class="activeTab==1?'subject-navigation-active':''" @click="activeTab=1">
                    <span>基本信息</span>
                </li>
                <li :class="activeTab==2?'subject-navigation-active':''" @click="activeTab=2">
                    <span>工商变更</span>
                    <span class="subject-span-red">({{changeLogList.length}})</span>
                </li>
                <li :class="activeTab==3?'subject-navigation-active':''" @click="activeTab=3">
                    <span>经营异常</span>
                    <span class="subject-span-red">({{runAbnormalList.length}})</span>
                </li>
                <li :class="activeTab==4?'subject-navigation-active':''" @click="activeTab=4">
                    <span>失信信息</span>
                    <span class="subject-span-red">({{dishonestPeopleList.length}})</span>
                </li>
                <li :class="activeTab==5?'subject-navigation-active':''" @click="activeTab=5">
                    <span>行政处罚</span>
                    <span class="subject-span-red">({{administrativePenaltiesList.length}})</span>
                </li>
                <li :class="activeTab==6?'subject-navigation-active':''" @click="activeTab=6">
                    <span>裁判文书</span>
                    <span class="subject-span-red">({{legalProceedingsList.length}})</span>
                </li>
                <li :class="activeTab==7?'subject-navigation-active':''" @click="activeTab=7">
                    <span>法院公告</span>
                    <span class="subject-span-red">({{courtNoticeList.length}})</span>
                </li>
                <li :class="activeTab==8?'subject-navigation-active':''" @click="activeTab=8">
                    <span>开庭公告</span>
                    <span class="subject-span-red">({{openCourtNoticeList.length}})</span>
                </li>
                <li :class="activeTab==9?'subject-navigation-active':''" @click="activeTab=9">
                    <span>被执行人</span>
                    <span class="subject-span-red">({{beExecutedList.length}})</span>
                </li>
            </ul>
            <!-- 基本信息 -->
            <div class="subject-content-block subject-content-basic" v-if="activeTab==1">
                <!-- <div class="subject-content-label">
                    <a href="javascript:void(0)" @click="jump('#basic-business-info')">工商信息</a>
                    <a href="javascript:void(0)" @click="jump('#basic-corporate-info')">法人信息</a>
                    <a href="javascript:void(0)" @click="jump('#basic-main-person')">主要人员</a>
                </div> -->
                <!-- 工商信息 -->
                <div id="basic-business-info">
                    <h3 class="basic-title">工商信息</h3>
                    <table class="subject-noheader-table subject-table">
                        <tbody>
                            <tr>
                                <td class="subject-table-color">注册资本</td>
                                <td>{{information.regCapital || ""}}</td>
                                <td class="subject-table-color">实缴资本</td>
                                <td>{{information.actualCapital || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">经营状态</td>
                                <td>{{information.regStatus || ""}}</td>
                                <td class="subject-table-color">成立日期</td>
                                <td>{{information.estiblishTime || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">统一社会信用代码</td>
                                <td>{{information.creditCode || ""}}</td>
                                <td class="subject-table-color">纳税人识别号</td>
                                <td>{{information.taxNumber || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">注册号</td>
                                <td>{{information.regNumber || ""}}</td>
                                <td class="subject-table-color">组织机构代码</td>
                                <td>{{information.orgNumber || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">公司类型</td>
                                <td>{{information.companyOrgType || ""}}</td>
                                <td class="subject-table-color">所属行业</td>
                                <td>{{information.industry || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">核准日期</td>
                                <td>{{information.approvedTime || ""}}</td>
                                <td class="subject-table-color">登记机关</td>
                                <td>{{information.regInstitute || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">所属地区</td>
                                <td>{{information.address ? ( (information.address.province || "") + (information.address.city || "") + (information.address.area || "") ) : ""}}</td>
                                <td class="subject-table-color">英文名</td>
                                <td>{{information.englishName || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">人员规模</td>
                                <td>{{information.staffNumRange || ""}}</td>
                                <td class="subject-table-color">参保人数</td>
                                <td>{{information.socialStaffNum || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">曾用名</td>
                                <td>{{information.historyNames || ""}}</td>
                                <td class="subject-table-color">营业期限</td>
                                <td>{{information.fromTime || ""}} 至 {{information.endTime || "无固定期限"}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">电话</td>
                                <td>{{information.phoneNumber || ""}}</td>
                                <td class="subject-table-color">邮箱</td>
                                <td>{{information.email || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">官网</td>
                                <td colspan="3">{{information.websiteList || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">企业地址</td>
                                <td colspan="3">{{information.regLocation || ""}}</td>
                            </tr>
                            <tr>
                                <td class="subject-table-color">经营范围</td>
                                <td colspan="3">{{information.businessScope || ""}}</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 法人信息 -->
                <div id="basic-corporate-info">
                    <h3 class="basic-title">法人信息</h3>
                    <table class="subject-header-table subject-table">
                        <tbody>
                            <tr>
                                <th class="subject-table-color subject-index" width="6%">序号</th>
                                <th class="subject-table-color" width="47%">姓名</th>
                                <th class="subject-table-color" width="47%">名下公司</th>
                            </tr>
                            <tr>
                                <td class="subject-index">1</td>
                                <td>{{information.legalPersonName || ""}}</td>
                                <td></td>
                            </tr>
                        </tbody>
                    </table>
                </div>
                <!-- 主要人员 -->
                <div id="basic-main-person">
                    <h3 class="basic-title">主要成员</h3>
                    <table class="subject-header-table subject-table">
                        <tbody>
                            <tr>
                                <th class="subject-table-color subject-index" width="6%">序号</th>
                                <th class="subject-table-color" width="47%">姓名</th>
                                <th class="subject-table-color" width="47%">职务</th>
                            </tr>
                            <tr v-for="(item,index) in mainPersonnelList" :key="index" v-if="mainPersonnelList.length!=0">
                                <td class="subject-index">{{index+1}}</td>
                                <td>{{item.name || ""}}</td>
                                <td>{{item.personnels || ""}}</td>
                            </tr>
                            <tr v-if="mainPersonnelList.length==0">
                                <td colspan="3">暂无数据</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
            <!-- 工商变更 -->
            <div class="subject-content-block" v-if="activeTab==2">
                <h3 class="basic-title">变更记录</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color" width="120">变更日期</th>
                            <th class="subject-table-color" width="150">变更项目</th>
                            <th class="subject-table-color">变更前</th>
                            <th class="subject-table-color">变更后</th>
                        </tr>
                        <tr v-for="(item,index) in changeLogList" :key="index" v-if="changeLogList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td>{{item.changeTime || ""}}</td>
                            <td>{{item.changeItem || ""}}</td>
                            <td v-html="(item.contentBefore || '')"></td>
                            <td v-html="(item.contentAfter || '')"></td>
                        </tr>
                        <tr v-if="changeLogList.length==0">
                            <td colspan="5">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 经营异常 -->
            <div class="subject-content-block" v-if="activeTab==3">
                <h3 class="basic-title">经营异常</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">列入日期</th>
                            <th class="subject-table-color">列入原因</th>
                            <th class="subject-table-color">决定机关</th>
                            <th class="subject-table-color">移除日期</th>
                            <th class="subject-table-color">移除原因</th>
                            <th class="subject-table-color">移除机关</th>
                        </tr>
                        <tr v-for="(item,index) in runAbnormalList" :key="index" v-if="runAbnormalList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td width="10%">{{item.putDate || ""}}</td>
                            <td>{{item.putReason || ""}}</td>
                            <td width="10%">{{item.putDepartment || ""}}</td>
                            <td width="10%">{{item.removeDate || ""}}</td>
                            <td>{{item.removeReason || ""}}</td>
                            <td width="10%">{{item.removeDepartment || ""}}</td>
                        </tr>
                        <tr v-if="runAbnormalList.length==0">
                            <td colspan="7">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 失信信息 -->
            <div class="subject-content-block" v-if="activeTab==4">
                <h3 class="basic-title">失信信息</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">案号</th>
                            <th class="subject-table-color">发布时间</th>
                            <th class="subject-table-color">执行法院</th>
                            <th class="subject-table-color">立案时间</th>
                            <th class="subject-table-color">省份</th>
                        </tr>
                        <tr v-for="(item,index) in dishonestPeopleList" :key="index" v-if="dishonestPeopleList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td>{{item.caseCode || ""}}</td>
                            <td>{{item.publishDate || ""}}</td>
                            <td>{{item.courtName || ""}}</td>
                            <td>{{item.regDate || ""}}</td>
                            <td>{{item.areaName || ""}}</td>
                        </tr>
                        <tr v-if="dishonestPeopleList.length==0">
                            <td colspan="6">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 行政处罚 -->
            <div class="subject-content-block" v-if="activeTab==5">
                <h3 class="basic-title">行政处罚</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">决定文书号</th>
                            <th class="subject-table-color">违法行为类型</th>
                            <th class="subject-table-color">行政处罚内容</th>
                            <th class="subject-table-color">公示日期</th>
                            <th class="subject-table-color">决定机关</th>
                            <th class="subject-table-color">决定日期</th>
                        </tr>
                        <tr v-for="(item,index) in administrativePenaltiesList" :key="index" v-if="administrativePenaltiesList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td>{{item.punishNumber || ""}}</td>
                            <td>{{item.type || ""}}</td>
                            <td>{{item.content || ""}}</td>
                            <td>{{item.publishDate || ""}}</td>
                            <td width="10%">{{item.departmentName || ""}}</td>
                            <td width="10%">{{item.decisionDate || ""}}</td>
                        </tr>
                        <tr v-if="administrativePenaltiesList.length==0">
                            <td colspan="7">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 裁判文书 -->
            <div class="subject-content-block" v-if="activeTab==6">
                <h3 class="basic-title">裁判文书</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">案件名称</th>
                            <th class="subject-table-color">案由</th>
                            <th class="subject-table-color">发布时间</th>
                            <th class="subject-table-color">案件编号</th>
                            <!-- <th class="subject-table-color">案件身份</th> -->
                            <th class="subject-table-color">执行法院</th>
                        </tr>
                        <tr v-for="(item,index) in legalProceedingsList" :key="index" v-if="legalProceedingsList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td class="subject-layer"><a class="subject-layer" :href="item.url" target="_blank">{{item.title || ""}}</a></td>
                            <td width="10%">{{item.caseReason || ""}}</td>
                            <td width="10%">{{item.submitTime || ""}}</td>
                            <td width="10%">{{item.caseNo || ""}}</td>
                            <!-- <td></td> -->
                            <td width="10%">{{item.court || ""}}</td>
                        </tr>
                        <tr v-if="legalProceedingsList.length==0">
                            <td colspan="6">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 法院公告 -->
            <div class="subject-content-block" v-if="activeTab==7">
                <h3 class="basic-title">法院公告</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">公告时间</th>
                            <th class="subject-table-color">上诉方</th>
                            <th class="subject-table-color">被诉方</th>
                            <th class="subject-table-color">公告类型</th>
                            <th class="subject-table-color">法院</th>
                            <th class="subject-table-color">操作</th>
                        </tr>
                        <tr v-for="(item,index) in courtNoticeList" :key="index" v-if="courtNoticeList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td width="10%">{{item.publishDate || ""}}</td>
                            <td>{{item.party1 || ""}}</td>
                            <td>{{item.party2 || ""}}</td>
                            <td>{{item.bltnType || ""}}</td>
                            <td width="10%">{{item.courtCode || ""}}</td>
                            <td class="subject-layer" width="7%" @click="openModal('courtNotice',item)">详情</td>
                        </tr>
                        <tr v-if="courtNoticeList.length==0">
                            <td colspan="7">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 开庭公告 -->
            <div class="subject-content-block" v-if="activeTab==8">
                <h3 class="basic-title">开庭公告</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">案号</th>
                            <th class="subject-table-color">开庭日期</th>
                            <th class="subject-table-color">案由</th>
                            <th class="subject-table-color">公诉人/原告/上诉人/申请人</th>
                            <!-- <th class="subject-table-color">被告人/被告/被上诉人/被申请人</th> -->
                        </tr>
                        <tr v-for="(item,index) in openCourtNoticeList" :key="index" v-if="openCourtNoticeList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td class="subject-layer" @click="openModal('openCourtNotice',item)">{{item.caseNo || ""}}</td>
                            <td width="10%">{{item.startDate || ""}}</td>
                            <td>{{item.caseReason || ""}}</td>
                            <td>{{item.litigant || ""}}</td>
                            <!-- <td>深圳市德鲁传媒公司</td> -->
                        </tr>
                        <tr v-if="openCourtNoticeList.length==0">
                            <td colspan="6">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
            <!-- 被执行人 -->
            <div class="subject-content-block" v-if="activeTab==9">
                <h3 class="basic-title">变更记录</h3>
                <table class="subject-header-table subject-table">
                    <tbody>
                        <tr>
                            <th class="subject-table-color subject-index" width="6%">序号</th>
                            <th class="subject-table-color">立案日期</th>
                            <th class="subject-table-color">执行标的</th>
                            <th class="subject-table-color">案号</th>
                            <th class="subject-table-color">执行法院</th>
                        </tr>
                        <tr v-for="(item,index) in beExecutedList" :key="index" v-if="beExecutedList.length!=0">
                            <td class="subject-index">{{index+1}}</td>
                            <td width="10%">{{item.caseCreateTime || ""}}</td>
                            <td width="10%">{{item.execMoney || ""}}</td>
                            <td>{{item.caseCode || ""}}</td>
                            <td>{{item.execCourtName || ""}}</td>
                        </tr>
                        <tr v-if="beExecutedList.length==0">
                            <td colspan="5">暂无数据</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <!-- 法院公告详情 -->
        <Modal 
            v-model="courtNoticeModal" 
            width="80%"
            class="business-modal"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">法院公告详情</div>
            <div style="height:100%">
                <table class="subject-noheader-table subject-table" style="width:100%;">
                    <tbody>
                        <tr>
                            <td class="subject-table-color">当事人</td>
                            <td>{{acitveData.party2 || ""}}</td>
                            <td class="subject-table-color">公告类型</td>
                            <td>{{acitveData.bltnType || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">刊登日期</td>
                            <td>{{acitveData.publishDate || ""}}</td>
                            <td class="subject-table-color">刊登封面</td>
                            <td>{{acitveData.publishPage || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">上传日期</td>
                            <td>{{acitveData.publishDate || ""}}</td>
                            <td class="subject-table-color">公告人</td>
                            <td>{{acitveData.courtCode || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">内容</td>
                            <td colspan="3">{{acitveData.content || ""}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>

        <!-- 开庭公告详情 -->
        <Modal 
            v-model="openCourtNoticeModal" 
            width="80%"
            class="business-modal"
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">开庭公告详情</div>
            <div style="height:100%">
                <table class="subject-noheader-table subject-table" style="width:100%;">
                    <tbody>
                        <tr>
                            <td class="subject-table-color">案由</td>
                            <td>{{acitveData.caseReason || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">案号</td>
                            <td>{{acitveData.caseNo || ""}}</td>
                        </tr>
                        <!-- <tr>
                            <td class="subject-table-color">原告/上诉人</td>
                            <td>{{acitveData.publishDate || ""}}</td>
                        </tr> -->
                        <tr>
                            <td class="subject-table-color">被告/被上诉人</td>
                            <td>{{acitveData.litigant || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">开庭日期</td>
                            <td>{{acitveData.startDate || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">当事人</td>
                            <td>{{acitveData.litigant || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">承办部门</td>
                            <td>{{acitveData.contractors || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">审判长/主审人</td>
                            <td>{{acitveData.judge || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">法院</td>
                            <td>{{acitveData.court || ""}}</td>
                        </tr>
                        <tr>
                            <td class="subject-table-color">法庭</td>
                            <td>{{acitveData.courtRoom || ""}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </Modal>

        <Col class="demo-spin-col" span="8" v-if="isLoading">
            <Spin fix>
                <Icon type="ios-loading" size=18 class="demo-spin-icon-load"></Icon>
                <div>数据拉取中...</div>
            </Spin>
        </Col>
    </div>
</template>
<script>
export default {
    data () {
        return {
            activeTab:1,
            courtNoticeModal:false,
            openCourtNoticeModal:false,
            companyId:"",
            blockStyle:{
                height:"600px",
                overflow:this.isLoading?"hidden":"auto"
            },
            acitveData:{},
            information:{},         //基本信息
            mainPersonnelList:[],   //主要人员
            changeLogList:[],       //工商变更
            runAbnormalList:[],     //经营异常
            dishonestPeopleList:[], //失信信息
            administrativePenaltiesList:[], //行政处罚
            legalProceedingsList:[],//裁判文书
            courtNoticeList:[],     //法院公告
            openCourtNoticeList:[], //开庭公告
            beExecutedList:[],      //被执行人
            isLoading:true
        }
    },
    props: ['defaultObj'],
    methods: {
        jump(id){
            let jump = document.querySelectorAll(id);
            let ele = document.querySelectorAll('.business-modal .ivu-modal-body');
            // 获取需要滚动的距离
            let total = jump[0].offsetTop;
            // Chrome
            ele[0].scrollTop = total;
            // Safari
            ele[0].pageYOffset = total;
        },
        stateColor(status){
            if(status=="吊销" || status=="注销"){
                return "subject-i-error"
            }else{
                return "subject-i-xc"
            }
        },
        getData(){
            let url = '/base/company/one-company';
            let ajaxData = {
                creditCode:this.defaultObj.creditCode || "",
                name:this.defaultObj.name || ""
            }
            this.$get(url,ajaxData).then(res=>{
                if(res.code==0){
                    this.information = res.data.information || {};
                    this.companyId = this.information.id
                    this.mainPersonnelList = res.data.mainPersonnelList || [];
                    if(!this.companyId){
                        this.isLoading = false;
                        return
                    }
                    this.getChangeLogList();
                    this.getRunAbnormalList();
                    this.getDishonestPeopleList();
                    this.getAdministrativePenaltiesList();
                    this.getLegalProceedingsList();
                    this.getCourtNoticeList();
                    this.getOpenCourtNoticeList();
                    this.getBeExecutedList();
                }else{
                    this.$Message.error(res.message);
                }
                this.isLoading = false;
            })
        },
        //获取工商变更
        getChangeLogList(){
            let url = '/base/company/change-log/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.changeLogList = res.data || [];
                }
            })
        },
        //获取经营异常
        getRunAbnormalList(){
            let url = '/base/company/run-abnormal/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.runAbnormalList = res.data || [];
                }
            })
        },
        //获取失信信息
        getDishonestPeopleList(){
            let url = '/base/company/dishonest-people/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.dishonestPeopleList = res.data || [];
                }
            })
        },
        //获取行政处罚
        getAdministrativePenaltiesList(){
            let url = '/base/company/administrative-penalties/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.administrativePenaltiesList = res.data || [];
                }
            })
        },
        //获取裁判文书
        getLegalProceedingsList(){
            let url = '/base/company/legal-proceedings/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.legalProceedingsList = res.data || [];
                }
            })
        },
        //获取法院公告
        getCourtNoticeList(){
            let url = '/base/company/court-notice/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.courtNoticeList = res.data || [];
                }
            })
        },
        //获取开庭公告
        getOpenCourtNoticeList(){
            let url = '/base/company/open-court-notice/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.openCourtNoticeList = res.data || [];
                }
            })
        },
        //获取被执行人
        getBeExecutedList(){
            let url = '/base/company/be-executed/list/'+this.companyId;
            this.$get(url).then(res=>{
                if(res.code==0){
                    this.beExecutedList = res.data || [];
                }
            })
        },
        openModal(str,data){
            if(str == "courtNotice"){
                this.courtNoticeModal = true;
            }else if(str == "openCourtNotice"){
                this.openCourtNoticeModal = true;
            }
            this.acitveData = data;
        }
    },
    created(){},
    beforeMount(){
        this.blockStyle.height = (document.body.offsetHeight*0.8 - 51) + "px";
    },
    mounted(){
        this.getData();
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./businessInformation.scss"
</style>
