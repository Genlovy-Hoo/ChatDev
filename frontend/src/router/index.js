import { createRouter, createWebHistory } from 'vue-router'
import ThemedRouteView from '../components/ThemedRouteView.vue'

const routes = [
    {
        path: '/',
        component: ThemedRouteView,
        props: {
            dark: () => import('../pages/HomeView.vue'),
            light: () => import('../themes/light/pages/light_HomeView.vue'),
        },
    },
    {
        path: '/tutorial',
        component: ThemedRouteView,
        props: {
            dark: () => import('../pages/TutorialView.vue'),
            light: () => import('../themes/light/pages/light_TutorialView.vue'),
        },
    },
    {
        path: '/launch',
        component: ThemedRouteView,
        props: {
            dark: () => import('../pages/LaunchView.vue'),
            light: () => import('../themes/light/pages/light_LaunchView.vue'),
        },
    },
    {
        path: '/batch-run',
        component: ThemedRouteView,
        props: {
            dark: () => import('../pages/BatchRunView.vue'),
            light: () => import('../themes/light/pages/light_BatchRunView.vue'),
        },
    },
    {
        path: '/workflows/:name?',
        component: ThemedRouteView,
        props: {
            dark: () => import('../pages/WorkflowWorkbench.vue'),
            light: () => import('../themes/light/pages/light_WorkflowWorkbench.vue'),
        },
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes,
    scrollBehavior(to, from, savedPosition) {
        if (savedPosition) {
            return savedPosition
        }
        
        if (to.hash) {
            return {
                el: to.hash,
                behavior: 'smooth',
                // Add a small delay to ensure the element exists
                top: 0
            }
        }
        
        // Otherwise scroll to top
        return { top: 0 }
    }
})

export default router