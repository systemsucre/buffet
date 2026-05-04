import {
    faFilePdf,
    faCheck,
    faArrowLeft,
    faChevronLeft,
    faSearch,
} from "@fortawesome/free-solid-svg-icons";

import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { UseCustomSalidas } from "../hooks/HookCustomSalidas";
import { useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { ColumnsTableSalidas } from "./columnTableSalidas";
import { LOCAL_URL } from "../Auth/config";
import CabeceraTramite from "../components/cabeceraTramite";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaSalidas() {
    const navigate = useNavigate();
    const { id } = useParams();
    const [filtroEstado, setFiltroEstado] = useState('TODOS'); // Estado local para el filtro gerencial

    const {
        salidasFiltradas,
        cargando,
        handleSearch,
        listarSalidas,
        exportPDf

    } = UseCustomSalidas();

    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/auxiliar/lista-tramites");
                return;
            }
            listarSalidas(id);
        }
    }, [id]);

    // Lógica de filtrado para el nivel gerencial
    // Asumiendo: estado 1 = Pendiente, 1 = Aprobado, 2 = Rechazado, 3 = Despachados
    const dataFiltrada = salidasFiltradas.filter(s => {
        if (filtroEstado === 'TODOS') return true;
        return s.estado === filtroEstado;
    });



    return (
        <>
            <main className="container-xl" style={{ maxWidth: "100%", }}>

                <div className="panel-custom rounded shadow-sm  mx-2">

                    <div className="banco-header-section mb-4">
                        <div className="banco-title-container">
                            <h3 className="banco-title-main">Gastos </h3>
                            <p className="banco-subtitle">Verifique sus gastos del tramite seleccionado</p>
                        </div>
                    </div>
                    <div className="banco-nav-header">
                        <button className="banco-btn-back" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h1 className="banco-nav-title">Volver a Lista de Boletas</h1>
                    </div>



                    {/* --- SECCIÓN DE FILTROS GERENCIALES --- */}
                    <div className="banco-search-wrapper ">

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
                                placeholder="codigo/numero boleta, detalle"
                                onChange={handleSearch}
                                className="banco-input-search"
                            />
                        </div>
                    </div>
                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableSalidas}
                            data={dataFiltrada}
                            cargando={cargando}
                            funciones={[

                                {
                                    boton: (id_salida, row) => { exportPDf(window.innerWidth < 1100 ? 'b64' : "print", row) },
                                    className:"banco-btn-secondary delete",
                                    icono: faFilePdf,
                                    label: 'Generar PDF'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}