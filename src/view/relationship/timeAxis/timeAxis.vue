<template>
    <div>
        <ul class="list">
            <li>
                <span>2019-01-08 14:46</span>
                <Icon type="md-radio-button-on" size="16" color="#4988eb" />
                <div class="annotation-content-right">
                    <div class="p-name">
                        <span class="active">麦世宏团队</span>
                        <span v-if="type === 0" class="verb">创建了</span>
                        <span v-if="type === 1" class="verb">更新了</span>
                        <span v-if="type === 2" class="verb">将</span>
                        <span class="active">R201901075283</span>
                        <span v-if="type === 2">
                            <span class="verb">的</span>  
                            <span class="active">状态asdadadad状态</span>
                            <span class="verb">更新为</span>
                            <span class="active">状态asdadadad状态新的新的</span>    
                        </span>
                    </div>
                    <div class="p-annotation">
                        备注：
                        <span class="active">新增报备结果123</span>
                    </div>
                </div>
            </li>
            <li>
                <span>2019-01-08 14:46</span>
                <Icon type="md-radio-button-on" size="16" color="#d8d8d8" />
                <div class="annotation-content-right">
                    <div class="p-name">111</div>
                    <div class="p-annotation">333</div>
                </div>
            </li>
        </ul>
    </div>
</template>
<script>
export default {
    data () {
        return {
            type:2
        }
    },
    props: [''],
    methods: {},
    created(){},
    beforeMount(){},
    mounted(){},
    updated(){},
    components: {},
    watch: {}
}
</script>
<style lang="sass" scoped>
@import "./timeAxis"
</style>

