import { faCheck, faEdit, faTrashAlt, faFolder, faClock, faExclamationCircle, faRecycle, faX, faFilePdf } from "@fortawesome/free-solid-svg-icons";
import DataTable from "../components/DataTable";
import { InputUsuarioSearch } from "../components/input/elementos";
import { ColumnsTableTramites } from "./columnTableTramites";
import { useTramites as UseTramites } from "../hooks/HookCustomTramites"; // Asegúrate que el path sea correcto
import { LOCAL_URL } from '../Auth/config';

export function ListaTramites() {
    // Extraemos las funciones y estados del custom hook
    const {
        handleSearch, tramites,
        tramitesFiltrados,
        allList,
        filterByEstado,
        cargando,
        toggleEstadoTramite,
        eliminarTramite,
        filterByDelete
    } = UseTramites();

    // Cálculos para las estadísticas (Cards)
    const enCurso = tramites.filter(t => t.estado === 1).length;
    const paralizados = tramitesFiltrados.filter(t => t.estado === 0).length;

    return (
        <>
            <main className="container-xl mt-5" style={{ maxWidth: "100%" }}>
                {/* Encabezado */}
                <div className="d-flex justify-content-between align-items-end mb-4">
                    <div>
                        <h3 className="text-dark fw-bold mb-0 p-2">Gestión de Expedientes</h3>
                        <p className="text-muted mb-0 small text-uppercase p-2" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                            Panel de control de procesos - KR Estudios
                        </p>
                    </div>

                </div>

                <div className="panel-custom bg-white rounded shadow-sm p-1">
                    {/* BARRA DE ACCIONES: Filtros y Buscador */}
                    <div className="row align-items-center mb-3 g-3">
                        <div className="col-md-6">
                            <div className="d-flex gap-2">
                                <button className="btn btn-light btn-sm border text-success fw-bold" onClick={allList}>TODOS <span className="fw-bold mb-0 text-success">{tramites.length}</span></button>
                                <button className="btn btn-primary btn-sm border text-primary fw-bold" onClick={() => filterByEstado(1)}>EN CURSO <span className="fw-bold mb-0 text-primary">{enCurso}</span></button>
                                <button className="btn btn-warning btn-sm border text-warning fw-bold" onClick={() => filterByEstado(0)}>PARALIZADOS <span className="fw-bold mb-0 text-warning">{paralizados}</span></button>
                                {tramites.filter(t => t.eliminado == 0).length > 0 ? <button className="btn btn-warning btn-sm border text-danger fw-bold" onClick={() => filterByDelete(0)}>RECICLAJE <span className="fw-bold mb-0 text-danger">{tramites.filter(t => t.eliminado == 0).length}</span></button> : null}
                            </div>
                        </div>
                        <div className="col-md-6 d-flex justify-content-md-end">
                            <div style={{ width: '100%', maxWidth: '300px', paddingTop: '10px' }}>
                                <InputUsuarioSearch
                                    name="input-search-tramite"
                                    placeholder='Buscar por código, cliente o tipo...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    {/* Tabla de Datos */}
                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableTramites}
                            data={tramitesFiltrados}
                            cargando={cargando}
                            funciones={[
                                {
                                    boton: null,
                                    className: 'btn btn-info py-1 px-3 x-small me-1',
                                    icono: faEdit,
                                    enlace: LOCAL_URL + '/admin/editar-tramite',
                                    label: 'Editar'
                                },
                                {
                                    boton: (id, row) => toggleEstadoTramite(id, row.estado === 1 ? 0 : 1), // Ejemplo para paralizar/activar
                                    className: 'btn btn-dark-clinical py-1 px-3 x-small me-1',
                                    icono: (id, row) => row.estado === 1 ? faCheck : faX,
                                    label: (id, row) => row.estado === 1 ? 'Desactivar' : 'Activar'
                                },
                                {
                                    boton: (id, row) => eliminarTramite(id, row.eliminado === 1 ? 0 : 1), // Ejemplo para paralizar/activar 
                                    className: (id, row) => row.eliminado === 1 ? 'btn btn-danger py-1 px-3 x-small' : 'btn btn-warning py-1 px-3 x-small',
                                    icono: (id, row) => row.eliminado === 1 ? faTrashAlt : faRecycle,
                                    enlace: null,
                                    label: (id, row) => row.eliminado === 1 ? 'Eliminar' : 'Restaurar'
                                },

                                {
                                    boton: (id_salida) => window.open(`${LOCAL_URL}/api/salidas/pdf/${id_salida}`, '_blank'),
                                    className: 'btn btn-secondary py-1 px-3 x-small',
                                    icono: faFilePdf,
                                    label: 'PDF'
                                }
                            ]}
                        />
                    </div>
                </div>
            </main>
        </>
    );
}

export default ListaTramites;