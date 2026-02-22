import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { INPUT, LOCAL_URL } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { UseCustomIngresos } from "../hooks/HookCustomIngresosCajero"; // Asegúrate de que el nombre coincida

const FormularioIngreso = () => {
    const { id_tramite, id } = useParams(); // id_tramite (nuevo) | id (editar)
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const {
        tramites,
        estados,
        setters,
        handleGuardar, // Nuestra función unificada del Hook
        cargarIngresoPorId,
        obtenerTramite,
        cargando,
        isLoading
    } = UseCustomIngresos();

    // 1. Efecto para EDICIÓN

    useEffect(() => {
        if (isEdit && id && UUID_REGEX.test(id)) {
            cargarIngresoPorId(id);
            if (id_tramite && obtenerTramite) obtenerTramite(id_tramite);
        }
    }, [id, isEdit]);

    // 2. Efecto para NUEVO INGRESO (vincular trámite)
    useEffect(() => {
        if (!isEdit && id_tramite && UUID_REGEX.test(id_tramite)) {
            setters.setIdTramite({
                campo: id_tramite,
                valido: 'true'
            });

            if (obtenerTramite) obtenerTramite(id_tramite);

        } else navigate(LOCAL_URL + "/cajero/lista-tramites")
    }, [id_tramite, isEdit]);

    // 3. Efecto secundario para manejar el error de carga o datos vacíos
    useEffect(() => {
        // Solo si NO está cargando Y el trámite sigue vacío, redirigimos
        alert(isLoading)
        if (!isLoading && tramites?.length === 0) {
            alert("Trámite no encontrado");
            navigate(LOCAL_URL + "/cajero/lista-tramites");
        }
    }, [tramites, isLoading, isEdit]);
    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#f0f2f5' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow p-4 p-md-5 bg-white" style={{ borderRadius: '20px', border: 'none' }}>

                            {/* Encabezado dinámico */}
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <span style={{ fontSize: '3.5rem' }}>{isEdit ? '📝' : '📥'}</span>
                                </div>
                                <h2 className="h3 fw-bold text-success text-uppercase">
                                    {isEdit ? 'Editar Registro de Ingreso' : 'Nuevo Ingreso / Abono'}
                                </h2>
                                <p className="text-muted small">Registro de dinero percibido para trámites</p>
                            </div>

                            {/* Info del Trámite Contextual */}
                            {tramites.length > 0 && (
                                <div className="alert alert-success border-0 shadow-sm mb-4" style={{ backgroundColor: '#e8f5e9', padding: '10px' }}>
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

                            <form className="row g-3" onSubmit={(e) => handleGuardar(e, isEdit)}>
                                {/* MONTO (Si lo incluiste en tu tabla) */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.monto}
                                        cambiarEstado={setters.setMonto}
                                        tipo='number'
                                        name='monto'
                                        etiqueta={'Monto Recibido (Bs) *'}
                                        placeholder="0.00"
                                        ExpresionRegular={INPUT.NUMEROS_MONEY}
                                    />
                                </div>

                                {/* FECHA INGRESO */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.fechaIngreso}
                                        cambiarEstado={setters.setFechaIngreso}
                                        tipo='date'
                                        name='fecha_ingreso'
                                        etiqueta={'Fecha de Cobro *'}
                                    />
                                </div>

                                {/* DETALLE */}
                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.detalle}
                                        cambiarEstado={setters.setDetalle}
                                        tipo='textarea'
                                        name='detalle'
                                        etiqueta={'Concepto del Pago / Observaciones *'}
                                        placeholder="Ej: Pago inicial, Cancelación de trámite, etc."
                                    />
                                </div>

                                {/* ACCIONES */}
                                <div className="col-12 d-flex gap-2 justify-content-end mt-4 pt-3 border-top">
                                    <button
                                        type="button"
                                        className="btn btn-outline-secondary px-4"
                                        onClick={() => navigate(-1)}
                                    >
                                        CANCELAR
                                    </button>

                                    <button
                                        type="submit"
                                        className={`btn ${isEdit ? 'btn-primary' : 'btn-success'} px-5 fw-bold`}
                                        disabled={cargando}
                                    >
                                        {cargando ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>PROCESANDO...</>
                                        ) : (
                                            isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR INGRESO'
                                        )}
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </section>
        </main>
    );
};

export default FormularioIngreso;