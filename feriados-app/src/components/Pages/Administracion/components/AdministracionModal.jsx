import { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

export default function AdministracionModal({ titulo, children, onClose, busy = false }) {
    const ref = useRef(null);
    useEffect(() => {
        const dialog = ref.current;
        dialog.showModal();
        return () => dialog.close();
    }, []);
    return <dialog ref={ref} className="admin-dialog" aria-label={titulo} onCancel={event => { event.preventDefault(); if (!busy) onClose(); }}>
        <div className="modal-header"><h2 className="h5 mb-0">{titulo}</h2><button type="button" className="btn-close ms-3" aria-label="Cerrar" disabled={busy} onClick={onClose} /></div>
        {children}
    </dialog>;
}
AdministracionModal.propTypes = { titulo: PropTypes.string.isRequired, children: PropTypes.node.isRequired, onClose: PropTypes.func.isRequired, busy: PropTypes.bool };
