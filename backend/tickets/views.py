from rest_framework import generics
from .models import Ticket, Comentario
from .serializers import TicketSerializer, ComentarioSerializer
from .filters import TicketFilter


class TicketListCreateView(generics.ListCreateAPIView):
    """GET /api/tickets/  -> listar (con filtros)
       POST /api/tickets/ -> crear"""
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer
    filterset_class = TicketFilter


class TicketDetailView(generics.RetrieveUpdateAPIView):
    """GET /api/tickets/<id>/   -> detalle del ticket
       PATCH /api/tickets/<id>/ -> actualizar ticket por estado o prioridad"""
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer

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
