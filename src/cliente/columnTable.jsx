export const columns = [
    {
        label: 'Nombre Completo',
        field: 'Nombre Completo',
        render: (row) => (
            <div >
                <span className="td-descripcion" >
                    {row.nombre_completo}
                </span>
            </div>
        ),
        sortable: true,
        wrap: true
    },
    {
        label: 'CI',
        field: 'CI',
        render: row => <div >
            <span className="td-descripcion" >
                {row.ci || 'S/N'}
            </span>
        </div>,
        sortable: true
    },
    {
        label: 'Celular',
        field: 'Celular',
        render: row => <div >
            <span className="td-numero" >
                {row.celular || 'S/N'}
            </span>
        </div>,
        sortable: true
    },
    {
        label: 'Dirección',
        field: 'Dirección',
        render: row => <div >
            <span className="td-numero" >
                {row.direccion || 'S/N'}
            </span>
        </div>,
        wrap: true
    },
    {
        label: 'Estado',
        field: 'Estado',
        sortable: true,
             render: (row) => {
            const estados = {
                1: {
                    badge: 'bgss-secsondary text-success',
                    texto: 'ACTIVO',
                    icon: 'bi-hourglass-split',
                },
                0: {
                    badge: 'bg-infos text-secondary',
                    texto: 'INACTIVO',
                    icon: 'bi-check-circle',
                },
       
            };

            const est = estados[row.estado] || {
                badge: 'bg-secondary',
                texto: 'DESCONOCIDO',  
                icon: 'bi-question',
            };

            return (
                <span
                    className={`badge ${est.badge} d-flex align-items-center w-fit-content px-2 py-1 `}
                    style={{ fontSize: '0.85rem', fontWeight: '600' }}
                >
                    <i className={`bi ${est.icon} me-1`}></i>
                    {est.texto}
                </span>
            );
        },
    },
      window.innerWidth > 877 ? 
    {
        label: 'Fecha Registro',
        field: 'Fecha Registro',
        sortable: true,
        render: row => {
            if (!row.created_at) return '---';
            const fecha = new Date(row.created_at);
            return fecha.toLocaleDateString('es-BO', {
                day: '2-digit',
                month: '2-digit',
                year: 'numeric'
            });
        }
    }:{}
];