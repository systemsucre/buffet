import { useEffect } from 'react';
import { useTramites } from '../hooks/HookCustomTramites';

const CabeceraTramite = ({ id }) => {
    const { tramites, cargarTramiteInfo } = useTramites();

    useEffect(() => {
        cargarTramiteInfo(id);
    }, [id]);

    if (tramites.length === 0) return null;

    const tramite = tramites.find(t => String(t.id) === String(id));
    if (!tramite) return null;

    const ingresos = parseFloat(tramite.total_ingresos) || 0;
    const gastos = parseFloat(tramite.total_gastos) || 0;
    const saldo = parseFloat(tramite.saldoDisponible) || 0;
    const estado = tramite.estado;

    const porcentajeGasto = ingresos > 0 ? Math.min((gastos / ingresos) * 100, 100) : 0;

    return (
        <div className="be-card-container">
            {/* Header: Código y Estado */}
            <div className="be-header">
                <div className="be-id-pill">Trámite {tramite.codigo}</div>
                <div className={`be-status-dot ${
                    estado === 1 ? 'status-green' : 
                    estado === 2 ? 'status-orange' : 'status-blue'
                }`}>
                    {estado === 1 ? 'En Curso' : estado === 2 ? 'Paralizado' : 'Finalizado'}
                </div>
            </div>

            {/* Cuerpo: Información Principal */}
            <div className="be-body">
                <span className="be-label">CLIENTE</span>
                <h2 className="be-client-name">{tramite.cliente_nombre}</h2>
                
                <div className="be-balance-main">
                    <span className="be-label-light">SALDO DISPONIBLE</span>
                    <h1 className="be-amount-highlight">Bs. {saldo.toLocaleString('de-DE', { minimumFractionDigits: 2 })}</h1>
                </div>
            </div>

            {/* Footer: Barra de progreso y detalles (Estilo App Financiera) */}
            <div className="be-footer">
                <div className="be-progress-info">
                    <span>Gastado: Bs. {gastos.toFixed(2)}</span>
                    <span className="be-percentage">{porcentajeGasto.toFixed(1)}%</span>
                </div>
                
                <div className="be-progress-bar-bg">
                    <div 
                        className="be-progress-bar-fill" 
                        style={{ width: `${porcentajeGasto}%` }}
                    ></div>
                </div>

                <div className="be-quick-details">
                    <div className="be-detail-item">
                        <span>Abono Total</span>
                        <strong>Bs. {ingresos.toFixed(2)}</strong>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CabeceraTramite;