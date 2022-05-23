<template>
    <div>
        <div id="toolbar-container"></div>
        <!-- 编辑器容器 -->
        <div id="editor" style="min-height: 200px; max-height: 620px; border: 1px solid #ccc;"></div>
    </div>
</template>
<script>
import CKEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import '@ckeditor/ckeditor5-build-decoupled-document/build/translations/zh-cn';
import UploadImageAdapter from './uploadImageAdapter';
export default {
    name: 'ckeditor',
    data () {
        return {
            editor:null,
            editorConfig: {
                language: "zh-cn",
                fontSize: {
                    options: [8, 10, 'default', 14, 16, 18, 20, 22, 24, 26, 28, 32, 48]
                },
                fontFamily: {
                    options: ["宋体", "仿宋", "微软雅黑", "黑体", "仿宋_GB2312", "楷体", "隶书", "幼圆"]
                },
                // 可以控制编辑器的提示文本
                placeholder: this.placeholder,
                removePlugins:['MediaEmbed'],
                // plugins:[Alignment,Autoformat],
            }
        }
    },
    methods: {
        initCKEditor(){
            CKEditor.create(document.querySelector('#editor'), this.editorConfig).then(editor => {
                const toolbarContainer = document.querySelector('#toolbar-container');
                toolbarContainer.appendChild(editor.ui.view.toolbar.element);
                this.editor = editor //将编辑器保存起来，用来随时获取编辑器中的内容等，执行一些操作

                editor.plugins.get('FileRepository').createUploadAdapter = ( loader ) => {
                    console.log(loader)
                    return new UploadImageAdapter(loader)
                };
                editor.model.document.on('change:data', () => {
                    //把富文本编辑器获取到的内容传出去
                    this.$emit('input', editor.getData())
                });
                //编辑的时候设置富文本编辑器的内容
                editor.setData(this.defaultData);
            }).catch(error => {
                console.error(error);
            });
        }
    },
    computed:{
        
    },
    props:{
        defaultData:{
            type:String,
            default:''
        },
        placeholder:{
            type:String,
            default:'请输入内容'
        }
    },
    created(){},
    beforeMount(){},
    mounted(){
        this.initCKEditor()
    },
    updated(){},
    components: {},
    watch: {}
}
</script>
<style>
 
</style>
