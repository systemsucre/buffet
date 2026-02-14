import {  useState } from 'react';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard, Select1 } from '../components/input/elementos';
import { toast } from 'react-hot-toast';

const NuevoTramite = () => {
    const [tipo, setTipo] = useState({ campo: null, valido: null });
    const [codigo, setCodigo] = useState({ campo: '', valido: null });
    const [cliente, setCliente] = useState({ campo: '', valido: null });
    const [fecha, setFecha] = useState({ campo: new Date().toISOString().split('T')[0], valido: 'true' });
    const [plazo, setPlazo] = useState({ campo: '', valido: null });
    const [costo, setCosto] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [otros, setOtros] = useState({ campo: '', valido: null });


    const tiposTramiteLista = [
        { value: 1, label: 'JUDICIAL' },
        { value: 2, label: 'ADMINISTRATIVO' },
        { value: 3, label: 'LOTEAMIENTO' }
    ]
    // Esta función se ejecuta cuando Select1 valida el cambio
    const handleCambioTipo = (idSeleccionado) => {
        const encontrado = tiposTramiteLista.find(t => t.value === idSeleccionado);
        if (encontrado) {
            const prefijo = encontrado.label === 'JUDICIAL' ? 'JUD-' :
                encontrado.label === 'LOTEAMIENTO' ? 'LOT-' : 'ADM-';
            setCodigo({ campo: prefijo, valido: 'true' });
        }
    };

    const guardarTramite = (e) => {
        e.preventDefault();
        if (tipo.valido === 'true' && codigo.valido === 'true' && cliente.valido === 'true') {
            const data = {
                tipoId: tipo.campo,
                codigo: codigo.campo,
                cliente: cliente.campo,
                fecha: fecha.campo,
                plazo: plazo.campo,
                costo: costo.campo,
                detalle: detalle.campo,
                otros: otros.campo
            };
            console.log("Enviando trámite:", data);
            toast.success('Trámite registrado con éxito');
        } else {
            toast.error('Por favor, complete los campos obligatorios (*) ');
        }
    };

    return (
        <main className="login-wrapper d-flex align-items-center justify-content-center py-5" style={{ minHeight: '100vh' }}>
            <section className="container">
                <div className="row justify-content-center">
                    {/* Explicación de clases:
                col-12: Ocupa todo el ancho en móviles.
                col-md-10: Un poco más estrecho en tablets.
                col-lg-7: Ocupa casi la mitad en pantallas grandes.
                col-xl-6: Se mantiene centrado y compacto en monitores muy grandes.
            */}
                    <div className="col-12 col-md-10 col-lg-7 col-xl-6 animate-fade-in">
                        <div className="login-card shadow-clinical p-4 p-md-5 bg-white" style={{ borderRadius: '15px' }}>

                            {/* Encabezado */}
                            <div className="text-center mb-5">
                                <div className="icon-pulse mb-3">
                                    <span className="fs-1">📑</span>
                                </div>
                                <h2 className="h3 fw-black text-primary text-uppercase m-0">Registro de Trámite</h2>
                                <p className="text-muted small">Portal KR Estudios - Gestión Profesional</p>
                            </div>

                            <form className="row g-3" onSubmit={guardarTramite}>

                                {/* Tipo de Trámite */}
                                <div className="col-md-6">
                                    <Select1
                                        estado={tipo}
                                        cambiarEstado={setTipo}
                                        Name="tipo_tramite"
                                        name="select_tipo"
                                        lista={tiposTramiteLista}
                                        etiqueta="Tipo de Trámite"
                                        msg="Seleccione un tipo"
                                        funcion={handleCambioTipo}
                                        ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                {/* Código */}
                                <div className="col-md-6">
                                    <InputUsuarioStandard
                                        estado={codigo}
                                        cambiarEstado={setCodigo}
                                        tipo='text'
                                        name='codigo'
                                        etiqueta={'Código Trámite'}
                                        placeholder={"Prefijo-000"}
                                        msg={'Ej. JUD-00022929'}
                                        ExpresionRegular={INPUT.CODIGO_TRAMITE}

                                    />
                                </div>

                                <div className="col-md-6">
                                    <Select1
                                        estado={cliente}
                                        cambiarEstado={setCliente}
                                        Name="cliente"
                                        lista={[
                                            { value: 1, label: 'JUAN PEREZ' },
                                            { value: 2, label: 'CAROS ARANCIBIA' },
                                            { value: 3, label: 'ROLANDO CONDORI' }
                                        ]}
                                        etiqueta="Cliente"
                                        msg="Seleccione un cliente"
                                        ExpresionRegular={INPUT.ID}
                                    />
                                </div>

                                {/* Fila: Fecha, Plazo, Costo */}
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={fecha}
                                        cambiarEstado={setFecha}
                                        tipo='date'
                                        name='fecha'
                                        etiqueta={'Fecha'}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={plazo}
                                        cambiarEstado={setPlazo}
                                        tipo='number'
                                        name='plazo'
                                        etiqueta={'Plazo (Días)'}
                                        ExpresionRegular={INPUT.NUMEROS_P}
                                        msg={'Deve ser un valor entero positivo'}
                                    />
                                </div>
                                <div className="col-md-4">
                                    <InputUsuarioStandard
                                        estado={costo}
                                        cambiarEstado={setCosto}
                                        tipo='number'
                                        name='costo'
                                        etiqueta={'Costo'}
                                        ExpresionRegular={INPUT.NUMERO_REALES_POSITIVOS}
                                        msg={'Deve ser un valor  positivo'}
                                    />
                                </div>

                                {/* Detalle */}
                                <div className="col-12">
                                    <InputUsuarioStandard
                                        estado={detalle}
                                        cambiarEstado={setDetalle}
                                        tipo='textarea'
                                        name='detalle'
                                        etiqueta={'Detalle del Trámite'}
                                        placeholder={"Describa el trámite..."}
                                    />
                                </div>

                                {/* Observaciones */}
                                <div className="col-12 mb-4">
                                    <InputUsuarioStandard
                                        estado={otros}
                                        cambiarEstado={setOtros}
                                        tipo='text'
                                        name='otros'
                                        etiqueta={'Otros / Observaciones'}
                                        placeholder={"Información adicional"}
                                    />
                                </div>

                                {/* Botón de Acción */}
                                <div className="col-12 p-3">
                                    <button type="submit" className="btn btn-success py-1 px-3 x-small">
                                        REGISTRAR TRÁMITE
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

export default NuevoTramite;