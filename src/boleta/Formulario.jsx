import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { UseCustomBoletas } from "../hooks/HookCustomBoleta";
import { useTramites } from "../hooks/HookCustomTramites";
import toast from 'react-hot-toast';
import Select from 'react-select';

export const FormularioBoleta = () => {
    const { codigo } = useParams();
    const navigate = useNavigate();

    const { listarTramitesActivos, tramitesFiltrados } = useTramites();
    const {
        guardarBoletaMasiva,
        actualizarBoletaMasiva,
        consultarDetalleBoleta,
        itemsBoleta,
        cargando
    } = UseCustomBoletas();

    const [itemsForm, setItemsForm] = useState([]);

    // 1. Carga inicial de datos
    useEffect(() => {
        listarTramitesActivos();
        if (codigo) {
            consultarDetalleBoleta(codigo);
        } else {
            agregarFila(); // Iniciar con una fila si es nuevo
        }
    }, [codigo]);

    // 2. Sincronización de datos del backend (Modo Edición)
    useEffect(() => {
        if (codigo && itemsBoleta.length > 0) {
            const itemsMapeados = itemsBoleta.map(item => ({
                // Asegúrate de que 'item.id_tramite' sea el UUID que viene del backend
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
            id_tramite: '',
            monto: '',
            detalle: '',
            fecha: new Date().toISOString().split('T')[0]
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

        // Validación: Verificar que no haya campos vacíos
        const incompleto = itemsForm.some(i => !i.id_tramite || !i.monto || !i.detalle);
        if (incompleto) return toast.error("Por favor, completa todos los campos de la tabla");

        try {
            if (codigo) {
                await actualizarBoletaMasiva(codigo, itemsForm);
            } else {
                await guardarBoletaMasiva(e, itemsForm);
            }
            // Opcional: navigate('/boletas') tras éxito si el hook no lo hace
        } catch (error) {
            toast.error("Error al procesar la operación");
        }
    };

    const totalBoleta = itemsForm.reduce((acc, curr) => acc + (Number(curr.monto) || 0), 0);

    return (
        <main className="py-5" style={{ minHeight: '100vh', background: '#f8f9fa' }}>
            <div className="container">
                <div className="shadow-sm p-4 p-md-5 bg-white" style={{ borderRadius: '20px', border: '1px solid #eee' }}>

                    <div className="text-center mb-4">
                        <span style={{ fontSize: '3rem' }}>{codigo ? '📝' : '📑'}</span>
                        <h2 className="h3 fw-bold text-primary text-uppercase">
                            {codigo ? `Modificar Boleta` : 'Nueva Boleta de Gastos'}
                        </h2>
                        {codigo && <span className="badge bg-info text-dark">Editando Código: {codigo}</span>}
                    </div>

                    <div className="table-responsive mb-4">
                        <table className="table table-hover align-middle">
                            <thead className="table-light">
                                <tr>
                                    <th style={{ minWidth: '300px' }}>Trámite / Caso</th>
                                    <th style={{ width: '180px' }}>Monto (Bs)</th>
                                    <th>Concepto</th>
                                    <th style={{ width: '160px' }}>Fecha</th>
                                    <th style={{ width: '50px' }}></th>
                                </tr>
                            </thead>
                            <tbody>
                                {itemsForm.map((item, index) => (
                                    <tr key={index}>
                                        <td>
                                            {tramitesFiltrados.length > 0 ? (<>
                                                <Select
                                                    placeholder={'Seleccione...'}
                                                    onChange={(e) => actualizarFila(index, 'id_tramite', e ? e.value : '')}
                                                    options={tramitesFiltrados}
                                                    // Usamos .find asegurándonos de que ambos valores existan y coincidan
                                                    value={
                                                        tramitesFiltrados.find(opt => String(opt.value) === String(item.id_tramite)) || null
                                                    }
                                                    isSearchable={true}
                                                    isClearable={true}
                                                    styles={{
                                                        control: (base) => ({
                                                            ...base,
                                                            borderRadius: '8px',
                                                            minHeight: '45px',
                                                        })
                                                    }}
                                                />
                                            </>
                                            ) : (
                                                <div className="spinner-border spinner-border-sm">Cargando trámites</div> // Cargando trámites...
                                            )}
                                        </td>
                                        <td>
                                            <div className="input-group">
                                                <span className="input-group-text bg-light border-end-0">Bs</span>
                                                <input
                                                    type="number"
                                                    className="form-control border-start-0"
                                                    value={item.monto}
                                                    placeholder="0.00"
                                                    onChange={(e) => actualizarFila(index, 'monto', e.target.value)}
                                                />
                                            </div>
                                        </td>
                                        <td>
                                            <input
                                                type="text"
                                                className="form-control"
                                                placeholder="Ej. Aranceles, fotocopias..."
                                                value={item.detalle}
                                                onChange={(e) => actualizarFila(index, 'detalle', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <input
                                                type="date"
                                                className="form-control"
                                                value={item.fecha}
                                                onChange={(e) => actualizarFila(index, 'fecha', e.target.value)}
                                            />
                                        </td>
                                        <td>
                                            <button
                                                className="btn btn-link text-danger p-0"
                                                onClick={() => eliminarFila(index)}
                                                title="Eliminar fila"
                                            >
                                                <span style={{ fontSize: '1.2rem' }}>✕</span>
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>

                    <button className="btn btn-outline-primary btn-sm fw-bold px-3 mb-4" onClick={agregarFila}>
                        + AÑADIR OTRO GASTO
                    </button>

                    <div className="d-flex flex-column flex-md-row justify-content-between align-items-center border-top pt-4 gap-3">
                        <div className="h4 m-0">
                            TOTAL: <span className="text-success fw-bold">Bs. {totalBoleta.toLocaleString('es-BO', { minimumFractionDigits: 2 })}</span>
                        </div>
                        <div className="d-flex gap-2 w-100 w-md-auto">
                            <button className="btn btn-light px-4 border" onClick={() => navigate(-1)}>CANCELAR</button>
                            <button
                                className={`btn ${codigo ? 'btn-warning' : 'btn-success'} px-5 fw-bold`}
                                disabled={cargando || itemsForm.length === 0}
                                onClick={handleGuardar}
                            >
                                {cargando ? (
                                    <><span className="spinner-border spinner-border-sm me-2"></span>PROCESANDO...</>
                                ) : (
                                    codigo ? 'ACTUALIZAR BOLETA' : 'GUARDAR BOLETA'
                                )}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    );
};