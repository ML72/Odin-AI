import { v4 as uuidv4 } from 'uuid';
import { addAlert, removeAlert } from '../store/slices/ui';

export const setNewAlert = (
    dispatch: any,
    { msg, alertType = 'success', timeout = 5000 }: { msg: string, alertType?: string, timeout?: number }
) => {

    const id = uuidv4();
    dispatch(addAlert({
        msg, alertType, id
    }));

    setTimeout(() => {
        dispatch(removeAlert({ id }));
    }, timeout);
}