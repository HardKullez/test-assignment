import axios from 'axios'

export async function fetchUsers() {
  try {
    const { data } = await axios.get('https://jsonplaceholder.typicode.com/users')

    return data
  } catch (e) {
    // not going deep into interceptors or handling error here
    return []
  }
}
