import { useEffect } from "react"
import { addsingle, singleOpenCursor } from "../../indexedb"


export default function(){
    // useEffect(() => {
    //     (async function() {
    //         await addsingle(2,{
    //             time:new Date().getTime(),
    //             message:[''],
    //         })
    //         await addsingle(3,{
    //             time:new Date().getTime(),
    //             message:[''],
    //         })
    //         await addsingle(2,{
    //             time:new Date().getTime(),
    //             message:[''],
    //         })
    //         await addsingle(3,{
    //             time:new Date().getTime(),
    //             message:[''],
    //         })
    //         await addsingle(2,{
    //             time:new Date().getTime(),
    //             message:[''],
    //         })

    //         const cursor =await singleOpenCursor(3);
    //         if(cursor)
    //         console.log(await cursor())
    //     })()
    // })
    return (<div>单聊页</div>)
}