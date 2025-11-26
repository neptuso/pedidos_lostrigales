import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'branches';

// Obtener todas las sucursales
export async function getAllBranches() {
    try {
        const branchesCollection = collection(db, COLLECTION_NAME);
        const q = query(branchesCollection, orderBy('nombre', 'asc'));
        const snapshot = await getDocs(q);

        const branches = [];
        snapshot.forEach((doc) => {
            branches.push({
                id: doc.id,
                ...doc.data()
            });
        });

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
