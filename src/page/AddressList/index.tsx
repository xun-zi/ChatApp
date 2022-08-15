import { List, Image } from "antd-mobile";
import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { getFriendPeresonData } from "../../api";
import { friendData } from "../../indexedb/dbType";
import { accountSlice } from "../../store/accountSlice";


const users = [
    {
        avatar:
            'https://images.unsplash.com/photo-1548532928-b34e3be62fc6?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Novalee Spicer',
        description: 'Deserunt dolor ea eaque eos',
    },
    {
        avatar:
            'https://images.unsplash.com/photo-1493666438817-866a91353ca9?ixlib=rb-0.3.5&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&s=b616b2c5b373a80ffc9636ba24f7a4a9',
        name: 'Sara Koivisto',
        description: 'Animi eius expedita, explicabo',
    },
    {
        avatar:
            'https://images.unsplash.com/photo-1542624937-8d1e9f53c1b9?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Marco Gregg',
        description: 'Ab animi cumque eveniet ex harum nam odio omnis',
    },
    {
        avatar:
            'https://images.unsplash.com/photo-1546967191-fdfb13ed6b1e?ixlib=rb-1.2.1&q=80&fm=jpg&crop=faces&fit=crop&h=200&w=200&ixid=eyJhcHBfaWQiOjE3Nzg0fQ',
        name: 'Edith Koenig',
        description: 'Commodi earum exercitationem id numquam vitae',
    },
]

export default function (): React.ReactElement {

    const { username } = useSelector((state: any) => state.account)

    const navigate = useNavigate();

    const [data, setData] = useState<friendData[]>([]);

    useEffect(() => {
        getFriendPeresonData(username).then(data => {
            setData(data)
        })
    }, [])

    const handle = (id: string) => {
        navigate(`/singleChat?id=${id}`)
    }
    console.log(data);
    return (
        <div>
            {data.map(user => {

               return (<div onClick={() => {
                    handle(user.uuid + '')
                }}
                key={user.uuid}
                >
                    <List >
                        <List.Item
                            key={user.uuid}
                            prefix={
                                <Image
                                    src={user.picture}
                                    style={{ borderRadius: 5 }}
                                    fit='cover'
                                    width={40}
                                    height={40}
                                />
                            }
                        >
                            {user.userName}
                        </List.Item>
                    </List>
                </div>)


            })}
        </div>
    )


}