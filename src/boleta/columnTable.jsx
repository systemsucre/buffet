import { faFileExcel, faTrash } from "@fortawesome/free-solid-svg-icons";
import { LOCAL_URL, URL } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { datosAuditoriaExtra } from "../hooks/datosAuditoriaExtra";
import { saveDB } from "../service/service";


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

    // {
    //     label: 'CODIGO. BOLETA',
    //     field: 'codigo',
    //     render: (row) => (
    //         <div className="d-flex align-items-center gap-2" style={{ minWidth: '150px' }}>
    //             {/* Código de la Boleta */}
    //             <div className="fw-bold text-dark">{row.codigo_boleta}</div>

    //             {/* Enlace al Excel (Solo si existe) */}
    //             {row.excel_path && (
    //                 <a
    //                     href={`${URL}storage/boletas/${row.excel_path}`}
    //                     download={`${row.codigo_boleta}.xlsx`} // Sugiere el nombre al descargar
    //                     target="_blank"
    //                     rel="noopener noreferrer"
    //                     className="btn btn-sm btn-outline-success border-0 p-1"
    //                     title="Descargar Respaldo Excel"
    //                 >
    //                     <FontAwesomeIcon icon={faFileExcel} className="text-success" />
    //                 </a>
    //             )
    //             }
    //         </div >
    //     ),
    //     sortable: true,
    // },
    {
        label: 'CODIGO. BOLETA',
        field: 'codigo',
        render: (row) => (
            /* Añadimos la clase 'parent-hover' para controlar los hijos con CSS */
            <div className="d-flex align-items-center gap-2 parent-hover" style={{ minWidth: '200px', position: 'relative', overflow: 'hidden' }}>

                <div className="fw-bold text-dark ">{row.codigo_boleta}</div>

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
    {
        label: 'NUMERO BOLETA',
        field: 'numero',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <div className="fw-bold text-dark text-center ">{row.numero_boleta}</div>

            </div>
        ),
        sortable: true,
    },

    {
        label: 'Fecha solicitud',
        field: 'created_at',
        render: (row) => {
            const fecha = new Date(row.fecha?.split(" ")[0])
            return (
                <div className="small text-secondary">
                    <i className="bi bi-calendar3 me-1"></i>
                    {fecha.toLocaleDateString('es-BO')}
                    <br />
                    <span className="text-muted" style={{ fontSize: '0.7rem' }}>
                        {fecha.toLocaleTimeString('es-BO', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                </div>
            );
        }
    },
    {
        label: 'Items',
        field: 'items',
        render: (row) => (
            <div className="text-center">
                <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                    {row.total_items}
                </span>
            </div>
        )
    },
    {
        label: 'Monto',
        field: 'monto',
        render: (row) => (
            <div className="text-center">
                <span className="fw-bold text-dark" style={{ fontSize: '1.05rem' }}>
                    Bs. {Number(row.monto_total || 0).toLocaleString('es-BO', {
                        minimumFractionDigits: 2,
                        maximumFractionDigits: 2
                    })}
                </span>
            </div>
        )
    },
    {
        label: 'Usuario Solicitante',
        field: 'solicitante',
        render: (row) => (
            <div style={{ minWidth: '10px' }}>
                <small className="text-muted" style={{ fontSize: '0.9rem' }}>
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
                1: { badge: 'bgss-secondary text-dark', texto: 'SOLICITADO', icon: 'bi-hourglass-split' },
                2: { badge: 'bg-info text-white', texto: 'APROBADO', icon: 'bi-check-circle' },
                3: { badge: 'bg-success text-white', texto: 'DESPACHADO', icon: 'bi-cash-stack' },
                4: { badge: 'bg-danger text-white', texto: 'RECHAZADO', icon: 'bi-x-circle' }
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