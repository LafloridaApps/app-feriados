import { useState, useEffect } from 'react';

export const useRrhhSelection = (currentAprobaciones) => {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        setSelectedItems(prevSelected =>
            prevSelected.filter(id => currentAprobaciones.some(item => item.idSolicitud === id))
        );
    }, [currentAprobaciones]);

    const handleSelectItem = (idSolicitud) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(idSolicitud)) {
                return prevSelected.filter(itemId => itemId !== idSolicitud);
            } else {
                return [...prevSelected, idSolicitud];
            }
        });
    };

    const handleSelectAll = () => {
        const allCurrentIds = currentAprobaciones.map(item => item.idSolicitud);
        const allCurrentlySelected = allCurrentIds.every(idSolicitud => selectedItems.includes(idSolicitud));

        if (allCurrentlySelected) {
            setSelectedItems(prevSelected => prevSelected.filter(idSolicitud => !allCurrentIds.includes(idSolicitud)));
        } else {
            setSelectedItems(prevSelected => {
                const newSelected = new Set([...prevSelected, ...allCurrentIds]);
                return Array.from(newSelected);
            });
        }
    };

    return {
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
    };
};
