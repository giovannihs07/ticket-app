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
    """GET /api/tickets/<id>/   -> detalle
       PATCH /api/tickets/<id>/ -> actualizar estado/prioridad"""
    queryset = Ticket.objects.all()
    serializer_class = TicketSerializer


class ComentarioCreateView(generics.CreateAPIView):
    """POST /api/tickets/<ticket_id>/comentarios/ -> agregar comentario"""
    serializer_class = ComentarioSerializer

    def perform_create(self, serializer):
        serializer.save(ticket_id=self.kwargs['ticket_id'])
