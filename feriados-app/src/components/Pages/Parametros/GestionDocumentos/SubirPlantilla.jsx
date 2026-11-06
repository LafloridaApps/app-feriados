import PropTypes from 'prop-types';

const SubirPlantilla = ({ selectedFile, feedbackMessage, nombrePlantilla, fileInputKey, setNombrePlantilla, handleFileChange, handleUpload }) => (
    <div className="gestion-documentos-upload-section">
        <h5>Subir Nueva Plantilla</h5>
        <div className="row g-3">
            <div className="col-12 col-md-4">
                <div className="form-floating">
                    <input
                        type="text"
                        id="templateName"
                        className="form-control border-0 bg-white"
                        placeholder="Nombre de la Plantilla"
                        value={nombrePlantilla}
                        onChange={(e) => setNombrePlantilla(e.target.value)}
                    />
                    <label htmlFor="templateName">Nombre de la Plantilla</label>
                </div>
            </div>
            <div className="col-12 col-md-5">
                <div className="form-floating">
                    <input
                        key={fileInputKey}
                        id="templateFile"
                        type="file"
                        className="form-control border-0 bg-white"
                        accept=".docx"
                        onChange={handleFileChange}
                    />
                    <label htmlFor="templateFile">Seleccionar Archivo (.docx)</label>
                </div>
            </div>
            <div className="col-12 col-md-3 d-flex align-items-stretch">
                <button
                    className="btn upload-button-premium text-white w-100 shadow-sm"
                    onClick={handleUpload}
                    disabled={!selectedFile || !nombrePlantilla}
                >
                    <i className="bi bi-cloud-arrow-up-fill me-2"></i>{' '}
                    Subir Plantilla
                </button>
            </div>
        </div>
        {feedbackMessage && (
            <div className="mt-3 d-flex align-items-center text-danger small fw-bold">
                <i className="bi bi-exclamation-circle-fill me-2"></i>{' '}
                {feedbackMessage}
            </div>
        )}
    </div>
);

SubirPlantilla.propTypes = {
    selectedFile: PropTypes.object,
    feedbackMessage: PropTypes.string.isRequired,
    nombrePlantilla: PropTypes.string.isRequired,
    fileInputKey: PropTypes.number.isRequired,
    setNombrePlantilla: PropTypes.func.isRequired,
    handleFileChange: PropTypes.func.isRequired,
    handleUpload: PropTypes.func.isRequired,
};

export default SubirPlantilla;
