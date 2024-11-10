import { useSelector } from 'react-redux';
import { RootState } from '../../app/store/store';

export const useAdminPermissions = (): boolean => {
    const user = useSelector((state: RootState) => state.user.user);

    return user?.role === 'admin';
};
