import { StyleSheet } from "react-native"

export const COLORS = {
    mainBlue: "#1B42CB",
    red: "#E12D2D",
    mainText: "#545D62",
    blueText: "#0062AE",
    border: "#ddd",
    green: "#04B100"
}

export const styles = StyleSheet.create({

    main: {flex: 1},
    input: {width:"100%", height: 56, backgroundColor: "#ffffff", marginVertical:7, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 18, fontFamily: "rns", fontSize: 18, borderColor:"#ccc", borderWidth: 1},
    row: {flexDirection:"row", alignItems:"center", justifyContent: "space-between"},
    rowCenter: {flexDirection:"row", alignItems:"center", justifyContent: "center"},
    rowLeft: {flexDirection:"row", alignItems:"center", justifyContent: "flex-start"},
    rowRight: {flexDirection:"row", alignItems:"center", justifyContent: "flex-end"}
})