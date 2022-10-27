import { createStore } from 'vuex'

import modules from './modules'
import { userStateInterceptor } from './modules/users'

const store = createStore({
  modules,
  strict: import.meta.env.DEV
})

store.subscribe(userStateInterceptor)

export { store }
