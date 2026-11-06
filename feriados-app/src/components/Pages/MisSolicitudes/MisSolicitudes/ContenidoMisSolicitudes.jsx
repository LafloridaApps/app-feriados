import PropTypes from 'prop-types';
import MisSolicitudesLoadingSpinner from '../MisSolicitudesLoadingSpinner';
import MisSolicitudesNoDataMessage from '../MisSolicitudesNoDataMessage';
import MisSolicitudesMobile from '../MisSolicitudesMobile';
import MisSolicitudesTable from '../MisSolicitudesTable';

const ContenidoMisSolicitudes = ({ loading, solicitudes, isMobile, openDetailId, handleToggleDetail }) => {
    if (loading) {
        return <MisSolicitudesLoadingSpinner />;
    }

    if (solicitudes.length === 0) {
        return <MisSolicitudesNoDataMessage />;
    }

    if (isMobile) {
        return (
            <MisSolicitudesMobile
                solicitudes={solicitudes}
                openDetailId={openDetailId}
                handleToggleDetail={handleToggleDetail}
            />
        );
    }

    return (
        <div className="mis-solicitudes-table-wrapper">
            <MisSolicitudesTable
                solicitudes={solicitudes}
                openDetailId={openDetailId}
                handleToggleDetail={handleToggleDetail}
            />
        </div>
    );
};

ContenidoMisSolicitudes.propTypes = {
    loading: PropTypes.bool.isRequired,
    solicitudes: PropTypes.array.isRequired,
    isMobile: PropTypes.bool.isRequired,
    openDetailId: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
    handleToggleDetail: PropTypes.func.isRequired,
};

export default ContenidoMisSolicitudes;
