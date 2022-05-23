import { get, post } from './axios';
import config from "./config";
const common = {
    formatTime(date,num){
        if(!!date){
            if (typeof (date) == "number"||typeof (date) == "object"||typeof (date) == "string") {
                date = new Date(date)
            }
            const year = date.getFullYear();
            const month = (date.getMonth()+1)<10?'0'+(date.getMonth()+1):date.getMonth()+1;
            const day = date.getDate()<10?'0'+date.getDate():date.getDate();
            const hour = date.getHours()<10?'0'+date.getHours():date.getHours();
            const minute = date.getMinutes()<10?'0'+date.getMinutes():date.getMinutes();
            const second = date.getSeconds()<10?'0'+date.getSeconds():date.getSeconds();
            switch (num){
                case 1:
                    return [year, month, day].join('-');
                case 2:
                    return [year, month, day].join('/');
                case 3:
                    return [year, month, day].join('-') +''+[hour,minute,second].join(':');
                case 4:
                    return [year, month, day].join('.');
                case 5:
                    return [year, month, day].join('-') + ' ' + [hour, minute, second].join(':');
                default:
                    return [year, month, day].join('-');
            }
        }else{
            return ''
        }
    },
    //获取字典数据接口
    getDictionaryItems(code){
        let url = '/base/dictionaryItem/getDictionaryItemsByCode/'+code;
        return new Promise(function(resolve,reject){
            get(url).then(res=>{
                if(res.code==0){
                    resolve(res.data)
                }else{
                    reject(res)
                }
            })
        })
    },
    //获取字典数据接口
    refreshToken(){
        let refreshToken = window.localStorage.getItem('refreshToken');
        let url = '/authentication/auth/refreshToken';
        let ajaxData = {
            refreshToken:refreshToken,
            client:'Basic c2VydmljZV9hY2NvdW50OjEyMzQ1Ng=='
        }
        return new Promise(function(resolve,reject){
            post(url,ajaxData).then(res=>{
                if(res){
                    window.localStorage.setItem('token',res.data.accessToken);
                    window.localStorage.setItem('account',JSON.stringify(res.data.additionalInformation.currentUser));
                    resolve(1);
                }else{
                    reject(-1)
                }
            })
        })
    },
    //获取角色
    getRoles(){
        let url = '/base/mgmt-permissions/menu';
        return new Promise(function(resolve,reject){
            get(url).then(res=>{
                // console.log(res);
                if(res.code==0){
                    let json = {}
                    res.data.options = res.data.operations.map((item)=>{
                        return item.code;
                    })
                    let roles = res.data.menus;
                    for(let i=0;i<roles.length;i++){
                        if(!json[roles[i].code]){
                            json[roles[i].code] = roles[i].childList
                        }
                    }
                    res.data.roles = json;
                    console.log(json)
                    resolve(res.data)
                }else{
                    reject(res)
                }
            },err=>{
                reject(err)
            })
        })
    },
    // 截取字符串
    cutString(str,num){
        if(!str){return}
        let returnStr;
        if(str.length>num){
            returnStr = str.substring(0,num)+"...";
        }else{
            returnStr = str;
        }
        return returnStr
    },
    // 转换千分数
    formateNumber(data,unit,precision){
        let prec = precision ? precision : 2;
        let unitStr = unit===''?unit:'￥';
        if(data===0){return unitStr + '0'}
        if(data==="" || !data){return ""}
        let str = (typeof data === 'number'&&!isNaN(data))?(data.toFixed(prec)+""):data;
        let arr = str.split(".");
        let formateStr = Number(arr[0]).toLocaleString();
        if(arr[1]){
            formateStr += `.${arr[1]}`;
        }else{
            formateStr += ".00";
        }
        return unitStr + formateStr;
    },
    debounce(fn, delay) {
        // 记录上一次的延时器
        var timer = null;
        var delay = delay || 200;
        return function() {
            var args = arguments;
            var that = this;
            // 清除上一次延时器
            clearTimeout(timer)
            timer = setTimeout(function() {
                fn.apply(that,args)
            }, delay);
        }
    },
    throttle(fn,delay){
        var lastTime;
        var timer;
        var delay = delay || 200;
        return function() {
            var args = arguments;
            // 记录当前函数触发的时间
            var nowTime = Date.now();
            if (lastTime && nowTime - lastTime < delay) {
                clearTimeout(timer);
                timer = setTimeout(function () {
                    // 记录上一次函数触发的时间
                    lastTime = nowTime;
                    // 修正this指向问题
                    fn.apply(this, args);
                }, delay);
            }else{
                lastTime = nowTime;
                fn.apply(this, args);
            }
        }
    },
    //根据传入的key和string 返回对应的数组对象
    /**
     * 
     * @param {*code:item.caseCodes,id:item.caseIds} 
     * @returns {code:'A123',id:123}
     */
    strMapArr(obj){
        let arrKey = [] ,arr = [];
        for(let key in obj){
            arrKey.push(key);
        }
        if(!obj[arrKey[0]]){
            return [];
        }
        let json = {};
        let len = obj[arrKey[0]].split(',').length;
        for(let i=0; i<len; i++){
            json = {};
            arrKey.forEach(item=>{
                json[item] = obj[item].split(',')[i];
                if(typeof Number(json[item])==='number'&& !isNaN(Number(json[item]))){
                    json[item] = Number(json[item])
                }
            })
            arr.push(json);
        }
        return arr;
    },
    //判断文件类型 
    /****
    * 返回值说明：
    * image是图片类型（可以使用viewer预览） 
    * wps是文件类型（可以是用wps打开） 
    * other是其他类型（直接使用a标签打开）
    ****/
    getFileType(mediaType){
        if(mediaType.indexOf("image")!=-1){
            return "image"
        }else if(mediaType.indexOf(".document")!=-1 
                || mediaType.indexOf("msword")!=-1 
                || mediaType.indexOf(".sheet")!=-1
                || mediaType.indexOf(".ms-excel")!=-1
                || mediaType.indexOf("pdf")!=-1
                || mediaType.indexOf("text/plain")!=-1
                || mediaType.indexOf("powerpoint")!=-1
                || mediaType.indexOf("presentation")!=-1){
            return "wps"
        }else{
            return "other"
        }
    },
    /**
     * 
     * @param {*} num 
     * @returns 大写
     */
    toChinesNum(money){
        //汉字的数字
        let cnNums = new Array('零', '壹', '贰', '叁', '肆', '伍', '陆', '柒', '捌', '玖');
        //基本单位
        let cnIntRadice = new Array('', '拾', '佰', '仟');
        //对应整数部分扩展单位
        let cnIntUnits = new Array('', '万', '亿', '兆');
        //对应小数部分单位
        let cnDecUnits = new Array('角', '分', '毫', '厘');
        //整数金额时后面跟的字符
        let cnInteger = '整';
        //整型完以后的单位
        let cnIntLast = '圆';
        //最大处理的数字
        let maxNum = 999999999999999.9999;
        //金额整数部分
        let integerNum;
        //金额小数部分
        let decimalNum;
        //输出的中文金额字符串
        let chineseStr = '';
        //分离金额后用的数组，预定义
        let parts;
        if (money === '') { return ''; }
        money = parseFloat(money);
        //超出最大处理数字
        if (money >= maxNum) { return ''; }
        if (money === 0) {
            chineseStr = cnNums[0] + cnIntLast + cnInteger;
            return chineseStr;
        }
        //转换为字符串
        money = money.toString();
        if (money.indexOf('.') == -1) {
            integerNum = money;
            decimalNum = '';
        } else {
            parts = money.split('.');
            integerNum = parts[0];
            decimalNum = parts[1].substr(0, 4);
        }
        //获取整型部分转换
        if (parseInt(integerNum, 10) > 0) {
            let zeroCount = 0;
            let IntLen = integerNum.length;
            for (let i = 0; i < IntLen; i++) {
            let n = integerNum.substr(i, 1);
            let p = IntLen - i - 1;
            let q = p / 4;
            let m = p % 4;
            if (n == '0') {
                zeroCount++;
            } else {
                if (zeroCount > 0) {
                chineseStr += cnNums[0];
                }
                //归零
                zeroCount = 0;
                chineseStr += cnNums[parseInt(n)] + cnIntRadice[m];
            }
            if (m == 0 && zeroCount < 4) {
                    chineseStr += cnIntUnits[q];
                }
            }
                chineseStr += cnIntLast;
        }
        //小数部分
        if (decimalNum != '') {
            let decLen = decimalNum.length;
            for (let i = 0; i < decLen; i++) {
                let n = decimalNum.substr(i, 1);
                if (n != '0') {
                    chineseStr += cnNums[Number(n)] + cnDecUnits[i];
                }
            }
        }
        if (chineseStr == '') {
            chineseStr += cnNums[0] + cnIntLast + cnInteger;
        } else if (decimalNum == '') {
            chineseStr += cnInteger;
        }
        return chineseStr;
    },
    /**
     * 
     * @param {*} arr 去重的数组
     * @param {*} prop 根据某个属性进行去重
     * @returns 
     */
    removeDuplication(arr,prop){
        let json = {},list = [];
        arr.map(item=>{
            let key = prop?item[prop]:item;
            if(!json[key]){
                json[key] = 1;
                list.push(item);
            }else{
                json[key]++;
            }
        })
        return list;
    },
    /**
     * 
     * @param {*} key 获取cookie中的内容
     * @returns 
     */
    getCookie(key){
        let arr = document.cookie.replace(/\s/g, "").split(';');
        for (var i = 0; i < arr.length; i++) {
            var tempArr = arr[i].split('=');
            if (tempArr[0] == key) {
                return decodeURIComponent(tempArr[1]);
            }
        }
        return '';
    },
    getPublicUrl(key){
        let url = '/base/cos/presigned-url/ap-guangzhou/'+ config.uploadPrivateUrl +'?keys='+key;
        return new Promise(function(resolve,reject){
            get(url).then(res=>{
                if(res.code==0){
                    let pubUrl = res.data[0];
                    resolve(pubUrl)
                }
            })
        })
    },
    handleSummary ({ columns, data }) {
        const sums = {};
        columns.forEach((column, index) => {
            const key = column.key;
            if(columns[0].type == "selection"){
                if(index === 1){
                    sums[key] = {
                        key,
                        value: '合计:'
                    };
                    return;
                }
            }else{
                if (index === 0) {
                    sums[key] = {
                        key,
                        value: '合计:'
                    };
                    return;
                }
            }
            const values = data.map(item => Number(item[key]));
            if (!values.every(value => isNaN(value)) && key!="caseNo") {
                const v = values.reduce((prev, curr) => {
                    const value = Number(curr);
                    if (!isNaN(value)) {
                        return prev + curr;
                    } else {
                        return prev;
                    }
                }, 0);
                sums[key] = {
                    key,
                    value: common.formateNumber(v)
                };
            } else {
                sums[key] = {
                    key,
                    value: '--'
                };
            }
        });
        return sums;
    }
}
export default common;