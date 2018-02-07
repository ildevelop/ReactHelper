import {SET_CLIENTS , SET_PARTNERS} from './constant'

export const setClients =(clients) => ({type: SET_CLIENTS, payload: clients});
export const setPartners =(partners) => ({type: SET_PARTNERS, payload: partners});