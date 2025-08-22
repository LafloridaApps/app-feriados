import { useState, useEffect } from 'react';

export const useRrhhSelection = (currentAprobaciones) => {
    const [selectedItems, setSelectedItems] = useState([]);

    useEffect(() => {
        setSelectedItems(prevSelected =>
            prevSelected.filter(id => currentAprobaciones.some(item => item.id === id))
        );
    }, [currentAprobaciones]);

    const handleSelectItem = (id) => {
        setSelectedItems(prevSelected => {
            if (prevSelected.includes(id)) {
                return prevSelected.filter(itemId => itemId !== id);
            } else {
                return [...prevSelected, id];
            }
        });
    };

    const handleSelectAll = () => {
        const allCurrentIds = currentAprobaciones.map(item => item.id);
        const allCurrentlySelected = allCurrentIds.every(id => selectedItems.includes(id));

        if (allCurrentlySelected) {
            setSelectedItems(prevSelected => prevSelected.filter(id => !allCurrentIds.includes(id)));
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
