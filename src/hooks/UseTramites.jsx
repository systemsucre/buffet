import { useEffect, useState } from "react"
import { useMemo } from "react"
import { dbTramites } from '../data/dbTramites'

export const UseTramites = () => {


    // 1. Estados
    const [tramites, setTramites] = useState(dbTramites); // Lista original de la DB
    const [tramitesFiltrados, setTramitesFiltrados] = useState(dbTramites); // Lo que se ve

    // 2. Cuando traigas los datos (ej. con un useEffect)
    useEffect(() => {
        // Supongamos que esta es tu función que trae datos
        const obtenerDatos = async () => {
            // const data = await fetchTuApi();
            // setTramites(data);
            // setTramitesFiltrados(data); // <--- IMPORTANTE: Inicializar ambos con los mismos datos
        };
        obtenerDatos();
    }, []);

    // 3. Función de búsqueda
    const handleSearch = (e) => {

        const busqueda = e.target.value;
        if (!busqueda) {
            setTramitesFiltrados(tramites); // Si no hay nada, mostrar todos
            return;
        }
        // Filtramos la lista original
        const filtrados = tramites.filter((expediente) => {
            return (
                expediente.dni.includes(busqueda) ||
                expediente.codigo.includes(busqueda)
            );
        });

        setTramitesFiltrados(filtrados);
    };

    // 4. Función listar todos
    const allList = () => {
        // 1. Limpiamos el valor visualmente en el DOM
        const input = document.getElementById('input-default-search');
        if (input) input.value = "";

        // 2. Restauramos la lista en el estado de React
        setTramitesFiltrados(tramites);
    };

    // 5. Función listar solo los tramites en proceso
    const listProcesing = () => {
        // Filtramos la lista original
        const filtrados = tramites.filter((expediente) => {
            return (
                expediente.estado.includes("Pendiente") 
            );
        });

        setTramitesFiltrados(filtrados);
    };


    return { handleSearch, tramites, tramitesFiltrados, allList, listProcesing }
}