import { useState } from 'react';
import { signInWithGoogle, signInWithEmail, registerWithEmail } from '../firebase/auth';

export default function Login() {
    const [isRegistering, setIsRegistering] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [displayName, setDisplayName] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleGoogleLogin = async () => {
        setLoading(true);
        setError('');
        const result = await signInWithGoogle();
        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        let result;
        if (isRegistering) {
            if (!displayName.trim()) {
                setError('Por favor ingresa tu nombre');
                setLoading(false);
                return;
            }
            result = await registerWithEmail(email, password, displayName);
        } else {
            result = await signInWithEmail(email, password);
        }

        if (!result.success) {
            setError(result.error);
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gradient-to-br from-orange-100 to-orange-200 flex items-center justify-center p-4">
            <div className="bg-white rounded-2xl shadow-2xl p-8 w-full max-w-md">
                {/* Logo y Título */}
                <div className="text-center mb-8">
                    <h1 className="text-4xl font-bold text-orange-800 mb-2">🍞 Los Trigales</h1>
                    <p className="text-gray-600">
                        {isRegistering ? 'Crear nueva cuenta' : 'Iniciar sesión'}
                    </p>
                </div>

                {/* Mensajes de error */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Botón de Google */}
                <button
                    onClick={handleGoogleLogin}
                    disabled={loading}
                    className="w-full bg-white border-2 border-gray-300 text-gray-700 font-semibold py-3 px-4 rounded-lg hover:bg-gray-50 transition flex items-center justify-center gap-3 mb-6"
                >
                    <svg className="w-5 h-5" viewBox="0 0 24 24">
                        <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                        <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
                        <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
                        <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
                    </svg>
                    Continuar con Google
                </button>

                <div className="flex items-center gap-4 mb-6">
                    <div className="flex-1 h-px bg-gray-300"></div>
                    <span className="text-gray-500 text-sm">o</span>
                    <div className="flex-1 h-px bg-gray-300"></div>
                </div>

                {/* Formulario Email/Contraseña */}
                <form onSubmit={handleEmailSubmit} className="space-y-4">
                    {isRegistering && (
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Nombre completo
                            </label>
                            <input
                                type="text"
                                value={displayName}
                                onChange={(e) => setDisplayName(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                                required={isRegistering}
                            />
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Correo electrónico
                        </label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Contraseña
                        </label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                            minLength={6}
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-orange-600 text-white font-semibold py-3 px-4 rounded-lg hover:bg-orange-700 transition disabled:bg-gray-400"
                    >
                        {loading ? 'Cargando...' : (isRegistering ? 'Registrarse' : 'Iniciar sesión')}
                    </button>
                </form>

                {/* Toggle entre Login y Registro */}
                <div className="mt-6 text-center">
                    <button
                        onClick={() => {
                            setIsRegistering(!isRegistering);
                            setError('');
                        }}
                        className="text-orange-600 hover:text-orange-700 text-sm font-medium"
                    >
                        {isRegistering
                            ? '¿Ya tienes cuenta? Inicia sesión'
                            : '¿No tienes cuenta? Regístrate'}
                    </button>
                </div>
            </div>
        </div>
    );
}
