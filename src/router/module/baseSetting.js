import Main from '@/components/main'
// 基础设置
export const baseSetting = [
  {
    path: '/person',
    name: 'person',
    component: Main,
    meta: {
      title: '人员管理',
      icon: 'md-people',
      showAlways: true,
      parentRouterKey: 'baseSetting'
    },
    children: [
      //  角色管理页面路由
      {
        path: 'memberManage',
        name: 'memberManage',
        meta: {
          title: '会员管理',
          icon: 'ios-person-add'
        },
        component: () => import('@/view/baseSetting/memberManage/index.vue')
      },
      {
        path: 'roleIndex',
        name: 'roleIndex',
        meta: {
          title: '角色管理',
          icon: 'md-options'
        },
        component: () => import('@/view/baseSetting/role/roleIndex.vue')
      },
      // 人员管理页面路由
      {
        path: 'department',
        name: 'department',
        meta: {
          title: '员工管理',
          icon: 'ios-person-add'
        },
        component: () => import('@/view/baseSetting/department/departmentList.vue')
      },

      // 菜单管理
      {
        path: 'privilegeMain',
        name: 'privilegeMain',
        meta: {
          title: '菜单管理',
          icon: 'md-menu',
          btnBox: [
          ]
        },
        component: () => import('@/view/baseSetting/privilege/privilegeMain.vue')
      }
    ]
  },
  {
    path: '/system',
    name: 'system',
    component: Main,
    meta: {
      title: '系统设置',
      icon: 'ios-speedometer-outline',
      parentRouterKey: 'baseSetting'
    },

    children: [
      {
        path: 'systemParams',
        name: 'systemParams',
        meta: {
          title: '系统参数',
          icon: 'ios-construct'
        },
        component: () => import('@/view/baseSetting/system/systemParams/systemParams.vue')
      }
    ]
  }
]
