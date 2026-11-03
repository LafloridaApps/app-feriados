import 'bootstrap/dist/css/bootstrap.min.css';
import VistaDashboard from './PaginaDashboard/VistaDashboard';
import { usePaginaDashboard } from './PaginaDashboard/usePaginaDashboard';
import './PaginaCalendarioAusencias.css';

const PaginaDashboard = () => {
    const dashboard = usePaginaDashboard();

    return <VistaDashboard {...dashboard} />;
};

export default PaginaDashboard;
