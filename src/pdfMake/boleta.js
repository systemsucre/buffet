import createPdf from './base.js';

const ticketBoleta = async (output, { itemsBoleta }) => {
    // Tomamos la cabecera del primer item (como en el JSX)
    const infoCabecera = itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0] : {};
    const codigoBoleta = infoCabecera?.codigo_boleta || "S/N";

    // Configuración de Colores según estado (Igual al JSX)
    const colorEstado = infoCabecera.estado === 3 ? '#28a745' : '#ffc107';
    const bgEstado = infoCabecera.estado === 3 ? '#dcfce7' : '#fef9c3';
    const textEstadoColor = infoCabecera.estado === 3 ? '#166534' : '#854d0e';
    const textoEstado = infoCabecera.estado === 3 ? 'TRANSACCIÓN FINALIZADA' : 'PENDIENTE DE DESPACHO';

    const content = [
        // 1. ENCABEZADO PRINCIPAL (TIPO BANNER)
        {
            table: {
                widths: ['*'],
                body: [
                    [{
                        stack: [
                            { text: 'COMPROBANTE DE EGRESO GRUPAL', style: 'hc', color: 'white' },
                            { text: `BOLETA: ${codigoBoleta}`, fontSize: 14, bold: true, color: 'white', margin: [0, 5, 0, 0] }
                        ],
                        fillColor: '#2c3e50',
                        margin: [20, 10, 20, 10],
                        alignment: 'center'
                    }]
                ]
            },
            layout: 'noBorders'
        },

        // 2. ETIQUETA DE ESTADO (BADGE)
        {
            canvas: [{ type: 'rect', x: 180, y: 5, w: 200, h: 20, r: 5, fillColor: bgEstado, lineColor: colorEstado }],
            absolutePosition: { x: 15, y: 93 }
        },
        { text: textoEstado, color: textEstadoColor, bold: true, fontSize: 8, alignment: 'center', margin: [0, 10, 0, 10] },

        // 3. SECCIÓN DE INFORMACIÓN DE FIRMAS (3 COLUMNAS)
        {
            columns: [
                {
                    stack: [
                        { text: 'SOLICITANTE', style: 'tProductsHeader', color: '#4e73df' },
                        { text: infoCabecera?.solicitado_por || '---', bold: true },
                        { text: infoCabecera?.fecha_solicitud?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
                    ]
                },
                {
                    stack: [
                        { text: 'AUTORIZACIÓN', style: 'tProductsHeader', color: '#4e73df' },
                        { text: infoCabecera?.autorizado_por || '---', bold: true },
                        { text: infoCabecera?.fecha_aprobacion?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
                    ]
                },
                {
                    stack: [
                        { text: 'DESPACHO', style: 'tProductsHeader', color: '#4e73df' },
                        { text: infoCabecera?.despachado_por || '---', bold: true },
                        { text: infoCabecera?.fecha_despacho?.split('T')[0] || '---', fontSize: 8, color: 'gray' }
                    ]
                }
            ],
            margin: [0, 10, 0, 20]
        },

        // 4. TABLA DE ITEMS (DETALLE FINANCIERO)
        {
            table: {
                headerRows: 1,
                widths: [20, '*', 60, 80, 50],
                body: [
                    // Header de la Tabla
                    [
                        { text: '#', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'DETALLE GASTO', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'TRAMITE', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white' },
                        { text: 'ESTADO FINANCIERO TRAMITE', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white', alignment: 'left' },
                        { text: 'MONTO SOLICITADO', style: 'tProductsHeader', fillColor: '#2c3e50', color: 'white', alignment: 'right' }
                    ],
                    // Filas de Items
                    ...itemsBoleta.map(item => [
                        { text: item.numero, alignment: 'center', fontSize: 9 },

                        { text: item.detalle, bold: true, fontSize: 10 },

                        { text: item.codigo_tramite, fontSize: 8, color: '#4e73df' },

                        {
                            fontSize: 7,
                            stack: [
                                { text: `Abonado: ${item.tramite_total_ingresos} Bs.`, color: 'green' },
                                { text: `Gastado: ${item.tramite_total_gastos_pagados} Bs.`, color: 'red' },
                                { text: `Disponible: ${item.saldoDisponibleTramite} Bs.`, bold: true, color: '#2c3e50' }
                            ]
                        },
                        { text: `${parseFloat(item.monto).toFixed(2)} Bs.`, alignment: 'right', bold: true, fontSize: 10 }
                    ])
                ]
            },
            layout: {
                hLineWidth: (i, node) => (i === 0 || i === 1 || i === node.table.body.length) ? 1 : 0.5,
                vLineWidth: () => 0,
                hLineColor: (i) => (i === 0 || i === 1) ? '#2c3e50' : '#eeeeee',
                paddingLeft: () => 5,
                paddingRight: () => 5,
                paddingTop: () => 8,
                paddingBottom: () => 8,
            }
        },

        // 5. TOTAL FINAL
        {
            table: {
                widths: ['*', 'auto'],
                body: [
                    [
                        { text: 'TOTAL BOLETA:', alignment: 'right', bold: true, margin: [0, 10, 0, 0] },
                        {
                            text: `${itemsBoleta.reduce((acc, item) => acc + parseFloat(item.monto), 0).toFixed(2)} Bs.`,
                            style: 'hc',
                            fillColor: '#f8f9fa',
                            margin: [10, 10, 10, 10],
                            fontSize: 14
                        }
                    ]
                ]
            },
            layout: 'noBorders'
        },

        { text: ' ', margin: [0, 40] },

        // 6. SECCIÓN DE FIRMAS (ESTILO FORMAL)
        {
            columns: [
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'ENTREGUÉ CONFORME', style: 'piePagina' },
                        { text: 'CAJERO / ADMINISTRACIÓN', style: 'piePagina' }
                    ]
                },
                {
                    stack: [
                        { text: '__________________________', alignment: 'center' },
                        { text: 'RECIBÍ CONFORME', style: 'piePagina' },
                        { text: 'CI / FIRMA BENEFICIARIO', style: 'piePagina' }
                    ]
                }
            ]
        }
    ];

    const response = await createPdf({ content }, output);
    return response;
};

export default ticketBoleta;