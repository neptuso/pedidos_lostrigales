import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { logout } from '../firebase/auth';

export default function UserProfileDropdown() {
    const { currentUser, userProfile } = useAuth();
    const [isOpen, setIsOpen] = useState(false);
    const [sessionTime, setSessionTime] = useState('');
    const dropdownRef = useRef(null);

    // Calcular tiempo de sesión
    useEffect(() => {
        const loginTime = currentUser?.metadata?.lastSignInTime;
        if (!loginTime) return;

        const updateSessionTime = () => {
            const now = new Date();
            const login = new Date(loginTime);
            const diff = now - login;

            const hours = Math.floor(diff / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

            if (hours > 0) {
                setSessionTime(`${hours}h ${minutes}m`);
            } else {
                setSessionTime(`${minutes} minutos`);
            }
        };

        updateSessionTime();
        const interval = setInterval(updateSessionTime, 60000); // Actualizar cada minuto

        return () => clearInterval(interval);
    }, [currentUser]);

    // Cerrar dropdown al hacer clic fuera
    useEffect(() => {
        function handleClickOutside(event) {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        }

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        await logout();
    };

    const formatDate = (dateString) => {
        if (!dateString) return 'N/A';
        return new Date(dateString).toLocaleDateString('es-AR', {
            day: '2-digit',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="relative" ref={dropdownRef}>
            {/* Botón de usuario */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition"
            >
                {userProfile?.photoURL ? (
                    <img
                        src={userProfile.photoURL}
                        alt={userProfile.displayName}
                        className="h-10 w-10 rounded-full border-2 border-orange-300"
                    />
                ) : (
                    <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center border-2 border-orange-300">
                        <span className="text-orange-700 font-semibold text-lg">
                            {userProfile?.displayName?.[0]?.toUpperCase() || currentUser?.email[0].toUpperCase()}
                        </span>
                    </div>
                )}
                <div className="text-left hidden md:block">
                    <p className="text-sm font-medium text-gray-700">{userProfile?.displayName}</p>
                    <p className="text-xs text-gray-500 capitalize">{userProfile?.rol}</p>
                </div>
                <svg
                    className={`w-4 h-4 text-gray-500 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown Menu */}
            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 z-50">
                    {/* Header del perfil */}
                    <div className="p-4 border-b border-gray-200 bg-gradient-to-r from-orange-50 to-orange-100">
                        <div className="flex items-center gap-3">
                            {userProfile?.photoURL ? (
                                <img
                                    src={userProfile.photoURL}
                                    alt={userProfile.displayName}
                                    className="h-16 w-16 rounded-full border-3 border-white shadow-md"
                                />
                            ) : (
                                <div className="h-16 w-16 rounded-full bg-orange-300 flex items-center justify-center border-3 border-white shadow-md">
                                    <span className="text-white font-bold text-2xl">
                                        {userProfile?.displayName?.[0]?.toUpperCase() || currentUser?.email[0].toUpperCase()}
                                    </span>
                                </div>
                            )}
                            <div>
                                <h3 className="font-bold text-gray-800">{userProfile?.displayName || 'Sin nombre'}</h3>
                                <p className="text-sm text-gray-600">{currentUser?.email}</p>
                                <span className="inline-block mt-1 px-2 py-1 text-xs font-semibold rounded-full bg-orange-200 text-orange-800 capitalize">
                                    {userProfile?.rol}
                                </span>
                            </div>
                        </div>
                    </div>

                    {/* Detalles de la sesión */}
                    <div className="p-4 space-y-3">
                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">⏱️ Tiempo de sesión:</span>
                            <span className="font-semibold text-gray-800">{sessionTime}</span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">🔐 Último acceso:</span>
                            <span className="font-medium text-gray-800 text-xs">
                                {formatDate(currentUser?.metadata?.lastSignInTime)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">📅 Cuenta creada:</span>
                            <span className="font-medium text-gray-800 text-xs">
                                {formatDate(currentUser?.metadata?.creationTime)}
                            </span>
                        </div>

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">🔑 Método:</span>
                            <span className="font-medium text-gray-800">
                                {currentUser?.providerData[0]?.providerId === 'google.com' ? 'Google' : 'Email/Contraseña'}
                            </span>
                        </div>
                    </div>

                    {/* Acciones */}
                    <div className="border-t border-gray-200 p-2">
                        <button
                            onClick={handleLogout}
                            className="w-full flex items-center justify-center gap-2 px-4 py-3 text-red-600 hover:bg-red-50 rounded-lg transition font-medium"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                            </svg>
                            Cerrar Sesión
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
