import Login from '@/views/login'
import Account from '@/views/account'
import Queue from '@/views/queuedetail'
import Settings from '@/views/setting'
import Shop from '@/views/shop'
import FormShop from '@/views/shopform'
import QueueShop from '@/views/shopqueue'
import NotFound from '@/views/404'
import Session from '@/views/session'

export default [
  { path: '*', component: NotFound},
  {
    path: '/',
    name: 'home',
    component: Login,
  },
  {
    path: '/login',
    name: 'login',
    component: Login
  },
  {
    path: '/account',
    name: 'account',
    component: Account,
    meta: { requiresAuth: true }
  },
  {
    path: '/queue/:qid',
    name: 'queue',
    component: Queue
  },
  {
    path: '/account/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/:id/edit',
    name: 'editshop',
    component: FormShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/:id/managequeue',
    name: 'managequeue',
    component: QueueShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/account/setupshop',
    name: 'setupshop',
    component: FormShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeout',
    name: 'session',
    component: Session
  },
  {
    path: '/:id',
    name: 'shop',
    component: Shop,
  },
]