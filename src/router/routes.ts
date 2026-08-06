import HomeView from '@/views/HomeView.vue'
import LexiconListView from '@/views/LexiconListView.vue'
import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names'
import MapView from '@/views/MapView.vue'
import LexiconDetail from '@/views/LexiconDetailView.vue'
import PrivacyPolicyView from '@/views/PrivacyPolicyView.vue'
import BirdRecognitionView from '@/views/BirdRecognitionView.vue'
import DangerGuide from '@/views/DangerGuide.vue'
import AboutView from '@/views/AboutView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
  },
  {
    path: '/bird-recognition',
    name: ROUTE_NAMES.BIRD_RECOGNITION,
    component: () =>
      import(
        /* webpackChunkName: "bird-recognition-view" */ "../views/BirdRecognitionView.vue"
      ),
  },
  {
    path: '/map',
    name: ROUTE_NAMES.MAP,
    component: () =>
      import(
        /* webpackChunkName: "map-view" */ "../views/MapView.vue"
      ),
  },
  {
    path: '/privacy-policy',
    name: ROUTE_NAMES.PRIVACY_POLICY,
    component: () =>
      import(
        /* webpackChunkName: "privacy-policy-view" */ "../views/PrivacyPolicyView.vue"
      ),
  },
  {
    path: '/lexicon',
    name: ROUTE_NAMES.LEXICON,
    component: () =>
      import(
        /* webpackChunkName: "lexicon-list-view" */ "../views/LexiconListView.vue"
      ),
  },
  {
    path: '/lexiconDetail/:id',
    name: ROUTE_NAMES.LEXICON_DETAILS,
    component: LexiconDetail,
  },
  {
    path: '/dangerguide',
    name: ROUTE_NAMES.DANGER_GUIDE,
    component: () =>
      import(
        /* webpackChunkName: "danger-guide-view" */ "../views/DangerGuide.vue"
      ),
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
