# Reglas de Seguridad de Firestore - Los Trigales

Este documento explica las reglas de seguridad implementadas para proteger la base de datos.

## Resumen de Protecciones

### 🔐 Principio General
**Todo está bloqueado por defecto**. Solo se permite acceso explícito según el rol del usuario.

---

## Roles y Permisos

### 👤 Cliente (Por defecto)
- ✅ Puede ver su propio perfil
- ✅ Puede actualizar su nombre y foto (NO su rol)
- ✅ Puede ver todos los productos
- ✅ Puede crear pedidos propios
- ✅ Puede ver solo sus propios pedidos
- ✅ Puede editar sus pedidos si están en estado "pendiente"

### 🏢 Sucursal
- ✅ Todo lo de Cliente +
- ✅ Puede ver perfiles de clientes
- ✅ Puede actualizar cualquier pedido
- ✅ Puede ver todos los pedidos de su zona

### 👔 Gerente
- ✅ Todo lo de Sucursal +
- ✅ Puede crear/editar/eliminar productos
- ✅ Puede ver todos los pedidos

### 🔑 Administrador
- ✅ **Acceso total**
- ✅ Puede ver y editar todos los usuarios
- ✅ Puede cambiar roles de otros usuarios
- ✅ Puede eliminar usuarios
- ✅ Puede eliminar pedidos
- ✅ Acceso a colecciones de prueba

---

## Protecciones Específicas

### 🛡️ Auto-asignación de Roles
- ❌ Los usuarios **NO pueden** asignarse a sí mismos el rol de admin, gerente o sucursal
- ✅ Al registrarse, automáticamente se les asigna el rol de "cliente"
- ✅ Solo un admin puede cambiar el rol de otro usuario
- ⚠️ **Excepción**: El email `neptuso@gmail.com` (tu email) puede auto-asignarse como admin al registrarse

### 🔒 Protección de Perfil Propio
- ❌ Nadie puede cambiar su propio rol (ni siquiera los admins)
- ✅ Cada usuario puede cambiar su nombre y foto
- ✅ Solo otro admin puede cambiar el rol de un admin

### 📦 Pedidos
- ✅ Cada pedido tiene un `userId` que identifica al creador
- ❌ Los clientes no pueden ver pedidos de otros clientes
- ❌ Los clientes no pueden editar pedidos que ya no están en estado "pendiente"

---

## Aplicar las Reglas

### Pasos:

1. Ve a la [Consola de Firebase](https://console.firebase.google.com/project/inventario-insumos-trigales/firestore/rules)
2. En el panel lateral, selecciona **Firestore Database** → **Reglas** (Rules)
3. **Borra todo** el contenido actual
4. Copia y pega el contenido del archivo `firestore.rules`
5. Haz clic en **"Publicar"** (Publish)

### ⚠️ Importante:
Después de publicar las reglas, tu base de datos ya **NO** estará en modo abierto. Asegúrate de:
- Tener al menos un usuario admin creado (tú)
- Probar que puedes seguir logueándote y usando la app

---

## Próximos Pasos

Una vez aplicadas estas reglas:
1. ✅ Tu base de datos estará protegida
2. ✅ Podrás publicar la app en Internet con seguridad
3. ✅ Solo usuarios autenticados con roles correctos podrán acceder a los datos

---

## Pruebas Recomendadas

Después de aplicar las reglas, prueba:
1. Crear una cuenta nueva (debería tener rol "cliente" automáticamente)
2. Intentar cambiar tu propio rol desde el perfil (debería fallar)
3. Como admin, cambiar el rol de otro usuario (debería funcionar)
4. Como cliente, intentar ver usuarios (debería ver solo su perfil)
