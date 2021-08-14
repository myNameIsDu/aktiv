import { useMemo } from 'react';
import { useLocation } from 'react-router-dom';
// @ts-ignore qs.stringify includes Node Util
import parse from 'qs/lib/parse';

type ParseSearchProps = (search: string) => Record<string, unknown>;

const parseSearch: ParseSearchProps = search => {
    // of course can use search.slice(1, -1) to get search at location
    return search ? parse(search.charAt(0) === '?' ? search.substring(1) : search) : {};
};

function useQuery(): Record<string, unknown> {
    const { search } = useLocation();

    return useMemo(() => parseSearch(search), [search]);
}

export default useQuery;
