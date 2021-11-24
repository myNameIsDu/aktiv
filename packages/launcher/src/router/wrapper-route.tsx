import { useEffect } from 'react';
import { useLocation, useResolvedPath, useNavigate } from 'react-router-dom';
interface WrapperRouteProps {
    children: JSX.Element;
    title?: string;
    redirect?: string;
}
function WrapperRoute({ children, title, redirect }: WrapperRouteProps): JSX.Element {
    const { pathname: currentRouteAbsolutePath } = useResolvedPath('.');
    const { pathname } = useLocation();
    const navigate = useNavigate();

    useEffect(() => {
        if (title) {
            document.title = title;
        }
        if (pathname === currentRouteAbsolutePath && redirect) {
            navigate(redirect);
        }
    }, [currentRouteAbsolutePath, navigate, pathname, redirect, title]);

    return children;
}

export default WrapperRoute;
