import { faEdit, faTrashAlt } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Link } from 'react-router-dom'

const DataTable = ({ columns, data, funciones }) => {
    return (
        <div className="  table-container animate-fade-up">

            <div className="table-responsive-wrapper"> {/* El que hace el scroll */}
                <table className="table-responsive-custom">
                    <thead>
                        <tr>
                            {columns.map((col) => (
                                <th key={col.field}>{col.label}</th>
                            ))}
                            <th className="text-center">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {data.map((item) => (
                            <tr key={item.id}>
                                {columns.map((col) => (
                                    <td key={col.field} data-label={col.label}>
                                        {col.render ? col.render(item) : item[col.field]}
                                    </td>
                                ))}
                                <td>
                                    <div className="contenedor-botones">
                                        {funciones.map((f, index) => (
                                            !f.enlace ?
                                                <button
                                                    key={index}
                                                    onClick={() => f.boton(item.id)}
                                                    className={f.className}
                                                >
                                                   <FontAwesomeIcon icon={f.icono} />{f.label} 
                                                </button>
                                                : <Link key={index} className={f.className} to={`${f.enlace}/${item.id}`} > <FontAwesomeIcon icon={f.icono} /> {f.label} </Link>
                                        ))}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div >
    );
};

export default DataTable;