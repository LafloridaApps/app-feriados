const MisSolicitudesLoadingSpinner = () => {
    return (
        <div className="text-center p-4">
            <output className="spinner-border text-primary" aria-hidden="true"></output>
            <output className="visually-hidden">Cargando...</output>
        </div>
    );
};

export default MisSolicitudesLoadingSpinner;