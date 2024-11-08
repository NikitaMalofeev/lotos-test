import React, { useEffect } from 'react';
import styles from './styles.module.scss';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import {
    deleteLotAsync,
    fetchLotsAsync,
    hideDrawer,
    showDrawer,
    showEditDrawer,
    hideEditDrawer
} from '../../../entities/lots/slice/lotsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store/store';
import { Button } from 'antd';
import { LotsCard } from '../LotsCard/LotsCard';
import CreateLotDrawer from '../CreateLotDrawer/CreateLotDrawer';
import EditLotDrawer from '../EditLotDrawer/EditLotDrawer';
import { ILot } from '../../../entities/lots/model/lotsTypes';

export const LotsList = () => {
    const dispatch = useAppDispatch();
    const { lots, createLotDrawerVisible, editLotDrawerVisible, selectedLot } = useSelector((state: RootState) => state.lots);

    useEffect(() => {
        dispatch(fetchLotsAsync());
    }, [dispatch]);

    const handleShowCreateLot = () => {
        dispatch(showDrawer());
    };

    const handleHideCreateLot = () => {
        dispatch(hideDrawer());
    };

    const handleDelete = (id: string) => {
        dispatch(deleteLotAsync(id));
    };

    const handleShowEditLot = (lot: ILot) => {
        dispatch(showEditDrawer(lot));
    };

    const handleHideEditLot = () => {
        dispatch(hideEditDrawer());
    };

    return (
        <div className={styles.lotsList}>
            {lots && lots.map((lot) => (
                <div key={lot.id} className={styles.lotsList__item}>
                    <LotsCard
                        name={lot.name}
                        term={lot.term}
                        payment={lot.payment}
                        startDate={lot.startDate}
                        timeLeftForLot={lot.timeLeft}
                    />
                    <Button type="primary" onClick={() => handleShowEditLot(lot)}>
                        Edit
                    </Button>
                    <Button type="primary" danger onClick={() => handleDelete(lot.id)}>
                        Delete
                    </Button>
                </div>
            ))}
            <Button onClick={handleShowCreateLot}>
                Create Lot
            </Button>
            <CreateLotDrawer visible={createLotDrawerVisible} onClose={handleHideCreateLot} />
            <EditLotDrawer visible={editLotDrawerVisible} onClose={handleHideEditLot} />
        </div>
    );
};
