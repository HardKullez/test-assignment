<template>
  <div class="md:container md:mx-auto sm:py-10 py-4">
    <AddUserForm @addRecord="addRecords" />

    <div class="overflow-x-auto relative shadow-md sm:rounded-lg mx-2 my-5">
      <table class="w-full text-sm text-left text-gray-500 dark:text-gray-400">
        <thead class="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" class="py-3 px-6">
              <div class="flex items-center">
                <input
                  @click="selectAllRecords"
                  :checked="users.length && areAllRecordsSelected"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </th>
            <th scope="col" class="py-3 px-6 cursor-pointer hover:bg-gray-200" @click="ascOrder = !ascOrder">
              <div class="flex justify-between items-center">
                Name
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  class="ml-1 w-3 h-3"
                  aria-hidden="true"
                  fill="currentColor"
                  viewBox="0 0 320 512"
                >
                  <path
                    d="M27.66 224h264.7c24.6 0 36.89-29.78 19.54-47.12l-132.3-136.8c-5.406-5.406-12.47-8.107-19.53-8.107c-7.055 0-14.09 2.701-19.45 8.107L8.119 176.9C-9.229 194.2 3.055 224 27.66 224zM292.3 288H27.66c-24.6 0-36.89 29.77-19.54 47.12l132.5 136.8C145.9 477.3 152.1 480 160 480c7.053 0 14.12-2.703 19.53-8.109l132.3-136.8C329.2 317.8 316.9 288 292.3 288z"
                  />
                </svg>
              </div>
            </th>
            <th scope="col" class="py-3 px-6">Email</th>
            <th scope="col" class="py-3 px-6">Phone</th>
          </tr>
        </thead>
        <tbody>
          <tr
            v-for="user in sortedUsers"
            :key="user.id"
            class="bg-white border-b hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
          >
            <td class="py-4 px-6">
              <div class="flex items-center">
                <input
                  v-model="selectedUserIds"
                  :value="user.id"
                  type="checkbox"
                  class="w-4 h-4 text-blue-600 bg-gray-100 rounded border-gray-300 focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </div>
            </td>
            <td class="py-4 px-6">{{ user.name }}</td>
            <td class="py-4 px-6">{{ user.email }}</td>
            <td class="py-4 px-6">{{ user.phone }}</td>
          </tr>
          <tr
            v-if="isLoading || !users.length"
            class="bg-white border-b hover:bg-gray-50 dark:bg-gray-900 dark:border-gray-700"
          >
            <td class="py-4 px-6 text-center" colspan="4">No data</td>
          </tr>
        </tbody>
      </table>
    </div>

    <div class="flex flex-col sm:grid gap-6 py-6 px-2 sm:grid-cols-3">
      <BaseButton class="w-full" @click="removeSelectedRecords">Delete</BaseButton>
      <div class="col-span-2 flex items-center">
        <div class="relative w-full">
          <div class="flex absolute inset-y-0 left-0 items-center pl-3 pointer-events-none">
            <svg
              aria-hidden="true"
              class="w-5 h-5 text-gray-500 dark:text-gray-400"
              fill="currentColor"
              viewBox="0 0 20 20"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                fill-rule="evenodd"
                d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                clip-rule="evenodd"
              ></path>
            </svg>
          </div>
          <div class="pl-10">
            <BaseInput
              v-model.trim="searchQuery"
              type="text"
              placeholder="Search for Users"
              area-label="Search"
              name="Search"
              class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            />
          </div>
        </div>
        <div
          class="relative w-1/3 text-center py-2.5 px-3 ml-2 text-sm font-medium text-white bg-gray-500 rounded-lg border border-gray-500 min-w-max"
        >
          Users found: {{ users.length }}
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import BaseButton from '../base/BaseButton.vue'
import BaseInput from '../base/BaseInput.vue'
import AddUserForm from './AddUserForm.vue'
import { mapActions, mapGetters, mapState } from 'vuex'

export default {
  components: {
    AddUserForm,
    BaseButton,
    BaseInput
  },
  data() {
    return {
      selectedUserIds: new Set(),
      searchQuery: null,
      ascOrder: true
    }
  },
  created() {
    this.getUsers()
  },
  methods: {
    selectRecord(id) {
      if (this.selectedUserIds.has(id)) {
        this.selectedUserIds.delete(id)

        return
      }

      this.selectedUserIds.add(id)
    },
    selectAllRecords() {
      if (this.areAllRecordsSelected) {
        this.selectedUserIds.clear()
        return
      }

      this.selectedUserIds = new Set(this.users.map(user => user.id))
    },
    addRecords(users) {
      this.addUsers(users)
      this.searchQuery = null
    },
    removeSelectedRecords() {
      this.removeUsers([...this.selectedUserIds])
      this.selectedUserIds.clear()
    },
    ...mapActions('users', {
      getUsers: 'getUsers',
      addUsers: 'addUsers',
      removeUsers: 'removeUsers'
    })
  },
  computed: {
    areAllRecordsSelected() {
      return this.users.length === this.selectedUserIds.size
    },
    users() {
      if (!this.searchQuery) {
        return this.storeUsers
      }

      return this.getUsersByQuery(this.searchQuery)
    },
    sortedUsers() {
      const sortedUsers = [...this.users].sort((a, b) => a.name.localeCompare(b.name))

      return this.ascOrder ? sortedUsers : sortedUsers.reverse()
    },
    ...mapGetters('users', {
      getUsersByQuery: 'getUsersByQuery'
    }),
    ...mapState('users', {
      storeUsers: 'users',
      isLoading: 'isLoading'
    })
  },
  watch: {
    searchQuery() {
      this.selectedUserIds.clear()
    }
  }
}
</script>
