import { type } from "os";

export type StoreData = [IDBDatabase,string];
export type MessageData = {
    uuid: number;
    time:number;
    message: string;
    bell: number;
}

export type friendData = {
    uuid:number;
    name:string;
    picture:string;
}

export type singleData = {
    time:number;
    message:string[];
}

export type singleDataNext = {
    index:number
    data:singleData
    next:number
}

export type singleDataHead = {
    index:number
    length:number
    [key:string|number]:number;
}