//用来渲染路由
import router from './router/index.js'
import store from '@/store/store.js'
import { Message } from 'view-design'
import NProgress from 'nprogress'
import 'nprogress/nprogress.css'

router.beforeEach(async (to, from, next) => {
    // console.log(to)
    NProgress.start()
    let token = window.localStorage.getItem('token');
    let expiryTime = window.localStorage.getItem('expiryTime');
    if(token){
        if(to.fullPath==='/login'||to.fullPath==='/shareList'){
            next()
            NProgress.done()
        }else{
            if(expiryTime&&new Date().getTime()-expiryTime<23*60*60*1000){
                next();
            }else{
                next('/login')
                return ;
            }
            const hasRoles = store.state.permission.flag;
            // console.log(hasRoles)
            if(hasRoles){
                next();
                NProgress.done()
            }else{
                try{
                    const {roles} = await store.dispatch('permission/getRoles',{root:true})||[];
                    const accessRoutes = await store.dispatch('permission/generateRoutes', roles);
                    router.addRoutes(accessRoutes)
                    next({ ...to, replace: true })
                }catch(error){
                    //抛错
                    Message.error(error || 'Has Error')
                    next(`/login?redirect=${to.path}`)
                    NProgress.done()
                }
            }
        }
    }else{
        if(to.fullPath.indexOf('/login')!=-1||to.fullPath==='/500'||to.fullPath=='/404'||to.fullPath==='/shareList'){
            next();
        }else{
            next(`/login?redirect=${to.path}`)
            NProgress.done();
        }
    }
})

router.afterEach(() => {
    NProgress.done()
})
