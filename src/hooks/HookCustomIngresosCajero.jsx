import { useState, } from "react";
import { URL } from '../Auth/config';
import { saveDB, start } from '../service/service';
import { datosAuditoriaExtra } from "./datosAuditoriaExtra";

export const UseCustomIngresos = () => {
    // ESTADOS DEL FORMULARIO (Sin estado para ID, ya que el server lo genera al insertar)
    const [monto, setMonto] = useState({ campo: '', valido: null }); // Solo para edición
    const [idIngreso, setIdIngreso] = useState({ campo: '', valido: null }); // Solo para edición
    const [idCliente, setIdCliente] = useState({ campo: '', valido: null });
    const [idTramite, setIdTramite] = useState({ campo: '', valido: null });
    const [detalle, setDetalle] = useState({ campo: '', valido: null });
    const [fechaIngreso, setFechaIngreso] = useState({ campo: '', valido: null });

    // ESTADOS DE DATOS
    const [tramites, setTramites] = useState([]);
    const [tramitesFiltrados, setTramitesFiltrados] = useState([]);
    const [ingresos, setIngresos] = useState([]);
    const [ingresosFiltrados, setIngresosFiltrados] = useState([]);
    const [cargando, setCargando] = useState(false);
    const [isLoading, setIsLoading] = useState(false);



    // 2. LISTAR INGRESOS DE UN TRÁMITE
    const listarIngresos = async (id_tramite) => {
        if (!id_tramite) return;
        const res = await start(`${URL}ingresos-cajero/listar-por-tramites`, { id_tramite });
        if (res) {
            setIngresos(res);
            setIngresosFiltrados(res);
        }
    };

    // 3. CARGAR PARA EDICIÓN (Aquí sí seteamos el idIngreso para el WHERE del Update)
    const cargarIngresoPorId = async (id) => {
        setCargando(true);
        const res = await start(`${URL}ingresos-cajero/obtener`, { id });
        if (res) {
            const data = res[0];
            setIdIngreso({ campo: data.id, valido: 'true' });
            setMonto({ campo: data.monto, valido: 'true' });
            setIdCliente({ campo: data.id_cliente, valido: 'true' });
            setIdTramite({ campo: data.id_tramite, valido: 'true' });
            setDetalle({ campo: data.detalle, valido: 'true' });
            setFechaIngreso({
                campo: data.fecha_ingreso?.split('T')[0],
                valido: 'true'
            });
        }
        setCargando(false);
    };

    // 3.1. CARGAR TRAMITE

    const obtenerTramite = async (id) => {
        setIsLoading(true);
        try {
            const res = await start(`${URL}salidas-cajero/obtener-tramite`, { id })
            if (res && res.length > 0) {
                setTramites(res)
                setIdCliente({ campo: res[0].id_cliente, valido: 'true' })
            } else setTramites([])

        } catch (error) {
            console.log(error)
            setTramites([])

        } finally {
            setIsLoading(false)
        }

    }

    // 4. GUARDAR (CREAR O ACTUALIZAR)
    const handleGuardar = async (e, esEdicion = false) => {
        if (e) e.preventDefault();

        const urlFinal = esEdicion ? 'actualizar' : 'crear';

        // No enviamos ID si es creación, el server usa randomUUID()
        const payload = {
            ...(esEdicion && { id: idIngreso.campo }),
            id_cliente: idCliente.campo,
            id_tramite: idTramite.campo,
            monto: monto.campo,
            detalle: detalle.campo,
            fecha_ingreso: fechaIngreso.campo,
            created_at: new Date(), // Fecha de envío desde el nodo inicio
            updated_at: new Date(),
            datosAuditoriaExtra
        };

        const res = await saveDB(`${URL}ingresos-cajero/${urlFinal}`, payload);
        if (res.ok) {
            listarIngresos(idTramite.campo);
            return true;
        }
        return false;
    };

    // 5. BUSCADORES
    const handleSearch = (e) => {
        const busqueda = e.target.value.toLowerCase();
        const filtrados = ingresos.filter(i =>
            i.codigo_tramite?.toLowerCase().includes(busqueda) ||
            i.detalle?.toLowerCase().includes(busqueda)
        );
        setIngresosFiltrados(filtrados);
    };


    return {
        tramites, tramitesFiltrados, ingresos, ingresosFiltrados, cargando, isLoading,
        estados: { idCliente, idTramite, monto, detalle, fechaIngreso },
        setters: { setIdCliente, setIdTramite, setMonto, setDetalle, setFechaIngreso },
        listarIngresos,
        cargarIngresoPorId,
        obtenerTramite,
        handleGuardar,
        handleSearch,
        allListIngresos: () => setIngresosFiltrados(ingresos),
        allListTramite: () => setTramitesFiltrados(tramites)
    };
};