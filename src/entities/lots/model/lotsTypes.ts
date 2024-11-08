export type ILot = {
    status: 'active' | 'paused' | 'cancelled';
    additionalFactors: string;
    term: string;
    payment: string;
    lastPrice: string;
    newPrice: string;
    startDate: number;
    timeLeft: number;
    name: string;
    id: string;
};
