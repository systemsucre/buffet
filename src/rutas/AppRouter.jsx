import {
  createBrowserRouter,
  Outlet,
  BrowserRouter as Router,
  RouterProvider,
} from "react-router-dom";

import { Toaster } from "react-hot-toast";
import { useEffect } from "react";

import useAuth from "../Auth/useAuth";
import { LOCAL_URL, TIEMPO_INACTIVO } from "../Auth/config";
import Check from "./check";
import PublicRoute from "./publicRoute";
import E500 from "./e500";

import HomeLogin from "../Login";
import Navbar from "../components/etc/menu";
import { Tramites } from "../Tramites";
import Pacientes from "../Pacientes";
import { Footer } from "../components/Footer";
import NuevoTramite from "../NuevoTramite";
import EditarTramite from "../EditarTramite";




export default function AppRouter() {
  const auth = useAuth();

  useEffect(() => {
    async function check() {
      if (localStorage.getItem("token") != null) {
        const inter = setInterval(() => {
          const tiempo1 = localStorage.getItem("tiempo");
          if (!tiempo1 || localStorage.getItem("token") == null) {
            auth.logout();
          } // sino existe el cookie redireccionamos a la ventana login
          const tiempo2 = new Date().getMinutes();
          let dif = 0;
          let aux1 = 0;
          let aux2 = 0;
          const maximo = 59;
          const inicio = 0;
          if (tiempo1 === tiempo2) {
            dif = 0;
          }
          if (tiempo2 > tiempo1) {
            dif = tiempo2 - tiempo1;
          }
          if (tiempo1 > tiempo2) {
            aux1 = maximo - tiempo1; //  59 - 50 = 10
            aux2 = tiempo2 - inicio; //  5 - 0  = 5
            dif = aux2 - aux1;
          }
          if (dif >= TIEMPO_INACTIVO) {
            // el tiempo de abandono tolerado, se define en el archivo varEntorno en unidades de tiempo MINUTOS
            auth.logout();
          }
        }, 10000);
        return inter;
      }
    }
    check()
  }, [auth]);

  useEffect(() => {
    return () => { };
  }, []);

  const handleKeyPress = () => {
    localStorage.setItem("tiempo", new Date().getMinutes());
  };

  const handleClick = () => {
    localStorage.setItem("tiempo", new Date().getMinutes());
  };

  const ruta1 = createBrowserRouter([

    // --- GRUPO 1: RUTAS PÚBLICAS LOGIN (Sin Navbar) ---
    {
      path: LOCAL_URL + "/login",
      errorElement: <E500 />,
      children: [
        { path: "", element: <PublicRoute component={HomeLogin} /> },
      ]
    },
    {
      path: LOCAL_URL + '/admin',
      element: <>
        <Navbar />
        <main className="main-content">
          {/* Outlet es donde se renderizarán las páginas (Pacientes, Login, etc.) */}
          <Outlet />
        </main>
      </>, // El Layout siempre se muestra
      errorElement: <E500 />,
      children: [
        {
          path: 'tramites',
          element: <Check component={Tramites} />,
        },
        {
          path: 'nuevo-tramite',
          element: <Check component={NuevoTramite} />,
        },
        {
          path: 'editar-tramite/:cliente',
          element: <Check component={EditarTramite} />,
        },
        // ... tus otras rutas
      ],
    },
  ]);
  return (
    <div onClick={handleClick} onKeyPress={handleKeyPress} >
      <RouterProvider router={ruta1} />
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{
          className: "",
          duration: 4000,
          style: {
            padding: '20px 30px',
            background: "#fff",
            // fontWeight:'bold',
            color: "#4E5AFE",
            fontSize: "14px",
          },
        }} />
    </div>
  );
}
