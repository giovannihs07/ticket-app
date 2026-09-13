from rest_framework import serializers
from .models import Ticket, Comentario


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'titulo', 'descripcion', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


class TicketSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)

    class Meta:
        model = Ticket
        fields = ['id', 'titulo', 'descripcion', 'categoria',
                  'prioridad', 'estado', 'created_at', 'updated_at', 'comentarios']
        read_only_fields = ['id', 'created_at', 'updated_at']