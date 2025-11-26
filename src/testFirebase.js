import { db } from './firebase/config';
import { collection, addDoc, getDocs } from 'firebase/firestore';

export const testConnection = async () => {
    try {
        console.log("Iniciando prueba de conexión a Firebase...");

        // Intentar escribir un documento de prueba
        const docRef = await addDoc(collection(db, "test_connection"), {
            message: "¡Conexión exitosa!",
            timestamp: new Date()
        });
        console.log("Documento escrito con ID: ", docRef.id);

        // Intentar leer la colección
        const querySnapshot = await getDocs(collection(db, "test_connection"));
        console.log(`Se encontraron ${querySnapshot.size} documentos en la colección de prueba.`);

        return { success: true, id: docRef.id };
    } catch (e) {
        console.error("Error al conectar con Firebase: ", e);
        return { success: false, error: e };
    }
};
