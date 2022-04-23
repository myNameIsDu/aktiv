import { useMemo } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';

const useQuery = (): Record<string, any> => {
    const location = useLocation();

    return useMemo(() => {
        return qs.parse(location.search || {}, { ignoreQueryPrefix: true });
    }, [location.search]);
};

export default useQuery;
