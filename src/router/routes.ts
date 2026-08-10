import type { RouteRecordRaw } from 'vue-router'
import { ROUTE_NAMES } from './route-names.ts'
import HomeView from '@/views/HomeView.vue'
import TourGuidesView from '@/features/tours/TourGuidesView.vue'
import TourDetailView from '@/features/tours/TourDetailView.vue'

export const routes: RouteRecordRaw[] = [
  {
    path: '/',
    name: ROUTE_NAMES.HOME,
    component: HomeView,
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
    path: '/bird-recognition',
    name: ROUTE_NAMES.BIRD_RECOGNITION,
    component: () =>
      import(/* webpackChunkName: "bird-recognition-view" */ '../views/BirdRecognitionView.vue'),
  },
  {
    path: '/privacy-policy',
    name: ROUTE_NAMES.PRIVACY_POLICY,
    component: () =>
      import(/* webpackChunkName: "privacy-policy-view" */ '../views/PrivacyPolicyView.vue'),
  },
  {
    path: '/map',
    name: ROUTE_NAMES.MAP,
    component: () => import(/* webpackChunkName: "map-view" */ '../views/MapView.vue'),
  },
  {
    path: '/lexicon',
    name: ROUTE_NAMES.LEXICON,
    component: () =>
      import(/* webpackChunkName: "lexicon-list-view" */ '../views/LexiconListView.vue'),
  },
  {
    path: '/lexicon/:id',
    name: ROUTE_NAMES.LEXICON_DETAILS,
    component: () =>
      import(/* webpackChunkName: "lexicon-detail-view" */ '../views/LexiconDetailView.vue'),
  },
  {
    path: '/dangerguide',
    name: ROUTE_NAMES.DANGER_GUIDE,
    component: () => import(/* webpackChunkName: "danger-guide-view" */ '../views/DangerGuide.vue'),
  },
  {
    path: '/about',
    name: ROUTE_NAMES.ABOUT,
    component: () => import(/* webpackChunkName: "about-view" */ '../views/AboutView.vue'),
  },
  {
    path: '/bathing-spots',
    name: ROUTE_NAMES.BATHING_SPOTS,
    component: () =>
      import(/* webpackChunkName: "bathing-spots-view" */ '../views/BathingSpotsView.vue'),
  },
  /*FallBack !!!DO NOT REMOVE!!!*/
  {
    path: '/:pathMatch(.*)*',
    redirect: '/',
  },
]
