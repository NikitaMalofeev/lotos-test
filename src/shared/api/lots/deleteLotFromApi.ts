export const deleteLotFromApi = async (id: string) => {
    try {
        const response = await fetch(`https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/lots/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Failed to delete the lot');
        }

        return id;
    } catch (error) {
        console.error('Error deleting lot:', error);
        throw error;
    }
};
