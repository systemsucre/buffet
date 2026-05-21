import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select from 'react-select';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { UseCustomHonorarios } from "../hooks/HookCustomHonorarios";
import { useTramites } from "../hooks/HookCustomTramites";

const FormularioHonorario = () => {
    const { id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const UUID_REGEX = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

    const { estados, setters, handleGuardar, cargarHonorarioPorId, cargando } = UseCustomHonorarios();
    const { tramitesFiltrados } = useTramites();

    useEffect(() => {
        if (isEdit && id && UUID_REGEX.test(id)) {
            cargarHonorarioPorId(id);
        }
    }, [id, isEdit]);

    const opcionesPago = [
        { value: 'Efectivo', label: 'EFECTIVO' },
        { value: 'Transferencia', label: 'TRANSFERENCIA' },
        { value: 'Depósito', label: 'DEPÓSITO' },
        { value: 'Cheque', label: 'CHEQUE' },
    ];

    // Estilos UI Premium
    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#f8fafc',
            borderColor: state.isFocused ? '#0f172a' : '#cbd5e1',
            boxShadow: state.isFocused ? '0 0 0 1px #0f172a' : 'none',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '14px',
            minHeight: '45px',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#0f172a' },
        }),
        menu: (provided) => ({ ...provided, borderRadius: '16px', zIndex: 9999 }),
        option: (provided, state) => ({
            ...provided,
            padding: '12px 16px',
            backgroundColor: state.isSelected ? '#e2e8f0' : state.isFocused ? '#f1f5f9' : 'transparent',
            color: '#0f172a',
            cursor: 'pointer',
        }),
    };

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', marginTop: '3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>
                
                {/* CABECERA */}
                <div style={{ marginBottom: '28px' }}>
                    <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px' }}>
                        Módulo de Honorarios
                    </span>
                    <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0 }}>
                        {isEdit ? 'Editar Cobro de Honorario' : 'Registrar Honorarios Profesionales'}
                    </h1>
                </div>

                <form onSubmit={(e) => handleGuardar(e, isEdit)} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '20px' }}>
                        
                        <InputUsuarioStandard
                            estado={estados.monto}
                            cambiarEstado={setters.setMonto}
                            tipo='number'
                            name='monto'
                            etiqueta={'Monto Honorario (Bs)'}
                            placeholder="0.00"
                            ExpresionRegular={INPUT.NUMEROS_MONEY}
                        />

                        <div>
                            <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Método de Pago *</label>
                            <Select
                                styles={customStyles}
                                options={opcionesPago}
                                onChange={(e) => setters.setTipoPago({ campo: e.value, valido: 'true' })}
                                value={opcionesPago.find(opt => opt.value === estados.tipoPago.campo) || null}
                                isSearchable={false}
                            />
                        </div>

                        <InputUsuarioStandard
                            estado={estados.fechaIngreso}
                            cambiarEstado={setters.setFechaIngreso}
                            tipo='date'
                            name='fecha_ingreso'
                            etiqueta={'Fecha de Cobro'}
                        />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Trámite *</label>
                        <Select
                            styles={customStyles}
                            placeholder={'Seleccione trámite...'}
                            onChange={(e) => setters.setIdTramite({ campo: e.value, valido: 'true' })}
                            options={tramitesFiltrados}
                            value={tramitesFiltrados.find(opt => String(opt.value) === String(estados.idTramite.campo)) || null}
                            isSearchable={true}
                            isClearable={true}
                        />
                    </div>

                    <div style={{ marginTop: '20px' }}>
                        <InputUsuarioStandard
                            estado={estados.descripcion}
                            cambiarEstado={setters.setDescripcion}
                            tipo='textarea'
                            name='descripcion'
                            etiqueta={'Descripción del Servicio'}
                            placeholder="Ej: Elaboración de memorial, Asesoría legal, etc."
                        />
                    </div>

                    {/* ACCIONES */}
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end', borderTop: '1px solid #e2e8f0', paddingTop: '24px' }}>
                        <button type="button" style={{ background: '#f1f5f9', border: 'none', padding: '14px 24px', borderRadius: '12px', cursor: 'pointer', fontWeight: '600', color: '#475569' }} onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={cargando} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
                            {cargando ? 'Procesando...' : (isEdit ? 'ACTUALIZAR HONORARIO' : 'REGISTRAR COBRO')}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

export default FormularioHonorario;