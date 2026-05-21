import { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Select, { components } from 'react-select';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCheckCircle, faTimes } from '@fortawesome/free-solid-svg-icons';
import { INPUT } from "../Auth/config";
import { InputUsuarioStandard } from '../components/input/elementos';
import { UseCustomIngresos } from "../hooks/HookCustomIngresos";
import { useTramites } from "../hooks/HookCustomTramites";

const FormularioIngreso = () => {
    const { id_tramite, id } = useParams();
    const isEdit = Boolean(id);
    const navigate = useNavigate();

    const { estados, setters, handleGuardar, cargarIngresoPorId, cargando } = UseCustomIngresos();
    const { listarTramitesActivos, tramitesFiltradosBoleta } = useTramites();

    useEffect(() => {
        listarTramitesActivos();
        if (isEdit && id) {
            cargarIngresoPorId(id);
        } else if (id_tramite) {
            setters.setIdTramite({ campo: id_tramite, valido: 'true' });
        }
    }, [id, isEdit, id_tramite]);

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

    const listaTipoPago = [{ value: 'EFECTIVO', label: 'EFECTIVO' }, { value: 'TRANFERENCIA', label: 'TRANFERENCIA' }, { value: 'CHEQUE', label: 'CHEQUE' }];

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', marginTop: '3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>

                {/* CABECERA */}
                <div style={{ marginBottom: '28px' }}>
                    <span style={{ textTransform: 'uppercase', color: '#64748b', fontWeight: '700', fontSize: '11px', letterSpacing: '1.5px' }}>
                        Módulo de Ingresos
                    </span>
                    <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px', margin: 0 }}>
                        {isEdit ? 'Editar Registro de Ingreso' : 'Nuevo Ingreso / Abono'}
                    </h1>
                </div>

                <form onSubmit={(e) => handleGuardar(e, isEdit)} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>

                    <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '20px' }}>
                        {/* TRAMITE */}
                        <div>
                            <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>TRÁMITE</label>
                            <Select
                                styles={customStyles}
                                options={tramitesFiltradosBoleta}
                                components={{ Option: CustomOption }}
                                placeholder="Seleccione trámite..."
                                onChange={(e) => setters.setIdTramite({ campo: e.value, valido: 'true' })}
                                value={tramitesFiltradosBoleta.find(t => t.value === estados.idTramite.campo) || null}
                            />
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                            <InputUsuarioStandard
                                estado={estados.monto}
                                cambiarEstado={setters.setMonto}
                                tipo='number'
                                etiqueta={'Monto Recibido (Bs) *'}
                                placeholder="0.00"
                                ExpresionRegular={INPUT.NUMEROS_MONEY}
                            />

                            <div>
                                <label style={{ display: 'block', color: '#475569', fontSize: '12px', fontWeight: '600', marginBottom: '8px' }}>Tipo Pago</label>
                                <Select
                                    styles={customStyles}
                                    options={listaTipoPago}
                                    onChange={(e) => setters.setTipo({ campo: e.value, valido: 'true' })}
                                    value={listaTipoPago.find(opt => opt.value === estados.tipo.campo) || null}
                                />
                            </div>
                        </div>

                        <InputUsuarioStandard
                            estado={estados.fechaIngreso}
                            cambiarEstado={setters.setFechaIngreso}
                            tipo='date'
                            etiqueta={'Fecha de Cobro *'}
                        />

                        <InputUsuarioStandard
                            estado={estados.detalle}
                            cambiarEstado={setters.setDetalle}
                            tipo='textarea'
                            etiqueta={'Concepto / Observaciones *'}
                        />
                    </div>

                    {/* ACCIONES */}
                    <div style={{ marginTop: '32px', display: 'flex', gap: '12px', justifyContent: 'flex-end' }}>
                        <button type="button" style={{ background: '#f1f5f9', border: 'none', padding: '14px 24px', borderRadius: '12px', cursor: 'pointer' }} onClick={() => navigate(-1)}>
                            Cancelar
                        </button>
                        <button type="submit" disabled={cargando} style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '14px 32px', borderRadius: '12px', cursor: 'pointer', fontWeight: '700' }}>
                            {cargando ? 'Procesando...' : (isEdit ? 'GUARDAR CAMBIOS' : 'REGISTRAR INGRESO')}
                        </button>
                    </div>
                </form>
            </section>
        </main>
    );
};

// Componente para la opción personalizada del Select
const CustomOption = (props) => (
    <components.Option {...props}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{props.data.label}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
                Moneda: <span style={{ fontWeight: '600', color: '#334155' }}>{props.data.simbolo}</span> | Saldo Disp: <span style={{ fontWeight: '600', color: props.data.saldoDisponible>0 ?'#2e7559':'#b91c1c' }}>{props.data.saldoDisponible}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {props.data.detalle}
            </div>
        </div>
    </components.Option>
);

export default FormularioIngreso;