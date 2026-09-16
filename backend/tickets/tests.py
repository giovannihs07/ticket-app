
"""
Pruebas automaticas para el sistema de tickets.

Como correrlas:
    python manage.py test                     -> todas
    python manage.py test tickets.tests.RegistroTests   -> solo una clase
"""

from django.contrib.auth.models import User
from rest_framework import status
from rest_framework.test import APITestCase

from .models import Ticket, Perfil


class BaseTicketTestCase(APITestCase):
    """Clase base: crea un Agente y dos Solicitantes reutilizables."""

    def setUp(self):
        self.agente = User.objects.create_user(username='agente1', password='clave12345')
        self.agente.perfil.rol = Perfil.Rol.AGENTE
        self.agente.perfil.save()

        # SOLICITANTE por defecto, no hace falta tocarlo.
        self.solicitante = User.objects.create_user(username='sol1', password='clave12345')
        self.otro_solicitante = User.objects.create_user(username='sol2', password='clave12345')

class RegistroTests(APITestCase):
    """POST /api/registro/"""

    def test_registro_exitoso_asigna_rol_solicitante_por_defecto(self):
        data = {'username': 'nuevo', 'email': 'nuevo@test.com', 'password': 'clave12345'}
        response = self.client.post('/api/registro/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='nuevo')
        self.assertEqual(user.perfil.rol, Perfil.Rol.SOLICITANTE)

    def test_registro_permite_elegir_rol_agente(self):
        data = {'username': 'jefe', 'password': 'clave12345', 'rol': Perfil.Rol.AGENTE}
        response = self.client.post('/api/registro/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        user = User.objects.get(username='jefe')
        self.assertEqual(user.perfil.rol, Perfil.Rol.AGENTE)

    def test_registro_rechaza_username_duplicado(self):
        User.objects.create_user(username='repetido', password='clave12345')
        data = {'username': 'repetido', 'password': 'clave12345'}
        response = self.client.post('/api/registro/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('username', response.data)

    def test_registro_rechaza_sin_password(self):
        response = self.client.post('/api/registro/', {'username': 'sinpass'})
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class TicketPermissionTests(BaseTicketTestCase):
    """Un usuario anonimo no debe poder tocar /api/tickets/."""

    def test_listar_tickets_sin_autenticar_devuelve_401(self):
        response = self.client.get('/api/tickets/')
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_crear_ticket_sin_autenticar_devuelve_401(self):
        data = {'titulo': 'x', 'descripcion': 'y', 'categoria': 'z'}
        response = self.client.post('/api/tickets/', data)
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)


class TicketCreateTests(BaseTicketTestCase):

    def test_solicitante_crea_ticket_con_prioridad_sugerida(self):
        self.client.force_authenticate(user=self.solicitante)
        data = {
            'titulo': 'Impresora no funciona',
            'descripcion': 'No imprime en el piso 3',
            'categoria': 'Hardware',
            'prioridad': Ticket.Prioridad.ALTA,
        }
        response = self.client.post('/api/tickets/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)

        ticket = Ticket.objects.get(id=response.data['id'])
        self.assertEqual(ticket.creado_por, self.solicitante)
        self.assertEqual(ticket.prioridad, Ticket.Prioridad.ALTA)
        self.assertEqual(ticket.estado, Ticket.Estado.ABIERTO)  # valor por defecto

    def test_crear_ticket_sin_titulo_devuelve_400_con_detalle_del_campo(self):
        self.client.force_authenticate(user=self.solicitante)
        data = {'descripcion': 'sin titulo', 'categoria': 'Hardware'}
        response = self.client.post('/api/tickets/', data)
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertIn('titulo', response.data)


class TicketListTests(BaseTicketTestCase):

    def setUp(self):
        super().setUp()
        self.ticket_sol1 = Ticket.objects.create(
            titulo='T1', descripcion='d', categoria='c', creado_por=self.solicitante,
        )
        self.ticket_sol2 = Ticket.objects.create(
            titulo='T2', descripcion='d', categoria='c', creado_por=self.otro_solicitante,
        )

    def test_solicitante_solo_ve_sus_propios_tickets(self):
        self.client.force_authenticate(user=self.solicitante)
        response = self.client.get('/api/tickets/')
        ids = [t['id'] for t in response.data]
        self.assertIn(self.ticket_sol1.id, ids)
        self.assertNotIn(self.ticket_sol2.id, ids)

    def test_agente_ve_todos_los_tickets(self):
        self.client.force_authenticate(user=self.agente)
        response = self.client.get('/api/tickets/')
        ids = [t['id'] for t in response.data]
        self.assertIn(self.ticket_sol1.id, ids)
        self.assertIn(self.ticket_sol2.id, ids)

    def test_filtro_por_estado(self):
        Ticket.objects.create(
            titulo='Cerrado', descripcion='d', categoria='c',
            creado_por=self.solicitante, estado=Ticket.Estado.CERRADO,
        )
        self.client.force_authenticate(user=self.solicitante)
        response = self.client.get('/api/tickets/?estado=CERRADO')
        self.assertTrue(all(t['estado'] == 'CERRADO' for t in response.data))
        self.assertEqual(len(response.data), 1)


class TicketDetailTests(BaseTicketTestCase):

    def setUp(self):
        super().setUp()
        self.ticket = Ticket.objects.create(
            titulo='T1', descripcion='d', categoria='c', creado_por=self.solicitante,
        )

    def test_solicitante_no_puede_ver_ticket_ajeno(self):
        self.client.force_authenticate(user=self.otro_solicitante)
        response = self.client.get(f'/api/tickets/{self.ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)

    def test_agente_puede_ver_cualquier_ticket(self):
        self.client.force_authenticate(user=self.agente)
        response = self.client.get(f'/api/tickets/{self.ticket.id}/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)

    def test_ticket_inexistente_devuelve_404(self):
        self.client.force_authenticate(user=self.agente)
        response = self.client.get('/api/tickets/9999/')
        self.assertEqual(response.status_code, status.HTTP_404_NOT_FOUND)


class TicketUpdateTests(BaseTicketTestCase):
    """
    Nota de diseno: hoy TicketDetailView no restringe quien puede cambiar
    estado/prioridad (no hay un perform_update sobreescrito), asi que tanto
    el Agente como el Solicitante pueden actualizarlos. Estos tests
    documentan el comportamiento real del sistema tal como esta hoy.
    """

    def setUp(self):
        super().setUp()
        self.ticket = Ticket.objects.create(
            titulo='T1', descripcion='d', categoria='c',
            creado_por=self.solicitante, prioridad=Ticket.Prioridad.MEDIA,
        )

    def test_agente_puede_cambiar_estado_y_prioridad(self):
        self.client.force_authenticate(user=self.agente)
        response = self.client.patch(
            f'/api/tickets/{self.ticket.id}/',
            {'estado': Ticket.Estado.EN_PROGRESO, 'prioridad': Ticket.Prioridad.ALTA},
        )
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.estado, Ticket.Estado.EN_PROGRESO)
        self.assertEqual(self.ticket.prioridad, Ticket.Prioridad.ALTA)

    def test_solicitante_no_puede_cambiar_estado(self):
        self.client.force_authenticate(user=self.solicitante)
        response = self.client.patch(
            f'/api/tickets/{self.ticket.id}/', {'estado': Ticket.Estado.CERRADO},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.estado, Ticket.Estado.ABIERTO)

    def test_solicitante_no_puede_cambiar_prioridad(self):
        self.client.force_authenticate(user=self.solicitante)
        response = self.client.patch(
            f'/api/tickets/{self.ticket.id}/', {'prioridad': Ticket.Prioridad.ALTA},
        )
        self.assertEqual(response.status_code, status.HTTP_403_FORBIDDEN)
        self.ticket.refresh_from_db()
        self.assertEqual(self.ticket.prioridad, Ticket.Prioridad.MEDIA)


class ComentarioTests(BaseTicketTestCase):

    def setUp(self):
        super().setUp()
        self.ticket = Ticket.objects.create(
            titulo='T1', descripcion='d', categoria='c', creado_por=self.solicitante,
        )

    def test_agregar_comentario_a_ticket(self):
        self.client.force_authenticate(user=self.solicitante)
        data = {'titulo': 'Actualizacion', 'descripcion': 'Se reviso el equipo'}
        response = self.client.post(f'/api/tickets/{self.ticket.id}/comentarios/', data)
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(self.ticket.comentarios.count(), 1)

    def test_comentario_queda_asociado_al_ticket_correcto(self):
        otro_ticket = Ticket.objects.create(
            titulo='T2', descripcion='d', categoria='c', creado_por=self.solicitante,
        )
        self.client.force_authenticate(user=self.solicitante)
        self.client.post(
            f'/api/tickets/{self.ticket.id}/comentarios/',
            {'titulo': 'a', 'descripcion': 'b'},
        )
        response = self.client.get(f'/api/tickets/{otro_ticket.id}/comentarios/')
        self.assertEqual(len(response.data), 0)


class HealthCheckTests(APITestCase):
    """GET /api/health/"""

    def test_health_check_retorna_200(self):
        response = self.client.get('/api/health/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(response.data, {'status': 'ok'})

