from django.urls import path
from .views import TicketListCreateView, TicketDetailView, ComentarioCreateView, ComentarioDetailView, ComentarioListView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/comentarios/', ComentarioCreateView.as_view(), name='comentario-create'),
    path('comentarios/<int:pk>/', ComentarioDetailView.as_view(), name='comentario-detail'),
    path('comentarios/', ComentarioListView.as_view(), name='comentario-list'),
]