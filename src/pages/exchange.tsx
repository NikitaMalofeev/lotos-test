
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { RootState } from "../app/store/store";
import AuthDrawer from "../features/user/AuthModal.tsx/AuthDrawer";
import { useAppDispatch } from "../shared/helpers/dispatch";
import { LotsList } from "../features/lots/LotsList/LotsList";

export const ExchangePage = () => {
    const [visible, setVisible] = useState(true)
    const user = useSelector((state: RootState) => state.user.user)
    const dispatch = useAppDispatch()

    useEffect(() => {
        if (user?.role) {
            setVisible(false)
        }
    }, [user])

    return (
        <div>
            <AuthDrawer visible={visible} />
            <span>{user && user.role}</span>
            <LotsList />
        </div>
    );
};