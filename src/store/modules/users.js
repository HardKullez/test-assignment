import { fetchUsers } from '../../services/api'

const mutationTypes = {
  SET_USERS: 'SET_USERS',
  ADD_USERS: 'ADD_USERS',
  REMOVE_USERS: 'REMOVE_USERS',
  SET_LOADING_STATUS: 'SET_LOADING_STATUS'
}

function isUserStateMutation(mutationType) {
  return [mutationTypes.SET_USERS, mutationTypes.ADD_USERS, mutationTypes.REMOVE_USERS].some(
    type => mutationType === 'users/' + type
  )
}

export function userStateInterceptor(mutation, state) {
  if (isUserStateMutation(mutation.type)) {
    localStorage.setItem('users', JSON.stringify(state.users.users))
  }
}

export default {
  namespaced: true,
  state: () => ({
    users: [],
    isLoading: false
  }),
  getters: {
    getUsersByQuery: state => query => {
      // implementing simple search
      const normalizedQuery = query.toLowerCase()

      const filteredUsers = state.users.filter(
        ({ name, email, phone }) =>
          name.toLowerCase().includes(normalizedQuery) ||
          email.toLowerCase().includes(normalizedQuery) ||
          phone.toString().toLowerCase().includes(normalizedQuery)
      )

      return filteredUsers
    }
  },
  mutations: {
    [mutationTypes.SET_USERS](state, users) {
      state.users = users
    },
    [mutationTypes.ADD_USERS](state, users) {
      state.users.push(...users)
    },
    [mutationTypes.REMOVE_USERS](state, ids) {
      const userIds = new Set(ids)

      state.users = state.users.filter(user => !userIds.has(user.id))
    },
    [mutationTypes.SET_LOADING_STATUS](state, status) {
      state.isLoading = status
    }
  },
  actions: {
    async getUsers({ commit, state: { isLoading } }) {
      if (isLoading) return

      let users = JSON.parse(localStorage.getItem('users'))

      if (!users || !users.length) {
        commit(mutationTypes.SET_LOADING_STATUS, true)
        users = await fetchUsers()
        commit(mutationTypes.SET_LOADING_STATUS, false)
      }

      commit('SET_USERS', users)
    },
    async addUsers({ commit, state }, userOrUsers) {
      // in case of we don't have actual backend with db, emulate id's
      let lastUserId = state.users.at(-1)?.id ?? 1

      const users = [userOrUsers].flat().map(user => {
        const id = user.id ?? ++lastUserId

        return {
          id,
          ...user
        }
      })

      commit('ADD_USERS', users)
    },
    async removeUsers({ commit }, idOrIds) {
      const ids = [idOrIds].flat()

      commit('REMOVE_USERS', ids)
    }
  }
}
