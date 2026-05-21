import toast from 'react-hot-toast';
import {
  faCheckCircle,
  faSearch,
  faTimesCircle,
} from '@fortawesome/free-solid-svg-icons';
import Select from 'react-select';
import { Input, IconoValidacion } from './stylos';
import { useEffect, useState } from 'react';
import { FormGroup } from 'reactstrap';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

// --- Estilos Base ---
const baseLabelStyle = {
  display: 'block',
  color: '#475569',
  fontSize: '13px',
  fontWeight: '600',
  marginBottom: '8px',
  textTransform: 'none',
  letterSpacing: 'normal'
};

const baseInputStyle = (valido, disabled) => ({
  width: '100%',
  height: '45px',
  borderRadius: '12px',
  padding: '0 40px 0 14px',
  backgroundColor: disabled ? '#f1f5f9' : '#ffffff',
  border: '1px solid',
  borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#cbd5e1',
  fontSize: '14px',
  fontWeight: '500',
  color: disabled ? '#64748b' : '#0f172a',
  outline: 'none',
  transition: 'all 0.2s ease',
});

const getSelectStyles = (valido) => ({
  control: (provided, state) => ({
    ...provided,
    backgroundColor: '#ffffff',
    borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : state.isFocused ? '#0f172a' : '#cbd5e1',
    boxShadow: state.isFocused ? `0 0 0 1px ${valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#0f172a'}` : 'none',
    borderRadius: '12px',
    padding: '4px 8px',
    fontSize: '14px',
    fontWeight: '500',
    minHeight: '45px',
    transition: 'all 0.2s ease',
    '&:hover': { borderColor: valido === 'true' ? '#2e7559' : valido === 'false' ? '#dc2626' : '#0f172a' },
  }),
  menu: (provided) => ({ ...provided, borderRadius: '16px', boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.08)', border: '1px solid #f1f5f9', zIndex: 9999 }),
  option: (provided, state) => ({
    ...provided,
    padding: '12px 16px',
    borderRadius: '10px',
    fontSize: '14px',
    backgroundColor: state.isSelected ? '#e2e8f0' : state.isFocused ? '#f1f5f9' : 'transparent',
    color: '#0f172a',
    cursor: 'pointer',
  }),
});

// --- Componentes ---

const InputUsuarioStandard = ({
  estado, cambiarEstado, name = "input-default", tipo = "text",
  ExpresionRegular, msg, placeholder, etiqueta, importante = true,
  logo = true, mayusculas = true, disabled = false,
}) => {
  const [mostrarMsg, setMostrarMsg] = useState(false);

  useEffect(() => {
    let timer;
    if (mostrarMsg) { timer = setTimeout(() => { setMostrarMsg(false); }, 10000); }
    return () => clearTimeout(timer);
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
    <div style={{ marginBottom: '4px', width: '100%' }}>
      <label style={baseLabelStyle}>{etiqueta} {importante && logo && <span style={{ color: '#dc2626' }}>*</span>}</label>
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center' }}>
        <Input
          type={tipo}
          style={baseInputStyle(estado.valido, disabled)}
          id={name} name={name} placeholder={placeholder}
          value={disabled ? "" : (estado.campo || "")}
          onChange={onChange} onKeyUp={validacion} onBlur={validacion}
          valido={estado.valido} disabled={disabled} required={importante}
        />
        {(tipo === 'text' || tipo === 'number') && estado.valido && (
          <div style={{ position: 'absolute', right: '14px', color: estado.valido === 'true' ? '#2e7559' : '#dc2626', pointerEvents: 'none' }}>
            <FontAwesomeIcon icon={estado.valido === 'true' ? faCheckCircle : faTimesCircle} />
          </div>
        )}
      </div>
      {mostrarMsg && <label style={{ color: '#dc2626', fontSize: '11px', fontWeight: '700', marginTop: '6px' }}>{msg}</label>}
    </div>
  );
};

const InputUsuarioSearch = ({ name = "input-default", placeholder, onChange }) => (
  <div style={{ position: 'relative', display: 'flex', alignItems: 'center', width: '100%' }}>
    <FontAwesomeIcon icon={faSearch} style={{ position: 'absolute', left: '16px', color: '#94a3b8', pointerEvents: 'none' }} />
    <Input type="text" style={{ ...baseInputStyle(null, false), padding: '0 14px 0 44px' }} id={name} name={name} placeholder={placeholder} onChange={onChange} />
  </div>
);

const Select1 = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, name, funcion = null, msg, etiqueta = null, importante = true }) => {
  const [mostrarMsg, setMostrarMsg] = useState(false);
  const handleChange = (selectedOption) => {
    const valor = selectedOption ? parseInt(selectedOption.value) : null;
    let esValido = ExpresionRegular ? (ExpresionRegular.test(valor) ? "true" : "false") : "null";
    cambiarEstado({ ...estado, campo: valor, valido: esValido });
    setMostrarMsg(esValido === "false");
    if (funcion && selectedOption) funcion(valor);
  };

  return (
    <div style={{ marginBottom: '4px', width: '100%' }}>
      {etiqueta && <label style={baseLabelStyle}>{etiqueta} {importante && <span style={{ color: '#dc2626' }}>*</span>}</label>}
      <Select name={Name} id={name} placeholder="Seleccione..." onChange={handleChange} options={lista} value={lista.find(o => o.value === estado.campo) || null} isSearchable isClearable styles={getSelectStyles(estado.valido)} />
      {mostrarMsg && <small style={{ color: '#dc2626', fontSize: '11px', fontWeight: '700', marginTop: '6px' }}>{msg}</small>}
    </div>
  );
};

const Select1EasyColors = ({ estado, cambiarEstado, Name, ExpresionRegular, lista, name, funcion = null, etiqueta = null }) => {
  const onChange = (e) => {
    const esValido = ExpresionRegular.test(e.value) ? "true" : "false";
    cambiarEstado({ campo: parseInt(e.value), valido: esValido });
    if (esValido === "true" && funcion) funcion(parseInt(e.value));
  };
  return (
    <FormGroup>
      {etiqueta && <label style={baseLabelStyle}>{etiqueta}</label>}
      <Select name={Name} value={lista.find(o => o.value === estado.campo) || null} styles={getSelectStyles(estado.valido)} placeholder="Seleccione..." onChange={onChange} options={lista} />
    </FormGroup>
  );
};

const ComponenteInputUserDisabled = ({ estado, etiqueta, placeholder, importante = true }) => (
  <FormGroup>
    <label style={baseLabelStyle}>{etiqueta}{importante && <span style={{ color: '#dc2626' }}>*</span>}</label>
    <Input type="text" style={baseInputStyle('null', true)} value={estado.campo || ""} disabled placeholder={placeholder} />
  </FormGroup>
);

const ComponenteCheck = ({ etiqueta, estado, onChange, name }) => (
  <label htmlFor={name} style={{ display: 'inline-flex', alignItems: 'center', color: '#475569', fontSize: '14px', fontWeight: '500', cursor: 'pointer', marginTop: '8px' }}>
    <input type="checkbox" name={name} id={name} checked={estado} onChange={onChange} style={{ width: '16px', height: '16px', marginRight: '8px', cursor: 'pointer', accentColor: '#0f172a' }} />
    {etiqueta}
  </label>
);

export { InputUsuarioStandard, Select1, Select1EasyColors, ComponenteCheck, ComponenteInputUserDisabled, InputUsuarioSearch };