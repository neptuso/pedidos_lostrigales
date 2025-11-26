
// URL del script de Google (se actualizará si el usuario genera una nueva)
let SHEETS_API_URL = "https://script.google.com/macros/s/AKfycbwpBoJG2ORHo-kQADBYppFUdevfPYa5-2S5BTgSOZTjJI_GadEaIprNdIhCz2bTMlTYwQ/exec";

export const updateSheetsUrl = (newUrl) => {
    SHEETS_API_URL = newUrl;
};

export const sendOrderToSheets = async (orderData) => {
    try {
        // Usamos 'no-cors' para evitar bloqueos del navegador.
        // Importante: No enviamos headers complejos para evitar "preflight checks" que fallan en Apps Script.

        await fetch(SHEETS_API_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: {
                'Content-Type': 'text/plain;charset=utf-8', // Enviamos como texto plano explícitamente
            },
            body: JSON.stringify(orderData)
        });

        console.log("Solicitud enviada a Google Sheets (Resultado opaco por no-cors)");
        return { success: true };
    } catch (error) {
        console.error("Error enviando a Google Sheets:", error);
        return { success: false, error };
    }
};
