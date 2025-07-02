const selectorCiudades = document.getElementById('ciudades-select');
const canvasGrafico = document.getElementById('grafico-precios');
let miGrafico;


document.addEventListener('DOMContentLoaded', async () => {
    try {
        const response = await fetch('/ciudades');
        const data = await response.json();

        selectorCiudades.innerHTML = '<option selected disabled>Elige una ciudad</option>';
        data.ciudad.forEach(ciudad => {
            const option = document.createElement('option');
            option.value = ciudad;
            option.textContent = ciudad;
            selectorCiudades.appendChild(option);
        });

    } catch (error) {
        console.error('Error al cargar las ciudades:', error);
        selectorCiudades.innerHTML = '<option selected disabled>Error al cargar</option>';
    }
});

selectorCiudades.addEventListener('change', async (event) => {
    const ciudadSeleccionada = event.target.value;
    if (!ciudadSeleccionada) return;

    try {
        const response = await fetch(`/filtro?Ciudad=${encodeURIComponent(ciudadSeleccionada)}`);
        const datosCiudad = await response.json();

        if (datosCiudad.length > 0) {
            const datosParaGrafico = datosCiudad[0];
            actualizarGrafico(datosParaGrafico);
        }

    } catch (error) {
        console.error('Error al cargar los datos de la ciudad:', error);
    }
});

function actualizarGrafico(datos) {

    if (miGrafico) {
        miGrafico.destroy();
    }

    const ctx = canvasGrafico.getContext('2d');
    miGrafico = new Chart(ctx, {
        type: 'bar',
        data: {
            labels: ['Trimestral Aptos 2025', 'Trimestral Casas 2025', 'Año Corrido Aptos 2025', 'Año Corrido Casas 2025', 'Anual Aptos 2025', 'Anual Casas 2025'],
            datasets: [{
                label: `Variación de Precios en ${datos.Ciudad}`,
                data: [
                    datos.Trimestral_Aptos_2025,
                    datos.Trimestral_Casas_2025,
                    datos.AñoCorrido_Aptos_2025,
                    datos.AñoCorrido_Casas_2025,
                    datos.Anual_Aptos_2025,
                    datos.Anual_Casas_2025
                ],
                backgroundColor: [
                    'rgba(54, 162, 235, 0.6)',
                    'rgba(255, 99, 132, 0.6)',
                    'rgba(75, 192, 192, 0.6)',
                    'rgba(255, 206, 86, 0.6)',
                    'rgba(251,104,168,0.8)',
                    'rgb(209,119,73)'

                ],
                borderColor: [
                    'rgba(54, 162, 235, 1)',
                    'rgba(255, 99, 132, 1)',
                    'rgba(75, 192, 192, 1)',
                    'rgba(255, 206, 86, 1)',
                    'rgba(245, 40, 145, 0.8)',
                    'rgba(250, 108, 0, 1)'
                ],
                borderWidth: 1
            }]
        },
        options: {
            scales: {
                y: {
                    beginAtZero: true,
                    ticks: {
                        callback: function(value) {
                            return value
                        }
                    }
                }
            },
            plugins: {
                title: {
                    display: true,
                    text: `Análisis de precios para ${datos.Ciudad}`
                }
            }
        }
    });
}
