import { renderHook } from '@testing-library/react-hooks';
import { MemoryRouter as Router, Routes, Route } from 'react-router-dom';
import { useQuery } from '../../src';
import React, { FC, ReactElement } from 'react';

describe('useQuery', () => {
    const TestApp: FC = ({ children }) => {
        return (
            <Router initialEntries={['/about?name=useQuery']}>
                <Routes>
                    <Route path="/about" element={children as ReactElement} />
                </Routes>
            </Router>
        );
    };

    it('should parse right query, when given location search', () => {
        const { result } = renderHook(() => useQuery(), {
            wrapper: TestApp,
        });

        expect(result.current.name).toEqual('useQuery');
        expect(result.current.age).toEqual(undefined);
    });
});
