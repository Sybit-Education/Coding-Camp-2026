import HomeView from '@/views/HomeView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import ImpressumView from '@/views/ImpressumView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/impressum',
    name: ROUTE_NAMES.IMPRESSUM,
    component: ImpressumView,
  },
]
