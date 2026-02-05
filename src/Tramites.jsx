
import { faCheck,  faEdit,  faTrashAlt } from "@fortawesome/free-solid-svg-icons";
import DataTable from "./components/DataTable";
import { InputUsuarioSearch } from "./components/input/elementos";
import { ColumnsTableTramites } from "./conf/columnTableTramites";
import { UseTramites } from "./hooks/UseTramites"
import {LOCAL_URL} from './Auth/config'


export function Tramites() {


    // custom hook
    const { handleSearch, tramites, tramitesFiltrados, allList, listProcesing } = UseTramites();


    // Render
    return (
        <>
            <main className="container-xl mt-5">

                <h3 className="text-dark fw-bold mb-0 p-2">Gestión de Expedientes</h3>
                <p className="text-muted mb-0 small text-uppercase p-2" style={{ letterSpacing: '1px', fontSize: '0.7rem' }}>
                    Panel de control de procesos judiciales y administrativos
                </p>

                {/* <div className="contenedor-boton">
                    <button type="button" class="btn btn-dark w-10">Añadir Nuevo </button>
                </div> */}


                {/* <div className="row g-3 mb-4 " style={{ padding: '10px'  }}>
                    <div className="col-lg-4 col-md-4 col-sm-6 col-6 panel-custom bg-primary-light ">
                        <div className="border-0 shadow-sm p-3 border-start border-primary border-4 card-stats">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted text-uppercase fw-bold d-block">Total trámites</span>
                                    <h3 className="fw-bold mb-0 text-primary">{tramites.length}</h3>
                                </div>
                                <div className="icon-box bg-primary-light d-flex align-items-center justify-content-center rounded">
                                    <FontAwesomeIcon icon={faFolder} className="text-primary" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-6 col-6 panel-custom bg-warning-light">
                        <div className=" border-0 shadow-sm p-3 border-start border-warning border-4 card-stats">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted text-uppercase fw-bold d-block">En Proceso</span>
                                    <h3 className="fw-bold mb-0 text-warning">
                                        {tramites.filter(t => t.estado === 'Proceso').length}
                                    </h3>
                                </div>
                                <div className="icon-box bg-warning-light d-flex align-items-center justify-content-center rounded">
                                    <FontAwesomeIcon icon={faClock} className="text-warning" />
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="col-lg-4 col-md-4 col-sm-12 col-12 panel-custom bg-danger-light">
                        <div className=" border-0 shadow-sm p-3 border-start border-danger border-4 card-stats">
                            <div className="d-flex align-items-center justify-content-between">
                                <div>
                                    <span className="text-muted text-uppercase fw-bold d-block">Urgentes</span>
                                    <h3 className="fw-bold mb-0 text-danger">
                                        {tramites.filter(t => t.prioridad === 'Urgente').length}
                                    </h3>
                                </div>
                                <div className="icon-box bg-danger-light d-flex align-items-center justify-content-center rounded">
                                    <FontAwesomeIcon icon={faExclamationTriangle} className="text-danger" />
                                </div>
                            </div>
                        </div>
                    </div>
                </div> */}

                <div className="panel-custom">

                    {/* BARRA DE ACCIONES: Buscador a la derecha */}
                    <div className="d-flex align-items-center mb-3 bg-white p-0 pt-3 pr-0 pl-0 pb-0 m-0 shadow-sm row ">
                        <div className="col-sm-12">
                            <div className="d-flex gap-2">
                                {/* Filtros rápidos opcionales */}
                                <button className="btn btn-light btn-sm border" onClick={allList} >Todos</button>
                                <button className="btn btn-light btn-sm border text-primary" onClick={listProcesing}>Pendientes</button>
                            </div>
                        </div>
                        <div className="col-sm-12">
                            <div style={{ width: '260px' }}>
                                <InputUsuarioSearch
                                    name="input-default-search"
                                    placeholder='Buscar trámites ...'
                                    onChange={handleSearch}
                                />
                            </div>
                        </div>
                    </div>

                    <DataTable
                        columns={ColumnsTableTramites}
                        data={tramitesFiltrados}
                        funciones={[
                            { boton: null, className: 'btn btn-info py-1 px-3 x-small', icono: faEdit, enlace: LOCAL_URL + '/admin/editar-tramite', label:'Editar' },
                            { boton: null, className: 'btn btn-danger py-1 px-3 x-small', icono: faTrashAlt, enlace: null, label:'Eliminar'},
                            { boton: null, className: 'btn btn-dark-clinical py-1 px-3 x-small', icono: faCheck, enlace: null },
                        ]}

                    />
                </div>
            </main>

        </>
    )
}

export default Tramites
