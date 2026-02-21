import { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const UseCustomSalidasGerente = () => {
    const navigate = useNavigate();

    // ESTADOS DEL FORMULARIO
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [monto, setMonto] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [fechaSolicitud, setFechaSolicitud] = useState({ campo: '', valido: null });

    // ESTADOS DE DATOS
    const [tramites, setTramites] = useState([]);
    const [tramitesFiltrados, setTramitesFiltrados] = useState([]);
    const [salidas, setSalidas] = useState([]);
    const [salidasFiltradas, setSalidasFiltradas] = useState([]);
    const [cargando, setCargando] = useState(false);

    // 1. LISTAR TRÁMITES
    const listarTramites = useCallback(async () => {
        setCargando(true);
        const res = await start(`${URL}salidas-gerente/listar-tramites`);
        if (res) {
            setTramites(res);
            setTramitesFiltrados(res.filter(t => t.eliminado === 1)); // t.eliminado === 0 suelen ser los activos
        }
        setCargando(false);
    }, []);

    // 2. LISTAR SALIDAS (Corregido para usar el estado correcto)
    const listarSalidas = async (id) => {
        // alert(id)
        if (!id) return;
        const res = await start(`${URL}salidas-gerente/listar`, { id });
        if (res) {
            setSalidas(res);
            setSalidasFiltradas(res);
            obtenerTramite(id)
        }
    };

    // 3. CARGAR PARA EDICIÓN
    const cargarSalidaPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}salidas-gerente/obtener-salida`, { id });
        if (res) {
            setIdTramite({ campo: res[0].id_tramite, valido: 'true' });
            setMonto({ campo: res[0].monto, valido: 'true' });
            setDetalle({ campo: res[0].detalle, valido: 'true' });
            setFechaSolicitud({
                campo: res[0].fecha_solicitud?.split('T')[0],
                valido: 'true'
            });
        }
        setCargando(false);
    };

    // 3.1. CARGAR TRAMITE
    const obtenerTramite = async (id) => {
        const res = await start(`${URL}salidas-gerente/obtener-tramite`, { id });
        if (res) {
            setTramites(res);
        }
    };



    // 5. ACCIONES DE ESTADO (Centralizadas para refrescar la lista correctamente)
    const ejecutarAccion = async (id, id_tramite, endpoint, msgConfirm, msgCarga) => {
        if (!window.confirm(msgConfirm)) return;

        const res = await start(`${URL}salidas-gerente/${endpoint}`, {
            id,
            datosAuditoriaExtra
        }, msgCarga);

        if (res) listarSalidas(id_tramite); // Refrescamos usando el ID del trámite padre
    };

    const aprobarSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'aprobar', "¿Aprobar solicitud?", "Aprobando...");

    const rechazarSalida = (id, id_tramite) =>
        ejecutarAccion(id, id_tramite, 'rechazar', "¿Rechazar solicitud?", "Rechazando...");


    // 6. BUSCADORES
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = salidas.filter(s =>
            s.codigo_tramite?.toLowerCase().includes(busqueda) ||
            s.detalle?.toLowerCase().includes(busqueda)
        );
        setSalidasFiltradas(filtrados);
    };

    const handleSearchTramite = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = tramites.filter((t) => (
            t.codigo.toLowerCase().includes(busqueda) ||
            t.cliente_nombre.toLowerCase().includes(busqueda) ||
            t.nombre_tipo_tramite.toLowerCase().includes(busqueda)
        ));
        setTramitesFiltrados(filtrados);
    };

    useEffect(() => {
        listarTramites();
    }, [listarTramites]);

    return {
        tramites, tramitesFiltrados, salidas, salidasFiltradas, cargando,
        estados: { idTramite, monto, detalle, fechaSolicitud },
        setters: { setIdTramite, setMonto, setDetalle, setFechaSolicitud },
        listarSalidas,
        aprobarSalida,
        rechazarSalida,
        handleSearch,
        handleSearchTramite,
        cargarSalidaPorId,
        allList: () => setSalidasFiltradas(salidas),
        allListTramite: () => setTramitesFiltrados(tramites), obtenerTramite
    };
};