<template>
    <div>
        <Row :class="[{'clue-block':true, 'error-block':isError}]">
            <Row class="clue-title">
                <slot name='title'></slot>
            </Row>
            <!-- 线索冲突 -->
            <Row>
                <Row class="clue-content">
                    <Row class="clue-detail-item">
                        <span class="clue-item-label">项目名称：</span>
                        <span class="textover" :title="renderObj.projectName">{{renderObj.projectName || "--"}}</span>
                    </Row>
                    <Row class="clue-detail-item">
                        <!-- <span class="clue-item-label">{{!renderObj.caseCode?'调查':'报备'}}团队：</span> -->
                        <span class="clue-item-label">报备团队：</span>
                        <span class="textover" :title="renderObj.teamName + '('+ renderObj.teamTypeName + ')'">{{renderObj.teamName || "--"}}（{{renderObj.teamTypeName || "--"}}）</span>
                    </Row>
                    <Row class="clue-detail-item">
                        <span class="clue-item-label">类型：</span>
                        <span class="textover" :title="!renderObj.caseCode?'线索':'案件'">{{!renderObj.caseCode?'线索':'案件'}}</span>
                    </Row>
                    <Row class="clue-detail-item">
                        <span class="clue-item-label">{{!renderObj.caseCode?'线索':'案件'}}编号：</span>
                        <span class="textover" :title="!renderObj.caseCode?renderObj.clueCode:renderObj.caseCode">{{!renderObj.caseCode?renderObj.clueCode:renderObj.caseCode}}</span>
                    </Row>
                    <Row class="clue-detail-item">
                        <span class="clue-item-label">状态：</span>
                        <span class="textover">
                            <Tag style="border:0;border-radius:11px;" :color="mainColor[stateColor(renderObj.state)]">{{renderObj.stateName}}</Tag>
                        </span>
                    </Row>
                    <Row class="clue-detail-item">
                        <span class="clue-item-label">冲突描述：</span>
                        <span class="textoverTwo" :title="renderObj.description">{{renderObj.description || "--"}}</span>
                    </Row>
                </Row>
                <Row>
                    <div class="content-divider">
                        <span slot="split-title">{{titleName}}要素对比</span>
                    </div>
                    <Row class="clue-content">
                        <Row class="clue-detail-item">
                            <span class="clue-item-label">侵权方式：</span>
                            <span>{{renderObj.tortTypeName || "--"}}</span>
                        </Row>
                        <!-- (线上)(产品链接)(冲突) -->
                        <Row v-if="renderObj.tortType.indexOf('E')!='-1'&&renderObj.conflictField.indexOf('productUrl')!=-1">
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">销售渠道：</span>
                                <span :title="renderObj.channelTypeName">{{renderObj.channelTypeName || "--"}}</span>
                            </Row>
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">店铺名称：</span>
                                <span :title="renderObj.storeName">{{renderObj.storeName || "--"}}</span>
                            </Row>
                            <Row :class="{'clue-detail-item':true,'error-item':isNeedError('productUrl')}">
                                <span class="clue-item-label">产品链接：</span>
                                <span :title="renderObj.productUrl">{{renderObj.productUrl || "--"}}</span>
                            </Row>
                        </Row>
                        <!-- (线上|线下)(生产商|销售商)(冲突|关联) -->
                        <Row v-if="renderObj.conflictField.indexOf('name')!=-1">
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">侵权主体类型：</span>
                                <span :title="renderObj.categoryName">{{renderObj.categoryName || "--"}}</span>
                            </Row>
                            <Row class="clue-detail-item" v-if="renderObj.propertyName">
                                <span class="clue-item-label">侵权主体性质：</span>
                                <span :title="renderObj.propertyName">{{renderObj.propertyName}}</span>
                            </Row>
                            <Row :class="{'clue-detail-item':true,'error-item':isNeedError('name')}">
                                <span class="clue-item-label">侵权主体名称：</span>
                                <span :title="renderObj.name">{{renderObj.name || "--"}}</span>
                            </Row>
                        </Row>
                        <!-- (线上)(店铺链接)(关联) -->
                        <Row v-if="renderObj.conflictField.indexOf('storeUrl')!=-1">
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">销售渠道：</span>
                                <span :title="renderObj.channelTypeName">{{renderObj.channelTypeName || "--"}}</span>
                            </Row>
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">店铺名称：</span>
                                <span :title="renderObj.storeName">{{renderObj.storeName || "--"}}</span>
                            </Row>
                            <Row class="clue-detail-item">
                                <span class="clue-item-label">掌柜号：</span>
                                <span :title="renderObj.dispenser">{{renderObj.dispenser || "--"}}</span>
                            </Row>
                            <Row :class="{'clue-detail-item':true,'error-item':isNeedError('storeUrl')}">
                                <span class="clue-item-label">店铺链接：</span>
                                <span :title="renderObj.storeUrl">{{renderObj.storeUrl || "--"}}</span>
                            </Row>
                        </Row>
                    </Row>
                </Row>
            </Row>
        </Row>
    </div>
</template>
<script>
import styles from "@/assets/globalStyle.scss";
export default {
    data () {
        return {
            mainColor:styles,
            conflictType:""
        }
    },
    props:{
        renderObj:{
            type:Object | String
        },
        isError:{
            type:Boolean,
            default:false
        },
        type:{
            type:String
        }
    },
    methods: {
        update(compareObj,errorObj){
            for(let key in errorObj){
                this.renderObj[key] = errorObj[key];
            }
            this.renderObj.conflictField = compareObj.conflictField;
        },
        isNeedError(key){
            return this.renderObj.conflictField&&this.renderObj.conflictField.indexOf(key)!=-1
        },
        stateColor(state){
            let color = "";
            switch (true){
                case (state=='P'||state=='PR'):color = 'warningColor';break;
                case (state=='HH'||state=='E'):color = 'successColor';break;
                case (state=='RT'||state=='AT'||state=='RA'||state=='TN'||state=='R'||state=='W'):color = 'errorColor';break;
                case (state=='ED'||state=='S'):color = 'expireColor';break;
            }
            return color
        }
    },
    computed:{
        titleName(){
            return this.type=='conflict'?'冲突':'关联'
        }
    },
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="scss" scoped>
@import "./compareClue.scss";
</style>
