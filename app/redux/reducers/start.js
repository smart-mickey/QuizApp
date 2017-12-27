import createReducer from '../createReducer'
import * as types from '../actions/types'


export const appState = createReducer('',{
    [types.WELCOME](state, action){
        return 'WELCOME';
    }
})

