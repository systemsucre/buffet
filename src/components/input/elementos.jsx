import toast from "react-hot-toast";
import { faCheckCircle, faSearch, faTimesCircle } from "@fortawesome/free-solid-svg-icons";
import Select from 'react-select';
import {
  Input,
  IconoValidacion,
  IconoValidacionSelect,
} from "./stylos"
import { useEffect, useState } from "react";
import { FormGroup, } from "reactstrap"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";




// Asumiendo que usas styled-components o alguna librería similar para FormGroup, Input, etc.

const InputUsuarioStandard = ({
  estado,
  cambiarEstado,
  name = "input-default",
  tipo = "text",
  ExpresionRegular,
  msg,
  placeholder,
  etiqueta,
  importante = true,
  logo = true,
  mayusculas = true,
  disabled = false,

}) => {
  const [mostrarMsg, setMostrarMsg] = useState(false);

  useEffect(() => {
    let timer;
    if (mostrarMsg) {
      timer = setTimeout(() => {
        setMostrarMsg(false);
      }, 10000);
    }
    return () => clearTimeout(timer); // Limpieza de memoria
  }, [mostrarMsg]);

  const onChange = (e) => {
    const valor = mayusculas ? e.target.value.toUpperCase() : e.target.value;
    cambiarEstado({ ...estado, campo: valor });
  };

  const validacion = () => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo) && estado.campo !== "") {
        cambiarEstado({ ...estado, valido: "true" });
        setMostrarMsg(false);
      } else {
        cambiarEstado({ ...estado, valido: "false" });
        setMostrarMsg(true);
      }
    }
  };

  return (
    <>
      <label className="hospital-label w-100 mb-2">
        {etiqueta}  {importante && logo && <span style={{ color: 'red' }}>*</span>}
      </label>
      <div className="input-group-custom">
        <Input
          type={tipo}
          className="form-control-clinical"
          id={name}
          name={name}
          placeholder={placeholder}
          value={disabled ? "" : (estado.campo || "")}
          onChange={onChange}
          onKeyUp={validacion}
          onBlur={validacion}
          valido={estado.valido}
          disabled={disabled}
          required={importante}
        />

        {/* Validación de Icono mejorada con paréntesis */}
        {(tipo === 'text' || tipo === 'number') && estado.valido && (
          <IconoValidacion
            valido={estado.valido}
            icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle}
          // style={{ right: tipo === 'text' ? '10px' : "30px" }}
          />
        )}
      </div>
      {/* Renderizado condicional en lugar de manipular el style directamente */}
      {mostrarMsg && (
        <label style={{ color: '#FF3D85', fontSize: '11px', fontWeight: 'bold', display: 'block', marginTop: '5px' }}>
          {msg}
        </label>
      )}
    </>
  );
};

const InputUsuarioSearch = ({
  name = "input-default",
  placeholder,
  onChange
}) => {


  return (
    <div className="buscador-contenedor">
      <FontAwesomeIcon icon={faSearch} className="icono-busqueda" />
      <Input
        type='text'
        className="input-buscador"
        id={name}
        name={name}
        placeholder={placeholder}
        onChange={onChange}
        valido={null}
      />
    </div>
  );
};

const Select1 = ({
  estado,
  cambiarEstado,
  Name,
  ExpresionRegular,
  lista,
  name,
  funcion = null,
  msg, etiqueta = null,
  opcion = "seleccionar", select = true, importante = true,
}) => {
  const [mensaje, setMensaje] = useState(null);
  useEffect(() => {
    setTimeout(() => {
      setMensaje(null);
    }, 10000);
  }, [mensaje]);

  const onChange = (e) => {
    cambiarEstado({ campo: parseInt(e.target.value), valido: "true" });
  };
  const validacion = (e) => {
    document.getElementById(name).style.display = 'none'
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo)) {
        cambiarEstado({ ...estado, valido: "true" }); //el valor del campo valido, debe ser una cadena
        setMensaje(null);
        if (funcion) funcion(parseInt(e.target.value))
      } else {
        cambiarEstado({ ...estado, valido: "false" });
        setMensaje(msg);
      }
    }
  };
  // console.log(lista)
  return (

    <FormGroup>
      <label htmlFor={name}>
        {etiqueta ? <> {etiqueta} {importante ? <span style={{ color: 'red' }}>*</span> : null}</> : null}
      </label>
      <Input
        name={Name}
        type="select"
        onChange={onChange}
        valido={estado.valido}
        value={estado.campo || ""}
        onClick={validacion}
      >
        {select && <option>{opcion}</option>}
        {lista.map((r) => (
          <option
            key={r.id}
            value={r.id}
          >
            {r.label}
          </option>
        ))}
      </Input>
      {/* </SelectStyle> */}
      <IconoValidacionSelect valido={estado.valido} icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle} />
      <label id={name} style={{ display: 'none', color: '#FF3D85', fontSize: '12px', fontWeight: 'bold' }}>Campo Incorrecto</label>

    </FormGroup >
  );
};

const Select1EasyColors = ({
  estado,
  cambiarEstado,
  Name,
  ExpresionRegular,
  lista,
  name,
  funcion = null,
  msg, etiqueta = null,
  nivel = null,
}) => {


  const onChange = (e) => {
    if (ExpresionRegular) {

      if (ExpresionRegular.test(e.value)) {
        cambiarEstado({ ...estado, valido: "true" }); //el valor del campo valido, debe ser una cadena
        if (funcion) funcion(parseInt(e.value))
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: "true" })
        cambiarEstado({ campo: parseInt(e.value), valido: "true" });
      } else {
        cambiarEstado({ ...estado, valido: "false" });
      }
    }

  };
  const validacion = (e) => {
    if (ExpresionRegular) {
      if (ExpresionRegular.test(estado.campo)) {
        cambiarEstado({ ...estado, valido: "true" }); //el valor del campo valido, debe ser una cadena
        if (funcion) funcion(parseInt(e.value))
        if (nivel) nivel({ campo: parseInt(e.nivel), valido: "true" })

      } else {
        cambiarEstado({ ...estado, valido: "false" });
      }
    }
  };

  let valor = ''
  for (let e of lista) {
    if (e.value == estado.campo) {
      valor = e.label
    }
  }
  // console.log(lista)




  return (
    <FormGroup>
      <label htmlFor={name}>
        {etiqueta}
      </label>
      <Select
        name={Name}
        onClick={validacion}
        value={lista.find(opt => opt.value === estado.campo) || null}
        className={estado.valido === 'true' ? 'select-valid' : estado.valido === 'false' ? 'select-invalid' : ''}
        styles={{
          control: (base, state) => ({
            ...base,

            borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : base.borderColor,
            '&:hover': {
              borderColor: estado.valido === 'true' ? '#1ed12d' : estado.valido === 'false' ? '#dc3545' : base.borderColor
            }
          }),

        }}
        placeholder={'Seleccione'}
        onChange={onChange}
        options={lista}
      />
    </FormGroup >
  );
};

const ComponenteInputUserDisabled = ({ estado, etiqueta, placeholder, tabla = false, importante = true }) => {
  return (
    <FormGroup>
      {!tabla && <label>{etiqueta}{importante ? <span style={{ color: 'red' }}>*</span> : null}</label>}
      <Input
        type="text"
        value={estado.campo || ""}
        valido={estado.valido}
        placeholder={placeholder}
        toUpperCase
        disabled
      />
    </FormGroup>
  );
};

const ComponenteCheck = ({
  etiqueta,
  estado,
  onChange,
  name
}) => {


  return (
    <label className="text-muted cursor-pointer" htmlFor={name}>
      <input
        type="checkbox"
        className="me-2"
        name={name}
        id={name}
        checked={estado} // Valor vinculado al estado
        onChange={onChange}
      />{etiqueta}
    </label>
  );
};



export {
  InputUsuarioStandard,
  Select1,
  Select1EasyColors,
  ComponenteCheck,
  ComponenteInputUserDisabled,
  InputUsuarioSearch

};
