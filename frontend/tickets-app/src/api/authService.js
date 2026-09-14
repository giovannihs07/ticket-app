import client from './client'

export const login = (credentials) =>
  client.post('/auth/login/', credentials)

export const register = (data) =>
  client.post('/auth/register/', data)

export const getCurrentUser = () =>
  client.get('/auth/me/')

export const logout = () =>
  client.post('/auth/logout/')
