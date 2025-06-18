// script.js
// Datos de tarifa y consumo promedio por estrato
const datosEstrato = {
  1: { consumoPromedio: 100, tarifa: 250 },
  2: { consumoPromedio: 130, tarifa: 300 },
  3: { consumoPromedio: 160, tarifa: 350 }
};

// Datos de HSP (Horas Sol Pico promedio) por municipio
const datosHSP = {
  "Medellin": 4.5,
  "Bogota": 4.1,
  "Cali": 4.8,
  "Barranquilla": 5.2,
  "Cartagena": 5.4
};

// Configuración técnica de diferentes paneles
const tiposPanel = {
  "300W": {
    potencia: 300,
    area: 1.67, // m²
    eficiencia: 0.18
  },
  "400W": {
    potencia: 400,
    area: 2.0, // m²
    eficiencia: 0.20
  }
};

// Parámetros globales de simulación
const diasMes = 30;
const perdidasSistema = 0.22; // 22% de pérdidas en el sistema

let graficoSolar = null;

// Formateador de moneda (COP)
function formatearMonedaCOP(valor) {
  return new Intl.NumberFormat('es-CO', {
    style: 'currency',
    currency: 'COP',
    minimumFractionDigits: 0
  }).format(valor);
}

// Calcula energía generada (kWh) para un sistema
function calcularEnergiaGenerada(kwInstalados, horasSolDia, eficiencia, dias = diasMes) {
  return kwInstalados * horasSolDia * eficiencia * dias;
}

// Cálculo de ahorro
function calcularAhorro(consumo, energiaGenerada, tarifa) {
  const ahorroKWh = Math.min(consumo, energiaGenerada);
  const ahorroMonetario = ahorroKWh * tarifa;//calculo de la tarifa
  return { ahorroKWh, ahorroMonetario };
}

// Calcula porcentaje de cobertura
function calcularCobertura(consumo, energiaGenerada) {
  if (consumo <= 0) return 0;
  return Math.min(consumo, energiaGenerada) / consumo * 100;
}

// Muestra mensaje de error
function mostrarError(msg) {
  const contError = document.getElementById('errorMensaje');
  if (contError) {
    contError.textContent = msg;
    contError.style.display = 'block';
  }
}

// Limpia el mensaje de error
function limpiarError() {
  const contError = document.getElementById('errorMensaje');
  if (contError) contError.style.display = 'none';
}

// Genera el gráfico de barras
function generarGrafico(consumo, generado) {
  const canvas = document.getElementById('graficoSolar');
  if (!canvas) return;
  
  const ctx = canvas.getContext('2d');
  if (graficoSolar) graficoSolar.destroy();
  
  graficoSolar = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: ['Consumo Actual', 'Energía Generada'],
      datasets: [{
        label: 'kWh/mes',
        data: [consumo, generado],
        backgroundColor: [
          'rgba(255, 69, 0, 0.7)',
          'rgba(255, 215, 0, 0.7)'
        ],
        borderColor: [
          'rgba(255, 69, 0, 1)',
          'rgba(255, 215, 0, 1)'
        ],
        borderWidth: 1
      }]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        y: { beginAtZero: true }
      },
      plugins: {
        legend: { display: false }
      }
    }
  });
}

// Función principal de cálculo
function calcularSistemaSolar() {
  // Obtener valores del formulario
  const consumo = parseFloat(document.getElementById('consumo').value);
  const estrato = document.getElementById('estrato').value;
  const municipio = document.getElementById('municipios-list').value;
  const eficiencia = parseFloat(document.getElementById('eficiencia').value);
  
  // Validaciones
  if (isNaN(consumo) || consumo <= 0) {
    mostrarError('Ingrese un consumo mensual válido (> 0).');
    return;
  }
  if (!estrato) {
    mostrarError('Seleccione un estrato de vivienda.');
    return;
  }
  if (!municipio) {
    mostrarError('Seleccione un municipio.');
    return;
  }
  if (isNaN(eficiencia)) {
    mostrarError('Seleccione la eficiencia del panel.');
    return;
  }

  // Obtener datos adicionales
  const tarifa = datosEstrato[estrato].tarifa;
  const hsp = datosHSP[municipio];
  const tipoPanel = "400W"; // Podría hacerse seleccionable
  const panel = tiposPanel[tipoPanel];
  
  // 1. Convertir consumo mensual a diario (kWh/día)
  const consumoDiario = consumo / 30;
  
  // 2. Cálculo de potencia necesaria considerando pérdidas
  const potenciaNecesaria = consumoDiario / (hsp * (1 - perdidasSistema)) * 1000; // en Watts
  
  // 3. Número de paneles necesarios
  const numPaneles = Math.ceil(potenciaNecesaria / panel.potencia);
  
  // 4. Área total requerida
  const areaTotal = (numPaneles * panel.area).toFixed(2);
  
  // 5. KW total instalados
  const kwInstalados = (numPaneles * panel.potencia) / 1000;
  
  // 6. Generación estimada mensual (kWh)
  const generacionMensual = calcularEnergiaGenerada(kwInstalados, hsp, eficiencia);
  
  // 7. Cálculo de ahorros
  const { ahorroMonetario } = calcularAhorro(consumo, generacionMensual, tarifa);
  const coberturaPct = calcularCobertura(consumo, generacionMensual);
  
  // Mostrar resultados
  mostrarResultados({
    consumo,
    estrato,
    municipio,
    hsp,
    eficiencia,
    numPaneles,
    tipoPanel,
    areaTotal,
    generacionMensual,
    ahorroMonetario,
    coberturaPct,
    tarifa,
    kwInstalados: kwInstalados.toFixed(2)
  });
}

// Mostrar resultados detallados
function mostrarResultados(datos) {
  const resultadosHTML = `
    <h4>Detalles Técnicos</h4>
    <p><strong>Ubicación:</strong> ${datos.municipio} (HSP: ${datos.hsp})</p>
    <p><strong>Consumo actual:</strong> ${datos.consumo.toFixed(2)} kWh/mes</p>
    <p><strong>Tarifa estrato ${datos.estrato}:</strong> ${formatearMonedaCOP(datos.tarifa)}/kWh</p>
    <hr>
    <p><strong>Sistema recomendado:</strong></p>
    <p>- Paneles: ${datos.numPaneles} x ${datos.tipoPanel} (${datos.eficiencia*100}% eficiencia)</p>
    <p>- Área requerida: ${datos.areaTotal} m²</p>
    <p>- Potencia instalada: ${datos.kwInstalados} kW</p>
    <hr>
    <p><strong>Generación estimada:</strong> ${datos.generacionMensual.toFixed(2)} kWh/mes</p>
    <p><strong>Cobertura:</strong> ${datos.coberturaPct.toFixed(2)}% de su consumo</p>
    <div class="recomendacion">
      <i class="fas fa-lightbulb"></i> Recomendación: Orientación al norte, inclinación ~15°
    </div>
  `;
  
  document.getElementById('datosCalculados').innerHTML = resultadosHTML;
  document.getElementById('ahorroMensual').textContent = formatearMonedaCOP(datos.ahorroMonetario);
  document.getElementById('energiaGenerada').textContent = `${datos.generacionMensual.toFixed(2)} kWh`;
  document.getElementById('porcentajeAhorro').textContent = `${datos.coberturaPct.toFixed(2)}%`;
  
  document.getElementById('resultados').classList.remove('oculto');
  generarGrafico(datos.consumo, datos.generacionMensual);
  
  // Scroll suave a resultados
  document.getElementById('resultados').scrollIntoView({ behavior: 'smooth' });
}

// Event listeners
document.addEventListener('DOMContentLoaded', function() {
  const formulario = document.getElementById('formularioSolar');
  if (formulario) {
    formulario.addEventListener('submit', function(e) {
      e.preventDefault();
      limpiarError();
      calcularSistemaSolar();
    });
  }

  // Autocompletar consumo sugerido por estrato
  const selectEstrato = document.getElementById('estrato');
  const inputConsumo = document.getElementById('consumo');
  if (selectEstrato && inputConsumo) {
    selectEstrato.addEventListener('change', function() {
      const estrato = selectEstrato.value;
      if (datosEstrato[estrato]) {
        inputConsumo.placeholder = `Ej: ${datosEstrato[estrato].consumoPromedio}`;
      }
    });
  }
});