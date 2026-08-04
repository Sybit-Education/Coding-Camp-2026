import HomeView from '@/views/HomeView.vue'
import LexiconView from '@/views/LexiconView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import ImpressumView from '@/views/ImpressumView.vue'
import LexiconDetail from '@/views/LexiconDetail.vue'

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
  {
    path: '/lexicon',
    name: ROUTE_NAMES.LEXICON,
    component: LexiconView,
  },
  {
    path: '/lexiconDetail/:id',
    name: ROUTE_NAMES.LEXICON_DETAILS,
    component: LexiconDetail
  },
]
