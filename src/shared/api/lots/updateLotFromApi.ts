import { ILot } from "../../../entities/lots/model/lotsTypes";

export const updateLotFromApi = async (id: string, updatedLot: Partial<ILot>) => {
    try {
        const response = await fetch(`https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/lots/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(updatedLot),
        });

        if (!response.ok) {
            throw new Error('Failed to update the lot');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating lot:', error);
        throw error;
    }
};
