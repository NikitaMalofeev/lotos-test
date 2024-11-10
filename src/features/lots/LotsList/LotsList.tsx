import React, { useEffect } from 'react';
import styles from './styles.module.scss';
import { useAppDispatch } from '../../../shared/helpers/dispatch';
import {
    fetchLotsAsync,
    showDrawer,
    showEditDrawer,
    hideDrawer,
    hideEditDrawer
} from '../../../entities/lots/slice/lotsSlice';
import { useSelector } from 'react-redux';
import { RootState } from '../../../app/store/store';
import { Button } from 'antd';
import { LotsCard } from '../LotsCard/LotsCard';
import CreateLotDrawer from '../CreateLotDrawer/CreateLotDrawer';
import EditLotDrawer from '../EditLotDrawer/EditLotDrawer';
import { ILot } from '../../../entities/lots/model/lotsTypes';
import { useAdminPermissions } from '../../../shared/hooks/useCheckPermissions';

export const LotsList = () => {
    const dispatch = useAppDispatch();
    const { lots, createLotDrawerVisible, editLotDrawerVisible, selectedLot } = useSelector((state: RootState) => state.lots);

    const hasAdminPermission = useAdminPermissions();

    useEffect(() => {
        dispatch(fetchLotsAsync());
    }, [dispatch]);

    const handleShowCreateLot = () => {
        dispatch(showDrawer());
    };

    const handleHideCreateLot = () => {
        dispatch(hideDrawer());
    };

    const handleShowEditLot = (lot: ILot) => {
        dispatch(showEditDrawer(lot));
    };

    const handleHideEditLot = () => {
        dispatch(hideEditDrawer());
    };

    return (
        <div className={styles.lotsList}>
            {hasAdminPermission && <Button onClick={handleShowCreateLot} className={styles.lotsList__button_create}>
                Create Lot
            </Button>}
            <div className={styles.lotsList__container}>

                {lots && lots.map((lot) => (
                    <div key={lot.id} className={styles.lotsList__item}>
                        <LotsCard lot={lot} onEdit={handleShowEditLot} />
                    </div>
                ))}

                {/* Modal windows */}
                <CreateLotDrawer visible={createLotDrawerVisible} onClose={handleHideCreateLot} />
                <EditLotDrawer visible={editLotDrawerVisible} onClose={handleHideEditLot} />
            </div>
        </div>

    );
};
