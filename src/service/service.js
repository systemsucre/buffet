import { URL } from "../Auth/config";
import axios from "axios";
import toast from "react-hot-toast";

const token = localStorage.getItem("token");
axios.interceptors.request.use(
    (config) => {
        config.headers.authorization = `Bearer ${token}`;
        return config;
    },
    (error) => {
        const token = localStorage.getItem("token");
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("tiempo");
        localStorage.removeItem("numRol");
        axios.post(URL + "/logout", { token: token });
        // window.location.href = LOCAL_URL + "/";
        window.location.href =  "/";
        return Promise.reject(error);
    }
);
async function start(url, id = null, msg = null) {
    try {
        let loadingToast = null
        if (msg) loadingToast = toast.loading(msg);
        const data = await axios.post(url, id ? id : null)
        if (msg) toast.dismiss(loadingToast);

        if (data.data.hasOwnProperty("sesion")) {
            toast.error("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            alert("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            const token = localStorage.getItem("token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tiempo");
            localStorage.removeItem("numRol");
            axios.post(URL + "/logout", { token: token });
            window.location.href =  "/";
        }
        if (data.data.ok) return data.data.data
        else {
            toast.error(data.data.msg);
            return []
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
        return []
    }
}

async function buscarDB(url, dato) {
    try {
        const loadingToast = toast.loading('Cargando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.hasOwnProperty("sesion")) {
            toast.error("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            alert("LA SESION FUE CERRADO DESDE EL SERVIDOR, VUELVA A INTRODODUCIR SUS DATOS DE INICIO");
            const token = localStorage.getItem("token");
            localStorage.removeItem("token");
            localStorage.removeItem("user");
            localStorage.removeItem("tiempo");
            localStorage.removeItem("numRol");
            axios.post(URL + "/logout", { token: token });
            window.location.href = "/";
        }
        if (data.data.ok) return data.data.data
        else {
            toast.error(data.data.msg);
            return []
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
        return []
    }
}

async function saveDB_IMG(url, dato, modal, estado, reload = false, vaciar = null) {
    try {
        const loadingToast = toast.loading('Guardando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {

            toast.success(data.data.msg)
            estado(0)
            modal(false)

            if (vaciar) vaciar()
            if (reload) window.location.reload()
            return data.data.data
        } else {
            estado(0)
            toast.error(data.data.msg);
            if (document.getElementById(data.data.campo))
                document.getElementById(data.data.campo).style.display = 'flex'
            return
        }

    }
    catch (error) {
        estado(0)
        console.log('error al conectar a la base de datos')
        toast.error(error.toJSON().message);
    }
}

async function saveDB(url, dato, modal, estado = null, reload = false, vaciar = null) {
    try {
        const loadingToast = toast.loading('Guardando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {

            toast.success(data.data.msg)
            if (estado) estado(0)
            modal(false)

            if (vaciar) vaciar()
            if (reload) window.location.reload()
            return
        } else {
            if (estado) estado(0)
            toast.error(data.data.msg);
            if (document.getElementById(data.data.campo))
                document.getElementById(data.data.campo).style.display = 'flex'
            return
        }

    }
    catch (error) {
        if (estado) estado(0)

        console.log('error al conectar a la base de datos')
        toast.error(error.toJSON().message);
    }
}

async function editDB(url, dato, modal = null, reload = false, vaciar = null) {
    try {
        const loadingToast = toast.loading('Actualizando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            modal(false)
            if (vaciar) vaciar()
            if (reload) window.location.reload()
            return
        }
        else {
            toast.error(data.data.msg);
            if (document.getElementById(data.data.campo))
                document.getElementById(data.data.campo).style.display = 'flex'
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}

async function eliminarDB(url, dato) {
    try {
        const loadingToast = toast.loading('Eliminando información...');
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            return
        }
        else {
            toast.error(data.data.msg);
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}

async function defaultDB(url, dato = null, msg = null) {
    try {
        const loadingToast = toast.loading(!msg ? 'Procesando información...' : msg);
        const data = await axios.post(url, dato)
        toast.dismiss(loadingToast);
        if (data.data.ok) {
            toast.success(data.data.msg)
            return
        }
        else {
            toast.error(data.data.msg);
            return
        }
    }
    catch (error) {
        toast.error(error.toJSON().message);
    }
}


export { start, buscarDB, saveDB, saveDB_IMG, editDB, eliminarDB, defaultDB }