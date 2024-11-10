import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getLotsFromApi } from '../../../shared/api/lots/getLotsFromApi';
import { ILot } from '../model/lotsTypes';
import { createLotFromApi } from '../../../shared/api/lots/createLotFromApi';
import { deleteLotFromApi } from '../../../shared/api/lots/deleteLotFromApi';
import { updateLotFromApi } from '../../../shared/api/lots/updateLotFromApi';
import { updateLotStatusFromApi } from '../../../shared/api/lots/updateLotStatusFromApi';


interface LotsState {
    lots: ILot[];
    status: 'idle' | 'loading' | 'succeeded' | 'failed';
    error: string | null;
    createLotDrawerVisible: boolean;
    editLotDrawerVisible: boolean;
    selectedLot: ILot | null;
}

const initialState: LotsState = {
    lots: [],
    status: 'idle',
    error: null,
    createLotDrawerVisible: false,
    editLotDrawerVisible: false,
    selectedLot: null,
};

export const fetchLotsAsync = createAsyncThunk('lots/fetchLots', async (_, { dispatch }) => {
    const data = await getLotsFromApi();
    dispatch(setLots(data));
    return data;
});

export const createLotAsync = createAsyncThunk('lots/createLot', async (newLot: Partial<ILot>, { dispatch }) => {
    const data = await createLotFromApi(newLot);
    dispatch(addLot(data));
    return data;
});

export const deleteLotAsync = createAsyncThunk('lots/deleteLot', async (id: string, { dispatch }) => {
    await deleteLotFromApi(id);
    dispatch(removeLot(id));
    return id;
});

export const editLotAsync = createAsyncThunk('lots/editLot', async ({ id, updatedLot }: { id: string, updatedLot: Partial<ILot> }, { dispatch }) => {
    const data = await updateLotFromApi(id, updatedLot);
    dispatch(editLot(data));
    return data;
});

export const updateLotStatusAsync = createAsyncThunk(
    'lots/updateLotStatus',
    async ({ id, status }: { id: string, status: 'active' | 'paused' }, { dispatch }) => {
        const data = await updateLotStatusFromApi(id, status);
        dispatch(editLotStatus({ id, status: data.status }));
        return data;
    }
);


const lotsSlice = createSlice({
    name: 'lots',
    initialState,
    reducers: {
        setLots: (state, action: PayloadAction<ILot[]>) => {
            state.lots = action.payload;
        },
        addLot: (state, action: PayloadAction<ILot>) => {
            state.lots.push(action.payload);
        },
        removeLot: (state, action: PayloadAction<string>) => {
            state.lots = state.lots.filter(lot => lot.id !== action.payload);
        },
        showDrawer: (state) => {
            state.createLotDrawerVisible = true;
        },
        hideDrawer: (state) => {
            state.createLotDrawerVisible = false;
        },
        editLot: (state, action: PayloadAction<ILot>) => {
            const index = state.lots.findIndex(lot => lot.id === action.payload.id);
            if (index !== -1) {
                state.lots[index] = action.payload;
            }
        },
        editLotStatus: (state, action: PayloadAction<{ id: string, status: 'active' | 'paused' }>) => {
            const index = state.lots.findIndex(lot => lot.id === action.payload.id);
            if (index !== -1) {
                state.lots[index].status = action.payload.status;
            }
        },
        showEditDrawer: (state, action: PayloadAction<ILot>) => {
            state.editLotDrawerVisible = true;
            state.selectedLot = action.payload;
        },
        hideEditDrawer: (state) => {
            state.editLotDrawerVisible = false;
            state.selectedLot = null;
        },
    },
});

export const { setLots, addLot, showDrawer, hideDrawer, removeLot, editLot, showEditDrawer, hideEditDrawer, editLotStatus } = lotsSlice.actions;
export default lotsSlice.reducer;
