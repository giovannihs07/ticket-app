# Guía de Despliegue - Mini Sistema de Tickets

Este documento describe dos opciones para desplegar la aplicación en un entorno de producción real:
**Plataforma Cloud (Render / Railway)** - Despliegue ágil sin gestión de infraestructura.

---

## 1. Variables de Entorno y Consideraciones de Seguridad

### Variables Requeridas

#### Backend
| Variable | Descripción | Valor en Producción (Ejemplo) |
|---|---|---|
| `SECRET_KEY` | Clave criptográfica de Django | Generar con `python -c "import secrets; print(secrets.token_urlsafe(50))"` |
| `DEBUG` | Modo depuración | **`False`** (Obligatorio en producción) |
| `ALLOWED_HOSTS` | Dominios autorizados | `api.tudominio.com,tickets-backend.onrender.com` |
| `CORS_ALLOWED_ORIGINS` | Orígenes frontend permitidos | `https://tudominio.com,https://tickets-frontend.onrender.com` |
| `DATABASE_PATH` | Ruta al archivo de base de datos | `/app/data/db.sqlite3` o ruta en disco persistente |

#### Frontend
| Variable | Descripción | Valor en Producción (Ejemplo) |
|---|---|---|
| `VITE_API_URL` | URL pública de la API Backend | `https://api.tudominio.com/api` |

### Consideraciones de Seguridad
* **Nunca subir archivos `.env` al repositorio Git.**
* **HTTPS obligatorio:** Todos los endpoints deben servirse bajo certificados SSL/TLS.
* **CORS restringido:** Limitar `CORS_ALLOWED_ORIGINS` únicamente al dominio exacto del frontend.
---

## 2. Plataforma Cloud (Render)

Render permite desplegar el Backend y Frontend de forma gratuita o de bajo costo con integración directa a GitHub.

### A. Despliegue del Backend (Web Service)
1. Iniciar sesión en [Render.com](https://render.com) y hacer clic en **New + > Web Service**.
2. Conectar el repositorio de GitHub del proyecto.
3. Configurar los siguientes parámetros:
   * **Root Directory:** `backend`
   * **Environment:** `Python 3`
   * **Build Command:**
     ```bash
     pip install -r requirements.txt && python manage.py migrate && python manage.py seed
     ```
   * **Start Command:**
     ```bash
     gunicorn config.wsgi:application --bind 0.0.0.0:$PORT --workers 2
     ```
4. En la sección **Environment Variables**, agregar:
   * `SECRET_KEY`: `<clave-secreta-generada>`
   * `DEBUG`: `False`
   * `ALLOWED_HOSTS`: `<tu-app-backend>.onrender.com`
   * `CORS_ALLOWED_ORIGINS`: `https://<tu-app-frontend>.onrender.com`
5. Guardar y desplegar. Copiar la URL pública asignada (ejemplo: `https://tickets-api.onrender.com`).

### B. Despliegue del Frontend (Static Site)
1. En Render, hacer clic en **New + > Static Site**.
2. Conectar el mismo repositorio de GitHub.
3. Configurar:
   * **Root Directory:** `frontend/tickets-app`
   * **Build Command:** `npm install && npm run build`
   * **Publish Directory:** `dist`
4. En **Environment Variables**, configurar:
   * `VITE_API_URL`: `https://tickets-api.onrender.com/api`
5. En la pestaña **Redirects / Rewrites**, crear una regla para soportar React Router (SPA):
   * **Source:** `/*`
   * **Destination:** `/index.html`
   * **Action:** `Rewrite`
6. Desplegar el sitio.

---
