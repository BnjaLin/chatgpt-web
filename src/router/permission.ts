import type { Router } from 'vue-router'
import { useUserStore } from '@/store'

export function setupPageGuard(router: Router): void {

    router.beforeEach((to, _, next) => {
        const userStore = useUserStore()
        if (to.path === '/login') {
            next()
        }
        if (userStore.userInfo && userStore.userInfo.username) {
            next()
        } else {
            next('/login')
        }
    })    
}
