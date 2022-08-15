import { NavBar, Space, Toast } from "antd-mobile";
import { MoreOutline, SearchOutline } from "antd-mobile-icons";
import { useNavigate } from "react-router-dom";


export default function ({tittle}:{tittle:string}) {
    const navigate = useNavigate();
    const right = (
        <div style={{ fontSize: 24 }}>
          <Space style={{ '--gap': '16px' }}>
            <MoreOutline />
          </Space>
        </div>
      )
    
      const back = () => {
        navigate('/message');
        
      }
        
    
    return (<NavBar right={right} onBack={back}>
        {tittle}
      </NavBar>)
}