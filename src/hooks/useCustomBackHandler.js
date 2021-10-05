import { useEffect } from "react"
import { BackHandler } from "react-native";

export const useCustomBackHandler = ({
    // should prevent the back event?
    preventBackEvent = false,
    // callback that aims to add custom behavior on trigger back event   
    onBackPressed = () => { }
}) => {
    useEffect(() => {

        const backAction = () => {
            // TODO: this currently not working 
            onBackPressed();
            return preventBackEvent;
        };

        const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);

        return () => backHandler.remove();

    }, [])
}