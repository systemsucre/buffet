






import ExcelJS from 'exceljs';
export const reportesMovimientos = async (tipoReporte, data, filtros) => {
    const workbook = new ExcelJS.Workbook();
    workbook.creator = 'System Sucre - Isaac Llanos';

    const sheet = workbook.addWorksheet('REPORTE DETALLADO', {
        pageSetup: { paperSize: 9, orientation: 'landscape' }
    });

    // 1. TÍTULO Y FILTROS
    sheet.mergeCells('A1:H1');
    const titleCell = sheet.getCell('A1');
    titleCell.value = `REPORTE DE ${tipoReporte} - KR ESTUDIOS`;
    titleCell.font = { size: 16, bold: true, color: { argb: 'FFFFFF' } };
    titleCell.alignment = { horizontal: 'center' };
    titleCell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: '1B4F72' } };

    sheet.addRow(['DESDE :', filtros.desde, '', '','','HASTA : '+ filtros.hasta]);
    sheet.getRow(2).font = { bold: true };

    sheet.addRow([]); // Espacio

    // 2. ENCABEZADOS DE LA TABLA (Más columnas)
    const headerRow = sheet.addRow([
        'N° ITEM',
        'FECHA',
        'CÓD. TRÁMITE',
        'TRÁMITE (DETALLE)',
        'CLIENTE',
        tipoReporte === 'salida' ? 'DESCRIPCIÓN SALIDA.' : 'DESCRIPCION INGRESO',
        'MONTO (Bs.)',
        'RESPONSABLE'
    ]);

    headerRow.eachCell((cell) => {
        cell.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: 'D5D8DC' } };
        cell.font = { bold: true };
        cell.border = { top: { style: 'thin' }, left: { style: 'thin' }, bottom: { style: 'thin' }, right: { style: 'thin' } };
    });

    // Ancho de columnas para KR Estudios
    sheet.getColumn(1).width = 10; // N°
    sheet.getColumn(2).width = 12; // Fecha
    sheet.getColumn(3).width = 15; // Cód Trámite
    sheet.getColumn(4).width = 30; // Detalle Trámite
    sheet.getColumn(5).width = 25; // Cliente
    sheet.getColumn(6).width = 40; // Descripción Mov
    sheet.getColumn(7).width = 15; // Monto
    sheet.getColumn(8).width = 20; // Responsable

    // 3. CARGA DE DATOS POR FILA
    let totalMonto = 0;

    data.forEach(item => {
        const montoActual = parseFloat(item.monto) || 0;
        const row = sheet.addRow([
            item.numero || '-',
            item.fecha_solicitud?.split('T')[0] || item.fecha_ingreso?.split('T')[0] || '-',
            item.codigo_tramite || 'N/A',
            item.tramite_detalle || '-',
            item.cliente_nombre || '-',
            item.detalle || '-',
            montoActual,
            item.usuario_nombre || 'S/N'
        ]);

        // Formato moneda
        row.getCell(7).numFmt = '#,##0.00';

        // Color por tipo de movimiento si es reporte general
        if (tipoReporte === 'GENERAL') {
            const isIngreso = item.tipo_mov === 'INGRESO';
            const color = isIngreso ? 'E8F5E9' : 'FFEBEE';
            row.eachCell(c => {
                c.fill = { type: 'pattern', pattern: 'solid', fgColor: { argb: color } };
            });
            totalMonto += isIngreso ? montoActual : -montoActual;
        } else {
            totalMonto += montoActual;
        }
    });

    // 4. TOTALES
    sheet.addRow([]);
    const totalRow = sheet.addRow(['', '', '', '', '', 'TOTAL RESULTADO:', totalMonto, '']);
    totalRow.getCell(6).font = { bold: true };
    totalRow.getCell(7).font = { bold: true, color: { argb: 'C0392B' } };
    totalRow.getCell(7).numFmt = '#,##0.00 "Bs."';

    // 5. EXPORTACIÓN
    const buffer = await workbook.xlsx.writeBuffer();
    const blob = new Blob([buffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
    const url = window.URL.createObjectURL(blob);
    const anchor = document.createElement('a');
    anchor.href = url;
    anchor.download = `Reporte_${tipoReporte}_KR_${new Date().getTime()}.xlsx`;
    anchor.click();
};