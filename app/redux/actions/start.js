import * as types from './types'


export const welcome = () => {
    return {
        type: types.WELCOME,
    }
}

export const getQuestions = (callback) => {
    return (dispatch, getState) => {
        fetch ('https://opentdb.com/api.php?amount=10&encode=url3986', {
            method: 'GET',
        })
        .then((data) => data.json())
        .then((res) => {
            callback(res.results)
        })
        .catch((e) => {
            alert(e.toString())
        });
    }
}