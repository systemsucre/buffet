import { Navigate } from "react-router-dom";

import { LOCAL_URL } from "../Auth/config";
import useAuth from "../Auth/useAuth"


export default function PublicRoute({ component: Component, ...rest }) {
    const auth = useAuth();
    let url = null

    if (parseInt(localStorage.getItem('numRol')) === 2) {
        url = "/consulta-externa"
    }
    if (parseInt(localStorage.getItem('numRol')) === 1) {
        url =  "/admin/tramites"
    }
    return (
        auth.isLogged() ? (
            <Navigate to={url ? LOCAL_URL + url : LOCAL_URL} replace />
        ) : (
            <Component /> // RUTA PUBLICA
        )
    );
} 