import {
    getAuth,
    signInWithPopup,
    GoogleAuthProvider,
    signInWithEmailAndPassword,
    createUserWithEmailAndPassword,
    signOut,
    onAuthStateChanged
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import app, { db } from './config';

export const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();

// Email del administrador principal (CAMBIAR POR TU EMAIL)
const ADMIN_EMAIL = "neptuso@gmail.com";

// Crear perfil de usuario en Firestore cuando se registra
async function createUserProfile(user, additionalData = {}) {
    const userRef = doc(db, 'users', user.uid);
    const snapshot = await getDoc(userRef);

    if (!snapshot.exists()) {
        const { email, displayName, photoURL } = user;
        const role = email === ADMIN_EMAIL ? 'administrador' : 'cliente';

        try {
            await setDoc(userRef, {
                email,
                displayName: displayName || email.split('@')[0],
                photoURL: photoURL || '',
                rol: role,
                createdAt: new Date(),
                ...additionalData
            });
            console.log('Perfil de usuario creado:', email, 'Rol:', role);
        } catch (error) {
            console.error('Error creando perfil:', error);
        }
    }

    return userRef;
}

// Login con Google
export async function signInWithGoogle() {
    try {
        const result = await signInWithPopup(auth, googleProvider);
        await createUserProfile(result.user);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Error en login con Google:', error);
        return { success: false, error: error.message };
    }
}

// Registro con Email y Contraseña
export async function registerWithEmail(email, password, displayName) {
    try {
        const result = await createUserWithEmailAndPassword(auth, email, password);
        await createUserProfile(result.user, { displayName });
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Error en registro:', error);
        return { success: false, error: error.message };
    }
}

// Login con Email y Contraseña
export async function signInWithEmail(email, password) {
    try {
        const result = await signInWithEmailAndPassword(auth, email, password);
        return { success: true, user: result.user };
    } catch (error) {
        console.error('Error en login:', error);
        return { success: false, error: error.message };
    }
}

// Cerrar sesión
export async function logout() {
    try {
        await signOut(auth);
        return { success: true };
    } catch (error) {
        console.error('Error al cerrar sesión:', error);
        return { success: false, error: error.message };
    }
}

// Obtener datos del perfil del usuario actual
export async function getUserProfile(uid) {
    try {
        const userRef = doc(db, 'users', uid);
        const snapshot = await getDoc(userRef);

        if (snapshot.exists()) {
            return { success: true, data: snapshot.data() };
        } else {
            return { success: false, error: 'Perfil no encontrado' };
        }
    } catch (error) {
        console.error('Error obteniendo perfil:', error);
        return { success: false, error: error.message };
    }
}

// Escuchar cambios en el estado de autenticación
export function onAuthChange(callback) {
    return onAuthStateChanged(auth, callback);
}
