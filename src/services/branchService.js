import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query } from 'firebase/firestore';
import { db } from '../firebase/config';

const COLLECTION_NAME = 'branches';

// Obtener todas las sucursales
export async function getAllBranches() {
    try {
        console.log('🔍 [DEBUG] Iniciando getAllBranches...');
        console.log('🔍 [DEBUG] db object:', db);
        console.log('🔍 [DEBUG] Collection name:', COLLECTION_NAME);

        const branchesCollection = collection(db, COLLECTION_NAME);
        console.log('🔍 [DEBUG] branchesCollection:', branchesCollection);

        const q = query(branchesCollection);
        console.log('🔍 [DEBUG] query:', q);

        const snapshot = await getDocs(q);
        console.log('🔍 [DEBUG] snapshot recibido:', snapshot);
        console.log('🔍 [DEBUG] snapshot.size:', snapshot.size);

        const branches = [];
        snapshot.forEach((docSnap) => {
            console.log('🔍 [DEBUG] Documento encontrado:', docSnap.id, docSnap.data());
            branches.push({
                id: docSnap.id,
                ...docSnap.data()
            });
        });

        console.log('🔍 [DEBUG] Total branches:', branches.length);
        return { success: true, branches };
    } catch (error) {
        console.error('❌ [ERROR] Error obteniendo sucursales:', error);
        console.error('❌ [ERROR] Error code:', error.code);
        console.error('❌ [ERROR] Error message:', error.message);
        console.error('❌ [ERROR] Error stack:', error.stack);
        return { success: false, error: error.message };
    }
}

// Crear una nueva sucursal
export async function createBranch(branchData) {
    try {
        console.log('🔍 [DEBUG] Creando sucursal:', branchData);
        const branchesCollection = collection(db, COLLECTION_NAME);
        const newBranch = {
            ...branchData,
            createdAt: new Date(),
            updatedAt: new Date()
        };

        const docRef = await addDoc(branchesCollection, newBranch);
        console.log('✅ [DEBUG] Sucursal creada con ID:', docRef.id);
        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('❌ [ERROR] Error creando sucursal:', error);
        console.error('❌ [ERROR] Error code:', error.code);
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
