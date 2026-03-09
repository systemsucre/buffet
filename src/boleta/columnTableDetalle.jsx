export const ColumnsTableDetalle = [
    {
        label: '#',
        field: 'numero',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <div className="fw-bold text-dark ">{row.numero}</div>

            </div>
        ),
        sortable: true,
    },

    {
        label: 'Detalle del Gasto',
        field: 'detalle',
        render: (row) => {
            return (
                <div className="small text-secondary">
                    {row.detalle?.length < 20 ?
                        <div className="text-dark">{row.detalle}</div> :
                        <small className="text-muted" style={{ fontSize: '0.7rem' }}>
                            {row.detalle?.substring(0, 40)}...
                        </small>
                    }
                </div>
            );
        }
    },
    {
        label: 'Código Tramite',
        field: 'codigo',
        render: (row) =>
            <div> <span className="fw-bold text-primary">{row.codigo_tramite}</span></div>
    },
    {
        label: 'Saldo Tramite',
        field: 'costo',
        render: (row) => {
            const costo = row.costo || 0;
            return (
                <div className={`fw-bold ${row.saldoDisponibleTramite > 2000 ? `text-dark` : row.saldoDisponibleTramite > 1000 ? `text-warning` : `text-danger`}`} style={{ fontSize: '0.7rem' }}>
                    SALDO DISP.  BS. {row.saldoDisponibleTramite}
                </div>
            );
        }
    },
    {
        label: 'Monto',
        field: 'monto',
        render: (row) => (
            <div className="text-center">
                <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                    Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            </div>
        )
    },

    {
        label: 'Estado Item',
        field: 'estado',
        render: (row) => {
            const estados = {
                1: { badge: 'bgss-secondary text-dark', texto: 'SOLICITADO', icon: 'bi-hourglass-split' },
                2: { badge: 'bg-info text-white', texto: 'APROBADO', icon: 'bi-check-circle' },
                3: { badge: 'bg-success text-white', texto: 'DESPACHADO', icon: 'bi-cash-stack' },
                4: { badge: 'bg-danger text-white', texto: 'RECHAZADO', icon:  'bi-x-circle' }
            };

            const est = estados[row.estado] || { badge: 'bg-secondary', texto: 'DESCONOCIDO', icon: 'bi-question' };

            return (
                <span className={`badge ${est.badge} d-flex align-items-center w-fit-content px-2 py-1`}>
                    <i className={`bi ${est.icon} me-1`}></i>
                    {est.texto}
                </span>
            );
        }
    }
];