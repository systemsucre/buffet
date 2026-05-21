import { faFileDownload, faChartLine, faFileInvoiceDollar, faWallet } from "@fortawesome/free-solid-svg-icons";
import Select, { components } from 'react-select'; // Importamos components aquí
import { InputUsuarioStandard } from "../components/input/elementos";
import { useReportes } from "../hooks/HookCustomReportes";
import { INPUT } from "../Auth/config";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// 1. Componente de opción personalizada
const CustomOption = (props) => (
    <components.Option {...props}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <div>
                <strong>{props.data.label}</strong>
                <div style={{ fontSize: '0.8em', color: '#666' }}>
                    Moneda: {props.data.simbolo} | Saldo: {props.data.saldoDisponible}
                </div>
                <div style={{ fontSize: '0.55em', color: '#444444', fontWeight: '100' }}>
                    {props.data.detalle?.substring(0, 40)}
                </div>
            </div>
        </div>
    </components.Option>
);

// 2. Estilos personalizados para el Select
const customStyles = {
    control: (provided, state) => ({
        ...provided,
        backgroundColor: '#ffffff',
        borderColor: state.isFocused ? '#3b82f6' : '#dee2e6',
        boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
        borderRadius: '10px',
        padding: '5px',
        '&:hover': { borderColor: '#3b82f6' },
    }),
    menu: (provided) => ({
        ...provided,
        borderRadius: '10px',
        boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
        marginTop: '8px',
    }),
    option: (provided, state) => ({
        ...provided,
        padding: '12px 16px',
        backgroundColor: state.isSelected ? '#eff6ff' : state.isFocused ? '#f3f4f6' : 'transparent',
        color: state.isSelected ? '#1d4ed8' : '#374151',
        fontWeight: state.isSelected ? '600' : '400',
        cursor: 'pointer',
    })
};

export function ReportesAdministracionPorTramite() {
    const { estados, setters, listaTramite, reporteSalidas, reporteIngresos, reporteGeneral } = useReportes();

    return (
        <>
            <style>{`
                .report-container { background: #f8f9fa; min-height: 100vh; padding: 20px; }
                .report-card { background: white; border-radius: 15px; box-shadow: 0 10px 25px rgba(0,0,0,0.05); padding: 30px; }
                .section-title { border-left: 5px solid #1B4F72; padding-left: 15px; margin-bottom: 25px; }
                .btn-report { transition: all 0.3s ease; border-radius: 10px; text-transform: uppercase; font-size: 0.85rem; font-weight: 700; display: flex; align-items: center; justify-content: center; gap: 10px; width: 100%; height: 50px; }
                .btn-report:hover { transform: translateY(-3px); box-shadow: 0 5px 15px rgba(0,0,0,0.1); }
                .btn-general { background: #1B4F72; color: white; border: none; }
                .btn-salidas { background: #e74c3c; color: white; border: none; }
                .btn-ingresos { background: #27ae60; color: white; border: none; }
                .custom-label { font-weight: 600; color: #444; font-size: 0.9rem; margin-bottom: 8px; display: block; }
            `}</style>

            <main className="report-container">
                <div className="container">
                    <div className="section-title">
                        <h3 className="text-dark fw-bold mb-0">Reportes Individuales de Caja</h3>
                    </div>

                    <div className="report-card">
                        <div className="row g-4">
                            {/* Selector de Caja */}
                            <div className="col-lg-12">
                                <label className="custom-label">Seleccionar Caja <span className="text-danger">*</span></label>
                                <Select
                                    styles={customStyles}
                                    components={{ Option: CustomOption }}
                                    placeholder='Busque por código o nombre...'
                                    onChange={(e) => setters.setTramite({ campo: e ? e.value : '', valido: e ? 'true' : 'false' })}
                                    options={listaTramite}
                                    value={listaTramite.find(opt => opt.value === estados.tramite.campo) || null}
                                    isSearchable={true}
                                    isClearable={true}
                                />
                            </div>

                            {/* Filtros de Fecha */}
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.desde} cambiarEstado={setters.setDesde}
                                    tipo='date' name='desde' etiqueta={'Desde (Fecha Inicial)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>
                            <div className="col-md-6">
                                <InputUsuarioStandard
                                    estado={estados.hasta} cambiarEstado={setters.setHasta}
                                    tipo='date' name='hasta' etiqueta={'Hasta (Fecha Final)'}
                                    ExpresionRegular={INPUT.FECHA}
                                />
                            </div>

                            {/* Botones de Acción */}
                            <div className="col-12 mt-4">
                                <div className="row g-3">
                                    <div className="col-md-4">
                                        <button className="btn-report btn-salidas" onClick={() => reporteSalidas(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                            <FontAwesomeIcon icon={faWallet} /> Reporte Salidas
                                        </button>
                                    </div>
                                    {parseInt(localStorage.getItem('numRol')) < 4 && (
                                        <>
                                            <div className="col-md-4">
                                                <button className="btn-report btn-ingresos" onClick={() => reporteIngresos(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                                    <FontAwesomeIcon icon={faFileInvoiceDollar} /> Reporte Ingresos
                                                </button>
                                            </div>
                                            <div className="col-md-4">
                                                <button className="btn-report btn-general" onClick={() => reporteGeneral(estados.tramite.campo, estados.desde.campo, estados.hasta.campo)}>
                                                    <FontAwesomeIcon icon={faChartLine} /> Balance General
                                                </button>
                                            </div>
                                        </>
                                    )}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div className="mt-4 text-center">
                        <p className="text-muted small">
                            <FontAwesomeIcon icon={faFileDownload} className="me-2" />
                            Los reportes generados se descargarán automáticamente en formato .xlsx (Excel)
                        </p>
                    </div>
                </div>
            </main>
        </>
    );
}