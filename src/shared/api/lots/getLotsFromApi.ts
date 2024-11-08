export const getLotsFromApi = async () => {
    try {
        const response = await fetch('https://66df0bcfde4426916ee36061.mockapi.io/exchangeApi/lots');
        if (!response.ok) {
            throw new Error('Failed to fetch lots data');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching lots:', error);
        return [];
    }
};
