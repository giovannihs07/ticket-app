from rest_framework import generics, permissions
from .models import Ticket, Comentario, Perfil
from .serializers import TicketSerializer, ComentarioSerializer, RegistroSerializer, UserSerializer
from .filters import TicketFilter
from django.contrib.auth.models import User


class TicketListCreateView(generics.ListCreateAPIView):
    """GET /api/tickets/  -> listar (con filtros)
       POST /api/tickets/ -> crear"""
    serializer_class = TicketSerializer
    filterset_class = TicketFilter

    permission_classes = [permissions.IsAuthenticated]
 
    def get_queryset(self):
        user = self.request.user
        if user.perfil.rol == Perfil.Rol.AGENTE:
            return Ticket.objects.all()
        return Ticket.objects.filter(creado_por=user)
 
    def perform_create(self, serializer):
        serializer.save(creado_por=self.request.user)


class TicketDetailView(generics.RetrieveUpdateDestroyAPIView):
    """GET /api/tickets/<id>/   -> detalle del ticket
       PATCH /api/tickets/<id>/ -> actualizar ticket por estado o prioridad"""
    
    serializer_class = TicketSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def get_queryset(self):
        user = self.request.user
        if user.perfil.rol == Perfil.Rol.AGENTE:
            return Ticket.objects.all()
        return Ticket.objects.filter(creado_por=user)

class ComentarioCreateView(generics.ListCreateAPIView):
    """POST /api/tickets/<ticket_id>/comentarios/ -> agregar comentario"""
    serializer_class = ComentarioSerializer

    def get_queryset(self):
        return Comentario.objects.filter(ticket_id=self.kwargs['ticket_id'])

    def perform_create(self, serializer):
        serializer.save(ticket_id=self.kwargs['ticket_id'])

class ComentarioDetailView(generics.RetrieveUpdateDestroyAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class ComentarioListView(generics.ListAPIView):
    queryset = Comentario.objects.all()
    serializer_class = ComentarioSerializer

class RegistroView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = RegistroSerializer
    permission_classes = [permissions.AllowAny]  # cualquiera puede registrarse, sin login

class MeView(generics.RetrieveAPIView):
    """GET /api/me/ -> datos del usuario autenticado (id, username, email, role)"""
    serializer_class = UserSerializer
    permission_classes = [permissions.IsAuthenticated]
 
    def get_object(self):
        return self.request.user