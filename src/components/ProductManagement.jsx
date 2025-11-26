import { useState, useEffect } from 'react';
import { getAllProducts, createProduct, updateProduct, deleteProduct } from '../services/productService';
import ProductForm from './ProductForm';
import ImportFromSheets from './ImportFromSheets';

export default function ProductManagement() {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showForm, setShowForm] = useState(false);
    const [editingProduct, setEditingProduct] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');
    const [filterCategory, setFilterCategory] = useState('');

    useEffect(() => {
        loadProducts();
    }, []);

    const loadProducts = async () => {
        setLoading(true);
        const result = await getAllProducts();

        if (result.success) {
            setProducts(result.products);
        } else {
            setError('Error al cargar productos: ' + result.error);
        }
        setLoading(false);
    };

    const handleSaveProduct = async (productData) => {
        let result;

        if (editingProduct) {
            result = await updateProduct(editingProduct.id, productData);
        } else {
            result = await createProduct(productData);
        }

        if (result.success) {
            setShowForm(false);
            setEditingProduct(null);
            loadProducts();
        }

        return result;
    };

    const handleEditProduct = (product) => {
        setEditingProduct(product);
        setShowForm(true);
    };

    const handleDeleteProduct = async (productId) => {
        if (!confirm('¿Estás seguro de eliminar este producto?')) return;

        const result = await deleteProduct(productId);
        if (result.success) {
            loadProducts();
        } else {
            alert('Error al eliminar: ' + result.error);
        }
    };

    const handleCancelForm = () => {
        setShowForm(false);
        setEditingProduct(null);
    };

    // Obtener categorías únicas
    const categories = [...new Set(products.map(p => p.categoria))].sort();

    // Filtrar productos
    const filteredProducts = products.filter(product => {
        const matchesSearch = product.descripcion.toLowerCase().includes(searchTerm.toLowerCase()) ||
            product.codigoPLU?.toLowerCase().includes(searchTerm.toLowerCase());
        const matchesCategory = !filterCategory || product.categoria === filterCategory;
        return matchesSearch && matchesCategory;
    });

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Cargando productos...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Productos</h2>
                    <button
                        onClick={() => setShowForm(!showForm)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                    >
                        {showForm ? 'Cancelar' : '+ Nuevo Producto'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Importador */}
                {!showForm && products.length === 0 && (
                    <div className="mb-6">
                        <ImportFromSheets onImportComplete={loadProducts} />
                    </div>
                )}

                {/* Formulario */}
                {showForm && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">
                            {editingProduct ? 'Editar Producto' : 'Nuevo Producto'}
                        </h3>
                        <ProductForm
                            product={editingProduct}
                            onSave={handleSaveProduct}
                            onCancel={handleCancelForm}
                        />
                    </div>
                )}

                {/* Filtros */}
                {products.length > 0 && (
                    <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <input
                                type="text"
                                placeholder="Buscar por descripción o código..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            />
                        </div>
                        <div>
                            <select
                                value={filterCategory}
                                onChange={(e) => setFilterCategory(e.target.value)}
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                            >
                                <option value="">Todas las categorías</option>
                                {categories.map(cat => (
                                    <option key={cat} value={cat}>{cat}</option>
                                ))}
                            </select>
                        </div>
                    </div>
                )}

                {/* Tabla de productos */}
                {filteredProducts.length > 0 ? (
                    <div className="overflow-x-auto">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Categoría
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Código PLU
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Descripción
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Precio A
                                    </th>
                                    <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Acciones
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {filteredProducts.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50">
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-100 text-orange-800">
                                                {product.categoria}
                                            </span>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                            {product.codigoPLU || '-'}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                                            {product.descripcion}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                                            ${product.precioA.toFixed(2)}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <button
                                                onClick={() => handleEditProduct(product)}
                                                className="text-blue-600 hover:text-blue-900 mr-4"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteProduct(product.id)}
                                                className="text-red-600 hover:text-red-900"
                                            >
                                                Eliminar
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        {searchTerm || filterCategory ? 'No se encontraron productos con esos filtros' : 'No hay productos cargados'}
                    </div>
                )}

                {/* Resumen */}
                {products.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                        Mostrando {filteredProducts.length} de {products.length} productos
                    </div>
                )}
            </div>
        </div>
    );
}
