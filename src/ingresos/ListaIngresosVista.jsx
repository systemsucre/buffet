import {
    faFilePdf,
    // faHandHoldingUsd, faArrowLeft,
    // faChevronLeft,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import DataTable from "../components/DataTable";
import { UseCustomIngresos } from "../hooks/HookCustomIngresos"; // Hook adaptado previamente
import { useNavigate, useParams } from "react-router-dom";
import { useEffect } from "react";
import { ColumnsTableIngresos } from "./columnTableIngresos"; // Columnas adaptadas previamente
import { LOCAL_URL } from "../Auth/config";

const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

export function ListaIngresosVista() {
    const navigate = useNavigate();
    const { id } = useParams(); // ID del trámite

    const {
        ingresosFiltrados,
        cargando,
        listarIngresosPorTramite    , // Cambiado de listarSalidas
        exportPDfIngresos,
    } = UseCustomIngresos();




    useEffect(() => {
        if (id) {
            if (!UUID_REGEX.test(id)) {
                navigate(LOCAL_URL + "/movimientos");
                return;
            }
            listarIngresosPorTramite(id);
        }
    }, [id]);

    // Cálculo de totales para el resumen
    const totalRecaudado = ingresosFiltrados.reduce((acc, curr) => acc + Number(curr.monto || 0), 0);

    const funciones =
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
                            <h3 className="banco-title-main">Ingresos Por Trámite</h3>
                            <p className="banco-subtitle">Verifique sus Ingresos del tramite seleccionado</p>
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