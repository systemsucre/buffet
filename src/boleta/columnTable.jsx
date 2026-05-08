import { faFileExcel, faTrash, faCalendarAlt } from "@fortawesome/free-solid-svg-icons";
import { LOCAL_URL, URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { datosAuditoriaExtra } from "../hooks/datosAuditoriaExtra";
import { saveDB } from "../service/service";
import { formatearFechaYHora } from "../components/FormtaarFecha";

const handleEliminarExcel = async (codigo) => {
    if (window.confirm('Eliminar Archivo excel ?')) {
        await saveDB(URL + 'boletas/eliminar-excel-boleta', {
            codigo_boleta: codigo,
            datosAuditoriaExtra
        })
        navigate(`${LOCAL_URL + '/boletas'}`)
    }
}

export const ColumnsTable = [

    {
        label: 'Fecha y Hora',
        field: 'fecha',
        render: (row) => {
            const info = formatearFechaYHora(row.fecha);
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
        label: 'CODIGO. BOLETA',
        field: 'codigo',
        render: (row) => (
            /* Añadimos la clase 'parent-hover' para controlar los hijos con CSS */
            <div >

                <div className="td-descripcion">{row.codigo_boleta}</div>

                {row.excel_path && (
                    <div className="d-flex align-items-center gap-1 transition-buttons">
                        {/* Botón de Descargar (Siempre visible o tú decides) */}
                        <a
                            href={`${URL}storage/boletas/${row.excel_path}`}
                            download={`${row.codigo_boleta}.xlsx`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="btn btn-sm btn-outline-success border-0 p-1"
                            title="Descargar Respaldo Excel"
                        >
                            <FontAwesomeIcon icon={faFileExcel} className="text-success" />
                        </a>

                        {/* Botón de Eliminar (Oculto por defecto, aparece al hacer hover) */}
                        <button
                            onClick={() => handleEliminarExcel(row.codigo_boleta)} // Tu función de eliminar
                            className="btn btn-sm btn-outline-danger border-0 p-1 btn-delete-file"
                            title="Eliminar archivo excel"
                        >
                            <FontAwesomeIcon icon={faTrash} />
                            <span className="ms-1 small text-delete">Eliminar</span>
                        </button>
                    </div>
                )}
            </div>
        ),
        sortable: true,
    },
    window.innerWidth > 877 ?
        {
            label: 'Num. Boleta',
            field: 'numero_boleta',
            render: (row) => (
                <div className="td-numero text-center">
                    <span className="ms-2"> {row.numero_boleta}</span>
                </div>
            )
        } : {},


    window.innerWidth > 877 ?
        {
            label: 'Items',
            field: '_items',
            render: (row) => (
                <div className="text-center">
                    <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                        {row.total_items}
                    </span>
                </div>
            ),
        } : {},


    {
        label: 'Usuario Solicitante',
        field: 'solicitante',
        render: (row) => (
            <div className="td-numero">
                <small className="ms-2" >
                    {row.solicitado_por}
                </small>
            </div>
        ),
        sortable: true,
    },
    {
        label: 'Estado',
        field: 'estado',
        render: (row) => {
            const estados = {
                1: {
                    badge: 'bgss-secsondary text-secondary',
                    texto: 'SOLICITADO',
                    icon: 'bi-hourglass-split',
                },
                2: {
                    badge: 'bg-infos text-info',
                    texto: 'APROBADO',
                    icon: 'bi-check-circle',
                },
                3: {
                    badge: 'tex-success text-success',
                    texto: 'DESPACHADO',
                    icon: 'bi-cash-stack',
                },
                4: {
                    badge: 'bg-danger text-danger',
                    texto: 'RECHAZADO',
                    icon: 'bi-x-circle',
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
            label: 'Monto',
            field: 'monto',
            render: (row) => (
                <div className="text-center">
                    <span className="fw-bold text-dark" style={{ fontSize: '0.85rem' }}>
                        Bs. {row.monto_total}
                    </span>
                </div>
            ),
        } : 
        {
            label: 'Monto',
            field: 'monto',
            render: (row) => {
                // Lógica de color: si es egreso rojo, si es ingreso verde
                const esEgreso = row.estado === 4 || row.monto_total < 0;
                const colorMonto = esEgreso ? '#e53e3e' : '#38a169';
                const prefijo = esEgreso ? '-' : '';

                return (<>
                    <div className="td-monto" style={{ color: colorMonto }}>
                        Bs. {Number(row.monto_total || 0).toLocaleString('es-BO', {
                            minimumFractionDigits: 2,
                            maximumFractionDigits: 2
                        })}
                    </div>
                  
                </>

                );
            }
        },

];