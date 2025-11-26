// Script temporal para crear una sucursal de prueba directamente
// Ejecuta esto en la consola del navegador (F12) cuando estés logueado en la app

import { collection, addDoc } from 'firebase/firestore';
import { db } from './src/firebase/config';

async function crearSucursalPrueba() {
    try {
        const branchesCollection = collection(db, 'branches');
        const docRef = await addDoc(branchesCollection, {
            nombre: 'Sucursal Prueba',
            direccion: 'Test 123',
            telefono: '0000',
            esPlantaProduccion: false,
            createdAt: new Date(),
            updatedAt: new Date()
        });
        console.log('✅ Sucursal creada con ID:', docRef.id);
    } catch (error) {
        console.error('❌ Error:', error);
    }
}

crearSucursalPrueba();
