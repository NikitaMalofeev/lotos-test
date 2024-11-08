import { ILot } from "../../../entities/lots/model/lotsTypes";

export const createLotFromApi = async (newLot: Partial<ILot>) => {
    try {
        const response = await fetch('https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/lots', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(newLot),
        });

        if (!response.ok) {
            throw new Error('Failed to create new lot');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error creating lot:', error);
        throw error;
    }
};
