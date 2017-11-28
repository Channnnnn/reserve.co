import Login from '@/views/login'
import Account from '@/views/account'
import Queue from '@/views/queuedetail'
import Settings from "@/views/setting";

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
  }
]