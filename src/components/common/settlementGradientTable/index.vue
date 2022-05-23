<template>
    <div>
        <Form :model="formData" ref="formData" :rules="ruleValidate">
        <Row class="block-content-title">
            <Row>
                <div class="title-begin">金额下限</div>
                <div class="title-end">金额上限</div>
                <div class="title-proportion">比例</div>
            </Row>
            <div>
                <span class="icon-increase-01 add-icon" @click="addLoopFee()"></span>
            </div>
        </Row>
        <Row v-for="(item,index) in formData.rewardFee" :key="index" class="fee-loop-list">
            <div class="require-tips">*</div>
            <Row class="fee-loop-content">
                <div class="fee-loop-begin">
                    <FormItem :label-width="0" label="" :prop="'rewardFee.' + index+'.start'" :rules="ruleValidate.subject">
                        <Input v-model="item.start" disabled>
                            <span slot="append">￥</span>
                        </Input>
                    </FormItem>
                </div>
                <div class="fee-loop-split">—</div>
                <div class="fee-loop-end">
                    <FormItem :label-width="0" label="" :prop="'rewardFee.' + index +'.end'" :rules="ruleValidate.subject">
                        <Input v-model="item.end" @on-blur="changeEnd(index)">
                            <span slot="append">￥</span>
                        </Input>
                    </FormItem>
                </div>
                <div class="fee-loop-proportion">
                    <FormItem :label-width="0" label="" :prop="'rewardFee.' + index +'.percentage'" :rules="ruleValidate.subject">
                        <Input v-model="item.percentage" @on-blur="changePercentage(index)">
                            <span slot="append">%</span>
                        </Input>
                    </FormItem>
                </div>
            </Row>
            <div class="fee-loop-icon">
                <span class="icon-down-01 remove-icon" @click="removeLoopFee(index)"></span>
            </div>
        </Row>
        <Row class="fee-loop-list">
            <div class="require-tips">*</div>
            <Row class="fee-loop-content">
                <div class="fee-loop-begin-lg">
                    <FormItem label="" :label-width="0" prop="maxNumber">
                        <Input v-model="formData.maxNumber" :disabled="this.formData.rewardFee.length==0?false:true" @on-blur="changeEnd(null)">
                            <span slot="prepend">></span>
                            <span slot="append">￥</span>
                        </Input>
                    </FormItem>
                </div>
                <div class="fee-loop-proportion">
                    <FormItem label="" :label-width="0" prop="maxPercentage">
                        <Input v-model="formData.maxPercentage" @on-blur="changePercentage(null)">
                            <span slot="append">%</span>
                        </Input>
                    </FormItem>
                </div>
            </Row>
        </Row>
        </Form>
    </div>
</template>
<script>
export default {
    data () {
        const rulesValid = (rule,value,callback) => {
            let arr = rule.fullField.split(".");
            let prop = arr[0];
            let index = arr[1];
            let attr = arr[2];
            if(attr=='start'){
                if(Number(this.formData[prop][index].start)>Number(this.formData[prop][index].end)){
                    return callback(new Error('金额上限不能小于下限'));
                }
            }else if(attr=='end'){
                if(!this.formData[prop][index].end){
                    return callback(new Error('请输入金额上限'));
                }
                if(this.formData[prop][index].end&&Number(this.formData[prop][index].end)==0){
                    return callback(new Error('金额上限不能为0'));
                }
                if(this.formData[prop][index].end&&Number(this.formData[prop][index].end)>100000000){
                    return callback(new Error('金额上限不能超过一亿'));
                }
            }else if(attr=='percentage'){
                if(this.formData[prop][index].percentage<0){
                    return callback(new Error('比例不能小于0'));
                }
                if(this.formData[prop][index].percentage>100){
                    return callback(new Error('比例不能大于100'));
                }
            }
            callback();
        }
        const maxNumberValid = (rule,value,callback) => {
            if(this.formData.maxNumber&&Number(this.formData.maxNumber)==0){
                return callback(new Error('金额上限不能为0'));
            }
            if(this.formData.maxNumber&&Number(this.formData.maxNumber)>100000000){
                return callback(new Error('金额上限不能为一亿'));
            }
            callback();
        }
        const maxPercentageVaild = (rule,value,callback) => {
            if(this.formData.maxPercentage<0){
                return callback(new Error('比例不能小于0'));
            }
            if(this.formData.maxPercentage>100){
                return callback(new Error('比例不能大于100'));
            }
            callback();
        }
        return {
            formData:{
                rewardFee:[
                    {
                        start:this.toFixedNumber(0),
                        end:this.toFixedNumber(1),
                        percentage:0,
                        index:0,
                    }
                ],
                maxNumber:this.toFixedNumber(1),
                maxPercentage:0
            },
            ruleValidate:{
               subject:[{validator:rulesValid}],
               maxNumber:[{validator:maxNumberValid}],
               maxPercentage:[{validator:maxPercentageVaild}]
            }
        }
    },
    props: ['list'],
    computed:{},
    methods: {
        //增加一行
        addLoopFee(){
            let len = this.formData.rewardFee.length;
            this.formData.rewardFee.push({
                start:len==0?this.toFixedNumber(0):this.toFixedNumber(this.formData.rewardFee[len-1].end),
                end:len==0?this.toFixedNumber(1):this.toFixedNumber(Number(this.formData.rewardFee[len-1].end)+1),
                percentage:0,
                index:len,
            })
            this.resetFirstStart()
        },
        //删除一行
        removeLoopFee(index){
            this.formData.rewardFee.splice(index,1);
            this.resetFirstStart()
        },
        //重新调整区间
        resetFirstStart(){
            let len = this.formData.rewardFee.length;
            if(len>0) this.formData.rewardFee[0].start = this.toFixedNumber(0);
            this.formData.maxNumber = len===0?0:this.formData.rewardFee[len-1].end;
            this.formData.maxNumber = this.toFixedNumber(this.formData.maxNumber);
            
            for(let i=0;i<this.formData.rewardFee.length-1;i++){
                this.formData.rewardFee[i+1].start = this.formData.rewardFee[i].end;
            }
        },
        //改变输入框
        changeEnd(index){
            if(index==null){
                this.formData.maxNumber = this.toFixedNumber(this.formData.maxNumber);
                return;
            }
            let len = this.formData.rewardFee.length;
            let reg  = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if(!reg.test(this.formData.rewardFee[index].end)){
                this.formData.rewardFee[index].end = "";
                return
            }
            this.formData.rewardFee[index].end = this.toFixedNumber(this.formData.rewardFee[index].end);
            this.resetFirstStart();
            this.submitValid();
        },
        //改变百分比
        changePercentage(index){
            let reg  = /^[+]{0,1}(\d+)$|^[+]{0,1}(\d+\.\d+)$/;
            if(index!==null){
                if(!reg.test(this.formData.rewardFee[index].percentage)){
                    this.formData.rewardFee[index].percentage = "";
                    return
                }
            }else{
                if(!reg.test(this.formData.maxPercentage)) {
                    this.formData.maxPercentage = "";
                    return
                }
            }
            this.submitValid();
        },
        //手动验证 传值
        submitValid(){
           this.$refs['formData'].validate((valid) => {
                if(valid){
                    this.$emit('getSettlementList',this.mapList(this.formData.rewardFee))
                }else{
                    this.$emit('getSettlementList',[])
                }
           }) 
        },
        //更新操作
        voluation(){
            console.log(this.list)
            let len = this.list.length;
            if(len>0){
                if(len>1){
                    let arr = this.list.splice(0,len-1);
                    this.formData.rewardFee = arr.map((item,index)=>{
                        return {
                            start:item.minAmount.toFixed(2),
                            end:item.maxAmount.toFixed(2),
                            percentage:item.ratio,
                            index:index,
                        }
                    })
                }
                this.formData.maxNumber = this.list[0].minAmount.toFixed(2);
                this.formData.maxPercentage = this.list[0].ratio;
                this.submitValid();
            }
        },
        //格式转换
        toFixedNumber(num){
            return Number(num).toFixed(2);
        },
        //数据map
        mapList(arr){
            let list = arr.map(item=>{
                return {
                   minAmount:Number(item.start).toFixed(0),
                   maxAmount:Number(item.end).toFixed(0),
                   ratio:Number(item.percentage).toFixed(0)
                }
            })
            list.push({
                minAmount:Number(this.formData.maxNumber).toFixed(0),
                maxAmount:'',
                ratio:Number(this.formData.maxPercentage).toFixed(0)
            })
            return list;
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        
    },
    updated(){},
    components: {},
    watch: {
        
    }
}
</script>
<style lang="scss">
.fee-loop-list{
    .ivu-form-item{
        margin-bottom: 0;
    }
}
</style>