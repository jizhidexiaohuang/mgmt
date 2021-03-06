import Vue from 'vue';
import Vuex from 'vuex';
import {get,patch} from '../libs/axios.js';
import permission from './permission.js'

Vue.use(Vuex);

const state = {
    isCollapsed: false,
    menuList:[],
    unauditedLegal:0,
    unauditPresident:0,
    unauditedMission:0,
    rejectedMission:0,
    unauditOpportunitie:0,
    unauditLawyer:0,
    unauditInvestigator:0,
    unauditClues:0,
    unauditLawyerAgreement:0,
    unauditInvestAgreement:0,
    unauditLawyerAccount:0,
    unauditInvestAccount:0,
    tagMenuArr:[],
    tagMenuPathArr:[],
};

const mutations = {
    toggleCollapsed(state,isCollapsed) {
        state.isCollapsed = isCollapsed;
    },
    changeMenu(state,menuList){
        state.menuList = menuList;
    },
    openTagMenu(state,obj){
        state.tagMenuArr = obj.tagMenuArr;
        state.tagMenuPathArr = obj.tagMenuPathArr;
    },
    setUnauditedLegal(state,num){
        state.unauditedLegal = num;
    },
    setMissionCount(state,num1,num2){
        state.unauditedMission = num1;
        state.rejectedMission = num2
    },
    setUnauditPresident(state,num){
        state.unauditPresident = num;
    },
    setOpportunitieCount(state,num){
        state.unauditOpportunitie= num;
    },
    setUnauditLawyer(state,num){
        state.unauditLawyer= num;
    },
    setUnauditInvestigator(state,num){
        state.unauditInvestigator= num;
    },
    setUnauditClues(state,num){
        state.unauditClues= num;
    },
    setUnauditLawyerAgreement(state,num){
        state.unauditLawyerAgreement= num;
    },
    setUnauditInvestAgreement(state,num){
        state.unauditInvestAgreement= num;
    },
    setUnauditLawyerAccount(state,num){
        state.unauditLawyerAccount= num;
    },
    setUnauditInvestAccount(state,num){
        state.unauditInvestAccount= num;
    },
};
const getters = {
	toggleCollapsed(state){
		return state.isCollapsed;
    },
    changeMenu(state){
        return state.menuList;
    },
    getUnauditedTask(state){
        return state.unauditedTask
    },
    openTagMenu(state){
        return state;
    },
    getUnauditedLegal:state=>state.unauditedLegal,
    getUnauditPresident:state=>state.unauditPresident,
    getUnauditedMissionCount:state=>state.unauditedMission,
    getRejectedMissionCount:state=>state.rejectedMission,
    getUnauditOpportunitie:state=>state.unauditOpportunitie,
    getUnauditLawyer:state=>state.unauditLawyer,
    getUnauditInvestigator:state=>state.unauditInvestigator,
    getUnauditClues:state=>state.unauditClues,
    getUnauditLawyerAgreement:state=>state.unauditLawyerAgreement,
    getUnauditInvestAgreement:state=>state.unauditInvestAgreement,
    getUnauditLawyerAccount:state=>state.unauditLawyerAccount,
    getUnauditInvestAccount:state=>state.unauditInvestAccount,
}

const actions = {
    //???????????????????????????
    getCountWaitAuditLegal({commit}){
        let url = '/base/contract/count-legal';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditedLegal',res.data);
            }
        })
    },
    //???????????????????????????
    getCountWaitAuditPresident({commit}){
        let url = '/base/contract/count-president';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditPresident',res.data);
            }
        })
    },
    //?????????????????????????????????????????????
    getMissionCount({commit}){
        let url = '/business/mission/count';
        get(url).then(res=>{
            if(res.code==0){
                commit('setMissionCount',res.data.beReleaseNum,res.data.refuseNum);
            }
        })
    },
    //?????????????????????????????????
    getOpportunitieCount({commit}){
        let url = '/base/customer-opportunitie/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setOpportunitieCount',res.data);
            }
        })
    },
    //???????????????????????????
    getUnauditLawyerCount({commit}){
        let url = '/base/lawyer-team/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditLawyer',res.data);
            }
        })
    },
    //??????????????????????????????
    getUnauditInvestigatorCount({commit}){
        let url = '/base/investigator-team/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditInvestigator',res.data);
            }
        })
    },
    //???????????????????????????
    getUnauditCluesCount({commit}){
        let url = '/business/clues/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditClues',res.data);
            }
        })
    },
    //?????????????????????????????????
    getUnauditLawyerAgreementCount({commit}){
        let url = '/settlement/agreement-price-lawyers/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditLawyerAgreement',res.data);
            }
        })
    },
    //?????????????????????????????????
    getUnauditInvestAgreementCount({commit}){
        let url = '/settlement/agreement-price-investigator/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditInvestAgreement',res.data);
            }
        })
    },
    //???????????????????????????????????????
    getUnauditLawyerAccountCount({commit}){
        let url = '/base/lawyer-banks/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditLawyerAccount',res.data);
            }
        })
    },
    //??????????????????????????????????????????
    getUnauditInvestAccountCount({commit}){
        let url = '/base/investigator-banks/count-pending';
        get(url).then(res=>{
            if(res.code==0){
                commit('setUnauditInvestAccount',res.data);
            }
        })
    },
}
var vuexStore = new Vuex.Store({
    state,
    mutations,
    actions,
    getters,
    modules:{permission:permission}
});

export default vuexStore;
