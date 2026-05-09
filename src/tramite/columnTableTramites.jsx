
import { faCalendar } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export const ColumnsTableTramites = [
    // window.innerWidth > 877 ?
    //     {
    //         label: 'Numero',
    //         field: 'numero,',
    //         render: (row) =>
    //             <div className="td-numero"> <span >{row.numero}</span></div>
    //     } : {},

    {
        label: 'Tramite',
        field: 'codigo',
        render: (row) =>
            <>
                <div className="td-descripcion"> <span>{row.codigo}</span></div>
                <div className="td-numero">
                    <div>{row.nombre_tipo_tramite?.toUpperCase()}</div>
                </div>
            </>
    },

    {
        label: 'Detalle',
        field: 'detalle',
        render: (row) =>
            <div className="td-descripcion">
                <small>
                    {row.detalle?.substring(0, 30)}
                </small>
            </div>
    },

    {
        label: 'Cliente',
        field: 'cliente_nombre', // Viene del CONCAT en el backend 
        render: (row) => (
            <div className="td-numero">
                <div>{row.cliente_nombre}</div>
            </div>
        )
    },

    {
        label: 'Plazo y Fechas',
        field: 'fecha_finalizacion',
        render: (row) => {
            const hoy = new Date();
            const vencimiento = new Date(row.fecha_finalizacion);
            const diasRestantes = Math.ceil(
                (vencimiento - hoy) / (1000 * 60 * 60 * 24),
            );

            let color = 'text-success';
            if (diasRestantes <= 7) color = 'text-warning fw-bold';
            if (diasRestantes <= 3) color = 'text-danger fw-bold animate-pulse';

            return (
                <>
                    <div className="td-numero" >
                        <FontAwesomeIcon className="me-2" icon={faCalendar} />
                        Apertura: {new Date(row.fecha_ingreso).toLocaleDateString()}
                        <br />
                        <FontAwesomeIcon className="me-2" icon={faCalendar} />

                        Cierre estimado: {vencimiento.toLocaleDateString()}
                        <br />
                        {diasRestantes > 0
                            ? `${diasRestantes} días restantes`
                            : 'Plazo vencido'}
                    </div>
                </>
            );
        },
    },
    {
        label: 'Costo de Gestión',
        field: 'costo',
        render: (row) => {
            const costo = row.costo || 0;
            return (
                <div className="td-numero">
                    <div className="me-2">
                        GASTOS : Bs. {row.total_gastos}
                    </div>
                    {/* {localStorage.getItem('numRol') != 4 ?
                        <div className=" fw-bold text-muted text-success italic" style={{ fontSize: '0.7rem' }}>
                            COSTO TRAMITE  Bs. {costo}
                        </div>
                        : null} */}
                    <div className="text-success">
                        MONTO ABONADO  Bs. {row.total_ingresos}
                    </div>
                    <div className={`fw-bold ${row.saldoDisponible > 2000 ? `text-dark` : row.saldoDisponible > 1000 ? `text-warning` : `text-danger`}`}>
                        SALDO DISP.  BS. {row.saldoDisponible}
                    </div>
                </div>
            );
        }
    }
];