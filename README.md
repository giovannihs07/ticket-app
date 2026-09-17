# Mini Sistema de Tickets

Sistema interno para registrar y gestionar tickets de soporte técnico, desarrollado con backend en **Django (Django REST Framework)** y frontend en **React (Vite)**, persistencia en **SQLite** y soporte de **Docker Compose**.

---
## 🛠️ Tecnologías

- **Backend:** Python 3.13 + Django 6 + Django REST Framework
- **Frontend:** React 19 (Vite)
- **Base de Datos:** SQLite 3 
- **Autenticación:** JSON Web Tokens (JWT)
- **Contenedores:** Docker & Docker Compose
- **Control de versiones:** Git
---

## 📁 Estructura del Proyecto

```
tickets-app/
├── backend/
│   ├── config/              # Configuración de Django (settings, urls, wsgi)
│   ├── tickets/             # App de tickets (modelos, vistas, serializers, tests)
│   │   └── management/
│   │       └── commands/
│   │           └── seed.py  # Comando de datos de prueba
│   ├── Dockerfile           # Imagen de backend
│   ├── entrypoint.sh        # Migraciones y seed automático en contenedor
│   ├── requirements.txt     # Dependencias de Python
│   └── manage.py
├── frontend/
│   └── tickets-app/
│       ├── src/
│       │   ├── api/         # Cliente Axios e interceptores JWT
│       │   ├── components/  # Componentes reutilizables
│       │   └── pages/       # Pantallas (Listado, Creación, Detalle, Auth)
│       ├── Dockerfile       # Multi-stage build (Node -> Nginx)
│       ├── nginx.conf       # Servidor estático con soporte de SPA routing
│       └── package.json
├── docs/
│   ├── arquitectura.md      # Diagrama y decisiones de arquitectura
│   └── despliegue.md        # Guía para Render y VPS (Gunicorn + Nginx)
├── docker-compose.yml       # Orquestación de servicios en un solo comando
├── .env.example             # Plantilla de variables de entorno para Docker
└── API TICKETS.postman_collection.json # Colección de pruebas de endpoints
```

---

## Ejecución del proyecto con Docker Compose

La forma más rápida de evaluar el proyecto. Levanta el backend, ejecuta las migraciones, puebla los datos de prueba y sirve el frontend compilado en Nginx con un solo comando:

### Requisitos
- Docker y Docker Compose instalados.

### Pasos
Desde la raíz del proyecto (`tickets-app/`):

```bash
docker compose up --build
```

Una vez levantado:
- **Frontend Web:** [http://localhost:5173](http://localhost:5173)
- **Healthcheck:** [http://localhost:8000/api/health/](http://localhost:8000/api/health/)
- **Panel Admin Django:** [http://localhost:8000/admin/](http://localhost:8000/admin/)

Para detener los contenedores:
```bash
docker compose down
```

---

## Opción 2: Ejecución local manual

### Requisitos
- Python 3.13.12 o superior
- Node.js 18 o superior
- Git

### 1. Backend (Django)

```bash
cd backend

# 1. Crear y activar entorno virtual
python -m venv .venv
# En Windows (PowerShell):
.\.venv\Scripts\Activate.ps1
# En Linux / Mac:
source .venv/bin/activate

# 2. Instalar dependencias
pip install -r requirements.txt

# 3. Configurar variables de entorno
cp .env.example .env

# 4. Aplicar migraciones
python manage.py migrate

# 5. Poblar base de datos con usuarios y datos de prueba
python manage.py seed

# 6. Iniciar servidor de desarrollo
python manage.py runserver
```
El backend quedará disponible en `http://127.0.0.1:8000/`.

---

### 2. Frontend (React + Vite)

En otra terminal:

```bash
cd frontend/tickets-app

# 1. Instalar dependencias de Node
npm install

# 2. Configurar variables de entorno
cp .env.example .env

# 3. Iniciar servidor Vite
npm run dev
```
El frontend quedará disponible en `http://localhost:5173/`.

---

## Usuarios de Prueba (Seed Data)

Al ejecutar `python manage.py seed` (o automáticamente con Docker Compose), se crean las siguientes credenciales para probar los roles de inmediato:

| Usuario | Contraseña | Rol | Permisos |
|---|---|---|---|
| `admin` | `admin123` | **Superusuario / Agente** | Acceso al panel `/admin/`, ver todos los tickets y modificar estados/prioridades |
| `agente1` | `agente123` | **Agente de Soporte** | Ver todos los tickets, cambiar estado y prioridad, comentar |
| `solicitante1` | `sol123` | **Solicitante** | Crear tickets, ver solo sus propios tickets y comentar |
| `solicitante2` | `sol123` | **Solicitante** | Crear tickets, ver solo sus propios tickets y comentar |

> **Nota:** Si deseas reiniciar la base de datos limpia con los datos iniciales, ejecuta:
> ```bash
> python manage.py seed --clear
> ```

---

## 🧪 Pruebas Automatizadas y Calidad de Código

### Ejecutar Pruebas Automatizadas
El proyecto cuenta con un set de pruebas unitarias y de integración que validan autenticación, permisos por rol, filtros de tickets, creación y comentarios:

```bash
cd backend
python manage.py test tickets
```

### Pruebas de API con Postman
En la raíz del proyecto se incluye el archivo:
- `API TICKETS.postman_collection.json`

Permite probar todos los endpoints (Login JWT, Registro, Listado con filtros, Creación, Detalle, Modificación de estado/prioridad y Comentarios).

---

## Endpoints Principales de la API

| Método | Endpoint | Autenticación | Rol Permitido | Descripción |
|---|---|---|---|---|
| `GET` | `/api/health/` | Pública | Cualquiera | Verificación de salud para Docker/Monitoreo |
| `POST` | `/api/registro/` | Pública | Cualquiera | Registro de nuevo usuario (asigna rol Solicitante o Agente) |
| `POST` | `/api/login/` | Pública | Cualquiera | Obtener tokens JWT (`access` y `refresh`) |
| `POST` | `/api/token/refresh/` | Pública | Cualquiera | Refrescar token de acceso expirado |
| `GET` | `/api/me/` | Bearer JWT | Todos | Obtener perfil y rol del usuario autenticado |
| `GET` | `/api/tickets/` | Bearer JWT | Todos | Listar tickets (Agente ve todos, Solicitante solo propios). Filtros: `?estado=`, `?prioridad=`, `?categoria=` |
| `POST` | `/api/tickets/` | Bearer JWT | Todos | Crear ticket |
| `GET` | `/api/tickets/<id>/` | Bearer JWT | Todos | Detalle del ticket (restringido al creador o agente) |
| `PATCH` | `/api/tickets/<id>/` | Bearer JWT | **Solo Agente** | Actualizar estado (`ABIERTO`, `EN_PROGRESO`, `CERRADO`) o prioridad |
| `GET` | `/api/tickets/<id>/comentarios/` | Bearer JWT | Todos | Listar comentarios de un ticket |
| `POST` | `/api/tickets/<id>/comentarios/` | Bearer JWT | Todos | Agregar comentario a un ticket |
| `GET/PATCH/DELETE` | `/api/comentarios/<id>/` | Bearer JWT | Todos | Operaciones sobre un comentario puntual |

---

## Documentación Adicional

- [Arquitectura del sistema y decisiones técnicas](docs/arquitectura.md)
- [Guía paso a paso para despliegue en producción](docs/despliegue.md)

---
