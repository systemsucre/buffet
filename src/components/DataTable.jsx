import React from 'react';

const DataTable = ({ columns, data, onEdit, onDelete }) => {
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
                                <td data-label="Acciones" className="text-center">
                                    <div className="d-flex gap-2 justify-content-center">
                                        <button
                                            onClick={() => onEdit(item)}
                                            className="btn btn-dark-clinical py-1 px-3 x-small"
                                        >
                                            Editar
                                        </button>
                                        <button
                                            onClick={() => onDelete(item.id)}
                                            className="btn btn-danger py-1 px-3 x-small"
                                        >
                                            Borrar
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default DataTable;