import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)
import Layout from '@/layout'

export const constantRoutes = [
    {
      path: '/',
      component: Layout,
      redirect: '/airdrop',
      children: [
        {
          path: 'airdrop',
          component: () => import('@/views/airdrop/index'),
          name: 'airdrop',
          meta: { title: 'airdrop' }
        },
        {
          path: 'deposit',
          component: () => import('@/views/deposit/index'),
          name: 'deposit',
          meta: { title: 'deposit' },
         
        },
        {
          path: 'deposit/detail',
          component: () => import('@/views/deposit/detail'),
          name: 'DepositDetail',
          meta: { title: 'DepositDetail' }
        },
        {
          path: 'pledgeMint',
          component: () => import('@/views/pledgeMint/index'),
          name: 'pledgeMint',
          meta: { title: 'pledgeMint' }
        },
        {
          path: 'pledgeMint/detail',
          component: () => import('@/views/pledgeMint/detail'),
          name: 'pledgeDetail',
          meta: { title: 'pledgeDetail' }
        },
        {
          path: 'position',
          component: () => import('@/views/position/index'),
          name: 'position',
          meta: { title: 'position' }
        },
        {
          path: 'totalMinting',
          component: () => import('@/views/totalMinting/index'),
          name: 'totalMinting',
          meta: { title: 'totalMinting' }
        },
        {
          path: 'totalMinting/detail',
          component: () => import('@/views/totalMinting/detail'),
          name: 'MintDetail',
          meta: { title: 'MintDetail' }
        },
        {
          path: 'Liquidation',
          component: () => import('@/views/Liquidation/index'),
          name: 'Liquidation',
          meta: { title: 'Liquidation' }
        },
        {
          path: 'Claim',
          component: () => import('@/views/claim/index'),
          name: 'Claim',
          meta: { title: 'Claim' }
        },
        {
          path: 'transaction',
          component: () => import('@/views/transaction/index'),
          name: 'transaction',
          meta: { title: 'transaction' }
        },
      ]
    },
]

const createRouter = () => new Router({
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

export default router