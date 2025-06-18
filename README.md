![cap3](https://github.com/user-attachments/assets/56fe9845-fa66-4d46-b50e-036af5d59c7f)
![cap4](https://github.com/user-attachments/assets/d1da4b67-dd68-41ea-a05e-e0dee4b06f30)
![cap1](https://github.com/user-attachments/assets/aca16eec-c52a-4435-adc3-e93e044506e4)
![cap2](https://github.com/user-attachments/assets/60d46113-4f5c-4f50-8583-3cdbd3561cd3)
El código implementa una calculadora técnica-financiera para sistemas de energía solar mienergiasolar, diseñada para estimar la viabilidad de instalación de paneles solares según el consumo eléctrico, ubicación geográfica y estrato socioeconómico del usuario. 
La solución utiliza datos predefinidos de tarifas eléctricas por estrato (COP/kWh), Horas Sol Pico (HSP) por municipio y especificaciones técnicas de paneles solares (potencia, área y eficiencia). A partir de los inputs del usuario (consumo mensual en kWh, estrato y municipio). 
El sistema 
calcula: (1) la potencia requerida en kW, considerando pérdidas del 22%.
(2) el número de paneles necesarios según el tipo seleccionado.
(3) el área de instalación en m².
(4) la generación mensual estimada (kWh).
(5) el ahorro económico basado en la tarifa del estrato. Los resultados se presentan en un formato claro que incluye un gráfico comparativo (consumo vs. generación), porcentaje de cobertura del consumo y detalles técnicos como la orientación recomendada. La solución está desarrollada en JavaScript puro, con visualización dinámica usando Chart.js y formato monetario para pesos colombianos (COP), garantizando precisión en los cálculos y usabilidad para el usuario final.

Fórmulas clave integradas:

Generación energética: kW instalados × HSP × eficiencia × 30 días.

Potencia necesaria: (Consumo diario / (HSP × (1 - pérdidas))) × 1000 (conversión a Watts).

Ahorro monetario: kWh generados × tarifa estrato (COP/kWh).

Cobertura: (mínimo(consumo, generación) / consumo) × 100%.

Esta herramienta es escalable, permitiendo actualizar tarifas, HSP o paneles sin modificar la lógica principal, y está diseñada para adaptarse a futuras integraciones con APIs de datos en tiempo real.
