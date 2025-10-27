// app.js (FINAL SIN GRÁFICO)

const API_URL = '/api/model-results'; 

document.addEventListener('DOMContentLoaded', fetchResults);

async function fetchResults() {
    try {
        const response = await fetch(API_URL);
        
        if (!response.ok) {
            throw new Error(`Error HTTP! Estado: ${response.status}`);
        }
        
        const data = await response.json();
        renderResults(data);
    } catch (error) {
        document.getElementById('results-container').innerHTML = 
            `<p style="color: red; font-weight: bold;">⚠️ Error al cargar resultados:</p>
             <p style="color: red;">${error.message}.</p>
             <p>Verifica:</p>
             <ul>
                <li>El servidor de Django esté corriendo.</li>
                <li>El archivo <strong>final_model_results.json</strong> exista en la raíz.</li>
             </ul>`;
        console.error("Fetch error:", error);
    }
}

// ====================================================================
// FUNCIONES PRINCIPALES DE RENDERIZADO DEL DASHBOARD
// ====================================================================

function renderResults(data) {
    const container = document.getElementById('results-container');
    let html = `<h1>Random Forest</h1><hr>`;
    
    // --------------------------------------------------------
    // SECCIÓN 1: INFORMACIÓN GENERAL Y DESCRIPTIVOS
    // --------------------------------------------------------
    const info = data.General_Info;
    html += '<h2>Información del Dataset</h2>';
    html += `<p class="summary-metric">Longitud del DataSet: <strong>${info.Longitud_Total}</strong></p>`;
    html += `<p class="summary-metric">Características: <strong>${info.Num_Caracteristicas}</strong></p>`;
    
    // Conteo de Clases
    html += '<h3>Clasificación</h3>';
    html += '<ul style="list-style-type: disc; margin-left: 20px;">';
    for (const [clase, conteo] of Object.entries(info.Conteo_Clases)) {
        html += `<li><strong>${clase}:</strong> ${conteo}</li>`;
    }
    html += '</ul>';

    // df.describe()
    html += '<h2>Descriptivas df.describe</h2>';
    html += renderDescribeTable(info.Descripcion_Numerica);
    
    // Correlación con la variable de salida
    html += '<h2>Correlación de las Variable de Salida (\'calss\')</h2>';
    html += renderCorrelationTable(data.Corr_Target);


    // --------------------------------------------------------
    // SECCIÓN 2: DATOS ESCALADOS Y TRANSFORMACIÓN
    // --------------------------------------------------------
    
    // X_train_scaled.head(10)
    html += '<h2>Muestra de Datos Escalados (Escalamiento)</h2>';
    const scaledHeaders = Object.keys(data.Scaled_Head[0] || {});
    html += renderGenericTable(data.Scaled_Head, scaledHeaders);

    // X_train_scaled.describe()
    html += '<h2>Informacion de Datos Escalados</h2>';
    html += renderDescribeTable(data.Scaled_Describe);


    // --------------------------------------------------------
    // SECCIÓN 3: RESULTADOS DEL MODELO
    // --------------------------------------------------------
    
    // F1 Score (Métrica de Entrenamiento)
    html += '<h2>Métrica de Rendimiento del Modelo (Train Set)</h2>';
    const f1TrainScore = (data.F1_Score_Train * 100).toFixed(4);
    html += `<p class="summary-metric" style="font-size: 1.5em; color: green;">
                F1 Score: <strong>${f1TrainScore}%</strong>
             </p><hr>`;

    // Importancia de Características (Tabla)
    html += '<h2>Características Random Forest</h2>';
    html += renderGenericTable(data.Feature_Importance, ['Feature', 'Importance']);

    // Eliminado: La sección 8 que contenía el gráfico.

    container.innerHTML = html;
}

// ====================================================================
// FUNCIONES AUXILIARES DE TABLAS (Sin cambios)
// ====================================================================

/** RENDERIZA: df.describe() o X_train_scaled.describe() */
function renderDescribeTable(describeData) {
    if (Object.keys(describeData).length === 0) return '<p>No hay datos descriptivos.</p>';
    
    const stats = Object.keys(describeData);
    const features = Object.keys(describeData[stats[0]] || {});
    
    let table = '<table border="1" class="data-table"><thead><tr><th>Estadística</th>';
    features.forEach(f => { table += `<th>${f}</th>`; });
    table += '</tr></thead><tbody>';

    stats.forEach(stat => {
        table += `<tr><td><strong>${stat.charAt(0).toUpperCase() + stat.slice(1)}</strong></td>`;
        features.forEach(f => {
            let value = describeData[stat][f];
            if (typeof value === 'number') {
                value = (stat === 'count' || stat === 'support') ? Math.round(value) : value.toFixed(4);
            }
            table += `<td>${value}</td>`;
        });
        table += '</tr>';
    });
    
    table += '</tbody></table>';
    return table;
}

/** RENDERIZA: Correlación con la Variable de Salida */
function renderCorrelationTable(corrTargetData) {
    let table = '<table border="1" class="data-table" style="width: 50%;"><thead><tr><th>Característica</th><th>Correlación con \'calss\'</th></tr></thead><tbody>';
    
    for (const [feature, corrValue] of Object.entries(corrTargetData)) {
        let displayValue = (typeof corrValue === 'number') ? corrValue.toFixed(4) : corrValue;
        table += `<tr><td>${feature}</td><td>${displayValue}</td></tr>`;
    }
    
    table += '</tbody></table>';
    return table;
}

/** RENDERIZA: Tablas Genéricas (Head, Feature Importance) */
function renderGenericTable(data, headers) {
    if (data.length === 0) return '<p>No hay datos disponibles para esta tabla.</p>';
    
    let table = '<table border="1" class="data-table"><thead><tr>';
    
    headers.forEach(header => {
        table += `<th>${header}</th>`;
    });
    table += '</tr></thead><tbody>';

    data.forEach(row => {
        table += '<tr>';
        headers.forEach(header => {
            let value = row[header];
            if (typeof value === 'number') {
                value = value.toFixed(4);
            }
            table += `<td>${value}</td>`;
        });
        table += '</tr>';
    });
    
    table += '</tbody></table>';
    return table;
}
