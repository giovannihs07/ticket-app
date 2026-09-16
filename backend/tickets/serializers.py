from rest_framework import serializers
from .models import Ticket, Comentario, Perfil
from django.contrib.auth.models import User


class ComentarioSerializer(serializers.ModelSerializer):
    class Meta:
        model = Comentario
        fields = ['id', 'titulo', 'descripcion', 'fecha_registro']
        read_only_fields = ['id', 'fecha_registro']


class TicketSerializer(serializers.ModelSerializer):
    comentarios = ComentarioSerializer(many=True, read_only=True)
    creado_por = serializers.SerializerMethodField()

    class Meta:
        model = Ticket
        fields = ['id', 'titulo', 'descripcion', 'categoria',
                  'prioridad', 'estado', 'created_at', 'updated_at', 'comentarios']
        read_only_fields = ['id', 'created_at', 'updated_at']

    def get_creado_por(self, obj):
        return obj.creado_por.username if obj.creado_por else None

class RegistroSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    rol = serializers.ChoiceField(choices=Perfil.Rol.choices, default=Perfil.Rol.SOLICITANTE)

    class Meta:
        model = User
        fields = ['username', 'email', 'password', 'rol']

    def create(self, validated_data):
        rol = validated_data.pop('rol')
        user = User.objects.create_user(
            username=validated_data['username'],
            email=validated_data.get('email', ''),
            password=validated_data['password'],
        )
        user.perfil.rol = rol
        user.perfil.save()
        return user

class UserSerializer(serializers.ModelSerializer):
    """Representa al usuario autenticado hacia el frontend."""
    role = serializers.CharField(source='perfil.rol', read_only=True)
 
    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'role']