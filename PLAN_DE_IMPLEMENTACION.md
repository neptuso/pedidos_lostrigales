# Plan de Implementación - Sistema de Pedidos "Los Trigales"

Este documento detalla los pasos para el desarrollo de la aplicación web de gestión de pedidos para la panadería "Los Trigales".

## Fase 1: Configuración Inicial y Estructura (Actual)
- [x] Inicialización del proyecto con React y Vite.
- [x] Instalación y configuración de Tailwind CSS para el diseño.
- [x] Limpieza de archivos de plantilla y creación de estructura básica.
- [x] Traducción de documentación y comentarios al español.
- [x] Gestion y control de versiones con Git.
- [x] Configuración del entorno de desarrollo con Node.js y npm.

## Fase 2: Integración de Base de Datos (Firebase)
- [x] Crear proyecto en Firebase Console.
- [x] Configurar Firestore (Base de datos NoSQL).
- [x] **Implementar autenticación básica** (Google + Email/Contraseña con sistema de roles).
- [x] Conectar la aplicación React con Firebase.
- [x] **Estrategia Híbrida**: Configurar sincronización de pedidos a Google Sheets (para administración).
- [x] **Configurar reglas de seguridad de Firestore** (Control de acceso basado en roles).

## Fase 3: Desarrollo de Funcionalidades Principales
### Gestión de Productos
- [x] Crear modelo de datos para productos (Panes, Facturas, etc.).
- [x] Vista de lista de productos.
- [x] Formulario para agregar/editar productos.
- [x] Importación masiva desde Google Sheets.

### Gestión de Clientes
- [ ] Crear modelo de datos de clientes.
- [ ] Vista de lista de clientes.
- [ ] Historial de pedidos por cliente.

### Gestión de Pedidos
- [ ] Interfaz para crear un nuevo pedido.
- [ ] Selección de productos y cálculo de totales.
- [ ] Estados del pedido (Pendiente, En Proceso, Entregado).

## Fase 4: Interfaz de Usuario (UI) y Experiencia (UX)
- [ ] Mejorar el diseño visual con la paleta de colores de la panadería (Naranjas, Marrones).
- [ ] Asegurar que la aplicación sea responsiva (funcione en móviles y PC).
- [ ] Agregar notificaciones visuales (Toasts) para acciones exitosas o errores.

## Fase 5: Pruebas y Despliegue
- [ ] Pruebas manuales de flujo completo de pedido.
- [ ] Corrección de errores.
- [ ] Despliegue (Deploy) de la aplicación para uso real.
