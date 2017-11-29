import Login from '@/views/login'
import Account from '@/views/account'
import Queue from '@/views/queuedetail'
import Settings from '@/views/setting'
import Shop from '@/views/shop'
import FormShop from '@/views/shopform'
import QueueShop from '@/views/shopqueue'

export default [
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
    component: Account
  },
  {
    path: '/queue:id',
    name: 'queue',
    component: Queue
  },
  {
    path: '/settings',
    name: 'settings',
    component: Settings
  },
  {
    path: '/shop:id',
    name: 'shop',
    component: Shop
  },
  {
    path: '/editshop',
    name: 'editshop',
    component: FormShop
  },
  {
    path: '/managequeue',
    name: 'managequeue',
    component: QueueShop
  },
  {
    path: '/setupshop',
    name: 'setupshop',
    component: FormShop
  }
]