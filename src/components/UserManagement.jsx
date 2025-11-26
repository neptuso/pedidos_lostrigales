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

    const getRoleColor = (rol) => {
        const colors = {
            administrador: 'bg-purple-100 text-purple-800',
            gerente: 'bg-blue-100 text-blue-800',
            sucursal: 'bg-green-100 text-green-800',
            cliente: 'bg-gray-100 text-gray-800',
            panadero: 'bg-orange-100 text-orange-800',
            transportista: 'bg-yellow-100 text-yellow-800',
            monitor: 'bg-teal-100 text-teal-800'
        };
        return colors[rol] || 'bg-gray-100 text-gray-800';
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
                        px-3 py-2 border rounded-lg text-sm font-medium cursor-pointer focus:ring-2 focus:ring-orange-500
                        ${user.id === currentUser.uid ? 'bg-gray-100 cursor-not-allowed' : ''}
                        ${getRoleColor(user.rol)}
                      `}
                                        >
                                            <option value="cliente">Cliente</option>
                                            <option value="sucursal">Sucursal</option>
                                            <option value="gerente">Gerente</option>
                                            <option value="panadero">Panadero</option>
                                            <option value="transportista">Transportista</option>
                                            <option value="monitor">Monitor</option>
                                            <option value="administrador">Administrador</option>
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
                        <li><strong className="text-purple-700">Administrador:</strong> Acceso total al sistema.</li>
                        <li><strong className="text-blue-700">Gerente:</strong> Gestión y reportes.</li>
                        <li><strong className="text-orange-700">Panadero:</strong> Elaboración y despacho.</li>
                        <li><strong className="text-yellow-700">Transportista:</strong> Logística y entrega.</li>
                        <li><strong className="text-green-700">Sucursal:</strong> Gestión de pedidos locales.</li>
                        <li><strong className="text-teal-700">Monitor:</strong> Solo lectura.</li>
                        <li><strong className="text-gray-700">Cliente:</strong> Pedidos personales.</li>
                    </ul>
                </div>
            </div>
        </div>
    );
}
