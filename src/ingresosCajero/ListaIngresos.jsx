import {
    faFilePdf,
    faPlus,
    faEdit,
    faTrash,
    faHandHoldingUsd, faArrowLeft
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomIngresos } from "../hooks/HookCustomIngresosCajero"; // Hook adaptado previamente
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableIngresos } from "./columnTableIngresos"; // Columnas adaptadas previamente
import { LOCAL_URL } from "../Auth/config";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaIngresosTramite() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID del trámite

    const {
        ingresosFiltrados,
        tramites,
        cargando,
        handleSearch,
        listarIngresos, // Cambiado de listarSalidas
        eliminarIngreso,
        obtenerTramite,
    } = UseCustomIngresos();

    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/cajero/lista-tramites");
                return;
            }
            listarIngresos(id);
            obtenerTramite(id)
        }
    }, [id]);

    // Cálculo de totales para el resumen
    const totalRecaudado = ingresosFiltrados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", padding: '3px' }}>
                <div className="d-flex justify-content-between align-items-center mb-4 m-2">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 text-titulos">Historial de Ingresos y Abonos</h3>
                        <p className="text-muted mb-0 small text-uppercase" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Gestión Financiera - Control de Pagos por Trámite
                        </p>
                    </div>
                </div>

                <div className=" d-flex justify-content-end gap-2 " style={{ marginRight: '10px' }}>
                    {/* El botón nuevo gasto hereda el UUID correctamente */}
                    {tramites.length > 0 ?

                        tramites[0].estado === 1 ?
                            < button
                                className="btn btn-success  fw-bold"
                                onClick={() => navigate(LOCAL_URL + `/cajero/crear/${id}`)}
                                disabled={!id || !UUID_REGEX.test(id)}
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> REGISTRAR PAGO
                            </button> : < button
                                className="btn btn-success  fw-bold"
                                disabled
                            >
                                <FontAwesomeIcon icon={faPlus} className="me-2" /> NO DISPONIBLE
                            </button> : null
                    }
                    <button className=" btn btn-dark" style={{ marginLeft: '4px' }} onClick={() => navigate(LOCAL_URL + "/cajero/lista-tramites")}>
                        <FontAwesomeIcon icon={faArrowLeft} className="me-2" /> VOLVER
                    </button>
                </div>

                {/* Cabecera de Resumen Financiero del Trámite */}
                {tramites.length > 0 && (
                    <div className="alert alert-success border-0 shadow-sm mb-4 " style={{ backgroundColor: '#e8f5e9', marginBottom:'15px', marginTop:'15px', padding:'10px' }}>
                        <div className="row g-2 small">
                            <div className="col-md-7 col-12">
                                <div>
                                    <span className="fw-bold text-dark">CLIENTE: </span>
                                    <strong className="text-success">{tramites[0].cliente_nombre}</strong>
                                </div>
                                <div>
                                    <span className="fw-bold text-dark">TRÁMITE: </span>
                                    <strong className="text-success">{tramites[0].codigo}</strong>
                                </div>
                            </div>
                            <div className="col-md-5 col-12 text-md-end">
                                <div className="fw-bold text-dark">
                                    TOTAL GASTADO: Bs. {tramites[0].montoAcumulado || 0}
                                </div>
                                <div className="text-muted" style={{ fontSize: '0.75rem' }}>
                                    COSTO TOTAL: Bs. {tramites[0].costo}
                                </div>
                                <div className={`fw-bold ${tramites[0].saldoDisponible > 2000 ? `text-dark` : tramites[0].saldoDisponible > 1000 ? `text-warning` : `text-danger`}`} >
                                    SALDO DISP.  BS. {tramites[0].saldoDisponible}
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                <div className="panel-custom bg-white rounded shadow-sm p-2 mx-2">
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex align-items-center gap-3">
                                <div className="bg-light p-2 rounded border">
                                    <FontAwesomeIcon icon={faHandHoldingUsd} className="text-success me-2" />
                                    <span className="fw-bold">Total en Caja: </span>
                                    <span className="text-success fw-bold">Bs. {totalRecaudado.toLocaleString('es-BO')}</span>
                                </div>
                                <span className="text-muted small">({ingresosFiltrados.length} registros)</span>
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-end">
                            <div style={{ width: '100%', maxWidth: '300px' }}>
                                <InputUsuarioSearch
                                    name="input-search-ingreso"
                                    placeholder="Buscar abono o detalle..."
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableIngresos}
                            data={ingresosFiltrados}
                            cargando={cargando}
                            funciones={[
                                {
                                    boton: (id_ingreso) => navigate(`${LOCAL_URL}/ingresos/editar/${id}/${id_ingreso}`),
                                    className: 'btn btn-outline-primary py-1 px-3 x-small me-1',
                                    icono: faEdit,
                                    label: 'Editar'
                                },
                                {
                                    boton: (id_ingreso) => window.open(`${LOCAL_URL}/api/ingresos/comprobante/${id_ingreso}`, '_blank'),
                                    className: 'btn btn-outline-secondary py-1 px-3 x-small me-1',
                                    icono: faFilePdf,
                                    label: 'Recibo'
                                },
                                {
                                    boton: (id_ingreso) => eliminarIngreso(id_ingreso, id, 1), // 1 es el ID usuario prueba
                                    className: 'btn btn-outline-danger py-1 px-3 x-small',
                                    icono: faTrash,
                                    label: 'Anular'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}