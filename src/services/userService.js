import { collection, getDocs, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

// Obtener todos los usuarios
export async function getAllUsers() {
    try {
        const usersCollection = collection(db, 'users');
        const snapshot = await getDocs(usersCollection);

        const users = [];
        snapshot.forEach((doc) => {
            users.push({
                id: doc.id,
                ...doc.data()
            });
        });

        return { success: true, users };
    } catch (error) {
        console.error('Error obteniendo usuarios:', error);
        return { success: false, error: error.message };
    }
}

// Actualizar el rol de un usuario
export async function updateUserRole(userId, newRole) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            rol: newRole,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error actualizando rol:', error);
        return { success: false, error: error.message };
    }
}

// Actualizar sucursal de un usuario
export async function updateUserBranch(userId, branchId, branchName) {
    try {
        const userRef = doc(db, 'users', userId);
        await updateDoc(userRef, {
            branchId: branchId,
            branchName: branchName, // Guardamos el nombre para evitar lecturas extra
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error('Error actualizando sucursal:', error);
        return { success: false, error: error.message };
    }
}

// Roles disponibles
export const ROLES = {
    CLIENTE: 'cliente',
    SUCURSAL: 'sucursal',
    GERENTE: 'gerente',
    ADMINISTRADOR: 'administrador',
    PANADERO: 'panadero',
    TRANSPORTISTA: 'transportista',
    MONITOR: 'monitor'
};

export const ROLE_LABELS = {
    administrador: 'Administrador',
    gerente: 'Gerente',
    sucursal: 'Sucursal',
    cliente: 'Cliente',
    panadero: 'Panadero',
    transportista: 'Transportista',
    monitor: 'Monitor'
};
