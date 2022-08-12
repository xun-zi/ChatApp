import { NavBar, Space } from "antd-mobile";
import { AddCircleOutline, MoreOutline } from "antd-mobile-icons";
import { Suspense } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import Navigation from "../../components/Navigation/Navigation";


const TopNavigation = ({tittle}:{tittle:string}) => {
    const navigate = useNavigate();
    const right = (
        <div style={{ fontSize: 24 }}>
            <Space style={{ '--gap': '16px' }}>
                <AddCircleOutline />
            </Space>
        </div>
    )

    const back = () => {
        navigate('/message');
    }


    return (<NavBar right={right} onBack={back} backArrow={false}>
        {tittle}
    </NavBar>)
}

const map:any = {
    ['/message']:'微信',
    ['/addressList']:'通讯录',
    ['/find']:'发现',
}


export default function () {
    const location = useLocation();
    const {pathname} = location;
    return (
        
        <div className='layout'>
            <TopNavigation tittle={map[pathname] || ''}/>
            <div style={{ flex: '1', overflow: 'auto' }}>
                <Suspense fallback={null}>
                    <Outlet />
                </Suspense>
            </div>
        <Navigation />
        </div>
    )
}