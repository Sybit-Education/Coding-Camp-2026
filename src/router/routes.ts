import HomeView from '@/views/HomeView.vue'
import LexiconView from '@/views/LexiconView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import MapView from '@/views/MapView.vue'
import LexiconDetail from '@/views/LexiconDetail.vue'
import DataProtectionView from '@/views/DataProtectionView.vue'
import ImprintView from '@/views/ImprintView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/map',
    name: ROUTE_NAMES.MAP,
    component: MapView,
  },
  {
    path: '/imprint',
    name: ROUTE_NAMES.IMPRINT,
    component: ImprintView,
  },
  {
    path: '/dataprotection',
    name: ROUTE_NAMES.DATA_PROTECTION,
    component: DataProtectionView,
  },
  {
    path: '/lexicon',
    name: ROUTE_NAMES.LEXICON,
    component: LexiconView,
  },
  {
    path: '/lexiconDetail/:id',
    name: ROUTE_NAMES.LEXICON_DETAILS,
    component: LexiconDetail,
  },

  /*FallBack !!!DO NOT REMOVE!!!*/
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
