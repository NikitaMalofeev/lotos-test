
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../../app/store/store";
import AuthDrawer from "../../features/user/AuthModal.tsx/AuthDrawer";
import { useAppDispatch } from "../../shared/helpers/dispatch";
import { LotsList } from "../../features/lots/LotsList/LotsList";
import styles from './styles.module.scss'

export const MainPage = () => {
    const [visible, setVisible] = useState(true)
    const user = useSelector((state: RootState) => state.user.user)

    useEffect(() => {
        if (user?.role) {
            setVisible(false)
        }
    }, [user])

    return (
        <div className={styles.page}>
            <span className={styles.page__title}>{user && user.role}</span>
            <LotsList />
            <AuthDrawer visible={visible} />
        </div>
    );
};