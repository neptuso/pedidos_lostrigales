import './App.css'
import { useState, useEffect } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import Login from './components/Login'
import UserManagement from './components/UserManagement'
import ProductManagement from './components/ProductManagement'
import OrderManagement from './components/OrderManagement'
import BranchManagement from './components/BranchManagement'
import UserProfileDropdown from './components/UserProfileDropdown'
import Footer from './components/Footer'
import { getDashboardMetrics } from './services/dashboardService'

function Dashboard() {
  const { isAdmin, isGerente, isMonitor, isGerenteOrHigher, userProfile } = useAuth();
  const [currentSection, setCurrentSection] = useState('dashboard');
  const [metrics, setMetrics] = useState({
    activeOrders: 0,
    totalClients: 0,
    todaySales: 0,
    pendingByPlant: {},
    pendingPrivateClients: 0
  });
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Roles que pueden ver el Dashboard de Métricas
  const canViewDashboardMetrics = isAdmin || isGerente || isMonitor;

  useEffect(() => {
    if (currentSection === 'dashboard' && canViewDashboardMetrics) {
      loadMetrics();
    }
  }, [currentSection, canViewDashboardMetrics]);

  const loadMetrics = async () => {
    const result = await getDashboardMetrics();
    if (result.success) {
      setMetrics(result.metrics);
    }
  };

  return (
    <div className="min-h-screen bg-orange-50 flex flex-col">
      {/* Barra de Navegación */}
      <nav className="bg-white shadow-md p-4 sticky top-0 z-50">
        <div className="container mx-auto">
          <div className="flex justify-between items-center">
            <h1 className="text-2xl font-bold text-orange-800 flex items-center gap-2">
              <span>🍞</span>
              <span className="hidden sm:inline">Los Trigales</span>
              <span className="sm:hidden">Trigales</span>
            </h1>

            {/* Menú Desktop */}
            <div className="hidden md:flex items-center gap-2">
              <NavButton
                label="Inicio"
                active={currentSection === 'dashboard'}
                onClick={() => setCurrentSection('dashboard')}
              />

              {isAdmin && (
                <NavButton
                  label="Sucursales"
                  active={currentSection === 'branches'}
                  onClick={() => setCurrentSection('branches')}
                />
              )}

              {isAdmin && (
                <NavButton
                  label="Usuarios"
                  active={currentSection === 'users'}
                  onClick={() => setCurrentSection('users')}
                />
              )}

              {isGerenteOrHigher && (
                <NavButton
                  label="Productos"
                  active={currentSection === 'products'}
                  onClick={() => setCurrentSection('products')}
                />
              )}

              <NavButton
                label="Pedidos"
                active={currentSection === 'orders'}
                onClick={() => setCurrentSection('orders')}
              />
            </div>

            {/* Perfil y Menú Móvil */}
            <div className="flex items-center gap-3">
              <UserProfileDropdown />

              {/* Botón Hamburguesa */}
              <button
                className="md:hidden p-2 text-gray-600 hover:bg-gray-100 rounded-lg"
                onClick={() => setIsMenuOpen(!isMenuOpen)}
              >
                <span className="text-2xl">{isMenuOpen ? '✕' : '☰'}</span>
              </button>
            </div>
          </div>

          {/* Menú Móvil Desplegable */}
          {isMenuOpen && (
            <div className="md:hidden mt-4 pb-2 border-t border-gray-100 flex flex-col gap-2 pt-4">
              <MobileNavButton
                label="Inicio"
                active={currentSection === 'dashboard'}
                onClick={() => { setCurrentSection('dashboard'); setIsMenuOpen(false); }}
              />

              {isAdmin && (
                <MobileNavButton
                  label="Sucursales"
                  active={currentSection === 'branches'}
                  onClick={() => { setCurrentSection('branches'); setIsMenuOpen(false); }}
                />
              )}

              {isAdmin && (
                <MobileNavButton
                  label="Usuarios"
                  active={currentSection === 'users'}
                  onClick={() => { setCurrentSection('users'); setIsMenuOpen(false); }}
                />
              )}

              {isGerenteOrHigher && (
                <MobileNavButton
                  label="Productos"
                  active={currentSection === 'products'}
                  onClick={() => { setCurrentSection('products'); setIsMenuOpen(false); }}
                />
              )}

              <MobileNavButton
                label="Pedidos"
                active={currentSection === 'orders'}
                onClick={() => { setCurrentSection('orders'); setIsMenuOpen(false); }}
              />
            </div>
          )}
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto p-6 flex-grow">
        {currentSection === 'dashboard' && (
          <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-4xl mx-auto mt-10">
            <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido al Sistema de Pedidos</h2>

            {canViewDashboardMetrics ? (
              <>
                <p className="text-gray-600 mb-8">
                  Resumen de operaciones del día
                </p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-6 border border-orange-100 rounded-lg bg-orange-50 hover:shadow-md transition cursor-pointer">
                    <h3 className="text-xl font-semibold text-orange-800 mb-2">📦 Pedidos Activos</h3>
                    <p className="text-4xl font-bold text-gray-800">{metrics.activeOrders}</p>
                    <p className="text-xs text-gray-500 mt-2">En proceso o despacho</p>
                  </div>

                  <div className="p-6 border border-blue-100 rounded-lg bg-blue-50 hover:shadow-md transition cursor-pointer">
                    <h3 className="text-xl font-semibold text-blue-800 mb-2">👥 Clientes</h3>
                    <p className="text-4xl font-bold text-gray-800">{metrics.totalClients}</p>
                    <p className="text-xs text-gray-500 mt-2">Registrados en el sistema</p>
                  </div>

                  <div className="p-6 border border-green-100 rounded-lg bg-green-50 hover:shadow-md transition cursor-pointer">
                    <h3 className="text-xl font-semibold text-green-800 mb-2">💰 Ventas Hoy</h3>
                    <p className="text-4xl font-bold text-gray-800">${metrics.todaySales.toLocaleString()}</p>
                    <p className="text-xs text-gray-500 mt-2">Total acumulado del día</p>
                  </div>
                </div>

                {/* Detalles de Producción */}
                {(metrics.pendingByPlant || metrics.pendingPrivateClients > 0) && (
                  <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-6 text-left">
                    {/* Por Planta */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        🏭 Pendientes por Planta
                      </h4>
                      {metrics.pendingByPlant && Object.keys(metrics.pendingByPlant).length > 0 ? (
                        <ul className="space-y-2">
                          {Object.entries(metrics.pendingByPlant).map(([plant, count]) => (
                            <li key={plant} className="flex justify-between items-center text-sm">
                              <span>{plant}</span>
                              <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded-full font-bold text-xs">
                                {count}
                              </span>
                            </li>
                          ))}
                        </ul>
                      ) : (
                        <p className="text-sm text-gray-500 italic">No hay pendientes de producción.</p>
                      )}
                    </div>

                    {/* Particulares */}
                    <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                      <h4 className="font-semibold text-gray-700 mb-3 flex items-center gap-2">
                        👤 Clientes Particulares
                      </h4>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Pedidos pendientes de atención:</span>
                        <span className="text-2xl font-bold text-blue-600">{metrics.pendingPrivateClients || 0}</span>
                      </div>
                    </div>
                  </div>
                )}
              </>
            ) : (
              <div className="py-8">
                <p className="text-gray-600 mb-6 text-lg">
                  Hola <strong>{userProfile?.nombre || 'Usuario'}</strong>, ¿qué deseas hacer hoy?
                </p>
                <button
                  onClick={() => setCurrentSection('orders')}
                  className="bg-orange-600 text-white px-6 py-3 rounded-lg hover:bg-orange-700 transition font-medium text-lg shadow-md"
                >
                  Ver Mis Pedidos
                </button>
              </div>
            )}

            {/* Botones de prueba solo para admins */}
            {isAdmin && (
              <div className="mt-8 p-4 border-t border-gray-200">
                <p className="text-xs text-gray-500 mb-2">Área de pruebas (Solo Admin)</p>
                <button
                  onClick={async () => {
                    const { testConnection } = await import('./testFirebase');
                    const result = await testConnection();
                    if (result.success) alert('¡Conexión a Firebase exitosa! ID: ' + result.id);
                    else alert('Error al conectar: ' + result.error);
                  }}
                  className="text-sm text-gray-500 underline hover:text-orange-600 mr-4"
                >
                  Probar conexión a Firebase
                </button>

                <button
                  onClick={async () => {
                    const { sendOrderToSheets } = await import('./services/sheetsService');
                    const result = await sendOrderToSheets({
                      id: "TEST-" + Math.floor(Math.random() * 1000),
                      cliente: "Cliente de Prueba",
                      total: 1500,
                      estado: "Pendiente"
                    });
                    if (result.success) alert('¡Datos enviados a Google Sheets! Revisa tu hoja de cálculo.');
                    else alert('Error al enviar a Sheets');
                  }}
                  className="text-sm text-gray-500 underline hover:text-green-600"
                >
                  Probar conexión a Google Sheets
                </button>
              </div>
            )}
          </div>
        )}

        {currentSection === 'users' && isAdmin && (
          <UserManagement />
        )}

        {currentSection === 'branches' && isAdmin && (
          <BranchManagement />
        )}

        {currentSection === 'products' && isGerenteOrHigher && (
          <ProductManagement />
        )}

        {currentSection === 'orders' && (
          <OrderManagement />
        )}
      </main>

      <Footer />
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

function AppContent() {
  const { currentUser } = useAuth();

  // Si el usuario no está logueado, mostrar pantalla de login
  if (!currentUser) {
    return <Login />;
  }

  // Si está logueado, mostrar dashboard
  return <Dashboard />;
}

// Componentes auxiliares de navegación
function NavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`px-4 py-2 rounded-lg transition text-sm font-medium ${active
        ? 'bg-orange-600 text-white'
        : 'text-gray-700 hover:bg-gray-100'
        }`}
    >
      {label}
    </button>
  );
}

function MobileNavButton({ label, active, onClick }) {
  return (
    <button
      onClick={onClick}
      className={`w-full text-left px-4 py-3 rounded-lg transition font-medium ${active
        ? 'bg-orange-50 text-orange-700 border-l-4 border-orange-600'
        : 'text-gray-600 hover:bg-gray-50'
        }`}
    >
      {label}
    </button>
  );
}

export default App
