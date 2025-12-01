# Plan de Implementación - Sistema de Pedidos "Los Trigales"

Este documento detalla los pasos para el desarrollo y evolución de la aplicación web de gestión de pedidos.

## ✅ Fase 1: Configuración Inicial y Estructura
- [x] Inicialización del proyecto con React y Vite.
- [x] Instalación y configuración de Tailwind CSS.
- [x] Configuración de Git y entorno de desarrollo.

## ✅ Fase 2: Integración de Firebase y Seguridad
- [x] Configurar Firestore y Authentication.
- [x] Implementar sistema de roles (Admin, Gerente, Sucursal, Panadero, Transportista).
- [x] **Reglas de Seguridad**: Configurar `firestore.rules` para proteger datos según rol.
- [x] **Gestión de Sucursales**: CRUD de sucursales con distinción de Plantas de Producción.
- [x] **Gestión de Usuarios**: Asignación de usuarios a sucursales específicas.

## ✅ Fase 3: Funcionalidades Principales (Core)
### Gestión de Productos
- [x] CRUD de productos.
- [x] Importación masiva desde Google Sheets.

### Gestión de Pedidos
- [x] Formulario de pedido con lógica de Origen (Planta) y Destino (Sucursal).
- [x] Vista de lista de pedidos con filtros.
- [x] **Flujo Operativo**:
    - [x] **Panadero**: Ver pedidos de su planta, "Comenzar Producción", "Terminar".
    - [x] **Transportista**: Ver pedidos listos, "Retirar", "Confirmar Entrega".
- [x] Visualización de Planta de Producción en tarjetas de pedido.

## 🚧 Fase 4: Experiencia de Usuario y Pulido (EN PROGRESO)
- [ ] **Pie de Página (Footer)**: Versión, Copyright, Desarrollador.
- [ ] **Impresión de Comandas**: Generar vista PDF/Imprimible para cocina.
- [ ] **Dashboard**: Métricas simples (Pedidos del día, Totales).
- [ ] **Historial de Estados**: Registro de quién y cuándo cambió cada estado.
- [ ] **Notificaciones**: (Opcional) Avisos visuales o por email al cambiar estado.

## Fase 5: Mantenimiento y Despliegue
- [x] Despliegue inicial en Firebase Hosting.
- [ ] Actualización continua del despliegue con nuevas funcionalidades.
