import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from "../hooks/HookCustomBoleta";
import { useTramites } from "../hooks/HookCustomTramites";
import toast from 'react-hot-toast';
import Select from 'react-select';
import { components } from 'react-select';
import { faPlus, faTrashAlt, faCheckCircle, faFileAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

export const FormularioBoleta = () => {
    const { codigo } = useParams();
    const navigate = useNavigate();

    const { listarTramitesActivos, tramitesFiltradosBoleta } = useTramites();
    const {
        guardarBoletaMasiva,
        actualizarBoletaMasiva,
        consultarDetalleBoleta,
        itemsBoleta,
        setters,
        cargando
    } = UseCustomBoletas();

    const [itemsForm, setItemsForm] = useState([]);

    useEffect(() => {
        listarTramitesActivos();
        if (codigo) {
            consultarDetalleBoleta(codigo);
        } else {
            agregarFila();
        }
    }, [codigo]);

    useEffect(() => {
        if (codigo && itemsBoleta.length > 0) {
            const itemsMapeados = itemsBoleta.map(item => ({
                id_tramite: item.value || item.id,
                monto: item.monto,
                detalle: item.detalle,
                fecha: item.fecha_solicitud?.split('T')[0] || new Date().toISOString().split('T')[0]
            }));
            setItemsForm(itemsMapeados);
        }
    }, [itemsBoleta, codigo]);

    const agregarFila = () => {
        setItemsForm([...itemsForm, {
            id_tramite: '', monto: '', detalle: '', fecha: new Date().toISOString().split('T')[0]
        }]);
    };

    const actualizarFila = (index, field, value) => {
        const nuevosItems = [...itemsForm];
        nuevosItems[index][field] = value;
        setItemsForm(nuevosItems);
    };

    const eliminarFila = (index) => {
        if (itemsForm.length === 1 && !codigo) return;
        setItemsForm(itemsForm.filter((_, i) => i !== index));
    };

    const handleGuardar = async (e) => {
        if (e) e.preventDefault();
        const incompleto = itemsForm.some(i => !i.id_tramite || (!i.monto || i.monto < 1) || !i.detalle || !i.fecha);
        if (incompleto) return toast.error("Por favor, completa todos los campos obligatorios");
        try {
            if (codigo) await actualizarBoletaMasiva(codigo, itemsForm);
            else await guardarBoletaMasiva(e, itemsForm);
        } catch (error) {
            toast.error("Error al procesar la operación");
        }
    };

    const totalBoleta = itemsForm.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

    const customStyles = {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: '#f8fafc',
            borderColor: state.isFocused ? '#b91c1c' : '#cbd5e1', // Rojo al enfocar
            boxShadow: state.isFocused ? '0 0 0 1px #b91c1c' : 'none',
            borderRadius: '12px',
            padding: '4px 8px',
            fontSize: '14px',
            fontWeight: '500',
            minHeight: '45px',
            transition: 'all 0.2s ease',
            '&:hover': { borderColor: '#b91c1c' },
        }),
        menu: (provided) => ({
            ...provided,
            borderRadius: '16px',
            boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)',
            border: '1px solid #f1f5f9',
            padding: '4px',
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            padding: '12px 16px',
            borderRadius: '10px',
            fontSize: '14px',
            backgroundColor: state.isSelected ? '#fee2e2' : state.isFocused ? '#fef2f2' : 'transparent', // Fondos rojos suaves
            color: '#0f172a',
            cursor: 'pointer',
        }),
    };

    return (
        <main style={{ minHeight: '100vh', background: '#f1f5f9', padding: '40px 20px', marginTop: '3rem' }}>
            <section style={{ maxWidth: '780px', margin: '0 auto' }}>
                <div style={{ marginBottom: '28px' }}>
                    <h1 style={{ color: '#0f172a', fontWeight: '800', fontSize: '28px' }}>
                        {codigo ? 'Modificar Boleta' : 'Nueva Boleta de Gastos'}
                    </h1>
                    {codigo && <span style={{ color: '#b91c1c', fontWeight: '600' }}>Caja: {codigo}</span>}
                </div>

                {tramitesFiltradosBoleta.length > 0 ? (
                    <form onSubmit={handleGuardar}>
                        <div style={{ marginBottom: '20px' }}>
                            {itemsForm.map((item, index) => (
                                <div key={index} style={{ background: '#ffffff', borderRadius: '16px', padding: '24px', marginBottom: '16px', borderLeft: '4px solid #b91c1c', boxShadow: '0 1px 3px rgba(0,0,0,0.05)' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '20px' }}>
                                        <span style={{ background: '#fef2f2', color: '#b91c1c', padding: '4px 10px', borderRadius: '6px', fontSize: '11px', fontWeight: '700' }}>ITEM #{index + 1}</span>
                                        {itemsForm.length > 1 && <button type="button" onClick={() => eliminarFila(index)} style={{ border: 'none', background: 'none', color: '#dc2626' }}><FontAwesomeIcon icon={faTrashAlt} /></button>}
                                    </div>
                                    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                        <Select styles={customStyles} options={tramitesFiltradosBoleta} components={{ Option: CustomOption }} onChange={(e) => actualizarFila(index, 'id_tramite', e?.value)} value={tramitesFiltradosBoleta.find(o => String(o.value) === String(item.id_tramite)) || null} />
                                        <input type="number" style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1' }} placeholder="Monto" value={item.monto} onChange={(e) => actualizarFila(index, 'monto', e.target.value)} />
                                        <input type="date" style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1' }} value={item.fecha} onChange={(e) => actualizarFila(index, 'fecha', e.target.value)} />
                                    </div>
                                    <input type="text" style={{ width: '100%', height: '45px', borderRadius: '12px', padding: '0 14px', border: '1px solid #cbd5e1' }} placeholder="Concepto del gasto..." value={item.detalle} onChange={(e) => actualizarFila(index, 'detalle', e.target.value)} />
                                </div>
                            ))}
                        </div>

                        <div style={{ background: '#fff', padding: '20px', borderRadius: '16px', marginBottom: '20px' }}>
                            <label style={{ fontWeight: '700', marginBottom: '8px', display: 'block' }}>Archivo de Respaldo</label>
                            <input type="file" onChange={(e) => setters.setArchivoBoleta(e.target.files[0])} />
                        </div>

                        <button type="button" onClick={agregarFila} style={{ width: '100%', padding: '14px', borderRadius: '12px', border: '2px dashed #cbd5e1', background: '#f8fafc', marginBottom: '20px' }}>
                            <FontAwesomeIcon icon={faPlus} /> Añadir otra línea
                        </button>

                        <div style={{
                            background: '#ffffff',
                            borderRadius: '16px',
                            padding: '24px',
                            display: 'flex',
                            flexDirection: window.innerWidth < 768 ? 'column' : 'row', // Column en móvil, Row en escritorio
                            justifyContent: 'space-between',
                            alignItems: window.innerWidth < 768 ? 'flex-start' : 'center',
                            gap: '20px',
                            boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)'
                        }}>
                            <div style={{ width: window.innerWidth < 768 ? '100%' : 'auto' }}>
                                <span style={{ color: '#64748b', fontSize: '11px', fontWeight: '700', textTransform: 'uppercase' }}>
                                    Total Acumulado
                                </span>
                                <div style={{ color: '#b91c1c', fontSize: '32px', fontWeight: '800' }}>
                                    Bs. {totalBoleta.toLocaleString('es-BO', { minimumFractionDigits: 2 })}
                                </div>
                            </div>

                            <div style={{
                                display: 'flex',
                                gap: '10px',
                                width: window.innerWidth < 768 ? '100%' : 'auto',
                                justifyContent: window.innerWidth < 768 ? 'stretch' : 'flex-end'
                            }}>
                                <button
                                    type="button"
                                    onClick={() => navigate(-1)}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', border: '1px solid #e2e8f0', background: '#f1f5f9', fontWeight: '600' }}
                                >
                                    Cancelar
                                </button>
                                <button
                                    type="submit"
                                    disabled={cargando}
                                    style={{ flex: 1, padding: '14px', borderRadius: '12px', background: '#0f172a', color: '#fff', border: 'none', fontWeight: '700' }}
                                >
                                    {cargando ? 'Procesando...' : (codigo ? 'Confirmar Cambios' : 'Registrar ')}
                                </button>
                            </div>
                        </div>
                    </form>
                ) : <p>Cargando información...</p>}
            </section>
        </main>
    );
};

const CustomOption = (props) => (
    <components.Option {...props}>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
            <div style={{ fontWeight: '700', color: '#1e293b', fontSize: '14px' }}>{props.data.label}</div>
            <div style={{ fontSize: '11px', color: '#64748b' }}>
                Moneda: <span style={{ fontWeight: '600', color: '#334155' }}>{props.data.simbolo}</span> | Saldo Disp: <span style={{ fontWeight: '600', color: '#b91c1c' }}>{props.data.saldoDisponible}</span>
            </div>
            <div style={{ fontSize: '10px', color: '#94a3b8', marginTop: '2px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {props.data.detalle}
            </div>
        </div>
    </components.Option>
);