from django.core.management.base import BaseCommand
from django.contrib.auth.models import User
from tickets.models import Perfil, Ticket, Comentario


class Command(BaseCommand):
    help = "Puebla la base de datos con usuarios de prueba (Admin, Agente, Solicitante) y tickets con comentarios."

    def add_arguments(self, parser):
        parser.add_argument(
            '--clear',
            action='store_true',
            help='Elimina tickets, comentarios y usuarios de prueba antes de poblar.',
        )

    def handle(self, *args, **options):
        self.stdout.write(self.style.NOTICE("Iniciando población de datos (seed)..."))

        if options['clear']:
            self.stdout.write("Limpiando datos anteriores...")
            Comentario.objects.all().delete()
            Ticket.objects.all().delete()
            User.objects.filter(username__in=['admin', 'agente1', 'solicitante1', 'solicitante2']).delete()
            self.stdout.write(self.style.WARNING("Datos anteriores eliminados."))

        usuarios_creados = {}

        admin_user, created = User.objects.get_or_create(
            username='admin',
            defaults={
                'email': 'admin@tickets.local',
                'is_staff': True,
                'is_superuser': True,
            }
        )
        admin_user.set_password('admin123')
        admin_user.save()
        # Asegurar rol AGENTE
        admin_user.perfil.rol = Perfil.Rol.AGENTE
        admin_user.perfil.save()
        usuarios_creados['admin'] = ('admin', 'admin123', 'Superusuario / Agente')

        # Agente de soporte
        agente1, created = User.objects.get_or_create(
            username='agente1',
            defaults={'email': 'agente1@tickets.local'}
        )
        agente1.set_password('agente123')
        agente1.save()
        agente1.perfil.rol = Perfil.Rol.AGENTE
        agente1.perfil.save()
        usuarios_creados['agente1'] = ('agente1', 'agente123', 'Agente de Soporte')

        # Solicitante 1
        sol1, created = User.objects.get_or_create(
            username='solicitante1',
            defaults={'email': 'solicitante1@tickets.local'}
        )
        sol1.set_password('sol123')
        sol1.save()
        sol1.perfil.rol = Perfil.Rol.SOLICITANTE
        sol1.perfil.save()
        usuarios_creados['solicitante1'] = ('solicitante1', 'sol123', 'Solicitante')

        # Solicitante 2
        sol2, created = User.objects.get_or_create(
            username='solicitante2',
            defaults={'email': 'solicitante2@tickets.local'}
        )
        sol2.set_password('sol123')
        sol2.save()
        sol2.perfil.rol = Perfil.Rol.SOLICITANTE
        sol2.perfil.save()
        usuarios_creados['solicitante2'] = ('solicitante2', 'sol123', 'Solicitante')

        # 2. Crear Tickets y Comentarios
        tickets_data = [
            {
                'titulo': 'Falla en la impresora del segundo piso',
                'descripcion': 'La impresora láser principal marca atasco de papel continuo y no permite enviar trabajos desde contabilidad.',
                'categoria': 'Hardware',
                'prioridad': Ticket.Prioridad.ALTA,
                'estado': Ticket.Estado.EN_PROGRESO,
                'creado_por': sol1,
                'comentarios': [
                    ('Revisión inicial', 'Se envió técnico a revisar los rodillos de alimentación.'),
                    ('Actualización de repuesto', 'Se requiere cambio del rodillo de tracción. Repuesto solicitado a compras.'),
                ]
            },
            {
                'titulo': 'Error al exportar reportes mensuales a Excel',
                'descripcion': 'Al intentar descargar el consolidado del mes de agosto, el sistema arroja un error 500 en la plataforma interna.',
                'categoria': 'Software',
                'prioridad': Ticket.Prioridad.MEDIA,
                'estado': Ticket.Estado.ABIERTO,
                'creado_por': sol1,
                'comentarios': [
                    ('Diagnóstico en curso', 'Se identificó un timeout por volumen de registros. Se optimizará la consulta SQL.'),
                ]
            },
            {
                'titulo': 'Intermitencia en la red Wi-Fi de la sala de juntas',
                'descripcion': 'Durante las videoconferencias la señal se cae cada 10 minutos desconectando a los participantes.',
                'categoria': 'Redes',
                'prioridad': Ticket.Prioridad.ALTA,
                'estado': Ticket.Estado.CERRADO,
                'creado_por': sol2,
                'comentarios': [
                    ('Inspección de Access Point', 'Se detectó saturación de canal en la banda de 2.4 GHz.'),
                    ('Solución aplicada', 'Se reconfiguró el AP para forzar banda 5 GHz y se actualizó el firmware. Conexión estable confirmada.'),
                ]
            },
            {
                'titulo': 'Solicitud de acceso VPN para teletrabajo',
                'descripcion': 'Requiero configuración de cliente VPN y credenciales para conectarme desde casa los días viernes.',
                'categoria': 'Accesos',
                'prioridad': Ticket.Prioridad.BAJA,
                'estado': Ticket.Estado.ABIERTO,
                'creado_por': sol2,
                'comentarios': []
            },
            {
                'titulo': 'Monitor adicional no detecta señal HDMI',
                'descripcion': 'El segundo monitor parpadea en negro de forma intermitente cuando se conecta a la base USB-C.',
                'categoria': 'Hardware',
                'prioridad': Ticket.Prioridad.MEDIA,
                'estado': Ticket.Estado.EN_PROGRESO,
                'creado_por': sol1,
                'comentarios': [
                    ('Prueba de cable', 'Se probó con cable nuevo y el problema persiste. Se cambiará el dock USB-C.'),
                ]
            },
        ]

        tickets_creados = 0
        comentarios_creados = 0

        for t_info in tickets_data:
            ticket, created = Ticket.objects.get_or_create(
                titulo=t_info['titulo'],
                defaults={
                    'descripcion': t_info['descripcion'],
                    'categoria': t_info['categoria'],
                    'prioridad': t_info['prioridad'],
                    'estado': t_info['estado'],
                    'creado_por': t_info['creado_por'],
                }
            )
            if created:
                tickets_creados += 1
                for titulo_com, desc_com in t_info['comentarios']:
                    Comentario.objects.create(
                        ticket=ticket,
                        titulo=titulo_com,
                        descripcion=desc_com,
                    )
                    comentarios_creados += 1

        # Resumen en consola
        self.stdout.write(self.style.SUCCESS("\n¡Base de datos poblada exitosamente!"))
        self.stdout.write(self.style.SUCCESS(f"Tickets creados: {tickets_creados} | Comentarios creados: {comentarios_creados}"))
        self.stdout.write("\n" + "=" * 60)
        self.stdout.write("USUARIOS DE PRUEBA DISPONIBLES:")
        self.stdout.write("=" * 60)
        for user, (username, password, rol) in usuarios_creados.items():
            self.stdout.write(f"Usuario: {username:<14} Clave: {password:<12} Rol: {rol}")
        self.stdout.write("=" * 60 + "\n")
