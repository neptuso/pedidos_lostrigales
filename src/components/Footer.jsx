import React from 'react';

export default function Footer() {
    const currentYear = new Date().getFullYear();
    const appVersion = "1.2.0"; // Versión con Flujo Operativo

    return (
        <footer className="bg-white border-t border-gray-200 mt-auto">
            <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
                <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0 text-sm text-gray-500">

                    {/* Izquierda: Copyright y Empresa */}
                    <div className="text-center md:text-left">
                        <p>&copy; {currentYear} <span className="font-semibold text-gray-700">para Los Trigales desarrolla Ceibal Sistemas</span>. Todos los derechos reservados.</p>
                        <p className="text-xs mt-1">Sistema de Gestión de Pedidos</p>
                    </div>

                    {/* Centro: Versión */}
                    <div className="text-center">
                        <span className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs font-mono">
                            v{appVersion}
                        </span>
                    </div>

                    {/* Derecha: Desarrollador */}
                    <div className="text-center md:text-right">
                        <p>Desarrollado con <span role="img" aria-label="mate">🧉</span>  y con ❤️  </p>
                        <p className="text-xs mt-1">Soporte: neptuso@gmail.com</p>
                    </div>
                </div>
            </div>
        </footer>
    );
}
