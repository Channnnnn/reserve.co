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
    name: 'home'
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
    path: '/queue:id',
    name: 'queue',
    component: Queue
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings,
    meta: { requiresAuth: true }
  },
  {
    path: '/shop:id',
    name: 'shop',
    component: Shop,
  },
  {
    path: '/editshop',
    name: 'editshop',
    component: FormShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/managequeue',
    name: 'managequeue',
    component: QueueShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/setupshop',
    name: 'setupshop',
    component: FormShop,
    meta: { requiresAuth: true }
  },
  {
    path: '/timeout',
    name: 'session',
    component: Session
  }
]