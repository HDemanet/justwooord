import axios from 'axios'

const authClient = axios.create({
  baseURL: '/',
  headers: { 'Content-Type': 'application/json' }
})

export const signIn = async (email, password) => {
  const response = await authClient.post('/users/sign_in', {
    user: { email, password }
  })
  const token = response.headers['authorization']?.replace('Bearer ', '')
  if (token) localStorage.setItem('jwt_token', token)
  return response.data
}

export const signOut = async () => {
  const token = localStorage.getItem('jwt_token')
  await authClient.delete('/users/sign_out', {
    headers: { Authorization: `Bearer ${token}` }
  })
  localStorage.removeItem('jwt_token')
}

export const signUp = async (email, name, password) => {
  const response = await authClient.post('/users', {
    user: { email, name, password }
  })
  return response.data
}
