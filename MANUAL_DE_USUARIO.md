# 📘 Manual de Usuario - Sistema de Pedidos "Los Trigales"

Bienvenido al sistema de gestión de pedidos. Este documento le guiará en el uso de la aplicación según su rol.

---

## 🏢 Para Sucursales y Clientes
**Objetivo:** Realizar pedidos de mercadería a las plantas de producción.

1.  **Ingreso:** Inicie sesión con su correo y contraseña.
2.  **Crear Pedido:**
    *   Haga clic en el botón **"+ Nuevo Pedido"**.
    *   **Seleccione la Planta:** Elija a qué fábrica le está pidiendo (ej: "Planta Central").
    *   **Agregue Productos:** Busque los productos y use los botones `+` y `-` para definir cantidades.
    *   **Confirmar:** Revise el total y haga clic en "Confirmar Pedido".
3.  **Seguimiento:**
    *   En la pantalla principal verá sus pedidos recientes.
    *   **Estados:**
        *   🟡 `Pendiente`: La planta recibió el pedido pero no ha empezado.
        *   🔵 `En Producción`: ¡Están cocinando su pedido!
        *   🟢 `Listo Despacho`: Esperando al camión.
        *   🚚 `En Ruta`: El pedido va en camino a su local.
        *   ✅ `Entregado`: Pedido finalizado.

---

## 👨‍🍳 Para Panaderos (Producción)
**Objetivo:** Gestionar la cola de producción y avisar cuando los pedidos están listos.

1.  **Su Tablero:** Usted solo verá los pedidos asignados a **SU Planta**.
2.  **Proceso de Trabajo:**
    *   Busque las tarjetas con estado 🟡 `Pendiente`.
    *   **Imprimir:** Haga clic en el icono de impresora 🖨️ junto al nombre del cliente para sacar la comanda.
    *   **Comenzar:** Al iniciar el trabajo, pulse el botón azul **"Comenzar Producción"**. El cliente verá que su pedido está en marcha.
    *   **Terminar:** Cuando toda la mercadería esté lista y empaquetada, pulse el botón verde **"Terminar Producción"**. Esto avisa al transporte.

---

## 🚚 Para Transportistas (Logística)
**Objetivo:** Retirar pedidos terminados y entregarlos al cliente.

1.  **Su Tablero:** Usted verá **TODOS** los pedidos de la empresa que están listos para retirar.
2.  **Proceso de Reparto:**
    *   Busque pedidos con estado 🟢 `Listo Despacho`.
    *   **Retirar:** Al cargar la mercadería en su camión, pulse **"🚚 Retirar Pedido"**. El estado cambiará a `En Ruta`.
    *   **Entregar:** Al llegar al cliente y descargar, pulse **"✅ Confirmar Entrega"**.

---

## 👔 Para Gerentes y Administradores
**Objetivo:** Supervisión y control.

1.  **Dashboard (Inicio):**
    *   Verá métricas en tiempo real: Pedidos activos, Ventas del día y Alertas de producción.
2.  **Gestión de Pedidos:**
    *   Puede ver todos los pedidos y filtrar por estado.
    *   Tiene permisos para **Cancelar** pedidos o cambiar estados manualmente si hubo un error.
3.  **Administración:**
    *   **Usuarios:** Crear y editar usuarios, asignar roles y sucursales.
    *   **Sucursales:** Gestionar las plantas y puntos de venta.
    *   **Productos:** Actualizar precios y catálogo.

---

## 🆘 Soporte Técnico
Desarrollado por **Ceibal Sistemas**.
Para asistencia, contacte a: `neptuso@gmail.com`
