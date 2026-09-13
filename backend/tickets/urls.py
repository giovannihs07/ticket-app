from django.urls import path
from .views import TicketListCreateView, TicketDetailView, ComentarioCreateView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/comentarios/', ComentarioCreateView.as_view(), name='comentario-create'),
]