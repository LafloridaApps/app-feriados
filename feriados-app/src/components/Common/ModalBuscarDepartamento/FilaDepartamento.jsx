import PropTypes from 'prop-types';

const FilaDepartamento = ({ depto, selectedDepto, setSelectedDepto }) => {
    const isSelected = selectedDepto?.idDepto === depto.idDepto;

    return (
        <tr
            key={depto.idDepto}
            onClick={() => setSelectedDepto(depto)}
            className={isSelected ? 'table-primary' : ''}
            style={{ cursor: 'pointer' }}
        >
            <td><span className="badge bg-secondary opacity-75">{depto.idDepto}</span></td>
            <td className="fw-medium">{depto.nombreDepartamento}</td>
            <td className="text-end">
                <button
                    className={`btn btn-sm ${isSelected ? 'btn-primary' : 'btn-outline-primary'}`}
                    onClick={(e) => {
                        e.stopPropagation();
                        setSelectedDepto(depto);
                    }}
                >
                    {isSelected ? <i className="bi bi-check2"></i> : 'Seleccionar'}
                </button>
            </td>
        </tr>
    );
};

FilaDepartamento.propTypes = {
    depto: PropTypes.object.isRequired,
    selectedDepto: PropTypes.object,
    setSelectedDepto: PropTypes.func.isRequired,
};

export default FilaDepartamento;
