export default {
    state:{
        mainTheme:'light',
        positionFinish:false,
    },
    mutations:{
        setMainTheme(state , val){
            state.mainTheme = val
        },
        setPositionFinish(state , val){
            state.positionFinish = val
        }
    }
}