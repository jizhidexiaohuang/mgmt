<template>
    <div class="file-container clearfix">
        <!-- title -->
        <div v-if="title" class="container-title">{{title}}：</div>
        <!-- 第一种文件样式 -->
        <div v-if="type=='one'" class="style-one clearfix">
            <viewer :options="options">
                <div v-for="(item,indexAttach) in attachmentList" :key="indexAttach" class="enclosure">
                    <img v-if="item.mediaType.indexOf('image')>-1" :src="item.imgSmallUrl" :data-source="item.url" alt>
                    <a v-else target="_blank" :href="item.url">
                        <span class="fileContain-span background-pdf" v-if="item.mediaType.indexOf('pdf')>-1"></span>
                        <span class="fileContain-span background-document" v-else-if="item.mediaType.indexOf('document')>-1"></span>
                        <span class="fileContain-span background-xls" v-else-if="item.mediaType.indexOf('xls')>-1"></span>
                        <span class="fileContain-span background-word" v-else-if="item.mediaType.indexOf('word')>-1"></span>
                        <span class="fileContain-span background-txt" v-else-if="item.mediaType.indexOf('txt')>-1"></span>
                        <span class="fileContain-span background-html" v-else></span>
                    </a>
                    <span :title="item.fileName" class="textoverTwo viewer-text">{{item.fileName}}</span>
                </div>
            </viewer>
        </div>
        <!-- 第二种文件样式 -->
        <div v-else-if="type=='two'" class="style-two">
            <div class="clearfix">
                <Col span="8" class="case-material textover">
                    <span class="case-material-icon icon-other"></span>
                    <a href="" target="_blank">【模版】海尔授权委托书</a>
                </Col>
                <Col span="8" class="case-material textover">
                    <span class="case-material-icon icon-doc"></span>
                    <a href="" target="_blank">【模版】海尔授权委托书</a>
                </Col>
                <Col span="8" class="case-material textover">
                    <span class="case-material-icon icon-pdf"></span>
                    <a href="" target="_blank">【模版】海尔授权委托书</a>
                </Col>
                <Col span="8" class="case-material textover">
                    <span class="case-material-icon icon-excel"></span>
                    <a href="" target="_blank">【模版】海尔授权委托书</a>
                </Col>
            </div>
        </div>
        <!-- 第三种文件样式 -->
        <div v-else-if="type=='three'" class="style-three">
            <div class="litigation-doc-wrap clearfix">
                <div class="l-doc">
                    <i v-if="true" class="sprite-icon document"></i>
                    <i v-else-if="false" class="sprite-icon word-pdf"></i>
                    <i v-else-if="false" class="sprite-icon msexcel"></i>
                    <i v-else class="sprite-icon other"></i>
                    <p class="l-doc-name textOver">授权书</p>
                    <p>申请
                        <span class="material-count"><input type="text" value="1" disabled=""></span>
                    份</p>
                </div>
                <div class="l-doc c-main">
                    <h5>主体材料</h5>
                    <i class="sprite-icon folder"></i>
                    <p class="l-doc-name c-main-name textOver">阿达</p>
                </div>
                <div class="l-doc c-main">
                    <h5>权属材料</h5>
                    <i class="sprite-icon power"></i>
                    <p class="l-doc-name c-main-name textOver">啊实打实大</p>
                </div>
                <div class="l-doc c-other">
                    <h5>其他材料</h5>
                    <i class="sprite-icon folder"></i>
                    <p class="l-doc-name c-other-name textOver">湿哒哒</p>
                    <p>申请
                        <span class="material-count"><input type="text" value="1" disabled=""></span>
                    份</p>
                </div>
            </div>
        </div>
        <!-- 第四种文件样式 -->
        <div v-else-if="type=='four'" class="style-four">
            <div class="litigation-doc-wrap clearfix">
                <div class="l-doc">
                    <i class="icon-close"></i>
                    <i v-if="true" class="sprite-icon document"></i>
                    <i v-else-if="false" class="sprite-icon word-pdf"></i>
                    <i v-else-if="false" class="sprite-icon msexcel"></i>
                    <i v-else class="sprite-icon other"></i>
                    <p class="l-doc-name textOver"><a href="">授权书</a></p>
                    <p>申请
                        <span class="material-count"><input type="number" min="1" max="100" value="1" /></span>
                    份</p>
                </div>
                <div class="l-doc c-main">
                    <i class="icon-close"></i>
                    <i class="sprite-icon folder"></i>
                    <p class="l-doc-name c-main-name textOver">阿达</p>
                </div>
                <div class="l-doc c-main">
                    <i class="icon-close"></i>
                    <i class="sprite-icon power"></i>
                    <p class="l-doc-name c-main-name textOver">啊实打实大</p>
                </div>
                <div class="l-doc c-other">
                    <i class="icon-close"></i>
                    <i class="sprite-icon folder"></i>
                    <p class="l-doc-name c-other-name textOver">湿哒哒</p>
                    <p>申请
                        <span class="material-count"><input type="number" min="1" max="100" value="1" /></span>
                    份</p>
                </div>
            </div>
        </div>
    </div>
</template>
<script>
    import myViewer from '../myViewer/myViewer.vue';
    export default {
        data () {
            return {
                attachmentList:[
                    {
                        "id": 3908,
                        "fileName": "1542951403751254.jpeg",
                        "mediaType": "image/jpeg",
                        "url": "http://qn.dev.andunip.cn/1542951403751254.jpeg?imageslim&e=1543915652&token=5NnH-jZ-oC6RX7vvP9rHJxjdgaA9yjHdItFTSnf0:HrRmfiv2ie57pUeFk8BO6_jikzU=",
                        "creatorType": null,
                        "creator": 19,
                        "createTime": null,
                        "sort": 3,
                        "assId": 1439,
                        "imgSmallUrl": "http://qn.dev.andunip.cn/1542951403751254.jpeg?imageView2/1/w/200/h/200&e=1543915652&token=5NnH-jZ-oC6RX7vvP9rHJxjdgaA9yjHdItFTSnf0:YVD2tklZebAC1CJ8RBZHXGTbEWk=",
                        "originalUrl": "1542951403751254.jpeg"
                    },
                ],
                options: { //viewer的配置
                    url: "data-source",
                    view:function(currItem){
                        console.log(currItem);
                    }
                },  
            }
        },
        props: ['type','title'],

        methods: {

        },
        created(){

        },
        beforeMount(){

        },
        mounted(){

        },
        updated(){

        },
        components: {
            myViewer
        },
        watch: {

        }
    }
</script>
<style lang="sass" scoped>
 @import './fileContainer.scss'
</style>
