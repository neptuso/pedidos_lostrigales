import { useState, useEffect } from 'react';
import { getAllOrders, getUserOrders, updateOrderStatus, deleteOrder, ORDER_STATES, ORDER_STATE_LABELS } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import NewOrderForm from './NewOrderForm';

export default function OrderManagement() {
    const { currentUser, isAdmin, isGerenteOrHigher } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showNewOrderForm, setShowNewOrderForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    useEffect(() => {
        loadOrders();
    }, []);

    const loadOrders = async () => {
        setLoading(true);
        let result;

        if (isGerenteOrHigher) {
            result = await getAllOrders();
        } else {
            result = await getUserOrders(currentUser.uid);
        }

        if (result.success) {
            setOrders(result.orders);
        } else {
            setError('Error al cargar pedidos: ' + result.error);
        }
        setLoading(false);
    };

    const handleStatusChange = async (orderId, newStatus) => {
        const result = await updateOrderStatus(orderId, newStatus);
        if (result.success) {
            loadOrders();
        } else {
            alert('Error al actualizar estado: ' + result.error);
        }
    };

    const handleDeleteOrder = async (orderId) => {
        if (!confirm('¿Estás seguro de eliminar este pedido?')) return;

        const result = await deleteOrder(orderId);
        if (result.success) {
            loadOrders();
        } else {
            alert('Error al eliminar: ' + result.error);
        }
    };

    const handleOrderCreated = () => {
        setShowNewOrderForm(false);
        loadOrders();
    };

    const getStatusColor = (status) => {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            en_proceso: 'bg-blue-100 text-blue-800 border-blue-300',
            listo: 'bg-green-100 text-green-800 border-green-300',
            entregado: 'bg-gray-100 text-gray-800 border-gray-300',
            cancelado: 'bg-red-100 text-red-800 border-red-300'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const filteredOrders = filterStatus
        ? orders.filter(order => order.estado === filterStatus)
        : orders;

    if (loading) {
        return (
            <div className="flex justify-center items-center h-64">
                <div className="text-gray-500">Cargando pedidos...</div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto p-6">
            <div className="bg-white rounded-xl shadow-lg p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-800">Gestión de Pedidos</h2>
                    <button
                        onClick={() => setShowNewOrderForm(!showNewOrderForm)}
                        className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition font-medium"
                    >
                        {showNewOrderForm ? 'Cancelar' : '+ Nuevo Pedido'}
                    </button>
                </div>

                {error && (
                    <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                        {error}
                    </div>
                )}

                {/* Formulario de nuevo pedido */}
                {showNewOrderForm && (
                    <div className="mb-6 p-6 bg-gray-50 rounded-lg">
                        <h3 className="text-lg font-semibold mb-4">Nuevo Pedido</h3>
                        <NewOrderForm
                            onOrderCreated={handleOrderCreated}
                            onCancel={() => setShowNewOrderForm(false)}
                        />
                    </div>
                )}

                {/* Filtro por estado */}
                {!showNewOrderForm && orders.length > 0 && (
                    <div className="mb-6">
                        <select
                            value={filterStatus}
                            onChange={(e) => setFilterStatus(e.target.value)}
                            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 focus:border-transparent"
                        >
                            <option value="">Todos los estados</option>
                            {Object.entries(ORDER_STATE_LABELS).map(([key, label]) => (
                                <option key={key} value={key}>{label}</option>
                            ))}
                        </select>
                    </div>
                )}

                {/* Lista de pedidos */}
                {filteredOrders.length > 0 ? (
                    <div className="space-y-4">
                        {filteredOrders.map((order) => (
                            <div key={order.id} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition">
                                <div className="flex justify-between items-start mb-3">
                                    <div>
                                        <h3 className="font-semibold text-lg text-gray-800">{order.clienteNombre}</h3>
                                        <p className="text-sm text-gray-500">
                                            {order.createdAt?.toDate?.().toLocaleDateString('es-AR', {
                                                day: '2-digit',
                                                month: 'short',
                                                year: 'numeric',
                                                hour: '2-digit',
                                                minute: '2-digit'
                                            })}
                                        </p>
                                        {order.clienteTelefono && (
                                            <p className="text-sm text-gray-600">📞 {order.clienteTelefono}</p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-600">${order.total.toFixed(2)}</p>
                                        {isGerenteOrHigher ? (
                                            <select
                                                value={order.estado}
                                                onChange={(e) => handleStatusChange(order.id, e.target.value)}
                                                className={`mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.estado)}`}
                                            >
                                                {Object.entries(ORDER_STATES).map(([key, value]) => (
                                                    <option key={value} value={value}>
                                                        {ORDER_STATE_LABELS[value]}
                                                    </option>
                                                ))}
                                            </select>
                                        ) : (
                                            <span className={`inline-block mt-2 px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.estado)}`}>
                                                {ORDER_STATE_LABELS[order.estado]}
                                            </span>
                                        )}
                                    </div>
                                </div>

                                {/* Items del pedido */}
                                <div className="bg-gray-50 rounded p-3 mb-3">
                                    <h4 className="text-sm font-semibold text-gray-700 mb-2">Productos:</h4>
                                    <ul className="space-y-1">
                                        {order.items.map((item, index) => (
                                            <li key={index} className="text-sm flex justify-between">
                                                <span>{item.cantidad}x {item.descripcion}</span>
                                                <span className="font-medium">${item.subtotal.toFixed(2)}</span>
                                            </li>
                                        ))}
                                    </ul>
                                </div>

                                {order.observaciones && (
                                    <div className="text-sm text-gray-600 mb-3">
                                        <strong>Observaciones:</strong> {order.observaciones}
                                    </div>
                                )}

                                {isAdmin && (
                                    <div className="flex justify-end">
                                        <button
                                            onClick={() => handleDeleteOrder(order.id)}
                                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                                        >
                                            Eliminar Pedido
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-12 text-gray-500">
                        {filterStatus ? 'No hay pedidos con ese estado' : 'No hay pedidos aún'}
                    </div>
                )}

                {orders.length > 0 && (
                    <div className="mt-4 text-sm text-gray-600">
                        Mostrando {filteredOrders.length} de {orders.length} pedidos
                    </div>
                )}
            </div>
        </div>
    );
}
