Manual Técnico - Proyecto Adopta un Árbol
1. Descripción General
El proyecto "Adopta un Árbol" es una plataforma desarrollada con un frontend en React y un backend en Node.js con MongoDB.
Permite gestionar adopciones de árboles, créditos, solicitudes de riego, reportes técnicos, dashboards administrativos,
y localización geográfica mediante Leaflet.
2. Arquitectura del Sistema
Frontend: React + Vite + Tailwind + Shadcn + Leaflet.
Backend: Node.js + Express + MongoDB.
Autenticación: JWT + middleware de roles.
Carga de imágenes: Multer.
3. Módulos Principales
- Módulo de usuarios (registro, login, perfil).
- Módulo de adopciones.
- Módulo de riegos y reportes técnicos.
- Panel administrativo.
- Sincronización de créditos (LocalStorage y BD).
- Mapas geográficos.
4. Backend - Estructura
src/
├── routes/
├── controllers/
├── models/
├── middleware/
├── config/
├── utils/
server.ts
.env
5. Endpoints Principales
/api/auth: login, registro.
/api/usuarios: gestión de usuarios.
/api/planta: árboles, adopciones.
/api/pago: créditos, recargas.
/api/tecnico: reportes de riego.
/api/admin: dashboard.
6. Base de Datos (MongoDB)
Colecciones:
- usuarios
- arboles
- adopciones
- pagos
- riegos
- reportesTecnicos

Relaciones basadas en ObjectId.
7. Frontend - Estructura
src/
├── components/
├── pages/
├── context/
├── hooks/
├── services/
├── ui/
main.tsx
App.tsx
8. Flujo de Adopción
1. Usuario selecciona árbol.
2. Se valida disponibilidad.
3. Se descuenta o recarga crédito.
4. Registro en BD.
5. Actualización visual en dashboard.
9. Flujo de Riego y Reportes
1. Usuario solicita riego.
2. Técnico recibe la tarea.
3. Técnico sube reporte técnico (foto, comentario).
4. Admin valida y confirma.
10. Roles del Sistema
Usuario: adopta y solicita riegos.
Técnico: atiende solicitudes, sube reportes.
Admin: gestiona árboles, usuarios, dashboard completo.
11. Instalación del Backend
npm install
npm run dev
Crear archivo .env con:
MONGO_URI=
JWT_SECRET=
PORT=
12. Instalación del Frontend
npm install
npm run dev
Configurar variables de entorno en .env.local
13. Seguridad
- Tokens JWT.
- Roles y permisos.
- Validación de input.
- Configuración CORS.
14. Esquema General de Comunicación
Frontend -> Backend -> MongoDB
Backend -> Servicios externos (imágenes, mapas)
15. Requerimientos del Sistema
Node 18+
MongoDB 6+
Navegador moderno
Servidor Linux o Windows
16. Errores Comunes y Soluciones
- Error de JWT: revisar expiración y secret.
- CORS bloqueado: agregar origen correcto.
- MongoDB no conecta: revisar firewall o URI.
17. Mantenimiento
- Limpiar logs.
- Revisar índices de Mongo.
- Regenerar tokens de seguridad cada 6 meses.
