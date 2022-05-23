<template>
    <div>
        <Row style="width:800px;">
           
        </Row>
        <Row v-for="(item,index) in listData" :key="index">
            <my-viewer 
                :data="item.attachmentList" 
                :smallImg="'imgSmallUrl'"
                :sourceImg="'url'" 
                :isSort="true"
                @doSort="doSort"
                @click.native.once="getId(item.id)">
            </my-viewer>
        </Row>
        <Row>
            <textarea id="editor1" rows="10" cols="80" name="content"></textarea>
        </Row>
        <Row>
            <textarea id="editor2" rows="10" cols="80" name="content"></textarea>
        </Row>
        <!-- <Row>
            <file-upload :defaultList="defaultList" :uploadConfig="uploadConfig"></file-upload>
        </Row>
        <Row>
            <p v-for="(item,index) in activeData" :key="index"></p>
            <Button @click="testBtn">测试按钮</Button>
        </Row>
        <Row>
            <Input v-model="value1" @on-change="changeValue2" placeholder="摄氏度" style="width: 300px" />
            <Input v-model="value2" @on-change="changeValue1" placeholder="温度" style="width: 300px" />
        </Row> -->
        <!-- <div v-for="(item,index) in f" :key="index">{{item}}</div> -->
        <router-link to="/relationship/investigateTeam">
            <span>跳转</span>
        </router-link>
        <Tree :data="data4" show-checkbox multiple></Tree>
        <Button @click="testTree">点击</Button>
        <!-- 启用modal -->
        <Modal
            v-model="enableCtrl"
            title="启用确认"
            :width="550"
            :footer-hide="true">
            <transfer-tree
                ref="transferTree"
                @getValue="getTreeValue"
                :rightHide="false"
            ></transfer-tree>                                                                                                                                                                                
            <Row style="text-align:center;margin:10px 0px 14px;">
                <Button type="primary" @click="enableSubmit">确认</Button>
                <Button @click="enableCtrl=false;" style="margin-left: 8px">取消</Button>
            </Row>
        </Modal>
    </div>
</template>
<script>
import url from '@/libs/config.js';
export default {
    data() {
        return {
            f:['🌑', '🌒', '🌓', '🌔', '🌝', '🌖', '🌗', '🌘'],
            defaultList:[],
            uploadConfig:[],
            archivesArr:[],
            mySelect:[],
            value1:"",
            value2:"",
            isDown:false,
            enableCtrl:false,
            //总列表数据
            listData:[
                {
                    id:11,
                    assId:22,
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
                        {
                            "id": 3907,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1543395733435250.jpeg?imageslim&e=1543919681&token=5NnH-jZ-oC6RX7vvP9rHJxjdgaA9yjHdItFTSnf0:mjCnCBovD9ITe6kiDWMAun7cJtQ=",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": 2,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1543395733435250.jpeg?imageView2/1/w/200/h/200&e=1543919727&token=5NnH-jZ-oC6RX7vvP9rHJxjdgaA9yjHdItFTSnf0:SByEeEgWcptyBFzAi7gGyzcA-tQ=",
                            "originalUrl": "1542951403751254.jpeg"
                        },
                        {
                            "id": 3654,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1543395734955788.jpeg?imageslim",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": null,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1543395734955788.jpeg?imageView2/1/w/200/h/200",
                            "originalUrl": "1542951403751254.jpeg"
                        },
                        {
                            "id": 9875,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1543395746785487.jpeg?imageslim",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": null,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1543395746785487.jpeg?imageView2/1/w/200/h/200",
                            "originalUrl": "1542951403751254.jpeg"
                        },
                        {
                            "id": 1458,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1543395718374821.jpeg?imageslim",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": null,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1543395718374821.jpeg?imageView2/1/w/200/h/200",
                            "originalUrl": "1542951403751254.jpeg"
                        }
                    ]
                },
                {
                    id:17,
                    assId:22,
                    attachmentList:[
                        {
                            "id": 7854,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1542982086021915.jpeg?imageslim",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": null,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1542982086021915.jpeg?imageView2/1/w/200/h/200",
                            "originalUrl": "1542951403751254.jpeg"
                        },
                        {
                            "id": 9863,
                            "fileName": "1542951403751254.jpeg",
                            "mediaType": "image/jpeg",
                            "url": "http://qn.dev.andunip.cn/1542982086211114.jpeg?imageslim",
                            "creatorType": null,
                            "creator": 19,
                            "createTime": null,
                            "sort": null,
                            "assId": 1439,
                            "imgSmallUrl": "http://qn.dev.andunip.cn/1542982086211114.jpeg?imageView2/1/w/200/h/200",
                            "originalUrl": "1542951403751254.jpeg"
                        }
                    ]
                }
            ],
            selectData:[
                {
                    id:1,
                    text:"著作权",
                    children:[
                        {
                            value: 1234,
                            label: '微信图标著作权微信图标著作权微信图标著作权微信图标著作权微信图标著作权微信图标著作权',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"---国作登字-2018-F-00434083---国作登字-2018-F-00434083---国作登字-2018-F-00434083"
                        },
                        {
                            value: 1452,
                            label: '摇摆卡通蓝牙音箱-迷你机器人狗',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"---国作登字-2018-F-00434083"
                        },
                        {
                            value: 'Sydney',
                            label: 'Sydney',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Ottawa',
                            label: 'Ottawa',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Paris',
                            label: 'Paris',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Canberra',
                            label: 'Canberra',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        }
                    ]
                },
                {
                    id:2,
                    text:"专利",
                    children:[
                        {
                            value: 1234,
                            label: '微信图标著作权',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"---国作登字-2018-F-00434083"
                        },
                        {
                            value: 1452,
                            label: '摇摆卡通蓝牙音箱-迷你机器人狗',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"---国作登字-2018-F-00434083"
                        },
                        {
                            value: 'Sydney',
                            label: 'Sydney',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Ottawa',
                            label: 'Ottawa',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Paris',
                            label: 'Paris',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        },
                        {
                            value: 'Canberra',
                            label: 'Canberra',
                            imgUrl:require("./../../../assets/images/copyright.png"),
                            describe:"我是描述我是描述我是描述"
                        }
                    ]
                }
            ],
            formData:[
                {
                    isActive:true,
                    name:"测试1"
                },
                {
                    isActive:false,
                    name:"测试2"
                },
                {
                    isActive:true,
                    name:"测试3"
                }
            ],
            archivesArr:[
                {
                    id:123,
                    company:"公司名称"
                }
            ],
            config:{},
            data4: [
                {
                    title: 'parent 1',
                    expand: true,
                    selected: true,
                    children: [
                        {
                            title: 'parent 1-1',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-1-1',
                                    disabled: true
                                },
                                {
                                    title: 'leaf 1-1-2'
                                }
                            ]
                        },
                        {
                            title: 'parent 1-2',
                            expand: true,
                            children: [
                                {
                                    title: 'leaf 1-2-1',
                                    checked: true
                                },
                                {
                                    title: 'leaf 1-2-1'
                                }
                            ]
                        }
                    ]
                }
            ]
        };
    },
    props: [""],
    components: {},
    methods: {
        inputToArchives(){},
        archivesReachBottom(){},
        getArchivesData(){},
        testTree(){
            // this.data4[0].children[1].children[0].checked = false;
            // console.log(this.data4[0]);
            // console.log(this.$refs.transferTree);
            this.enableCtrl = true;
        },
        showDown(){
            this.isDown = !this.isDown;
        },
        changeValue2(){
            this.value2 = this.value1 + 1;
        },
        changeValue1(){
            this.value1 = this.value2 + 1;            
        },
        //监听viewer组件
        inited(viewer) {
            this.$viewer = viewer;
        },
        //图片排序业务处理
        doSort(imgId,sortId,opera){
            console.log(imgId,sortId,opera);
        },
        getId(id){
            console.log(id);
        },
        getSelectValue(arr){
            console.log(arr);
        },
        testBtn(){
            console.log("点击");
        },
        getTreeValue(data){
            console.log(data);
        },
        enableSubmit(){
            this.enableCtrl = false;
        }
    },
    created() {},
    beforeMount() {},
    mounted() {
        document.addEventListener('click', (e) => {
            if (!this.$el.contains(e.target)){
                this.isDown = false;
            }
        })
        this.config.qiniuImgUrl = url.qiniuImgUrl;
        this.config.tokenUrl = url.baseUrl+'/qiniuUpload/getUpToken';
        this.editor = CKEDITOR.replace('editor1',this.config);
        this.editor = CKEDITOR.replace('editor2',this.config);
        // this.$post(url,ajaxData).then(res=>{
        //     t.teamArr = t.teamArr.concat(res.rows);
        //     t.isEnd = res.rows.length == 0 ? true:false;
        // })
        // this.$post("news/queryWeixinNewsInfo?count=10&offset=&type=news").then(res => {
               
        // });
    },
    updated() {},
    watch: {},
    computed: {
        activeData(){
            return this.formData.filter(function (item) {
                return item.isActive
            })
        }
    }
};
</script>
<style lang="sass" scoped>
@import "./test"
</style>


