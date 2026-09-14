
import client from './client';

export const getTickets = (filters = {}) => {
  return client.get('/tickets/', { params: filters });
};

export const getTicket = (id) => {
  return client.get(`/tickets/${id}/`);
};

export const createTicket = (data) => {
  return client.post('/tickets/', data);
};

export const updateTicket = (id, data) => {
  return client.patch(`/tickets/${id}/`, data);
};

export const deleteTicket = (id) => {
  return client.delete(`/tickets/${id}/`);
};

export const getComentarios = (ticketId) => {
  return client.get(`/tickets/${ticketId}/comentarios/`);
};

export const createComentario = (ticketId, data) => {
  return client.post(`/tickets/${ticketId}/comentarios/`, data);
};