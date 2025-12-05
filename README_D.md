📘 MANUAL TÉCNICO — Sistema “Adopta un Árbol”
Versión: 2025
________________________________________
👥 Integrantes – Roles
•	Jorge Dilan Aguilar Triveño – Desarrollador Backend / Arquitectura / Base de Datos
•	Luis Fernando Ramírez Viscarra – Desarrollador Frontend / UI – UX / QA Tester
________________________________________
🟩 1. Introducción
Descripción / Objetivo del proyecto
El sistema Adopta un Árbol es una plataforma web diseñada para facilitar la adopción, seguimiento y mantenimiento (riego) de árboles urbanos.
Incluye módulos para usuarios, técnicos y administradores con flujos de:
•	Adopción de árboles
•	Solicitud y pago de riego
•	Gestión de créditos
•	Reportes técnicos con evidencias fotográficas
•	Mapas interactivos (Leaflet)
•	Paneles administrativos y técnicos
El propósito es mejorar la gestión ambiental mediante un sistema accesible y automatizado.
________________________________________
🎥 Video ilustrativo (2 a 5 minutos)
[ENLACE A INSERTAR AQUÍ]
________________________________________
🟦 2. Listado de Requisitos Funcionales del Sistema
1.	RF01 – Registrar usuario
2.	RF02 – Iniciar sesión con autenticación JWT
3.	RF03 – Visualizar árboles disponibles en mapa
4.	RF04 – Adoptar un árbol utilizando créditos
5.	RF05 – Generar solicitud de riego
6.	RF06 – Registrar pago de riego
7.	RF07 – Técnico puede visualizar tareas asignadas
8.	RF08 – Técnico puede reportar riegos realizados
9.	RF09 – Administrador gestiona costos, usuarios y riegos
10.	RF10 – Administrador visualiza reportes técnicos
11.	RF11 – Usuario puede ver historial de riegos
12.	RF12 – Sistema descuenta créditos automáticamente
13.	RF13 – Sistema envía notificaciones de riegos completados
14.	RF14 – Carga de fotografías como evidencia
15.	RF15 – Sincronización de créditos entre frontend y backend
16.	RF16 – API REST estructurada para Backend
________________________________________
🟧 3. Arquitectura de Software
El sistema sigue una arquitectura Cliente – Servidor, basada en:
Frontend
•	React.js + Vite
•	Leaflet.js para mapas
•	Context API para estado global
•	Componentes desacoplados / diseño modular
•	Comunicación con API REST mediante Fetch
Backend (API REST)
•	Node.js + Express
•	Controladores separados por entidad
•	Multer para carga de imágenes
•	JWT para autenticación
•	Middlewares para protección de rutas
Base de Datos
•	MongoDB Atlas
•	ODM: Mongoose
•	Colecciones: usuarios, plantas, riegos, settings, pagos
Patrones de diseño utilizados
•	MVC simplificado (Routes – Controllers – Models)
•	DTO natural en las respuestas de la API
•	Modularización por responsabilidades
•	Hooks personalizados en frontend (useSettings, etc.)
________________________________________
🟩 4. Base de Datos
Diagrama Completo Actual
[Usuario]
 - _id
 - nombre
 - correo
 - rol (admin/tecnico/user)
 - puntostotales
 - contraseña

[Planta]
 - _id
 - nombre
 - latitud
 - longitud
 - adoptante (ref Usuario)
 - imagen

[Riego]
 - _id
 - treeId (ref Planta)
 - requesterId (ref Usuario)
 - technicianId (ref Usuario)
 - status (assigned / in-progress / completed)
 - pago (pendiente / pagado)
 - evidencia
 - notas
 - completionStatus
 - completedAt

[Settings]
 - adoptionPrice
 - waterPrice
 - creditPackages[]

[Pagos]
 - usuario
 - comprobante
 - estado (pendiente / aprobado / rechazado)
________________________________________
Script simple de generación
db.usuarios.insertMany([
  { nombre: "Admin", correo: "admin@demo.com", rol: "admin", puntostotales: 500, password: "123456" },
  { nombre: "Tecnico", correo: "tecnico@demo.com", rol: "technician", puntostotales: 100, password: "123456" },
  { nombre: "Juan Perez", correo: "juan@demo.com", rol: "user", puntostotales: 50, password: "123456" }
]);

db.settings.insertOne({
  adoptionPrice: 20,
  waterPrice: 10,
  creditPackages: [
    { id: "pack1", name: "Básico", credits: 20, price: 20 },
    { id: "pack2", name: "Medio", credits: 50, price: 45 }
  ]
});
________________________________________
🟧 5. Roles más credenciales
Administrador
correo: admin@demo.com
contraseña: admin123
Técnico
correo: tecnico@demo.com
contraseña: tecnico123
Usuario
correo: usuario@demo.com
contraseña: user123
(credenciales inventadas a pedido del usuario)
________________________________________
🟦 6. Requerimientos del Sistema
Cliente (mínimos)
•	Navegador actualizado
•	RAM 4GB
•	CPU Dual Core
•	Conexión a internet
Software cliente
•	Chrome / Firefox
•	React 18
•	Node.js 18+ (si ejecuta local)
Servidor / Hosting / BD
•	Node.js 18+
•	PM2 o servicio equivalente
•	MongoDB Atlas (cluster gratuito funciona)
________________________________________
🟩 7. Instalación y Configuración
Backend
cd backend
npm install
cp .env.example .env
npm start
Variables .env
MONGO_URI=...
JWT_SECRET=...
PORT=4000
________________________________________
Frontend
cd frontend
npm install
npm run dev
________________________________________
Conexión al backend
El frontend consume:
http://localhost:4000/api
________________________________________
🟧 8. Procedimiento de Hosting
Sitio Web
•	Deploy en Vercel, Netlify o servidor Node
•	Ajustar variable VITE_API_URL
Base de Datos
•	MongoDB Atlas
•	Crear usuario con permisos de lectura/escritura
•	Conectar mediante MONGO_URI
API Backend
•	Deploy en Render, Railway o VPS
•	Usar PM2 para levantar Node
________________________________________
🟦 9. Puesta en marcha (hosting)
1.	Crear instancia MongoDB Atlas
2.	Configurar variables del backend
3.	Desplegar backend (Railway / Render)
4.	Desplegar frontend (Vercel)
5.	Probar rutas /api/auth/login
6.	Insertar datos iniciales
7.	Verificar módulo de riegos
8.	Verificar panel técnico y admin
________________________________________
🟩 10. Git
Ramas del proyecto
•	main (producción)
•	dev-frontend (Luis)
•	dev-backend (Jorge)
Compilados
•	Carpeta /dist en frontend
•	Carpeta /build si aplica para backend
________________________________________
🟧 11. Dockerización
Backend
FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
CMD ["npm", "start"]
Frontend
FROM node:18
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .
npm run build
Ejecutar
docker compose up --build
________________________________________
🟦 12. Personalización y configuración
•	Se pueden modificar los precios en el panel admin
•	Se puede editar paquetes de créditos
•	Se puede cambiar costo por adopción y riego
•	Configuración Leaflet en /src/mapConfig.js
________________________________________
🟧 13. Seguridad
•	Hash de contraseñas con bcrypt
•	Autenticación con JWT
•	Validación de roles (admin, técnico, usuario)
•	Sanitización de archivos subidos con Multer
•	CORS configurado correctamente
________________________________________
🟩 14. Depuración y solución de problemas
Error: Backend no responde
→ Revisar .env
→ Verificar conexión a MongoDB
Créditos no actualizan
→ Revisar sincronización /api/user/credits
→ Verificar Settings.waterPrice
Imágenes no cargan
→ Revisar carpeta /uploads con permisos correctos
________________________________________
🟦 15. Glosario de términos
•	JWT: Token para autenticación segura
•	CRUD: Crear, Leer, Actualizar, Eliminar
•	API REST: Interfaz de comunicación entre frontend y backend
•	Reporte técnico: Evidencia del riego realizada por el técnico
•	Multer: Middleware para carga de archivos en Node
________________________________________
🟧 16. Referencias y recursos adicionales
•	React documentation: https://react.dev
•	Node.js documentation: https://nodejs.org
•	MongoDB Atlas: https://www.mongodb.com/atlas
•	Leaflet maps: https://leafletjs.com
________________________________________
🟩 17. Herramientas de implementación
Lenguajes:
•	JavaScript
•	TypeScript parcial (opcional)
Frameworks:
•	React
•	Node.js / Express
APIs / Librerías:
•	Leaflet
•	JWT
•	Multer
•	Mongoose
________________________________________
📚 18. Bibliografía
•	Node.js Docs — https://nodejs.org/en/docs
•	React Docs — https://react.dev
•	MongoDB Docs — https://www.mongodb.com/docs
•	Leaflet Docs — https://leafletjs.com

