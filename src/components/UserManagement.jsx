import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, ROLES, ROLE_LABELS } from '../services/userService';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Cargar usuarios al montar el componente
    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        setLoading(true);
        setError('');
        const result = await getAllUsers();

        if (result.success) {
            // Ordenar: administradores primero, luego por fecha de creación
            const sortedUsers = result.users.sort((a, b) => {
                if (a.rol === 'administrador' && b.rol !== 'administrador') return -1;
                if (a.rol !== 'administrador' && b.rol === 'administrador') return 1;
                return b.createdAt?.seconds - a.createdAt?.seconds;
            });
            setUsers(sortedUsers);
        } else {
            setError('Error al cargar usuarios: ' + result.error);
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        setError('');
        setSuccessMessage('');

        const result = await updateUserRole(userId, newRole);

        if (result.success) {
            setSuccessMessage('Rol actualizado correctamente');
            // Actualizar la lista local sin recargar desde el servidor
            setUsers(users.map(user =>
                user.id === userId ? { ...user, rol: newRole } : user
            ));

            // Limpiar mensaje después de 3 segundos
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError('Error al actualizar rol: ' + result.error);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Cargando usuarios...</div>
            </div>
        );
    }

    return (
        <div className="max-w-6xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>

                {/* Mensajes */}
                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}
                {successMessage && (
                    <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                        {successMessage}
                    </div>
                )}

                {/* Tabla de usuarios */}
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Usuario
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Email
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Fecha de Registro
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                    Rol
                                </th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.photoURL ? (
                                                <img
                                                    src={user.photoURL}
                                                    alt={user.displayName}
                                                    className="h-10 w-10 rounded-full mr-3"
                                                />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center mr-3">
                                                    <span className="text-orange-700 font-semibold">
                                                        {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">
                                                    {user.displayName || 'Sin nombre'}
                                                </div>
                                                {user.id === currentUser.uid && (
                                                    <span className="text-xs text-orange-600">(Tú)</span>
                                                )}
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.email}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {user.createdAt ? new Date(user.createdAt.seconds * 1000).toLocaleDateString('es-AR') : 'N/A'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.rol}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.id === currentUser.uid} // No puede cambiarse su propio rol
                                            className={`
                        px-3 py-2 border rounded-lg text-sm font-medium
                        ${user.id === currentUser.uid ? 'bg-gray-100 cursor-not-allowed' : 'cursor-pointer'}
                        ${user.rol === 'administrador' ? 'border-purple-300 text-purple-700 bg-purple-50' : ''}
                        ${user.rol === 'gerente' ? 'border-blue-300 text-blue-700 bg-blue-50' : ''}
                        ${user.rol === 'sucursal' ? 'border-green-300 text-green-700 bg-green-50' : ''}
                        ${user.rol === 'cliente' ? 'border-gray-300 text-gray-700 bg-gray-50' : ''}
                      `}
                                        >
                                            {Object.entries(ROLES).map(([key, value]) => (
                                                <option key={value} value={value}>
                                                    {ROLE_LABELS[value]}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>

                {users.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                        No hay usuarios registrados aún.
                    </div>
                )}

                {/* Leyenda de roles */}
                <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                    <h3 className="text-sm font-semibold text-gray-700 mb-2">Roles del sistema:</h3>
                    <ul className="text-xs text-gray-600 space-y-1">
                        <li><strong className="text-purple-700">Administrador:</strong> Acceso total al sistema (gestión de usuarios, productos, pedidos)</li>
                        <li><strong className="text-blue-700">Gerente:</strong> Puede ver reportes y estadísticas generales</li>
                        <li><strong className="text-green-700">Sucursal:</strong> Puede gestionar pedidos de su zona</li>
                        <li><strong className="text-gray-700">Cliente:</strong> Puede hacer pedidos y ver su historial</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
