import { useState, useEffect } from 'react';
import { getAllOrders, getUserOrders, getOrdersForPlant, updateOrderStatus, deleteOrder, ORDER_STATES, ORDER_STATE_LABELS } from '../services/orderService';
import { useAuth } from '../context/AuthContext';
import NewOrderForm from './NewOrderForm';

export default function OrderManagement() {
    const { currentUser, userProfile, isAdmin, isGerenteOrHigher } = useAuth();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [showNewOrderForm, setShowNewOrderForm] = useState(false);
    const [filterStatus, setFilterStatus] = useState('');

    const isPanadero = userProfile?.rol === 'panadero';
    const isTransportista = userProfile?.rol === 'transportista';

    useEffect(() => {
        loadOrders();
    }, [currentUser, userProfile]);

    const loadOrders = async () => {
        setLoading(true);
        let result;

        if (isGerenteOrHigher) {
            result = await getAllOrders();
        } else if (isPanadero || isTransportista) {
            // Panaderos y Transportistas ven pedidos de su planta asignada
            if (userProfile?.branchId) {
                result = await getOrdersForPlant(userProfile.branchId);
            } else {
                result = { success: false, error: 'No tienes una planta asignada.' };
            }
        } else {
            result = await getUserOrders(currentUser.uid);
        }

        if (result.success) {
            // Filtrar pedidos relevantes para cada rol operativo
            let filtered = result.orders;

            if (isPanadero) {
                // Panaderos ven: Pendientes, En Producción, Listos (para referencia)
                filtered = result.orders.filter(o => ['pendiente', 'en_produccion', 'listo_despacho'].includes(o.estado));
            } else if (isTransportista) {
                // Transportistas ven: Listos para Despacho, En Ruta, Entregados (recientes)
                filtered = result.orders.filter(o => ['listo_despacho', 'en_ruta', 'entregado'].includes(o.estado));
            }

            setOrders(filtered);
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

    const printOrderTicket = (order) => {
        const printWindow = window.open('', '_blank', 'width=600,height=600');
        if (!printWindow) {
            alert('Por favor, permite las ventanas emergentes para imprimir.');
            return;
        }

        const ticketContent = `
            <html>
            <head>
                <title>Comanda #${order.id.slice(-6)}</title>
                <style>
                    body { font-family: 'Courier New', monospace; padding: 20px; max-width: 400px; margin: 0 auto; }
                    .header { text-align: center; border-bottom: 2px dashed #000; padding-bottom: 10px; margin-bottom: 10px; }
                    .title { font-size: 24px; font-weight: bold; margin: 0; }
                    .meta { font-size: 14px; margin-bottom: 5px; }
                    .items { width: 100%; border-collapse: collapse; margin-top: 10px; }
                    .items th { text-align: left; border-bottom: 1px solid #000; }
                    .items td { padding: 5px 0; }
                    .qty { font-weight: bold; font-size: 18px; width: 40px; }
                    .desc { font-size: 16px; }
                    .total { text-align: right; font-size: 18px; font-weight: bold; margin-top: 15px; border-top: 1px solid #000; padding-top: 5px; }
                    .notes { margin-top: 15px; font-style: italic; background: #eee; padding: 5px; }
                    .footer { text-align: center; margin-top: 20px; font-size: 12px; }
                    @media print {
                        .no-print { display: none; }
                    }
                </style>
            </head>
            <body>
                <div class="header">
                    <h1 class="title">LOS TRIGALES</h1>
                    <p class="meta">Comanda de Producción</p>
                    <p class="meta">📅 ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}</p>
                </div>
                
                <div>
                    <p><strong>Pedido:</strong> #${order.id.slice(-6)}</p>
                    <p><strong>Cliente:</strong> ${order.clienteNombre}</p>
                    ${order.origenNombre ? `<p><strong>Planta:</strong> ${order.origenNombre}</p>` : ''}
                </div>

                <table class="items">
                    <thead>
                        <tr>
                            <th>Cant</th>
                            <th>Producto</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${order.items.map(item => `
                            <tr>
                                <td class="qty">${item.cantidad}</td>
                                <td class="desc">${item.descripcion}</td>
                            </tr>
                        `).join('')}
                    </tbody>
                </table>

                ${order.observaciones ? `
                    <div class="notes">
                        <strong>⚠️ Nota:</strong> ${order.observaciones}
                    </div>
                ` : ''}

                <div class="footer">
                    <p>--- Fin del Ticket ---</p>
                </div>

                <script>
                    window.onload = function() { window.print(); }
                </script>
            </body>
            </html>
        `;

        printWindow.document.write(ticketContent);
        printWindow.document.close();
    };

    const getStatusColor = (status) => {
        const colors = {
            pendiente: 'bg-yellow-100 text-yellow-800 border-yellow-300',
            en_produccion: 'bg-blue-100 text-blue-800 border-blue-300',
            listo_despacho: 'bg-green-100 text-green-800 border-green-300',
            en_ruta: 'bg-indigo-100 text-indigo-800 border-indigo-300',
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
                                        <h3 className="font-semibold text-lg text-gray-800 flex items-center gap-2">
                                            {order.clienteNombre}
                                            <button
                                                onClick={() => printOrderTicket(order)}
                                                className="text-gray-400 hover:text-gray-700 transition"
                                                title="Imprimir Comanda"
                                            >
                                                🖨️
                                            </button>
                                        </h3>
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
                                        {order.origenNombre && (
                                            <p className="text-sm text-blue-600 font-medium mt-1">
                                                🏭 Planta: {order.origenNombre}
                                            </p>
                                        )}
                                    </div>
                                    <div className="text-right">
                                        <p className="text-2xl font-bold text-orange-600">${order.total.toFixed(2)}</p>

                                        {/* Acciones para PANADEROS */}
                                        {isPanadero && (
                                            <div className="mt-2 flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.estado)}`}>
                                                    {ORDER_STATE_LABELS[order.estado]}
                                                </span>

                                                {order.estado === 'pendiente' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'en_produccion')}
                                                        className="bg-blue-600 text-white px-3 py-1 rounded text-sm hover:bg-blue-700 transition"
                                                    >
                                                        Comenzar Producción
                                                    </button>
                                                )}

                                                {order.estado === 'en_produccion' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'listo_despacho')}
                                                        className="bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition"
                                                    >
                                                        Terminar Producción
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Acciones para TRANSPORTISTAS */}
                                        {isTransportista && (
                                            <div className="mt-2 flex flex-col items-end gap-2">
                                                <span className={`px-3 py-1 text-sm font-semibold rounded-full border ${getStatusColor(order.estado)}`}>
                                                    {ORDER_STATE_LABELS[order.estado]}
                                                </span>

                                                {order.estado === 'listo_despacho' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'en_ruta')}
                                                        className="bg-indigo-600 text-white px-3 py-1 rounded text-sm hover:bg-indigo-700 transition flex items-center gap-1"
                                                    >
                                                        🚚 Retirar Pedido
                                                    </button>
                                                )}

                                                {order.estado === 'en_ruta' && (
                                                    <button
                                                        onClick={() => handleStatusChange(order.id, 'entregado')}
                                                        className="bg-teal-600 text-white px-3 py-1 rounded text-sm hover:bg-teal-700 transition flex items-center gap-1"
                                                    >
                                                        ✅ Confirmar Entrega
                                                    </button>
                                                )}
                                            </div>
                                        )}

                                        {/* Acciones para GERENTES/ADMINS */}
                                        {isGerenteOrHigher && !isPanadero && !isTransportista && (
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
                                        )}

                                        {/* Vista para CLIENTES/SUCURSALES (Solo lectura) */}
                                        {!isPanadero && !isTransportista && !isGerenteOrHigher && (
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
