# Arquitectura del Sistema - Mini Sistema de Tickets

## 1. Visión General

El sistema implementa una arquitectura cliente-servidor de dos capas. El backend
expone una API REST (Django + Django REST Framework) y el frontend es una Single
Page Application en React que la consume vía HTTP/JSON, sin estado compartido entre
peticiones (autenticación por JWT en cada request).

A nivel interno, el backend aplica parcialmente el patrón MVT nativo de Django: la capa de
Template se reemplaza por Serializers que devuelven JSON en lugar de HTML, este enfoque es
conocido como "Django headless", dejando que React construya toda la interfaz.

```
┌─────────────────────────────────────────────────────────────┐
│                    Navegador Web (Cliente)                  │
└──────────────────────────────┬──────────────────────────────┘
                               │ HTTP / JSON
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│              Frontend: React 19 + Vite (SPA)                │
└──────────────────────────────┬──────────────────────────────┘
                               │ Peticiones REST 
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│               Backend: Django REST Framework                │
└──────────────────────────────┬──────────────────────────────┘
                               │ Django ORM
                               ▼
┌──────────────────────────────┴──────────────────────────────┐
│                  PERSISTENCIA (SQL): SQLite                 |    
└─────────────────────────────────────────────────────────────┘
```

---

## 2. Decisiones de Arquitectura y Diseño

### A. Desacoplamiento Frontend / Backend
* **Decisión:** Implementar el backend como una API REST pura con Django REST Framework (DRF) y el frontend como una Single Page Application (SPA) con React.
* **Justificación:** Separa las responsabilidades de presentación y de negocio. Facilita que el frontend sea servido por un CDN o Nginx estático mientras el backend escala de forma independiente.

### B. Autenticación y autorización por roles (RBAC)
* **Decisión:** Uso de tokens JWT con dos roles definidos: Agente y Solicitante.
* **Justificación:** Al ser una API stateless, el token viaja en las cabeceras. El modelo `Perfil` extiende a `User` mediante una relación 1 a 1 y una señal `post_save` garantiza que todo usuario tenga rol asignado:
  * **Solicitante:** Solo visualiza y gestiona sus propios tickets; no puede alterar estado ni prioridad.
  * **Agente:** Visualiza todos los tickets y tiene privilegios exclusivos para cambiar estados y prioridades.

### C. Persistencia y modelado de datos
* **Decisión:** Uso de SQLite para el MVP junto al ORM de Django.
* **Justificación:** Elimina la fricción de instalación en entornos locales o de evaluación sin dependencias externas de bases de datos. Al utilizar el ORM de Django, la migración a PostgreSQL o MySQL en producción requiere únicamente cambiar las credenciales en `settings.py` sin modificar el código de la aplicación.
