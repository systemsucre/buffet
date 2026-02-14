export const ColumnsTableTramites = [
    { label: 'Codigo', field: 'codigo' },
    { label: 'Cliente', field: 'cliente' },
    { label: 'DNI/RUC', field: 'dni' },
    {
        label: 'Estado Procesal',
        field: 'estado',
        render: (row) => (
            <span className={`badge ${row.estado === 'Completado' ? 'bg-success' : 'bg-primary'}`}>
                {row.estado.toUpperCase()}
            </span>
        )
    },
    {
        label: 'Plazo',
        field: 'fecha_limite',
        render: (row) => {
            const hoy = new Date();
            const vencimiento = new Date(row.fecha_limite);
            const diasRestantes = Math.ceil((vencimiento - hoy) / (1000 * 60 * 60 * 24));

            let color = 'text-success';
            if (diasRestantes <= 7) color = 'text-warning fw-bold animate-pulse'; // ¡Urgente!
            if (diasRestantes <= 4) color = 'text-danger';

            return (<div>
                {/* Gastos realizados en el trámite */}
                <div className="small text-muted" title="Gastos de gestión/tasas">
                    <i className="bi bi-arrow-down-circle me-1"></i>
                    Fecha ingreso: {row.fecha_creacion}
                </div>


               <div className="x-small text-info" title="Gastos de gestión/tasas">
                    <i className="bi bi-arrow-down-circle me-1"></i>
                    Fecha Entrega: {row.fecha_limite}
                </div>
                <span className={color}>
                    <i className="bi bi-clock-history me-1"></i>
                    Dias restantes:  ({diasRestantes} días)
                </span>
            </div>

            );
        }
    },
    {
        label: 'Balance del Caso', field: 'total_contrato',
        render: (row) => {
            // Cálculo rápido (opcional, si no vienen calculados del backend)
            const total = row.total_contrato || 0;
            const gastos = row.gastos_tramite || 0;
            const saldo = row.saldo_pendiente || 0;

            return (
                <div className="text-end">
                    {/* Monto total del contrato */}
                    <div className="small text-muted" title="Total del contrato">
                        Contrato: ${total.toLocaleString()}
                    </div>

                    {/* Gastos realizados en el trámite */}
                    <div className="x-small text-info" title="Gastos de gestión/tasas">
                        <i className="bi bi-arrow-down-circle me-1"></i>
                        Gastos: ${gastos.toLocaleString()}
                    </div>

                    {/* Saldo pendiente con lógica de colores */}
                    <div className={`fw-bold mt-1 ${saldo > 0 ? 'text-danger' : 'text-success'}`}>
                        {saldo > 0 ? `Pendiente: $${saldo.toLocaleString()}` : '¡Pagado!'}
                    </div>
                </div>
            );
        }
    },
    {
        label: 'Tipo de Caso',
        field: 'rama',
        render: (row) => {
            const estilos = {
                Penal: ' text-danger',
                Laboral: ' text-dark',
                Familia: ' text-primary',
                Civil: ' text-success'
            };
            return (
                <span className={`badge ${estilos[row.rama] || 'bg-light text-dark'}`}>
                    {row.rama.toUpperCase()}
                </span>
            );
        }
    }

]