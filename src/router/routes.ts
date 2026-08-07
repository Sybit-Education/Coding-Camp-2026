import HomeView from '@/views/HomeView.vue'
import LexiconView from '@/features/lexicon/LexiconView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import MapView from '@/views/MapView.vue'
import LexiconDetail from '@/features/lexicon/LexiconDetail.vue'
import DataProtectionView from '@/views/DataProtectionView.vue'
import BirdRecognitionView from '@/views/BirdRecognitionView.vue'
import DangerGuide from '@/views/DangerGuide.vue'
import AboutView from '@/views/AboutView.vue'
import TourGuidesView from '@/features/tours/TourGuidesView.vue'
import TourDetailView from '@/features/tours/TourDetailView.vue'

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
    path: '/tours',
    name: ROUTE_NAMES.TOURS,
    component: TourGuidesView,
  },
  {
    path: '/tour/:id',
    name: ROUTE_NAMES.TOUR_DETAILS,
    component: TourDetailView,
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
  {
    path: '/dangerguide',
    name: ROUTE_NAMES.DANGER_GUIDE,
    component: DangerGuide,
  },
  {
    path: '/about',
    name: ROUTE_NAMES.ABOUT,
    component: AboutView,
  },
  /*FallBack !!!DO NOT REMOVE!!!*/
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
