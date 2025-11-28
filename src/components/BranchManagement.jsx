import { useState, useEffect } from 'react';
import { getAllBranches, createBranch, updateBranch, deleteBranch } from '../services/branchService';

export default function BranchManagement() {
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [currentBranchId, setCurrentBranchId] = useState(null);

    const [formData, setFormData] = useState({
        nombre: '',
        direccion: '',
        telefono: '',
        esPlantaProduccion: false
    });

    useEffect(() => {
        loadBranches();
    }, []);

    const loadBranches = async () => {
        setLoading(true);
        const result = await getAllBranches();
        if (result.success) {
            setBranches(result.branches);
        } else {
            setError('Error al cargar sucursales: ' + result.error);
        }
        setLoading(false);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (!formData.nombre) {
            setError('El nombre es obligatorio');
            return;
        }

        let result;
        if (isEditing) {
            result = await updateBranch(currentBranchId, formData);
        } else {
            result = await createBranch(formData);
        }

        if (result.success) {
            loadBranches();
            resetForm();
        } else {
            setError('Error al guardar: ' + result.error);
        }
    };

    const handleEdit = (branch) => {
        setFormData({
            nombre: branch.nombre,
            direccion: branch.direccion || '',
            telefono: branch.telefono || '',
            esPlantaProduccion: branch.esPlantaProduccion || false
        });
        setCurrentBranchId(branch.id);
        setIsEditing(true);
    };

    const handleDelete = async (id) => {
        if (confirm('¿Estás seguro de eliminar esta sucursal?')) {
            const result = await deleteBranch(id);
            if (result.success) {
                loadBranches();
            } else {
                alert('Error al eliminar: ' + result.error);
            }
        }
    };

    const resetForm = () => {
        setFormData({
            nombre: '',
            direccion: '',
            telefono: '',
            esPlantaProduccion: false
        });
        setIsEditing(false);
        setCurrentBranchId(null);
        setError('');
    };

    if (loading) return <div className="p-4 text-center">Cargando sucursales...</div>;

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-4">
                    {isEditing ? 'Editar Sucursal' : 'Nueva Sucursal'}
                </h2>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
                        <input
                            type="text"
                            value={formData.nombre}
                            onChange={(e) => setFormData({ ...formData, nombre: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="Ej: Los Trigales"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Dirección</label>
                        <input
                            type="text"
                            value={formData.direccion}
                            onChange={(e) => setFormData({ ...formData, direccion: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="Ej: Av. San Martín 123"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Teléfono</label>
                        <input
                            type="text"
                            value={formData.telefono}
                            onChange={(e) => setFormData({ ...formData, telefono: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                            placeholder="Ej: 3456-7890"
                        />
                    </div>
                    <div className="flex items-center mt-6">
                        <input
                            type="checkbox"
                            id="esPlanta"
                            checked={formData.esPlantaProduccion}
                            onChange={(e) => setFormData({ ...formData, esPlantaProduccion: e.target.checked })}
                            className="w-5 h-5 text-orange-600 rounded focus:ring-orange-500 border-gray-300"
                        />
                        <label htmlFor="esPlanta" className="ml-2 text-sm font-medium text-gray-700">
                            Es Planta de Producción
                        </label>
                    </div>

                    <div className="md:col-span-2 flex gap-2 mt-2">
                        <button
                            type="submit"
                            className="bg-orange-600 text-white px-6 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                        >
                            {isEditing ? 'Actualizar' : 'Crear Sucursal'}
                        </button>
                        {isEditing && (
                            <button
                                type="button"
                                onClick={resetForm}
                                className="bg-gray-200 text-gray-700 px-6 py-2 rounded-lg hover:bg-gray-300 transition font-medium"
                            >
                                Cancelar
                            </button>
                        )}
                    </div>
                </form>
            </div>

            <div className="bg-white rounded-xl shadow-lg p-6">
                <h2 className="text-xl font-bold text-gray-800 mb-4">Listado de Sucursales</h2>
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Nombre</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Dirección</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Tipo</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Acciones</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {branches.map((branch) => (
                                <tr key={branch.id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap font-medium text-gray-900">
                                        {branch.nombre}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-gray-500">
                                        {branch.direccion || '-'}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        {branch.esPlantaProduccion ? (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-100 text-purple-800">
                                                Planta Producción
                                            </span>
                                        ) : (
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                                                Sucursal Venta
                                            </span>
                                        )}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                        <button
                                            onClick={() => handleEdit(branch)}
                                            className="text-indigo-600 hover:text-indigo-900 mr-4"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => handleDelete(branch.id)}
                                            className="text-red-600 hover:text-red-900"
                                        >
                                            Eliminar
                                        </button>
                                    </td>
                                </tr>
                            ))}
                            {branches.length === 0 && (
                                <tr>
                                    <td colSpan="4" className="px-6 py-4 text-center text-gray-500">
                                        No hay sucursales registradas.
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
