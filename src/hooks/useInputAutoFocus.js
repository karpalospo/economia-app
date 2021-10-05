import { useFocusEffect } from "@react-navigation/native";
import { useEffect, useCallback } from "react"

export const useInputAutoFocus = (ref, useScreenFocus = false, delay = 500) => {
    useEffect(() => {
        focusReferencedInput(ref);
    }, [ref])

    if(useScreenFocus) {
        useFocusEffect(
            useCallback(() => {
              focusReferencedInput(ref);
            }, [ref])
        );
    }

    const focusReferencedInput = (ref) => {
        if(ref.current && ref.current.focus) {
            setTimeout(() => {
                ref.current.focus();
            }, delay);
        }
    }
}