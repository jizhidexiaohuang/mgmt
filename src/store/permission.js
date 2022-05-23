import {constantRoutes,asyncRoutes} from '@/router';
import utils from '@/libs/util.js';

function getRolesList(arr){
    let list = [];
    for(let i=0;i<arr.length;i++){
        if(arr[i].hasChildList){
            list = list.concat(arr[i].childList)
        }else{
            list.push(arr[i])
        }
    }
    return list;
}

function hasPermission(roles, route) {
    let list = getRolesList(roles);
    if(route.path!='/'){
        return list.some(function(value){
            if(value.href==route.path){
                return route
            }
        })
    }else{
        return true
    }
}

export function filterAsyncRoutes(routes,roles){
    if(roles.length==0){ return roles;}
    const res = []
    routes.forEach(route => {
        const tmp = { ...route }
        if (hasPermission(roles, tmp)){
            if(tmp.children){
                tmp.children = filterAsyncRoutes(tmp.children, roles)
            }
            res.push(tmp)
        }
    })
    return res
}
const state = {
    routers:constantRoutes,
    addRouters:[],
    menu:{},
    options:[],
    roles:{},
    flag:false,
}

const mutations = {
    setRouters:(state,routers)=>{
        state.addRouters = routers;
        state.routers = constantRoutes.concat(routers)
        state.flag = true;
    },
    setMenu:(state,data)=>{
        state.menu = data?data.menus:{};
        state.roles = data?data.roles:[];
        state.options = data?data.options:[]
    },
    resetFlag(state,data){
        state.flag = data;
    }
}

const actions = {
    async getRoles({commit}){
        let roles = await utils.getRoles().catch(err=>{
            console.log(err)
        });
        commit('setMenu',roles);
        return roles;
    },
    generateRoutes({ commit ,state}, roles) {
        return new Promise(resolve => {
            let accessedRoutes = [],roleList = [];
            // console.log(roles) // roles: {}/undefined
            if(roles){
                Object.keys(roles).map((key)=>{
                    let arr = roles[key].map((item)=>{
                        return item;
                    })
                    roleList = roleList.concat(arr)
                })
            }
            accessedRoutes = filterAsyncRoutes(asyncRoutes, roleList)
            commit('setRouters',accessedRoutes)
            accessedRoutes = state.routers;
            accessedRoutes.push({ path: '*', redirect: '/404', hidden: true })
            // console.log(accessedRoutes) //router []
            resolve(accessedRoutes)
        })
    }
}

const getters = {
    roles:state=> state.roles,
    menu:state=> state.menu,
    options:state=>state.options
}

export default {
    namespaced: true,
    state,
    mutations,
    getters,
    actions
}