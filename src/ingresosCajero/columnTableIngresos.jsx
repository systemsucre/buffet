export const ColumnsTableIngresos = [
    {
        label: 'ID / REF',
        field: 'id',
        render: (row) => (
            <div className="text-center">
                <div className="fw-bold text-dark small" style={{ fontSize: '0.7rem' }}>
                    {row.id ? row.id.substring(0, 8).toUpperCase() : '---'}
                </div>
                <small className="badge bg-light text-secondary border">INGRESO</small>
            </div>
        ),
        sortable: true,
    },
    {
        label: 'Concepto de Ingreso',
        field: 'detalle',
        render: (row) => (
            <div style={{ minWidth: '220px' }}>
                <div className="fw-bold text-dark">{row.detalle}</div>
                <div className="d-flex align-items-center mt-1">
                    <small className="text-muted" style={{ fontSize: '0.75rem' }}>
                        <i className="bi bi-person-badge me-1"></i>
                        Recibido por: {row.usuario_nombre || `ID: ${row.usuario}`}
                    </small>
                </div>
            </div>
        )
    },
    {
        label: 'Fecha de Cobro',
        field: 'fecha_ingreso',
        render: (row) => {
            // Manejamos la fecha de ingreso definida en el formulario
            const fecha = new Date(row.fecha_ingreso);
            return (
                <div className="small text-secondary">
                    <span className="fw-bold text-dark">
                        <i className="bi bi-calendar-check me-1 text-success"></i>
                        {fecha.toLocaleDateString('es-BO')}
                    </span>
                    <br />
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        Registro: {new Date(row.created_at).toLocaleDateString('es-BO')}
                    </span>
                </div>
            );
        }
    },
    {
        label: 'Monto Recibido',
        field: 'monto',
        render: (row) => (
            <div className="text-end pe-3">
                <span className="fw-bold text-success" style={{ fontSize: '1.1rem' }}>
                    Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
                <div style={{ fontSize: '0.65rem' }} className="text-muted text-uppercase fw-bold">
                    Efectivo / Transferencia
                </div>
            </div>
        )
    },
    {
        label: 'Comprobante',
        field: 'acciones', // Campo ficticio para el estado visual
        render: (row) => {
            return (
                <div className="d-flex flex-column align-items-center">
                    <span className="badge bg-success bg-opacity-10 text-success border border-success border-opacity-25 px-2 py-1 mb-1">
                        <i className="bi bi-shield-check me-1"></i>
                        CONSOLIDADO
                    </span>
                    <small className="text-muted italic" style={{ fontSize: '0.6rem' }}>
                        Listo para arqueo
                    </small>
                </div>
            );
        }
    }
];