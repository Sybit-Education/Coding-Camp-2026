import HomeView from '@/views/HomeView.vue'
import LexiconListView from '@/views/LexiconListView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import MapView from '@/views/MapView.vue'
import LexiconDetail from '@/views/LexiconDetailView.vue'
import DataProtectionView from '@/views/DataProtectionView.vue'
import BirdRecognitionView from '@/views/BirdRecognitionView.vue'
import DangerGuide from '@/views/DangerGuide.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/bird-recognition',
    name: ROUTE_NAMES.BIRD_RECOGNITION,
    component: BirdRecognitionView,
  },
  {
    path: '/map',
    name: ROUTE_NAMES.MAP,
    component: MapView,
  },
  {
    path: '/dataprotection',
    name: ROUTE_NAMES.DATA_PROTECTION,
    component: DataProtectionView,
  },
  {
    path: '/lexicon',
    name: ROUTE_NAMES.LEXICON,
    component: LexiconListView,
  },
  {
    path: '/lexiconDetail/:id',
    name: ROUTE_NAMES.LEXICON_DETAILS,
    component: LexiconDetail,
  },
  {
    path: '/DangerGuide',
    name: ROUTE_NAMES.DANGER_GUIDE,
    component: DangerGuide,
  },

  /*FallBack !!!DO NOT REMOVE!!!*/
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
