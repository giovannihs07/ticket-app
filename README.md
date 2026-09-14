# Mini Sistema de Tickets

Sistema interno para registrar y gestionar tickets de soporte, con backend en Django (API REST) y frontend en React (Vite).

## Tecnologías

- **Backend:** Python 3.x + Django + Django REST Framework
- **Frontend:** React (Vite)
- **Base de datos:** SQLite
- **Control de versiones:** Git

## Estructura del proyecto

```
tickets-app/
├── backend/
│   ├── manage.py
│   ├── requirements.txt
│   ├── config/          # settings, urls raíz
│   └── tickets/         # modelos, serializers, vistas, urls del dominio
└── frontend/
    └── tickets-app/
        ├── src/
        │   ├── api/          # cliente HTTP y servicios
        │   ├── components/   # piezas de UI reutilizables
        │   └── pages/         # pantallas (listado, formulario, detalle)
        └── package.json
```

## Requisitos

- Python 3.13.12 o superior
- Node.js 18 o superior
- Git

## 1. Backend (Django)

### Instalación

```bash
cd backend

# Crear y activar entorno virtual
python -m venv .venv
source venv/bin/activate        # Linux/Mac
\.venv\Scripts\activate           # Windows

# Instalar dependencias
pip install -r requirements.txt
```

### Variables de entorno

Copiar `.env.example` a `.env` :

```bash
cp .env.example .env
```

Contenido esperado de `.env`:
```
SECRET_KEY=clave-secreta
DEBUG=True
ALLOWED_HOSTS=127.0.0.1,localhost
CORS_ALLOWED_ORIGINS=http://localhost:5173
```

### Base de datos

```bash
python manage.py migrate
```

Esto crea `db.sqlite3` con todas las tablas necesarias (tickets, comentarios y las tablas internas de Django).

Opcional — crear un superusuario para acceder al panel `/admin/`:
```bash
python manage.py createsuperuser
```

### Correr el servidor

```bash
python manage.py runserver
```

El backend queda disponible en `http://127.0.0.1:8000/`. El panel de administración en `http://127.0.0.1:8000/admin/`.

## 2. Frontend (React + Vite)

### Instalación

```bash
cd frontend/tickets-app
npm install
```

### Variables de entorno

Copia `.env.example` a `.env`:

```bash
cp .env.example .env
```

Contenido esperado de `.env`:
```
VITE_API_URL=http://127.0.0.1:8000/api
```

### Correr la aplicación

```bash
npm run dev
```

El frontend queda disponible en `http://localhost:5173/`.

> Importante: el backend debe estar corriendo antes de abrir el frontend, o el listado de tickets no cargará datos.

## Endpoints disponibles (API)

| Método | Endpoint | Descripción |
|---|---|---|
| GET | `/api/tickets/` | Listar tickets (filtros: `estado`, `prioridad`, `categoria`) |
| POST | `/api/tickets/` | Crear ticket |
| GET | `/api/tickets/<id>/` | Detalle de un ticket |
| PATCH | `/api/tickets/<id>/` | Actualizar estado y/o prioridad |
| GET | `/api/tickets/<id>/comentarios/` | Listar comentarios de un ticket |
| POST | `/api/tickets/<id>/comentarios/` | Agregar comentario a un ticket |
| GET/PATCH/DELETE | `/api/comentarios/<id>/` | Ver, editar o eliminar un comentario puntual |

## Pantallas del frontend

- **Listado de tickets** (`/`): tabla con filtros por estado y prioridad.
- **Crear ticket** (`/tickets/nuevo`): formulario de creación.
- **Detalle de ticket** (`/tickets/:id`): información del ticket, cambio de estado/prioridad, y gestión de comentarios.

## Uso de IA

Este proyecto se desarrolló con acompañamiento de **Claude (Anthropic)** como asistente técnico durante todo el proceso: explicación de conceptos de Django/DRF y React para quien no tenía experiencia previa en estos frameworks, revisión de arquitectura, y generación de código guiado en base a los requisitos del reto. Todo el código fue revisado, entendido y adaptado antes de integrarse al proyecto.

## Pendiente / próximos pasos

- Autenticación (login/registro) y control de acceso por rol (Agente / Solicitante).