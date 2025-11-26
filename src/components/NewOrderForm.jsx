import { useState, useEffect } from 'react';
import { getAllProducts } from '../services/productService';
import { createOrder } from '../services/orderService';
import { useAuth } from '../context/AuthContext';

export default function NewOrderForm({ onOrderCreated, onCancel }) {
    const { currentUser } = useAuth();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const [formData, setFormData] = useState({
        clienteNombre: '',
        clienteTelefono: '',
        items: [],
        observaciones: ''
    });

    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantity, setQuantity] = useState(1);

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        const result = await getAllProducts();
        if (result.success) {
            setProducts(result.products);
        }
    };

    const handleAddItem = () => {
        if (!selectedProduct) return;

        const product = products.find(p => p.id === selectedProduct);
        if (!product) return;

        const existingItemIndex = formData.items.findIndex(item => item.productId === selectedProduct);

        if (existingItemIndex >= 0) {
            // Actualizar cantidad si ya existe
            const newItems = [...formData.items];
            newItems[existingItemIndex].cantidad += quantity;
            setFormData({ ...formData, items: newItems });
        } else {
            // Agregar nuevo item
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

        if (!formData.clienteNombre || formData.items.length === 0) {
            setError('Completa el nombre del cliente y agrega al menos un producto');
            setLoading(false);
            return;
        }

        const orderData = {
            ...formData,
            total: calculateTotal()
        };

        const result = await createOrder(orderData, currentUser);

        if (result.success) {
            onOrderCreated();
        } else {
            setError(result.error);
        }

        setLoading(false);
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
                    {error}
                </div>
            )}

            {/* Datos del cliente */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Datos del Cliente</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Nombre del Cliente *
                        </label>
                        <input
                            type="text"
                            value={formData.clienteNombre}
                            onChange={(e) => setFormData({ ...formData, clienteNombre: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            required
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Teléfono
                        </label>
                        <input
                            type="tel"
                            value={formData.clienteTelefono}
                            onChange={(e) => setFormData({ ...formData, clienteTelefono: e.target.value })}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        />
                    </div>
                </div>
            </div>

            {/* Agregar productos */}
            <div className="bg-gray-50 p-4 rounded-lg">
                <h3 className="font-semibold text-gray-800 mb-3">Agregar Productos</h3>
                <div className="flex gap-2">
                    <select
                        value={selectedProduct}
                        onChange={(e) => setSelectedProduct(e.target.value)}
                        className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                        className="w-24 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
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
                                <th className="px-4 py-2 text-center text-xs font-medium text-gray-500 uppercase">Cantidad</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Precio Unit.</th>
                                <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase">Subtotal</th>
                                <th className="px-4 py-2"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {formData.items.map((item, index) => (
                                <tr key={index}>
                                    <td className="px-4 py-2 text-sm">{item.descripcion}</td>
                                    <td className="px-4 py-2 text-sm text-center">{item.cantidad}</td>
                                    <td className="px-4 py-2 text-sm text-right">${item.precioUnitario.toFixed(2)}</td>
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
                                <td colSpan="3" className="px-4 py-3 text-right font-semibold">Total:</td>
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                    Observaciones
                </label>
                <textarea
                    value={formData.observaciones}
                    onChange={(e) => setFormData({ ...formData, observaciones: e.target.value })}
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                    placeholder="Notas adicionales sobre el pedido..."
                />
            </div>

            {/* Botones */}
            <div className="flex gap-3 pt-4">
                <button
                    type="submit"
                    disabled={loading || formData.items.length === 0}
                    className="flex-1 bg-orange-600 text-white py-3 px-4 rounded-lg hover:bg-orange-700 transition font-medium disabled:bg-gray-400"
                >
                    {loading ? 'Creando...' : 'Crear Pedido'}
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
