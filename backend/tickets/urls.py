from django.urls import path
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .views import TicketListCreateView, TicketDetailView, ComentarioCreateView, ComentarioDetailView, ComentarioListView, RegistroView, MeView

urlpatterns = [
    path('tickets/', TicketListCreateView.as_view(), name='ticket-list-create'),
    path('tickets/<int:pk>/', TicketDetailView.as_view(), name='ticket-detail'),
    path('tickets/<int:ticket_id>/comentarios/', ComentarioCreateView.as_view(), name='comentario-create'),
    path('comentarios/<int:pk>/', ComentarioDetailView.as_view(), name='comentario-detail'),
    path('comentarios/', ComentarioListView.as_view(), name='comentario-list'),
    path('registro/', RegistroView.as_view(), name='registro'),
    path('login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('me/', MeView.as_view(), name='me'),  # endpoint para obtener datos del usuario autenticado
]