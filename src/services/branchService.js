import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'branches';

// Obtener todas las sucursales
export async function getAllBranches() {
    try {
        // Verificar autenticación
        const { auth } = await import('../firebase/auth');
        const currentUser = auth.currentUser;
        console.log('🔐 Usuario actual en getAllBranches:', currentUser?.email || 'NO AUTENTICADO');

        const branchesCollection = collection(db, COLLECTION_NAME);
        const snapshot = await getDocs(branchesCollection);

        const branches = [];
        snapshot.forEach((docSnap) => {
            branches.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        // Ordenar por nombre en el cliente
        branches.sort((a, b) => (a.nombre || '').localeCompare(b.nombre || ''));

        return { success: true, branches };
    } catch (error) {
        console.error('Error obteniendo sucursales:', error);
        return { success: false, error: error.message };
    }
}

// Crear una nueva sucursal
export async function createBranch(branchData) {
    try {
        const branchesCollection = collection(db, COLLECTION_NAME);
        const newBranch = {
            ...branchData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(branchesCollection, newBranch);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creando sucursal:', error);
        return { success: false, error: error.message };
    }
}

// Actualizar una sucursal
export async function updateBranch(branchId, branchData) {
    try {
        const branchRef = doc(db, COLLECTION_NAME, branchId);
        await updateDoc(branchRef, {
            ...branchData,
            updatedAt: new Date()
        });
        return { success: true };
    } catch (error) {
        console.error('Error actualizando sucursal:', error);
        return { success: false, error: error.message };
    }
}

// Eliminar una sucursal
export async function deleteBranch(branchId) {
    try {
        const branchRef = doc(db, COLLECTION_NAME, branchId);
        await deleteDoc(branchRef);
        return { success: true };
    } catch (error) {
        console.error('Error eliminando sucursal:', error);
        return { success: false, error: error.message };
    }
}
