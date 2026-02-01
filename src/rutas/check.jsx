import { Navigate } from "react-router-dom";

import useAuth from "../Auth/useAuth"
import { LOCAL_URL } from "../Auth/config";


export default function Check({ component: Component, ...rest }) {
    const auth = useAuth();


    return (

        auth.isLogged() ? <Component /> :  <Navigate to={LOCAL_URL} replace />


    )

}
