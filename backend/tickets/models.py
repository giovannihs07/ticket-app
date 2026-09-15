from django.db import models
from django.contrib.auth.models import User
from django.db.models.signals import post_save
from django.dispatch import receiver

class Perfil(models.Model):
    class Rol(models.TextChoices):
        AGENTE = 'AGENTE', 'Agente'
        SOLICITANTE = 'SOLICITANTE', 'Solicitante'

    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='perfil')
    rol = models.CharField(max_length=20, choices=Rol.choices, default=Rol.SOLICITANTE)

    def __str__(self):
        return f"{self.user.username} ({self.rol})"

class Ticket(models.Model):
    class Prioridad(models.TextChoices):
        BAJA = 'BAJA', 'Baja'
        MEDIA = 'MEDIA', 'Media'
        ALTA = 'ALTA', 'Alta'

    class Estado(models.TextChoices):
        ABIERTO = 'ABIERTO', 'Abierto'
        EN_PROGRESO = 'EN_PROGRESO', 'En progreso'
        CERRADO = 'CERRADO', 'Cerrado'

    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    categoria = models.CharField(max_length=100)
    prioridad = models.CharField(max_length=10, choices=Prioridad.choices, default=Prioridad.MEDIA)
    estado = models.CharField(max_length=20, choices=Estado.choices, default=Estado.ABIERTO)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    creado_por = models.ForeignKey(
        User, 
        on_delete=models.CASCADE, 
        related_name='tickets_creados',
        null=True, blank=True 
    )

    def __str__(self):
        return f"[{self.id}] {self.titulo}"


class Comentario(models.Model):
    ticket = models.ForeignKey(Ticket, on_delete=models.CASCADE, related_name='comentarios')
    titulo = models.CharField(max_length=200)
    descripcion = models.TextField()
    fecha_registro = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"Comentario #{self.id} de Ticket {self.ticket_id}"

@receiver(post_save, sender=User)
def crear_perfil_automatico(sender, instance, created, **kwargs):
    """Crea un Perfil automáticamente cada vez que se crea un User (incluye
    createsuperuser y el panel /admin/), para que nunca falte user.perfil."""
    if created and not hasattr(instance, 'perfil'):
        rol = Perfil.Rol.AGENTE if instance.is_superuser else Perfil.Rol.SOLICITANTE
        Perfil.objects.create(user=instance, rol=rol)
