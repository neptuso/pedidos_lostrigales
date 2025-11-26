import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import { createOrder } from '../services/orderService';
import { getAllBranches } from '../services/branchService';
import { useAuth } from '../context/AuthContext';

export default function NewOrderForm({ onOrderCreated, onCancel }) {
    const { currentUser, userProfile, isCliente } = useAuth();
    const [products, setProducts] = useState([]);
    const [branches, setBranches] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        origenId: '', // Planta de producción
        origenNombre: '',
        destinoId: '', // Sucursal destino
        destinoNombre: '',
        clienteNombre: '', // Solo si es cliente final o venta mostrador
        items: [],
        observaciones: ''
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadData();
    }, []);

    // Autocompletar destino basado en el perfil del usuario
    useEffect(() => {
        if (userProfile?.branchId) {
            setFormData(prev => ({
                ...prev,
                destinoId: userProfile.branchId,
                destinoNombre: userProfile.branchName
            }));
        } else if (isCliente) {
            // Si es cliente, el destino es él mismo (se usará su nombre)
            setFormData(prev => ({
                ...prev,
                clienteNombre: currentUser.displayName || 'Cliente Web'
            }));
        }
    }, [userProfile, isCliente, currentUser]);

    const loadData = async () => {
        const [productsResult, branchesResult] = await Promise.all([
            getAllProducts(),
            getAllBranches()
        ]);

        if (productsResult.success) setProducts(productsResult.products);
        if (branchesResult.success) setBranches(branchesResult.branches);
    };

    const handleAddItem = () => {
        if (!selectedProduct) return;

        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        const existingItemIndex = formData.items.findIndex(item => item.productId === selectedProduct);

        if (existingItemIndex >= 0) {
            const newItems = [...formData.items];
            newItems[existingItemIndex].cantidad += quantity;
            newItems[existingItemIndex].subtotal = newItems[existingItemIndex].cantidad * product.precioA;
            setFormData({ ...formData, items: newItems });
        } else {
            const newItem = {
                productId: product.id,
                descripcion: product.descripcion,
                precioUnitario: product.precioA,
                cantidad: quantity,
                subtotal: product.precioA * quantity
            };
            setFormData({ ...formData, items: [...formData.items, newItem] });
        }

        setSelectedProduct('');
        setQuantity(1);
    };

    const handleRemoveItem = (index) => {
        const newItems = formData.items.filter((_, i) => i !== index);
        setFormData({ ...formData, items: newItems });
    };

    const calculateTotal = () => {
        return formData.items.reduce((sum, item) => sum + item.subtotal, 0);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        // Validaciones
        if (!formData.origenId) {
            setError('Debes seleccionar una Planta de Producción (Origen).');
            setLoading(false);
            return;
        }

        if (!formData.destinoId && !formData.clienteNombre) {
            setError('No se ha definido un destino para el pedido.');
            setLoading(false);
            return;
        }

        if (formData.items.length === 0) {
            setError('Agrega al menos un producto al pedido.');
            setLoading(false);
            return;
        }

        const orderData = {
            ...formData,
            total: calculateTotal(),
            estado: 'pendiente', // Estado inicial del flujo
            historial: [
                {
                    estado: 'pendiente',
                    fecha: new Date(),
                    usuario: currentUser.email,
                    nota: 'Pedido creado'
                }
            ]
        };

        const result = await createOrder(orderData, currentUser);

        if (result.success) {
            onOrderCreated();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    // Filtrar solo plantas de producción para el origen
    const productionPlants = branches.filter(b => b.esPlantaProduccion);

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Selección de Origen y Destino */}
            <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                <h3 className="font-semibold text-blue-800 mb-3">Logística del Pedido</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Origen (Planta de Producción) *
                        </label>
                        <select
                            value={formData.origenId}
                            onChange={(e) => {
                                const branch = branches.find(b => b.id === e.target.value);
                                setFormData({
                                    ...formData,
                                    origenId: e.target.value,
                                    origenNombre: branch ? branch.nombre : ''
                                });
                            }}
                            className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                            required
                        >
                            <option value="">Selecciona una planta...</option>
                            {productionPlants.map(plant => (
                                <option key={plant.id} value={plant.id}>
                                    {plant.nombre}
                                </option>
                            ))}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Destino (Sucursal / Cliente)
                        </label>
                        <div className="px-4 py-2 bg-gray-100 border border-gray-300 rounded-lg text-gray-700 font-medium">
                            {formData.destinoNombre || formData.clienteNombre || 'Sin asignar (Contacte al Admin)'}
                        </div>
                        <p className="text-xs text-gray-500 mt-1">
                            * El destino se asigna automáticamente según tu usuario.
                        </p>
                    </div>
                </div>
            </div>

            {/* Si no tiene sucursal asignada y no es cliente, pedir nombre (caso fallback) */}
            {!formData.destinoId && !isCliente && (
                <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                    <label className="block text-sm font-medium text-yellow-800 mb-1">
                        Nombre del Cliente / Destinatario Manual
                    </label>
                    <input
                        type="text"
                        value={formData.clienteNombre}
                        onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                        className="w-full px-4 py-2 border border-yellow-300 rounded-lg"
                        placeholder="Ingrese nombre del destinatario"
                    />
                </div>
            )}

            {/* Agregar productos */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Agregar Productos</h3>
                <div className="flex gap-2">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    >
                        <option value="">Selecciona un producto...</option>
                        {products.map(product => (
                            <option key={product.id} value={product.id}>
                                {product.descripcion} - ${product.precioA.toFixed(2)}
                            </option>
                        ))}
                    </select>
                    <input
                        type="number"
                        min="1"
                        value={quantity}
                        onChange={(e) => setQuantity(parseInt(e.target.value))}
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    />
                    <button
                        type="button"
                        onClick={handleAddItem}
                        className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition"
                    >
                        + Agregar
                    </button>
                </div>
            </div>

            {/* Lista de items */}
            {formData.items.length > 0 && (
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                    <table className="min-w-full">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">Producto</th>
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cant.</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm">{item.descripcion}</td>
                                    <td className="px-4 py-2 text-sm text-center">{item.cantidad}</td>
                                    <td className="px-4 py-2 text-sm text-right font-medium">${item.subtotal.toFixed(2)}</td>
                                    <td className="px-4 py-2 text-right">
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveItem(index)}
                                            className="text-red-600 hover:text-red-800"
                                        >
                                            ✕
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                        <tfoot className="bg-gray-50">
                            <tr>
                                <td colSpan="2" className="px-4 py-3 text-right font-semibold">Total:</td>
                                <td className="px-4 py-3 text-right font-bold text-lg text-orange-600">
                                    ${calculateTotal().toFixed(2)}
                                </td>
                                <td></td>
                            </tr>
                        </tfoot>
                    </table>
                </div>
            )}

            {/* Observaciones */}
            <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Observaciones</label>
                <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    rows="2"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    placeholder="Notas adicionales..."
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading || formData.items.length === 0}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
                >
                    {loading ? 'Creando...' : 'Confirmar Pedido'}
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
