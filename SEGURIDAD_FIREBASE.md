# ⚠️ IMPORTANTE: Configuración de Firebase

Este archivo contiene las credenciales públicas de Firebase. Estas credenciales son **seguras de compartir públicamente** porque:

1. La seguridad real está en las **Reglas de Firestore** (que ya configuramos)
2. Firebase usa autenticación de usuarios, no claves secretas
3. Las API keys de Firebase están diseñadas para ser públicas

## Credenciales actuales:
- **Project ID**: inventario-insumos-trigales
- **API Key**: Visible en `src/firebase/config.js`

## Seguridad implementada:
✅ Reglas de Firestore configuradas (solo usuarios autenticados)  
✅ Control de acceso basado en roles  
✅ Autenticación requerida para todas las operaciones  

## Si necesitas rotar las credenciales:
1. Ve a Firebase Console → Project Settings
2. Elimina la app web actual
3. Crea una nueva app web
4. Actualiza `src/firebase/config.js` con las nuevas credenciales
