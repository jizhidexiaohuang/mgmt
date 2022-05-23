<template>
    <div>
        <Row class="viewer-img-box" v-show="false">
            <viewer :options="options" @inited="inited">
                <img ref="imgDom" :src="imgUrl" :data-source="imgUrl" alt="">
            </viewer>
        </Row>

        <Modal 
            v-model="onlineWordModal" 
            fullscreen
            :footer-hide="true">
            <div slot="header" style="font-weight:700;font-size:18px">在线文档</div>
            <div style="height:100%;">
                <wps-file 
                    :fileUrl="onlineFileUrl"
                    :readOnly="readOnly"
                    v-if="onlineWordModal"></wps-file>
            </div>
        </Modal>
    </div>
</template>
<script>
export default {
    data () {
        return {
            options: {
                url: "data-source"
            },
            imgUrl:"",
            onlineWordModal:false,
            onlineFileUrl:"",
            url:""
        }
    },
    props: {
        readOnly:{
            type:Boolean,
            default:true
        }
    },
    methods: {
        inited(viewer) {
            this.$viewer = viewer;
        },
        async getUrl(key,type){
            this.url = await this.common.getPublicUrl(key);
            this.initPreview(type);
        },
        preview(defaultData){
            let type = this.common.getFileType(defaultData.mediaType);
            this.url = defaultData.url;
            if(defaultData.url && defaultData.url.indexOf("dev-private")!=-1){
                let arr = defaultData.url.split("?")[0].split("/");
                let key = arr[arr.length-1];
                this.getUrl(key,type);
            }else{
                this.initPreview(type);
            }
        },
        initPreview(type){
            if(type==="image"){
                this.imgUrl = this.url;
                this.$viewer.update();
                this.$refs["imgDom"].click();
            }else{
                this.onlineFileUrl = this.url;
                this.onlineWordModal = true;
            }
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
<style>
 
</style>
