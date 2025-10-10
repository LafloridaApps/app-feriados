import { useState } from 'react';

export const useRrhhSelection = (fullData) => {
    const [selectedItems, setSelectedItems] = useState([]);

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
        const allIds = fullData.map(item => item.idSolicitud);
        const allCurrentlySelected = allIds.length > 0 && allIds.every(id => selectedItems.includes(id));

        if (allCurrentlySelected) {
            // If all are selected, deselect all
            setSelectedItems([]);
        } else {
            // Otherwise, select all
            setSelectedItems(allIds);
        }
    };

    return {
        selectedItems,
        setSelectedItems,
        handleSelectItem,
        handleSelectAll,
    };
};
