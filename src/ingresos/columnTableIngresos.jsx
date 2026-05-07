
import { formatearFechaYHora } from "../components/FormtaarFecha";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCalendarAlt } from "@fortawesome/free-solid-svg-icons";

export const ColumnsTableIngresos = [
    {
        label: 'Fecha de Cobro',
        field: 'fecha',
        render: (row) => {
            const info = formatearFechaYHora(row.fecha_ingreso);
            return (
                <div className="movimiento-banco-wrapper">
                    {/* Cabecera con icono de calendario */}
                    <div className="fecha-header">
                        {/* <i className="bi bi-calendar3 me-2"></i> */}
                        <FontAwesomeIcon className="me-2" icon={faCalendarAlt} />
                        {info.fechaLarga}
                        {/* Hora (solo se muestra si existe) */}
                        {info.hora && (
                            <div className="hora-detalle">

                                {info.hora}
                            </div>
                        )}
                    </div>


                </div>
            );
        }
    },
    {
        label: 'TRAMITE REF',
        field: 'codigo_tramite',
        render: (row) => (
            <>            <div className="td-descripcion">

                {row.codigo_tramite}
            </div>
                <div className="td-numero">
                    <span >{row.cliente_nombre}</span>
                </div>
            </>

        )
    },



    {
        label: 'Detalle ítem',
        field: 'detalle',
        render: (row) => (
            <div className="td-descripcion">
                <small>
                    {row.detalle?.substring(0, 50)}
                </small>
            </div>
        )
    },


    window.innerWidth > 877 ?
        {
            label: 'RECIBIDO POR',
            field: 'username',
            render: (row) => (
                <div className="td-numero">
                    <span >{row.usuario_nombre}</span>
                </div>
            )
        } : {},

    window.innerWidth > 877 ?
        {
            label: 'Monto',
            field: 'monto',
            render: (row) => {
                // Lógica de color: si es egreso rojo, si es ingreso verde
                const esEgreso = row.estado === 4 || row.monto < 0;
                const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
                const prefijo = esEgreso ? '-' : '';

                return (<>
                    <div className="td-descripcion" style={{ color: colorMonto }}>
                        Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}

                    </div>
                    <div className="td-numero" >
                        <span >{row.tipo}</span>
                    </div>
                </>
                );
            }
        } :

        {
            label: 'Monto',
            field: 'monto',
            render: (row) => {
                // Lógica de color: si es egreso rojo, si es ingreso verde
                const esEgreso = row.estado === 4 || row.monto < 0;
                const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
                const prefijo = esEgreso ? '-' : '';

                return (<>
                    <div className="td-monto" style={{ color: colorMonto }}>
                        Bs. {Number(row.monto || 0).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                    <div className="td-monto td-numero" style={{ marginTop: '2.5rem' }}>
                        <span >{row.tipo}</span>
                    </div>
                </>

                );
            }
        }
];