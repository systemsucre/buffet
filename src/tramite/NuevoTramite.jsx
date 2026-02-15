import { useEffect } from 'react';
import { useParams } from 'react-router-dom'; // Para capturar el ID de la URL
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { useTramites } from "../hooks/HookCustomTramites";

const FormularioTramite = () => {
    const { id } = useParams(); // Si existe 'id', estamos en modo EDICIÓN
    const isEdit = Boolean(id);

    const {
        auxiliares,
        estados,
        setters,
        guardarTramite,
        cargarTramitePorId, // Debes añadir esta función a tu Hook
        cargando
    } = useTramites();

    // Efecto para cargar datos si es edición
    useEffect(() => {
        if (isEdit) {
            cargarTramitePorId(id);
        }
    }, [id, isEdit]);

const handleCambioTipo = (idSeleccionado) => {
    // 1. No autogenerar si estamos editando (para no sobrescribir el código real)
    if (isEdit) return;

    // 2. Buscar el objeto del trámite seleccionado en la lista que vino de la BD
    const encontrado = auxiliares.listaTipos.find(t => t.value === parseInt(idSeleccionado));
    
    if (encontrado) {
        // 3. Limpiar el nombre (quitar espacios al inicio/final)
        const nombre = encontrado.label.trim().toUpperCase();
        
        // 4. Extraer las 3 primeras letras
        // Si el nombre tiene menos de 3, tomará lo que haya
        const iniciales = nombre.substring(0, 3);
        
        // 5. Formatear el prefijo (Ej: "JUD-", "ADM-", "PRO-")
        const prefijo = `${iniciales}-`;
        
        // 6. Actualizar el estado del código
        setters.setCodigo({ 
            campo: prefijo, 
            valido: 'true' 
        });
    }
};

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    <div className="col-12 col-md-10 col-lg-8 col-xl-7 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{ borderRadius: '15px' }}>

                            {/* Encabezado Dinámico */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">{isEdit ? '📝' : '📑'}</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">
                                    {isEdit ? 'Editar Trámite' : 'Apertura de Trámite'}
                                </h2>
                                <p className="text-muted small">
                                    {isEdit ? `Modificando expediente: ${estados.codigo.campo}` : 'KR Estudios - Gestión de Expedientes'}
                                </p>
                            </div>

                            <form className="row g-3" onSubmit={(e) => guardarTramite(e, id)}>

                                <div className="col-md-6">
                                    <Select1
                                        estado={estados.idTipoTramite}
                                        cambiarEstado={setters.setIdTipoTramite}
                                        Name="id_tipo_tramite"
                                        lista={auxiliares.listaTipos}
                                        etiqueta="Tipo de Trámite *"
                                        msg="Seleccione el tipo de servicio"
                                        funcion={handleCambioTipo}
                                        ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={estados.codigo}
                                        cambiarEstado={setters.setCodigo}
                                        tipo='text'
                                        name='codigo'
                                        etiqueta={'Código de Expediente *'}
                                        placeholder={"Prefijo-000"}
                                        ExpresionRegular={INPUT.CODIGO_TRAMITE}
                                        readOnly={isEdit} // Opcional: Bloquear código en edición
                                    />
                                </div>

                                <div className="col-md-12">
                                    <Select1
                                        estado={estados.idCliente}
                                        cambiarEstado={setters.setIdCliente}
                                        Name="id_cliente"
                                        lista={auxiliares.listaClientes}
                                        etiqueta="Cliente / Solicitante *"
                                        msg="Busque y seleccione al cliente"
                                        ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.fechaIngreso}
                                        cambiarEstado={setters.setFechaIngreso}
                                        tipo='date'
                                        name='fecha_ingreso'
                                        etiqueta={'Fecha Ingreso *'}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.fechaFinalizacion}
                                        cambiarEstado={setters.setFechaFinalizacion}
                                        tipo='date'
                                        name='fecha_finalizacion'
                                        etiqueta={'Fecha Entrega *'}
                                    />
                                </div>

                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={estados.costo}
                                        cambiarEstado={setters.setCosto}
                                        tipo='number'
                                        name='costo'
                                        etiqueta={'Costo Total (Bs) *'}
                                        ExpresionRegular={INPUT.NUMEROS_P}
                                    />
                                </div>

                                <div className="col-12 mb-2">
                                    <InputUsuarioStandard
                                        estado={estados.detalle}
                                        cambiarEstado={setters.setDetalle}
                                        tipo='textarea'
                                        name='detalle'
                                        etiqueta={'Detalle del Trámite'}
                                        placeholder={"Descripción del caso..."}
                                    />
                                </div>

                                <div className="col-12 mb-4">
                                    <InputUsuarioStandard
                                        estado={estados.otros}
                                        cambiarEstado={setters.setOtros}
                                        tipo='textarea'
                                        name='otros'
                                        etiqueta={'Notas Adicionales'}
                                        placeholder={"Observaciones..."}
                                        importante={false}
                                    />
                                </div>
                                <p></p>
                                <div className="col-12 d-flex gap-2 justify-content-end border-top pt-4">
                                    <button type="button" className="btn btn-light px-4" onClick={() => window.history.back()}>
                                        CANCELAR
                                    </button>
                                    <button type="submit" className={`btn ${isEdit ? 'btn-info' : 'btn-success'} px-5 fw-bold`} disabled={cargando}>
                                        {cargando ? 'PROCESANDO...' : isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR'}
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

export default FormularioTramite;