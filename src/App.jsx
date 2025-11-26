import { useState } from 'react'
import './App.css'

function App() {
  return (
    <div className="min-h-screen bg-orange-50">
      {/* Barra de Navegación */}
      <nav className="bg-white shadow-md p-4">
        <div className="container mx-auto flex justify-between items-center">
          <h1 className="text-2xl font-bold text-orange-800">🍞 Los Trigales</h1>
          <button className="bg-orange-600 text-white px-4 py-2 rounded-lg hover:bg-orange-700 transition">
            Nuevo Pedido
          </button>
        </div>
      </nav>

      {/* Contenido Principal */}
      <main className="container mx-auto p-6">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center max-w-2xl mx-auto mt-10">
          <h2 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido al Sistema de Pedidos</h2>
          <p className="text-gray-600 mb-8">
            Gestiona tus pedidos, clientes y productos desde un solo lugar.
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="p-6 border border-orange-100 rounded-lg bg-orange-50 hover:shadow-md transition cursor-pointer">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">📦 Pedidos Activos</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
            <div className="p-6 border border-orange-100 rounded-lg bg-orange-50 hover:shadow-md transition cursor-pointer">
              <h3 className="text-xl font-semibold text-orange-800 mb-2">👥 Clientes</h3>
              <p className="text-3xl font-bold text-gray-800">0</p>
            </div>
          </div>

          {/* Área de Pruebas */}
          <div className="mt-8 p-4 border-t border-gray-200">
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
        </div>
      </main>
    </div>
  )
}

export default App
