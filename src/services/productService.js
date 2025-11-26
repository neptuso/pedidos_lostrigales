import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase/config';

// Crear un nuevo producto
export async function createProduct(productData) {
    try {
        const productsCollection = collection(db, 'products');
        const docRef = await addDoc(productsCollection, {
            ...productData,
            createdAt: new Date(),
            updatedAt: new Date()
        });

        return { success: true, id: docRef.id };
    } catch (error) {
        console.error('Error creando producto:', error);
        await updateDoc(productRef, {
            ...productData,
            updatedAt: new Date()
        });

        return { success: true };
    } catch (error) {
        console.error('Error actualizando producto:', error);
        return { success: false, error: error.message };
    }
}

// Eliminar un producto
export async function deleteProduct(productId) {
    try {
        const productRef = doc(db, 'products', productId);
        await deleteDoc(productRef);

        return { success: true };
    } catch (error) {
        console.error('Error eliminando producto:', error);
        return { success: false, error: error.message };
    }
}

// Importar productos desde Google Sheets
export async function importProductsFromSheets(products) {
    try {
        const productsCollection = collection(db, 'products');
        let imported = 0;
        let errors = 0;

        for (const product of products) {
            try {
                await addDoc(productsCollection, {
                    ...product,
                    createdAt: new Date(),
                    updatedAt: new Date()
                });
                imported++;
            } catch (err) {
                console.error('Error importando producto:', product, err);
                errors++;
            }
        }

        return {
            success: true,
            imported,
            errors,
            message: `${imported} productos importados, ${errors} errores`
        };
    } catch (error) {
        console.error('Error en importación masiva:', error);
        return { success: false, error: error.message };
    }
}
