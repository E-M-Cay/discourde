import { useAppSelector } from './redux/hooks';

const user = useAppSelector((state) => state.userReducer);
