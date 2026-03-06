const MisSolicitudesLoadingSpinner = () => {
    return (
        <div className="text-center p-4">
            <span className="spinner-border text-primary" aria-hidden="true"></span>
            <output className="visually-hidden">Cargando...</output>
        </div>
    );
};

export default MisSolicitudesLoadingSpinner;