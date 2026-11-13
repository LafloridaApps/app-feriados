import { useEffect, useRef } from 'react';
import GrillaSolicitantes from './GrillaSolicitantes';

export default function ModalSolicitantes({ cerrar, buscarFuncionarios, seleccionar, seleccionando }) {
    const dialogo = useRef(null);

    useEffect(() => {
        const elemento = dialogo.current;
        const anterior = document.activeElement;
        elemento.showModal();
        return () => {
            elemento.close();
            anterior?.focus();
        };
    }, []);

    return (
        <dialog ref={dialogo} className="rounded border-0 shadow p-0"
            style={{ width: 'min(960px, 95vw)', maxHeight: '90vh' }}
            aria-labelledby="titulo-modal-solicitantes" onCancel={event => {
                event.preventDefault();
                cerrar();
            }}>
            <div className="modal-content">
                <div className="modal-header p-3 border-bottom">
                    <h3 id="titulo-modal-solicitantes" className="modal-title h5">Buscar por nombre</h3>
                    <button type="button" className="btn-close" aria-label="Cerrar" onClick={cerrar} />
                </div>
                <div className="modal-body p-3">
                    <GrillaSolicitantes buscarFuncionarios={buscarFuncionarios}
                        seleccionar={seleccionar} seleccionando={seleccionando} />
                </div>
                <div className="modal-footer p-3 border-top">
                    <button type="button" className="btn btn-secondary" onClick={cerrar}>Cerrar</button>
                </div>
            </div>
        </dialog>
    );
}
