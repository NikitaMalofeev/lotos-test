export const updateLotStatusFromApi = async (id: string, status: 'active' | 'paused') => {
    try {
        const response = await fetch(`https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/lots/${id}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ status }),
        });

        if (!response.ok) {
            throw new Error('Failed to update the status of the lot');
        }

        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error updating lot status:', error);
        throw error;
    }
};
