import client from './client'

export const login = (credentials) =>
  client.post('/login/', credentials)

export const register = (data) =>
  client.post('registro/', data)

export const getCurrentUser = () =>
  client.get('/me/')

