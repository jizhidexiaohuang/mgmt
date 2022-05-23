import axios from 'axios';
import config from './config';
import router from '../router/index';
import util from './util';
import {Message} from 'view-design';
import { flatten } from 'lodash';
import qs from "qs";

const whitelist = ['/tpi/quanweidu/enterprise/info','/wechat/corp/js-api-config']
axios.defaults.withCredentials=true;//让ajax携带cookie
axios.defaults.timeout = 10000*6*3;  //超时

axios.interceptors.request.use(
    config => {
        let token = window.localStorage.getItem('token');
        if(token){
            config.headers['Authorization'] = 'Bearer ' + token;
        }
        if(/authentication/.test(config.url)||/openwechat/.test(config.url)){
            config.headers['Authorization'] = 'Basic c2VydmljZV9hY2NvdW50OjEyMzQ1Ng==';
            config.headers['osType'] = 1;
            config.headers['appVer'] = 300;
            config.headers['Content-Type'] = 'application/json;charset=UTF-8';
        }
        return config;
    },
    err => {
        return Promise.reject(err);
    }
)

axios.interceptors.response.use(
    async(response) => {
        if(response.data.code===1000){
            router.push({path:'/login'});
        }else if(response.data.code===1001){
            //重刷token
            let flag = await util.refreshToken();
            if(flag==1){
                return axios.request(response.config);
            }
        }else if(response.data.code===10000){
            Message.error('操作失败');
            return response;
        }else{
            return response;
        }
    },
    err => {
        if(!!err.response){
            if(err.response.status===401||err.response.status===400){
                router.push({path:'/login'})
            }else if(err.response.status===500 || err.response.status===503){
                if(whitelist.indexOf(err.response.data.path)==-1){
                    router.push({path:'/500'})
                }
            }
        }
        return Promise.reject(err)
    }
)

export function get(url,params = {}) {
    return new Promise((resolve,reject) => {
        axios.get(config.baseUrl+url,{
            params:params,
            paramsSerializer:((params)=>{
                return qs.stringify(params, { arrayFormat: 'indices',allowDots:true })
            })
        })
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function post(url,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    return new Promise((resolve,reject) => {
        axios.post(config.baseUrl+url,
            params,
            {
              header
            }
        )
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function patch(url,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    return new Promise((resolve,reject) => {
        axios.patch(config.baseUrl+url,
            params,
            {
              header
            }
        )
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function del(url,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    return new Promise((resolve,reject) => {
        axios.delete(config.baseUrl+url,
            params,
            {
              header
            }
        )
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function put(url,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    return new Promise((resolve,reject) => {
        axios.put(config.baseUrl+url,
            params,
            {
              header
            }
        )
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}

export function exportGet(url,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    return new Promise((resolve,reject) => {
        axios({
            method: 'GET',
            headers:header,
            url: config.baseUrl+url,
            params: params,
            paramsSerializer: params => {
                return qs.stringify(params, { indices: false })
            },
            responseType: "blob"
        }).then(res=>{
            // 截取文件名
            let fileName = res.headers['content-disposition']?decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1]):"导出文件.xlsx";
            fileName = fileName.replace(/\"/g,'');
            // 将`blob`对象转化成一个可访问的`url`
            let url = window.URL.createObjectURL(new Blob([res.data]));
            let link = document.createElement('a');
            link.style.display = 'none';
            link.href = url;
            link.setAttribute('download', fileName);
            document.body.appendChild(link);
            link.click();
            URL.revokeObjectURL(link.url); // 释放URL 对象
            document.body.removeChild(link);

            resolve(res);
        }).catch(err=>{
            reject(err)
        })
    })
}

export function anpaiAjax(url,type,params,headers = {}) {
    const header = JSON.stringify(headers) == "{}"?config.headers:headers;
    let obj = {
        method: type,
        headers:header,
        url: config.anpaiUrl+url,
    }
    if(type=="GET"){ 
        obj.params = params;
    }else{
        obj.data = params;
    }
    return new Promise((resolve,reject) => {
        axios(obj).then(res=>{
            if(res){ resolve(res.data) }
        }).catch(err=>{
            resolve(res.data)
        })
    })
}

export function postFormData(url,params = {}) {
    return new Promise((resolve,reject) => {
        axios.post(config.baseUrl+url,
            params,
            {
                headers:{
                    'Content-Type': 'multipart/form-data',
                    'Accept':'application/json', 
                }
            }
        )
        .then(res => {
            if(res){ resolve(res.data) }
        })
        .catch(err => {
            reject(err)
        })
    })
}