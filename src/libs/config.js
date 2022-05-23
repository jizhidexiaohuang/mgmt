/**
* @description api请求基础路径
*/
const baseUrl= {
    dev:  '/api',
    test:'http://test.gateway.andunip.cn',
    pro: 'http://gateway.andunip.cn'
};
/**
* @description 安牌api请求基础路径
*/
const anpaiUrl= 'https://api.anpaitm.com';
/**
* @description 腾讯上传公有桶名
*/
const uploadPublicUrl= 'dev-public-1251740668';
/**
* @description 腾讯上传私有桶名
*/
const uploadPrivateUrl= 'dev-private-1251740668';
/**
* @description 微信回传地址
*/
const basePath= {
    dev: 'http://wechatapi.utools.club',
    test:'http://test.mgmt.andunip.cn',
    pro: 'http://mgmt.andunip.cn'
};
/**
 * @description 接口地址 重定向链接地址
 */
export default {
    baseUrl: mapUrl(baseUrl),
    basePath:mapUrl(basePath),
    anpaiUrl:anpaiUrl,
    headers:{
        'Content-Type':'application/json;charset=UTF-8',
        'Accept':'application/json'
    },
    pageSizeOpts:[15,30,50,100],
    pageSize:15,
    modalPageSizeOpts:[5,10,15,20],
    modalPageSize:5,
    uploadPublicUrl:uploadPublicUrl,
    uploadPrivateUrl:uploadPrivateUrl,
}

function mapUrl(url){
    if(process.env.NODE_ENV=='development'){
        return url['dev'];
    }else if(process.env.type=='test'){
        return url['test'];
    }else{
        return url['pro'];
    }
}