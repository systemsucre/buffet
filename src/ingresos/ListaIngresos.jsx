import {
    faFilePdf,
    faPlus,
    faEdit,
    faTrash,
    faHandHoldingUsd, faArrowLeft,
    faChevronLeft,
    faSearch
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomIngresos } from "../hooks/HookCustomIngresos"; // Hook adaptado previamente
import { useTramites } from "../hooks/HookCustomTramites"; // Hook adaptado previamente
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableIngresos } from "./columnTableIngresos"; // Columnas adaptadas previamente
import { LOCAL_URL } from "../Auth/config";
import CabeceraTramite from "../components/cabeceraTramite";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaIngresosTramite() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID del trámite

    const {
        ingresosFiltrados,
        cargando,
        handleSearch,
        listarIngresos, // Cambiado de listarSalidas
        eliminarIngreso,
        exportPDfIngresos,
    } = UseCustomIngresos();

    const {
        tramites,
    } = useTramites();




    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/cajero/lista-tramites");
                return;
            }
            listarIngresos(id);
        }
    }, [id]);

    // Cálculo de totales para el resumen
    const totalRecaudado = ingresosFiltrados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    const funciones = parseInt(localStorage.getItem('numRol')) === 3 ? [
        {
            boton: (id_ingreso) => {
                // alert(`${LOCAL_URL}/cajero/editar-ingreso/${id}/${id_ingreso}`);
                navigate(`${LOCAL_URL}/editar-ingreso/${id}/${id_ingreso}`);
            },
            className: 'btn btn-info py-1 px-3 x-small me-1',
            icono: faEdit,
            label: 'Editar'
        },
        {
            boton: (id_salida, row) => { exportPDfIngresos(window.innerWidth < 1100 ? 'b64' : "print", row) },
            className: 'btn btn-pdf py-1 px-3 x-small me-1',
            icono: faFilePdf,
            label: 'Recibo'
        },
        {
            boton: (id_ingreso) => eliminarIngreso(id_ingreso),
            className: 'btn btn-danger py-1 px-3 x-small',
            icono: faTrash,
            label: 'Eliminar'
        }
    ] :
        [
            {
                boton: (id_salida, row) => { exportPDfIngresos(window.innerWidth < 1100 ? 'b64' : "print", row) },
                className: 'btn btn-pdf py-1 px-3 x-small me-1',
                icono: faFilePdf,
                label: 'Recibo'
            },
        ]

    return (
        <>
            <main className="container-xl mt-2" style={{ maxWidth: "100%", }}>
                <div className="panel-custom rounded shadow-sm mx-2">

                    <div className="banco-header-section mb-4">
                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Ingresos </h3>
                            <p className="banco-subtitle">Verifique sus Ingresos del tramite seleccionado</p>
                        </div>
                    </div>

                    <div className="be-actions-container">
                        {tramites.length > 0 && parseInt(localStorage.getItem('numRol')) === 3 && (() => {
                            const tramiteActual = tramites.find(t => String(t.id) === String(id));
                            const esValido = tramiteActual?.estado === 1 && id && UUID_REGEX.test(id);

                            return (
                                <button
                                    className={`be-main-button ${!esValido ? 'be-disabled' : ''}`}
                                    onClick={() => esValido && navigate(LOCAL_URL + `/crear-ingreso/${id}`)}
                                    disabled={!esValido}
                                >
                                    <div className="be-button-content">
                                        <FontAwesomeIcon icon={faPlus} className="be-icon-circle" />
                                        <span>{tramiteActual?.estado === 1 ? 'REGISTRAR PAGO' : 'NO DISPONIBLE'}</span>
                                    </div>
                                </button>
                            );
                        })()}
                    </div>


                    <div className="banco-search-wrapper p-2">
                        <div className="banco-search-wrapper">
                            <FontAwesomeIcon
                                icon={faSearch}
                                style={{
                                    position: 'absolute',
                                    left: '18px',
                                    top: '50%',
                                    transform: 'translateY(-50%)',
                                    color: '#8e8e93',
                                    zIndex: 1
                                }}
                            />
                            <input
                                name="input-search-salida"
                                placeholder="numero ingreso, detalle..."
                                onChange={handleSearch}
                                className="banco-input-search"
                            />
                        </div>
                    </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableIngresos}
                            data={ingresosFiltrados}
                            cargando={cargando}
                            funciones={funciones}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}