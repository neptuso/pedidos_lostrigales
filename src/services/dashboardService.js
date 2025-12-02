import { collection, getDocs, query, where, Timestamp } from 'firebase/firestore';
import { db } from '../firebase/config';

export async function getDashboardMetrics() {
    try {
        const metrics = {
            activeOrders: 0,
            totalClients: 0,
            todaySales: 0,
            pendingByPlant: {},
            pendingPrivateClients: 0
        };

        // 1. Obtener Pedidos Activos y Ventas del Día
        const ordersRef = collection(db, 'orders');
        // Traemos todos para filtrar en memoria
        const ordersSnapshot = await getDocs(ordersRef);

        const today = new Date();
        today.setHours(0, 0, 0, 0);

        ordersSnapshot.forEach(doc => {
            const data = doc.data();

            // Contar pedidos activos (no finalizados)
            if (['pendiente', 'en_produccion', 'listo_despacho', 'en_ruta'].includes(data.estado)) {
                metrics.activeOrders++;

                // Desglose por Planta (solo pendientes de producir)
                if (['pendiente', 'en_produccion'].includes(data.estado) && data.origenNombre) {
                    metrics.pendingByPlant[data.origenNombre] = (metrics.pendingByPlant[data.origenNombre] || 0) + 1;
                }

                // Desglose Clientes Particulares (asumiendo que no tienen destinoId de sucursal)
                if (!data.destinoId && ['pendiente', 'en_produccion'].includes(data.estado)) {
                    metrics.pendingPrivateClients++;
                }
            }

            // Calcular ventas del día (solo pedidos válidos de hoy)
            if (data.createdAt && data.estado !== 'cancelado') {
                const orderDate = data.createdAt.toDate();
                if (orderDate >= today) {
                    metrics.todaySales += (data.total || 0);
                }
            }
        });

        // 2. Obtener Total de Clientes
        const usersRef = collection(db, 'users');
        const clientsQuery = query(usersRef, where('rol', '==', 'cliente'));
        const clientsSnapshot = await getDocs(clientsQuery);
        metrics.totalClients = clientsSnapshot.size;

        return { success: true, metrics };

    } catch (error) {
        console.error("Error fetching dashboard metrics:", error);
        return { success: false, error: error.message };
    }
}
