# 🍞 Los Trigales - Sistema de Gestión de Pedidos

## 🌐 Aplicación en Producción
**URL**: https://inventario-insumos-trigales.web.app

## 📋 Resumen del Proyecto

Sistema web completo para gestión de pedidos de panadería con:
- ✅ Autenticación segura (Google + Email/Contraseña)
- ✅ Control de acceso basado en roles (Admin, Gerente, Sucursal, Cliente)
- ✅ Gestión de productos con importación desde Google Sheets
- ✅ Gestión de pedidos con estados y seguimiento
- ✅ Sincronización automática con Google Sheets
- ✅ Base de datos en tiempo real (Firebase Firestore)

## 🚀 Tecnologías Utilizadas

- **Frontend**: React + Vite + Tailwind CSS v4
- **Backend**: Firebase (Firestore + Authentication + Hosting)
- **Integración**: Google Apps Script (Sheets)
- **Control de versiones**: Git + GitHub

## 👥 Usuarios y Roles

### Administrador
- Email configurado: `neptuso@gmail.com`
- Acceso total al sistema
- Puede gestionar usuarios, productos y pedidos

### Otros Roles
- **Gerente**: Gestión de productos y visualización de todos los pedidos
- **Sucursal**: Gestión de pedidos de su zona
- **Cliente**: Creación de pedidos y visualización de su historial

## 📦 Funcionalidades Principales

### 1. Gestión de Usuarios
- Panel de administración de usuarios
- Asignación y cambio de roles
- Visualización de perfiles

### 2. Gestión de Productos
- Lista completa de productos
- Creación y edición manual
- **Importación masiva desde Google Sheets** (balanza)
- Filtros por categoría y búsqueda

### 3. Gestión de Pedidos
- Creación de pedidos con selección de productos
- Carrito de compras
- Estados: Pendiente, En Proceso, Listo, Entregado, Cancelado
- Filtros por estado
- Sincronización automática con Google Sheets

## 🔐 Seguridad

- Reglas de Firestore configuradas
- Autenticación requerida para todas las operaciones
- Control de acceso basado en roles
- Protección contra auto-asignación de roles privilegiados

## 📊 Integración con Google Sheets

- Importación de productos desde hoja de balanza
- Exportación automática de pedidos para administración
- URL de la hoja: [Ver hoja de productos](https://docs.google.com/spreadsheets/d/1Yp2I2jLQM2EwoD6SJxh3LyKy4qtvjcOTpTc1uCzcmgk/edit)

## 🛠️ Desarrollo Local

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Construir para producción
npm run build

# Deploy a Firebase
npx firebase deploy
```

## 📱 Acceso

La aplicación es **responsive** y funciona en:
- 💻 Computadoras de escritorio
- 📱 Teléfonos móviles
- 📲 Tablets

## 🔗 Enlaces Importantes

- **Aplicación**: https://inventario-insumos-trigales.web.app
- **Repositorio GitHub**: https://github.com/neptuso/pedidos_lostrigales
- **Firebase Console**: https://console.firebase.google.com/project/inventario-insumos-trigales

## 📝 Próximos Pasos Sugeridos

1. Realizar pruebas con usuarios reales
2. Ajustar flujos según feedback
3. Implementar gestión de clientes (opcional)
4. Agregar reportes y estadísticas
5. Configurar notificaciones por email

## 👨‍💻 Desarrollado con

- React 19
- Vite 7
- Tailwind CSS 4
- Firebase 11
- Google Apps Script

---

**Desarrollado para Los Trigales - 2025**
