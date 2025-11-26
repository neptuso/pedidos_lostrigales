import { createContext, useContext, useState, useEffect } from 'react';
import { onAuthChange, getUserProfile } from '../firebase/auth';

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [currentUser, setCurrentUser] = useState(null);
    const [userProfile, setUserProfile] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const unsubscribe = onAuthChange(async (user) => {
            setCurrentUser(user);

            if (user) {
                // Obtener perfil completo del usuario (con rol)
                const profileResult = await getUserProfile(user.uid);
                if (profileResult.success) {
                    setUserProfile(profileResult.data);
                }
            } else {
                setUserProfile(null);
            }

            setLoading(false);
        });

        return unsubscribe;
    }, []);

    const value = {
        currentUser,
        userProfile,
        loading,
        // Helpers para verificar roles
        isAdmin: userProfile?.rol === 'administrador',
        isGerente: userProfile?.rol === 'gerente',
        isSucursal: userProfile?.rol === 'sucursal',
        isCliente: userProfile?.rol === 'cliente',
    };

    return (
        <AuthContext.Provider value={value}>
            {!loading && children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}
