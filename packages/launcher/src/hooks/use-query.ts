import { useMemo } from 'react';
import qs from 'qs';
import { useLocation } from 'react-router-dom';

const useQuery = (): Record<string, any> => {
    const { search } = useLocation();

    return useMemo(() => {
        return qs.parse(search, { ignoreQueryPrefix: true });
    }, [search]);
};

export default useQuery;
