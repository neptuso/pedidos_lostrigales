import { useState, useEffect } from 'react';
import { getAllUsers, updateUserRole, updateUserBranch, ROLES, ROLE_LABELS } from '../services/userService';
import { getAllBranches } from '../services/branchService';
import { useAuth } from '../context/AuthContext';

export default function UserManagement() {
    const { currentUser } = useAuth();
    const [users, setUsers] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [successMessage, setSuccessMessage] = useState('');

    // Cargar usuarios y sucursales al montar
    useEffect(() => {
        loadData();
    }, []);

    const loadData = async () => {
        setLoading(true);
        setError('');

        const [usersResult, branchesResult] = await Promise.all([
            getAllUsers(),
            getAllBranches()
        ]);

        if (usersResult.success && branchesResult.success) {
            // Ordenar usuarios
            const sortedUsers = usersResult.users.sort((a, b) => {
                if (a.rol === 'administrador' && b.rol !== 'administrador') return -1;
                if (a.rol !== 'administrador' && b.rol === 'administrador') return 1;
                return b.createdAt?.seconds - a.createdAt?.seconds;
            });
            setUsers(sortedUsers);
            setBranches(branchesResult.branches);
        } else {
            setError('Error al cargar datos: ' + (usersResult.error || branchesResult.error));
        }
        setLoading(false);
    };

    const handleRoleChange = async (userId, newRole) => {
        setError('');
        setSuccessMessage('');

        const result = await updateUserRole(userId, newRole);

        if (result.success) {
            setSuccessMessage('Rol actualizado correctamente');
            setUsers(users.map(user =>
                user.id === userId ? { ...user, rol: newRole } : user
            ));
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError('Error al actualizar rol: ' + result.error);
        }
    };

    const handleBranchChange = async (userId, branchId) => {
        setError('');
        setSuccessMessage('');

        const branch = branches.find(b => b.id === branchId);
        const branchName = branch ? branch.nombre : null;

        const result = await updateUserBranch(userId, branchId, branchName);

        if (result.success) {
            setSuccessMessage('Sucursal asignada correctamente');
            setUsers(users.map(user =>
                user.id === userId ? { ...user, branchId: branchId, branchName: branchName } : user
            ));
            setTimeout(() => setSuccessMessage(''), 3000);
        } else {
            setError('Error al asignar sucursal: ' + result.error);
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
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Gestión de Usuarios</h2>

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

                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Usuario</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Rol</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Sucursal Asignada</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {users.map((user) => (
                                <tr key={user.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <div className="flex items-center">
                                            {user.photoURL ? (
                                                <img src={user.photoURL} alt={user.displayName} className="h-10 w-10 rounded-full mr-3" />
                                            ) : (
                                                <div className="h-10 w-10 rounded-full bg-orange-200 flex items-center justify-center mr-3">
                                                    <span className="text-orange-700 font-semibold">
                                                        {user.displayName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
                                                    </span>
                                                </div>
                                            )}
                                            <div>
                                                <div className="text-sm font-medium text-gray-900">{user.displayName || 'Sin nombre'}</div>
                                                <div className="text-xs text-gray-500">{user.email}</div>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.rol}
                                            onChange={(e) => handleRoleChange(user.id, e.target.value)}
                                            disabled={user.id === currentUser.uid}
                                            className={`px-3 py-2 border rounded-lg text-sm font-medium cursor-pointer focus:ring-2 focus:ring-orange-500 ${getRoleColor(user.rol)}`}
                                        >
                                            {Object.entries(ROLES).map(([key, value]) => (
                                                <option key={value} value={value}>{ROLE_LABELS[value]}</option>
                                            ))}
                                        </select>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <select
                                            value={user.branchId || ''}
                                            onChange={(e) => handleBranchChange(user.id, e.target.value)}
                                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 w-full max-w-xs"
                                        >
                                            <option value="">-- Sin asignar --</option>
                                            {branches.map(branch => (
                                                <option key={branch.id} value={branch.id}>
                                                    {branch.nombre} {branch.esPlantaProduccion ? '(Planta)' : ''}
                                                </option>
                                            ))}
                                        </select>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
