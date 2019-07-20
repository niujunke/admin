import { on } from '@/libs/tools'
import store from '@/store'
export default {
  inserted: (el, binding, vnode) => {
    if (store.state.user.userLoginInfo.isSuperMan) {
      return true
    }
    let routerName = vnode.context.$route.name
    let privilegeList = store.getters.hasBtnPrivlege(routerName, binding.value)
    if (privilegeList[routerName] && privilegeList[routerName].includes(binding.value)) {
      return true
    }
    el.remove(el)
  }
}
