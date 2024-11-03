document.addEventListener('DOMContentLoaded', () => {
    const entradaMonto = document.getElementById('monto');
    const seleccionMonedaOrigen = document.getElementById('monedaOrigen');
    const seleccionMonedaDestino = document.getElementById('monedaDestino');
    const botonConvertir = document.getElementById('botonConvertir');
    const cajaResultado = document.getElementById('resultado');
    const listaHistorial = document.getElementById('historial');

    // Fetch y cargar monedas disponibles de una API
    fetch('https://open.er-api.com/v6/latest/USD')
        .then(respuesta => respuesta.json())
        .then(datos => {
            const tasas = datos.rates;
            for (const [moneda, tasa] of Object.entries(tasas)) {
                const opcion = document.createElement('option');
                opcion.value = moneda;
                opcion.textContent = moneda;
                seleccionMonedaOrigen.appendChild(opcion.cloneNode(true));
                seleccionMonedaDestino.appendChild(opcion);
            }
        })
        .catch(error => console.error('Error al cargar las monedas:', error));

    // Manejo del botón de conversión
    botonConvertir.addEventListener('click', () => {
        const monto = parseFloat(entradaMonto.value);
        const monedaOrigen = seleccionMonedaOrigen.value;
        const monedaDestino = seleccionMonedaDestino.value;

        if (isNaN(monto) || monedaOrigen === '' || monedaDestino === '') {
            cajaResultado.textContent = 'Por favor, ingresa un monto válido y selecciona las monedas de origen y destino.';
            return;
        }

        // Obtener la tasa de cambio entre las dos monedas
        fetch(`https://open.er-api.com/v6/latest/${monedaOrigen}`)
            .then(respuesta => respuesta.json())
            .then(datos => {
                const tasa = datos.rates[monedaDestino];
                if (!tasa) {
                    cajaResultado.textContent = 'No se pudo obtener la tasa de cambio para las monedas seleccionadas.';
                    return;
                }

                const montoConvertido = (monto * tasa).toFixed(2);
                cajaResultado.textContent = `Monto convertido: ${montoConvertido} ${monedaDestino}`;

                // Agregar al historial de conversiones
                const itemHistorial = document.createElement('li');
                itemHistorial.textContent = `Monto: ${monto} ${monedaOrigen} - Convertido a: ${montoConvertido} ${monedaDestino}`;
                listaHistorial.appendChild(itemHistorial);

                // Animación con GSAP
                gsap.fromTo(cajaResultado, { opacity: 0 }, { opacity: 1, duration: 1 });
                gsap.fromTo(itemHistorial, { x: -100, opacity: 0 }, { x: 0, opacity: 1, duration: 1 });
            })
            .catch(error => console.error('Error al realizar la conversión:', error));
    });
});
