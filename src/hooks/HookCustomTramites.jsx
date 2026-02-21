import { useState, useEffect, useCallback } from "react";
import { toast } from "react-hot-toast";
import { LOCAL_URL, URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { useNavigate } from "react-router-dom";
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const useTramites = () => {
    const navigate = useNavigate();

    // --- ESTADOS PARA FORMULARIO (Tabla tramites) ---
    const [idCliente, setIdCliente] = useState({ campo: '', valido: null });
    const [idTipoTramite, setIdTipoTramite] = useState({ campo: '', valido: null });
    const [codigo, setCodigo] = useState({ campo: '', valido: null });
    const [fechaIngreso, setFechaIngreso] = useState({ campo: '', valido: null });
    const [fechaFinalizacion, setFechaFinalizacion] = useState({ campo: '', valido: null });
    const [plazo, setPlazo] = useState({ campo: 0, valido: 'true' });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [costo, setCosto] = useState({ campo: '', valido: null });
    const [otros, setOtros] = useState({ campo: '', valido: 'true' });
    const [estado, setEstado] = useState({ campo: 1, valido: 'true' }); // 1: En curso, 0: Paralizado

    // --- ESTADOS PARA LISTADO Y AUXILIARES ---
    const [tramites, setTramites] = useState([]);
    const [tramitesFiltrados, setTramitesFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);

    // Listas para los Selects del formulario
    const [listaClientes, setListaClientes] = useState([]);
    const [listaTipos, setListaTipos] = useState([]);

    // 1. LISTAR TRÁMITES (Principal)
    const listarTramites = useCallback(async () => {
        setCargando(true);
        const res = await start(`${URL}tramites/listar`, { usuario: 1 });
        if (res) {
            setTramites(res);

            const activos = res.filter(t => t.eliminado > 0);

            // setTramites(activos);
            setTramitesFiltrados(activos);
        }
        setCargando(false);
    }, []);

    // 2. CARGAR AUXILIARES (Para los combobox del formulario)
    const cargarAuxiliares = useCallback(async () => {
        const resClientes = await start(`${URL}tramites/listar-clientes`);
        const resTipos = await start(`${URL}tramites/listar-tipo-tramites`);
        if (resClientes) setListaClientes(resClientes);
        if (resTipos) setListaTipos(resTipos);
    }, []);


    // Cargar Tramite por Id desde la BD, para garantizar la veracidad de la informacion
    const cargarTramitePorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}tramites/obtener`, { id }); // Debes crear este endpoint
        if (res) {
            setCodigo({ campo: res.codigo, valido: 'true' });
            setIdCliente({ campo: res.id_cliente, valido: 'true' });
            setIdTipoTramite({ campo: res.id_tipo_tramite, valido: 'true' });
            setFechaIngreso({ campo: res.fecha_ingreso.split('T')[0], valido: 'true' });
            setFechaFinalizacion({ campo: res.fecha_finalizacion.split('T')[0], valido: 'true' });
            setCosto({ campo: res.costo, valido: 'true' });
            setDetalle({ campo: res.detalle || '', valido: 'true' });
            setOtros({ campo: res.otros || '', valido: 'true' });
        }
        setCargando(false);
    };
    // 3. GUARDAR O ACTUALIZAR
    const guardarTramite = async (e, idParaEditar = null) => {
        if (e) e.preventDefault();




        // 2. Buscar el objeto del trámite seleccionado en la lista que vino de la BD
        const encontrado = listaTipos.find(t => t.value === parseInt(idTipoTramite.campo));

        // 3. Limpiar el nombre (quitar espacios al inicio/final)
        const nombre = encontrado.label.trim().toUpperCase();

        // 4. Extraer las 3 primeras letras
        // Si el nombre tiene menos de 3, tomará lo que haya
        const iniciales = nombre.substring(0, 3);

        // 5. Formatear el prefijo (Ej: "JUD-", "ADM-", "PRO-")
        const prefijo = `${iniciales}-`;


        const data = {
            id_cliente: idCliente.campo,
            codigo: prefijo + codigo.campo.split('-')[1],
            fecha_ingreso: fechaIngreso.campo,
            fecha_finalizacion: fechaFinalizacion.campo,
            plazo: plazo.campo,
            id_tipo_tramite: idTipoTramite.campo,
            detalle: detalle.campo,
            costo: costo.campo,
            otros: otros.campo,
            estado: estado.campo,
            usuario: 1, // ID usuario sesión
            fecha_: new Date().toISOString(), // Para created_at o modified_at,
            datosAuditoriaExtra
        };

        const endpoint = `${URL}tramites/${idParaEditar ? 'editar' : 'crear'}`;
        const payload = idParaEditar ? { ...data, id: idParaEditar } : data;

        const res = await saveDB(
            endpoint,
            payload,
            () => {
                listarTramites();
                setTimeout(() => navigate(LOCAL_URL + '/admin/lista-tramites'), 1000);
            },
            setCargando
        );
        return res;
    };

    // 4. CAMBIAR ESTADO (EN CURSO / PARALIZADO)
    const toggleEstadoTramite = async (id, estadoActual) => {
        const msgConfirm = estadoActual === 1 ? '¿Poner en curso?' : '¿Paralizar trámite?';


        if (window.confirm(msgConfirm)) {
            const res = await start(`${URL}tramites/cambiar-estado`, {
                id,
                estado: estadoActual,datosAuditoriaExtra
            }, "Actualizando estado...");

            if (res) {
                // toast.success(res.msg);
                listarTramites();
            }
        }
    };

    // Función para ELIMINACIÓN LÓGICA
    const eliminarTramite = async (id, estadoActual) => {
        const msgConfirm = estadoActual === 1 ? 'Restaurar Tramite' : 'Eliminar Tramite?';

        // Usamos una confirmación clara para evitar accidentes
        if (window.confirm(msgConfirm)) {

            // Enviamos el ID y el nuevo estado (0 = Eliminado)
            // Usamos la misma lógica de enviar al endpoint de actualización de estado
            const res = await start(`${URL}tramites/eliminar-logica`, {
                id,
                estado: estadoActual,datosAuditoriaExtra // Estado de eliminación lógica
            }, estadoActual === 1 ? 'Restaurando Tramite.....': 'Eliminando tramite ........');

            if (res) {
                // Si el backend responde correctamente, refrescamos la lista
                listarTramites();
            }
        }
    };

    // 5. BÚSQUEDA FILTRADA
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        if (!busqueda) {
            setTramitesFiltrados(tramites);
            return;
        }

        const filtrados = tramites.filter((t) => (
            t.codigo.toLowerCase().includes(busqueda) ||
            t.cliente_nombre.toLowerCase().includes(busqueda) ||
            t.nombre_tipo_tramite.toLowerCase().includes(busqueda)
        ));
        setTramitesFiltrados(filtrados);
    };

    // 6. FILTROS RÁPIDOS
    const filterByEstado = (est) => setTramitesFiltrados(tramites.filter(t => t.estado == est));
    const filterByDelete = () => setTramitesFiltrados(tramites.filter(t => t.eliminado == 0));
    const allList = () => setTramitesFiltrados(tramites);

    useEffect(() => {
        listarTramites();
        cargarAuxiliares();
    }, [listarTramites, cargarAuxiliares]);

    return {
        tramitesFiltrados, tramites,
        auxiliares: { listaClientes, listaTipos },
        handleSearch,
        cargando,
        estados: {
            idCliente, idTipoTramite, codigo, fechaIngreso,
            fechaFinalizacion, plazo, detalle, costo, otros, estado
        },
        setters: {
            setIdCliente, setIdTipoTramite, setCodigo, setFechaIngreso,
            setFechaFinalizacion, setPlazo, setDetalle, setCosto, setOtros, setEstado
        },
        guardarTramite,
        toggleEstadoTramite,
        filterByEstado,
        allList,
        cargarTramitePorId,
        eliminarTramite,
        filterByDelete
    };
};