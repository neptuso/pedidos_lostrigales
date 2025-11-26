import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';
import { sendOrderToSheets } from './sheetsService';

// Crear un nuevo pedido
export async function createOrder(orderData, currentUser) {
    try {
        const ordersCollection = collection(db, 'orders');
        const newOrder = {
            ...orderData,
            userId: currentUser.uid,
            userEmail: currentUser.email,
            estado: 'pendiente',
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(ordersCollection, newOrder);

        // Enviar a Google Sheets (estrategia híbrida)
        await sendOrderToSheets({
            id: docRef.id,
            cliente: orderData.clienteNombre,
            total: orderData.total,
            estado: 'pendiente'
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creando pedido:', error);
        return { success: false, error: error.message };
    }
}

// Obtener todos los pedidos (admin/gerente)
export async function getAllOrders() {
    try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, orders };
    } catch (error) {
        console.error('Error obteniendo pedidos:', error);
        return { success: false, error: error.message };
    }
}

// Obtener pedidos de un usuario específico
export async function getUserOrders(userId) {
    try {
        const ordersCollection = collection(db, 'orders');
        const q = query(ordersCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
        const snapshot = await getDocs(q);

        const orders = [];
        snapshot.forEach((doc) => {
            orders.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, orders };
    } catch (error) {
        console.error('Error obteniendo pedidos del usuario:', error);
        return { success: false, error: error.message };
    }
}

// Actualizar estado de un pedido
export async function updateOrderStatus(orderId, newStatus) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await updateDoc(orderRef, {
            estado: newStatus,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error actualizando estado:', error);
        return { success: false, error: error.message };
    }
}

// Eliminar un pedido
export async function deleteOrder(orderId) {
    try {
        const orderRef = doc(db, 'orders', orderId);
        await deleteDoc(orderRef);

        return { success: true };
    } catch (error) {
        console.error('Error eliminando pedido:', error);
        return { success: false, error: error.message };
    }
}

// Estados posibles
export const ORDER_STATES = {
    PENDIENTE: 'pendiente',
    EN_PROCESO: 'en_proceso',
    LISTO: 'listo',
    ENTREGADO: 'entregado',
    CANCELADO: 'cancelado'
};

export const ORDER_STATE_LABELS = {
    pendiente: 'Pendiente',
    en_proceso: 'En Proceso',
    listo: 'Listo',
    entregado: 'Entregado',
    cancelado: 'Cancelado'
};
