import {createRouter, createWebHashHistory, createWebHistory} from 'vue-router'

const router = createRouter({
    history: createWebHashHistory(),
    routes: [
        {
            path: '/',
            name: 'Home',
            component: () => import('@/views/Home.vue')
        },
        {
            path: '/demo/:id',
            name: 'DemoDetail',
            component: () => import('@/views/DemoDetail.vue')
        }
    ]
})

export default router