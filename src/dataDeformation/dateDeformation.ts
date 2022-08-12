import { subscribeData } from "../api/longPoll";
import { singleData } from "../indexedb/dbType";

export type singleDataObject = {
    [uuid:string]:singleData[]
}

export function subscribeDataToSingleData(data:subscribeData):singleDataObject{
    const res:singleDataObject = {};
    //数据初始化
    for(const key in data){
        res[key] = [];
    }

    //对象
    for(const key in data){
        const dataArr = data[key];
        dataArr.sort((a,b) => {
            return a.time - b.time
        })
        if(!dataArr.length)continue;
        let time = dataArr[0].time;

        let messageArr = [{
            uuid:+key,
            message:dataArr[0].message
        }];

        for(let i = 1;i < dataArr.length;i ++){
            if(dataArr[i].time - time < 3 * 1000 * 60){
                messageArr.push({
                    uuid:+key,
                    message:dataArr[i].message
                });
            }else{
                res[key].push({
                    time,
                    message:messageArr,
                })
                time = dataArr[i].time;
                messageArr = [{
                    uuid:+key,
                    message:dataArr[i].message
                }];
            }
        }
        res[key].push({
            time,
            message:messageArr,
        })
    }

    return res
}