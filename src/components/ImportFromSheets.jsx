import { useState } from 'react';
import { importProductsFromSheets } from '../services/productService';

const SHEET_ID = '1Yp2I2jLQM2EwoD6SJxh3LyKy4qtvjcOTpTc1uCzcmgk';
const SHEET_NAME = 'Productos'; // Ajusta según el nombre de tu hoja

export default function ImportFromSheets({ onImportComplete }) {
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    const [result, setResult] = useState(null);

    const handleImport = async () => {
        setLoading(true);
        setError('');
        setResult(null);

        try {
            // URL pública de la hoja en formato CSV
            const csvUrl = `https://docs.google.com/spreadsheets/d/${SHEET_ID}/gviz/tq?tqx=out:csv&sheet=${SHEET_NAME}`;

            const response = await fetch(csvUrl);
            const csvText = await response.text();

            // Parsear CSV
            const lines = csvText.split('\n');
            const headers = lines[0].split(',').map(h => h.replace(/"/g, '').trim());

            // Encontrar índices de las columnas que nos interesan
            const categoriaIdx = headers.findIndex(h => h.toLowerCase().includes('categoria'));
            const pluIdx = headers.findIndex(h => h.toLowerCase().includes('plu'));
            const descripcionIdx = headers.findIndex(h => h.toLowerCase().includes('descripcion'));
            const precioIdx = headers.findIndex(h => h.toLowerCase().includes('precio a'));

            if (categoriaIdx === -1 || descripcionIdx === -1 || precioIdx === -1) {
                throw new Error('No se encontraron las columnas necesarias en la hoja');
            }

            // Procesar productos
            const products = [];
            for (let i = 1; i < lines.length; i++) {
                const line = lines[i];
                if (!line.trim()) continue;

                const values = line.split(',').map(v => v.replace(/"/g, '').trim());

                const categoria = values[categoriaIdx];
                const descripcion = values[descripcionIdx];
                const precioStr = values[precioIdx];

                // Validar que tenga datos mínimos
                if (!categoria || !descripcion || !precioStr) continue;

                const precio = parseFloat(precioStr);
                if (isNaN(precio)) continue;

                products.push({
                    categoria: categoria.toUpperCase(),
                    codigoPLU: pluIdx !== -1 ? values[pluIdx] : '',
                    descripcion: descripcion.toUpperCase(),
                    precioA: precio
                });
            }

            if (products.length === 0) {
                throw new Error('No se encontraron productos válidos para importar');
            }

            // Importar a Firestore
            const importResult = await importProductsFromSheets(products);

            if (importResult.success) {
                setResult(importResult);
                if (onImportComplete) {
                    onImportComplete();
                }
            } else {
                setError(importResult.error);
            }

        } catch (err) {
            console.error('Error en importación:', err);
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-2">
                📥 Importar desde Google Sheets
            </h3>
            <p className="text-sm text-blue-700 mb-4">
                Importa todos los productos desde tu hoja de cálculo de balanza.
            </p>

            {error && (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {result && (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                    ✅ {result.message}
                </div>
            )}

            <button
                onClick={handleImport}
                disabled={loading}
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:bg-gray-400"
            >
                {loading ? 'Importando...' : 'Importar Productos'}
            </button>

            <p className="text-xs text-gray-600 mt-3">
                <strong>Nota:</strong> La hoja debe ser pública o accesible. Se importarán las columnas: Categoría, Código PLU, Descripción y Precio A.
            </p>
        </div>
    );
}
