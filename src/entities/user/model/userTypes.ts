import { ILot } from "../../lots/model/lotsTypes"

export type IUser = {
    name: string,
    avatar: string,
    company: string,
    role: string,
    id: string
}

export type ITradingMember = {
    name: string,
    avatar: string,
    company: string,
    role: string,
    id: string,
    lot: ILot
}