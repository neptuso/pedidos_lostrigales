import { useState } from 'react';

export default function ProductForm({ product, onSave, onCancel }) {
    const [formData, setFormData] = useState(product || {
        categoria: '',
        codigoPLU: '',
        descripcion: '',
        precioA: ''
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (!formData.categoria || !formData.descripcion || !formData.precioA) {
            setError('Por favor completa todos los campos obligatorios');
            setLoading(false);
            return;
        }

        // Convertir precio a número
        const productData = {
            ...formData,
            precioA: parseFloat(formData.precioA),
            codigoPLU: formData.codigoPLU || ''
        };

        const result = await onSave(productData);

        if (!result.success) {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Categoría *
                </label>
                <input
                    type="text"
                    name="categoria"
                    value={formData.categoria}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ej: PANADERIA"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Código PLU
                </label>
                <input
                    type="text"
                    name="codigoPLU"
                    value={formData.codigoPLU}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Código de balanza (opcional)"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Descripción *
                </label>
                <input
                    type="text"
                    name="descripcion"
                    value={formData.descripcion}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Ej: PAN"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Precio A *
                </label>
                <input
                    type="number"
                    name="precioA"
                    value={formData.precioA}
                    onChange={handleChange}
                    step="0.01"
                    min="0"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="0.00"
                    required
                />
            </div>

            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
                >
                    {loading ? 'Guardando...' : (product ? 'Actualizar' : 'Crear Producto')}
                </button>
                <button
                    type="button"
                    onClick={onCancel}
                    className="flex-1 bg-gray-200 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                    Cancelar
                </button>
            </div>
        </form>
    );
}
