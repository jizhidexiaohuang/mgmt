import store from '@/store/store.js';
import permissionJson from './../../libs/permission';

export default {
    inserted(el, binding, vnode) {
        const { value } = binding;
        const options = store.state.permission && store.state.permission.options
        if (value && value instanceof Array && value.length > 0) {
            const permissionRoles = [];
            let hasPermission = null;

            if(value[0].indexOf('/')!=-1){
                permissionRoles = [permissionJson[value]];
            }else{
                permissionRoles = value;
            }

            // console.log(permissionRoles)
            hasPermission = options.some(role => {
                return permissionRoles.includes(role)
            })
            if(permissionRoles.includes(false)){
                hasPermission = !hasPermission;
            }
            if (!hasPermission) {
                el.parentNode && el.parentNode.removeChild(el)
            }
        }else{
            throw new Error(`need roles! Like v-permission="['admin','editor']"`)
        }
    }
}