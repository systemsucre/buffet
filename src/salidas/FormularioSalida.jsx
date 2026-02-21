import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom'; // Añadido useNavigate para mejor control
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { UseCustomSalidas } from "../hooks/HookCustomSalidas";

const FormularioSalida = () => {
    const { id_tramite, id } = useParams(); // id_tramite (nuevo) | id (editar)
    const isEdit = Boolean(id);
    const navigate = useNavigate();


    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const {
        tramites,
        estados,
        setters,
        guardarSalida,
        cargarSalidaPorId,
        obtenerTramite,
        cargando
    } = UseCustomSalidas();

    // 1. Efecto para EDICIÓN
    useEffect(() => {
        // Verificamos que exista el ID y que cumpla el formato antes de cargar
        if (isEdit && id && UUID_REGEX.test(id)) {
            // alert(' edtar'+id)
            cargarSalidaPorId(id);
            if (obtenerTramite) obtenerTramite(id_tramite);
        }
    }, [id, isEdit]);

    // useEffect(() => {
    //     // Verificamos que tengamos la info del trámite y un monto escrito
    //     if (tramites.length > 0 && estados.monto.campo > 0) {

    //         const costoMaximo = parseFloat(tramites[0].montoAcumulado);
    //         const montoIngresado = parseFloat(estados.monto.campo);

    //         if (montoIngresado >= costoMaximo) {
    //             alert(`¡Atención! El monto (Bs. ${montoIngresado}) excede el costo total del trámite (Bs. ${costoMaximo})`);

    //             // Reajustamos el valor al máximo permitido usando tu setter
    //             setters.setMonto({
    //                 ...estados.monto,
    //                 campo: costoMaximo.toString()
    //             });
    //         }
    //     }
    // }, [estados.monto.campo, tramites, setters]);

    // 2. Efecto para CREACIÓN
    useEffect(() => {
        if (!isEdit && id_tramite && UUID_REGEX.test(id_tramite)) {
            // alert('guardar ')

            setters.setIdTramite({
                campo: id_tramite, // Ahora guardará el UUID string
                valido: 'true'
            });

            if (obtenerTramite) obtenerTramite(id_tramite);
        }
    }, [id_tramite, isEdit]);

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-sm p-4 p-md-5 bg-white" style={{ borderRadius: '15px', border: '1px solid #eee' }}>

                            {/* Encabezado dinámico */}
                            <div className="text-center mb-4">
                                <div className="mb-3">
                                    <span style={{ fontSize: '3rem' }}>{isEdit ? '📝' : '💰'}</span>
                                </div>
                                <h2 className="h3 fw-bold text-primary text-uppercase">
                                    {isEdit ? 'Editar Registro de Gasto' : 'Nuevo Gasto de Trámite'}
                                </h2>
                            </div>

                            {/* Info del Trámite Contextual */}
                            {tramites.length>0?
                                <div className="alert alert-info border-0 shadow-sm mb-4" >
                                    <div className="row g-2 small">

                                        <div className="col-md-6 col-12 col-md-5">
                                            <div className="col">
                                                <span className="fw-bold text-dark">CLIENTE : </span>
                                                <strong className="text-primary">{tramites[0].cliente_nombre}</strong>
                                            </div>

                                            <div>
                                                <span className="fw-bold text-dark">CODIGO : </span>
                                                <strong className="text-primary">{tramites[0].codigo}</strong>
                                            </div>
                                        </div>
                                        <div className=" col-md-4  col-12 text-md-end">
                                            <div className="row align-items-center">
                                                <div className="text-end">
                                                    <div className="fw-bold text-dark">
                                                        GASTOS : Bs. {tramites[0].montoAcumulado}
                                                    </div>
                                                    <small className=" fw-bold text-muted text-success italic" style={{ fontSize: '0.7rem' }}>
                                                        COSTO TRAMITE  Bs. {tramites[0].costo}
                                                    </small>
                                                    <div className={`fw-bold ${tramites[0].saldoDisponible > 2000 ? `text-dark` : tramites[0].saldoDisponible > 1000 ? `text-warning` : `text-danger`}`} style={{ fontSize: '0.7rem' }}>
                                                        SALDO DISP.  BS. {tramites[0].saldoDisponible}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>:null
                            }

                            <br />
                            <form className="row g-3" onSubmit={(e) => guardarSalida(e, id, id_tramite)}>
                                {/* MONTO */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.monto}
                                        cambiarEstado={setters.setMonto}
                                        tipo='number'
                                        name='monto'
                                        etiqueta={'Monto (Bs) *'}
                                        placeholder="0.00"
                                        ExpresionRegular={INPUT.NUMEROS_MONEY}
                                    />
                                </div>

                                {/* FECHA SOLICITUD */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.fechaSolicitud}
                                        cambiarEstado={setters.setFechaSolicitud}
                                        tipo='date'
                                        name='fecha_solicitud'
                                        etiqueta={'Fecha de Solicitud *'}
                                    />
                                </div>

                                {/* DETALLE */}
                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={estados.detalle}
                                        cambiarEstado={setters.setDetalle}
                                        tipo='textarea'
                                        name='detalle'
                                        etiqueta={'Concepto / Detalle del Gasto *'}
                                        placeholder="Describa el motivo del gasto..."
                                    />
                                </div>

                                {/* ACCIONES */}
                                <div className="col-12 d-flex gap-2 justify-content-end mt-4 pt-3 border-top ">
                                    <button
                                        type="button"
                                        className="btn btn-dark px-4"
                                        style={{ marginRight: '4px' }}
                                        onClick={() => navigate(-1)} // Retorno más seguro
                                    >
                                        VOLVER
                                    </button>

                                    <button
                                        type="submit"
                                        className={`btn ${isEdit ? 'btn-info' : 'btn-success'} px-5 fw-bold`}
                                        disabled={cargando}
                                    >
                                        {cargando ? (
                                            <><span className="spinner-border spinner-border-sm me-2"></span>PROCESANDO...</>
                                        ) : (
                                            isEdit ? 'ACTUALIZAR GASTO' : 'SOLICITAR GASTO'
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

export default FormularioSalida;