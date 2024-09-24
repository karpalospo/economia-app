import { StatusBar, Platform  } from "react-native"

export const COLORS = {
    mainBlue: "#1B42CB",
    red: "#E12D2D",
    mainText: "#545D62",
    blueText: "#0062AE",
    border: "#ddd",
    green: "#04B100"
}

export const styles = {
    container: {
        flex: 1, 
        backgroundColor: "white", 
        paddingBottom: Platform.OS == "ios" ? 15 : 0, 
        paddingTop: Platform.OS == "ios" ? StatusBar.currentHeight + 40 + 10 : 5
    },
    containerTrans: {
        flex: 1, 
        alignItems: 'center', 
        justifyContent: 'center', 
        backgroundColor: 'rgba(10,10,40,0.8)', 
        paddingHorizontal:20
    },
    main: {flex: 1},
    input: {width:"100%", height: 56, backgroundColor: "#ffffff", marginVertical:7, borderRadius: 10, paddingHorizontal: 15, paddingVertical: 18, fontFamily: "rns", fontSize: 18, borderColor:"#ccc", borderWidth: 1},
    row: {flexDirection:"row", alignItems:"center", justifyContent: "space-between"},
    rowCenter: {flexDirection:"row", alignItems:"center", justifyContent: "center"},
    rowLeft: {flexDirection:"row", alignItems:"center", justifyContent: "flex-start"},
    rowRight: {flexDirection:"row", alignItems:"center", justifyContent: "flex-end"},
    h2: {
        textAlign:"center",
        color:"#222",
        fontSize: 21,
        fontFamily: "Tommy",
        paddingHorizontal:10,

    },

    h4: {
        textAlign:"left",
        color:"#333",
        fontSize: 18,
        fontFamily: "Tommy",
        paddingHorizontal:5,

    },
}