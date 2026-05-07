import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from "../hooks/HookCustomBoleta";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {


    faFilePdf,
    faCheck,

    faClock, faCircleCheck, faUserTie, faEdit,
    faTrash,
    faArrowLeft,
    faChevronLeft
} from '@fortawesome/free-solid-svg-icons';
import { ColumnsTableDetalle } from './columnTableDetalle';
import DataTable from "../components/DataTable";
import { LOCAL_URL } from '../Auth/config';


export const DetallesBoleta = () => {
    const { codigo } = useParams();
    const navigate = useNavigate();
    const [infoCabecera, setInfoCabecera] = useState(null);

    const {
        consultarDetalleBoleta,
        exportarBoletaPDF,

        aprobarBoleta,
        aprovarDespacharBoleta,
        rechazarBoleta,
        despacharBoleta,
        eliminarBoleta,
        habilitarEdicionBoleta,

        itemsBoleta,
        cargando
    } = UseCustomBoletas();

    useEffect(() => {
        const cargarDatos = async () => {
            await consultarDetalleBoleta(codigo);
        };
        cargarDatos();
    }, [codigo]);

    // Actualizamos la cabecera cuando lleguen los items
    useEffect(() => {
        if (itemsBoleta && itemsBoleta.length > 0) {
            setInfoCabecera(itemsBoleta[0]);
        }
    }, [itemsBoleta]);


    const styles = {
        card: { borderRadius: '16px', border: 'none', overflow: 'hidden' },
        headerIcon: { width: '45px', height: '45px', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '12px' },
        financeBox: { backgroundColor: '#f8f9fa', borderRadius: '10px', padding: '12px', borderLeft: '4px solid #4e73df' },
        tableHeader: { backgroundColor: '#2c3e50', color: '#fff', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '1px' },
        badgeStatus: { padding: '8px 12px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 'bold' }
    };
    return (
        !cargando ?
            <main className="container-xl">
                <div className="panel-custom  rounded shadow-sm mx-2"  >


                    <div className="banco-nav-header">
                        <button className="banco-btn-back" onClick={() => navigate(-1)}>
                            <FontAwesomeIcon icon={faChevronLeft} />
                        </button>
                        <h1 className="banco-nav-title">Volver a Lista de Boletas</h1>
                    </div>

                    <div className="banco-card-header">
                        <div className="banco-info-main">
                            {/* Etiqueta superior sutil */}
                            <p className="banco-label-top">
                                BOLETA <span className="banco-id-secondary">{codigo}</span>
                            </p>

                            {/* Identificador Principal (como el saldo) */}
                            <h2 className="banco-monto-principal">
                                #{itemsBoleta && itemsBoleta.length > 0 ? itemsBoleta[0].numero_boleta : 'S/N'}
                            </h2>

                            <p className="banco-label-sub">Número de Boleta</p>
                        </div>

                        <hr className="banco-divider" />

                        <div className="banco-info-grid">
                            <div className="banco-grid-item">
                                <span className="banco-grid-label">Estado actual</span>
                                {/* Badge sutil estilo BancoEstado */}
                                <span style={{
                                    ...styles.badgeStatus,
                                    background: 'transparent',
                                    padding: '0',
                                    fontSize: '14px',
                                    fontWeight: '500',
                                    color: infoCabecera?.estado === 3 ? '#38a169' : '#d69e2e'
                                }}>
                                    <FontAwesomeIcon icon={infoCabecera?.estado === 3 ? faCircleCheck : faClock} className="me-2" />
                                    {infoCabecera?.estado === 3 ? 'Finalizada' :infoCabecera?.estado === 2?'Aprobado':infoCabecera?.estado === 1?'Solicitado': 'Rechazado'}
                                </span>
                            </div>

                            <div className="banco-grid-item text-end">
                                <span className="banco-grid-label">Total Boleta</span>
                                <span className="banco-grid-value">
                                 Bs.   {
                                        itemsBoleta.reduce((acumulador, item) => {
                                            // Convertimos el string "10.00" a número flotante
                                            return acumulador + parseFloat(item.monto);
                                        }, 0)?.toFixed(2)} {itemsBoleta[0]?.simbolo}
                                </span>
                            </div>
                        </div>

                        <button className="banco-btn-cartolas" onClick={() => exportarBoletaPDF(window.innerWidth < 1100 ? 'b64' : "print", infoCabecera)}>
                            Ver Detalles <FontAwesomeIcon icon={faFilePdf} className="me-2" />
                        </button>
                    </div>
                    {/* PANEL DE INFORMACIÓN DE FIRMAS/USUARIOS */}
                    {/* <div className="card-body bg-light border-bottom py-4 px-4 mt-3">
                        <div className="row g-4 text-md-start">
                            {[
                                { label: 'Solicitante', user: infoCabecera?.solicitado_por, date: infoCabecera?.fecha_solicitud?.split('T')[0], icon: faUserTie, status: infoCabecera?.estado },
                                { label: 'Autorización', user: infoCabecera?.autorizado_por, date: infoCabecera?.fecha_aprobacion?.split('T')[0], icon: faCircleCheck, status: infoCabecera?.estado },
                                { label: 'Despacho', user: infoCabecera?.despachado_por, date: infoCabecera?.fecha_despacho?.split('T')[0], icon: faClock, status: infoCabecera?.estado }
                            ].map((step, i) => (
                                <div className={"col-md-4"} key={i}>
                                    <div className="p-3 bg-white rounded shadow-sm h-100 border-top border-primary border-3">
                                        <small className="text-muted fw-bold d-block mb-1"><FontAwesomeIcon icon={step.icon} className="me-1" /> {step.label}</small>
                                        <div className="fw-bold text-dark mb-1">{step.user || '---'}</div>
                                        <small className="text-muted fw-bold d-block" style={{ fontSize: '0.9rem' }}>{step.date || 'Pendiente'}</small>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div> */}
                        <div className="banco-actions-container">
                            {infoCabecera?.estado === 1 && parseInt(localStorage.getItem('id')) === infoCabecera?.usuario ?
                                <>
                                    <button className="banco-btn-secondary edit" onClick={() => navigate(`${LOCAL_URL}/modificar-boleta/${codigo}`)}>
                                        <FontAwesomeIcon icon={faEdit} className="me-2" /> Modificar
                                    </button>
                                    <button className="banco-btn-secondary delete" onClick={() => eliminarBoleta(codigo)}>
                                        <FontAwesomeIcon icon={faTrash} className="me-2" /> Eliminar
                                    </button>
                                </>  

                                : null}
    
                            {
                                parseInt(localStorage.getItem('numRol')) === 3 && infoCabecera?.estado === 2 ?
                                    <button className="banco-btn-secondary edit" onClick={() => despacharBoleta(codigo)}>
                                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Despachar
                                    </button>
                                    :
                                    parseInt(localStorage.getItem('numRol')) === 3 && infoCabecera?.estado === 1 && parseInt(localStorage.getItem('id')) !== infoCabecera?.usuario ?
                                        <button className="banco-btn-secondary edit" onClick={() => aprovarDespacharBoleta(codigo)}>
                                            <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar y Despachar
                                        </button>
                                        :
                                        parseInt(localStorage.getItem('numRol')) === 2 && infoCabecera?.estado === 1 && parseInt(localStorage.getItem('id')) !== infoCabecera?.usuario ?
                                            <button className="banco-btn-secondary edit" onClick={() => aprobarBoleta(codigo)}>
                                                <FontAwesomeIcon icon={faCheck} className="me-2" /> Aprobar
                                            </button>
                                            : null}
                            {
                                parseInt(localStorage.getItem('numRol')) < 4 && infoCabecera?.estado > 1 ?
                                    <button className="banco-btn-secondary delete" onClick={() => habilitarEdicionBoleta(codigo)}>
                                        <FontAwesomeIcon icon={faCheck} className="me-2" /> Habilitar Edicion
                                    </button> : null
                            }
                        </div>

                    <div className="table-responsive">
                        <DataTable
                            columns={ColumnsTableDetalle}
                            data={itemsBoleta}
                            cargando={cargando}
                            funciones={[]}
                        />
                    </div>
                </div>

            </main > : <p style={{ margin: '10rem' }}>cargando</p>
    );
};