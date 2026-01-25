import { useState } from 'react';

const useCrearDepartamentoModal = () => {
    const [showCrearModal, setShowCrearModal] = useState(false);
    const [parentDepartment, setParentDepartment] = useState(null);

    const handleShowCrearModal = (parent) => {
        setParentDepartment(parent);
        setShowCrearModal(true);
    };

    const handleHideCrearModal = () => {
        setShowCrearModal(false);
        setParentDepartment(null);
    };

    return {
        showCrearModal,
        parentDepartment,
        handleShowCrearModal,
        handleHideCrearModal
    };
};

export default useCrearDepartamentoModal;
