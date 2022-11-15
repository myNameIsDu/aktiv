import { useNavigate } from 'react-launcher';
import './index.less';

function Main() {
    const navigate = useNavigate();

    return (
        <div className="main-page">
            <h3>hello 欢迎使用ak，点击按钮跳转about页面</h3>
            <button
                onClick={() => {
                    navigate('/about');
                }}
            >
                go to about
            </button>
        </div>
    );
}
export default Main;
