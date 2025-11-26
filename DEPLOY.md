# Publicación del Proyecto

## 1. Subir el código a GitHub

### Pasos:
1. Ve a [github.com](https://github.com) y crea un repositorio nuevo
   - Nombre sugerido: `pedidos-los-trigales`
   - **Importante**: NO inicialices con README, .gitignore ni licencia (ya tenemos eso)

2. Una vez creado, GitHub te mostrará los comandos. Ejecuta estos en tu terminal:
   ```bash
   git remote add origin https://github.com/TU-USUARIO/pedidos-los-trigales.git
   git branch -M master
   git push -u origin master
   ```

3. ¡Listo! Tu código estará en la nube.

---

## 2. Publicar la App (Deploy) para acceso desde Internet

Tienes 3 opciones gratuitas y excelentes:

### Opción A: Firebase Hosting (Recomendado) 
✅ **Ventajas**: Ya usas Firebase, es gratis, rápido y con SSL automático.

**Pasos:**
```bash
npm install -D firebase-tools
npx firebase login
npx firebase init hosting
# Selecciona: 
# - Build directory: dist
# - Single-page app: Yes
# - Set up automatic builds with GitHub: No (por ahora)

npm run build
npx firebase deploy
```
Te dará una URL como: `https://tu-proyecto.web.app`

---

### Opción B: Vercel (Muy fácil)
✅ **Ventajas**: Deploy automático desde GitHub, muy rápido.

**Pasos:**
1. Ve a [vercel.com](https://vercel.com)
2. Conecta tu cuenta de GitHub
3. Importa tu repositorio
4. ¡Vercel lo configura automáticamente!

---

### Opción C: Netlify (También excelente)
Similar a Vercel, también tiene deploy automático desde GitHub.

---

## Recomendación
**Para este proyecto, usa Firebase Hosting** porque:
- Ya tienes Firebase configurado
- Es gratuito (10 GB/mes de tráfico)
- SSL gratis
- CDN global rápido
- Se integra perfecto con tu backend

¿Quieres que te guíe en el deploy con Firebase Hosting?
