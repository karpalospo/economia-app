import React, {useState, useEffect} from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image, Modal } from "react-native";
import { COLORS, FONTS } from "../../utils/constants";
import CustomDropdown from "../dropdown/CustomDropdown";

export const CustomDatePicker = props =>
{
    const {maxDate = new Date(), onChangeDate} = props

    const [days, ] = useState(s => {
        let arr = []
        for (let index = 1; index < 32; index++) arr.push({id: index, name: index})
        return arr
    })

    const [months, ] = useState([{id: 1, name: 'Enero'}, {id: 2, name: 'Febrero'}, {id: 3, name: 'Marzo'}, {id: 4, name: 'Abril'}, {id: 5, name: 'Mayo'}, {id: 6, name: 'Junio'}, {id: 7, name: 'Julio'}, {id: 8, name: 'Agosto'}, {id: 9, name: 'Septiembre'}, {id: 10, name: 'Octubre'}, {id: 11, name: 'Noviembre'}, {id: 12, name: 'Diciembre'}])

    const [years, ] = useState(s => {
        let arr = []
        for (let index = maxDate.getFullYear(); index >= 1900; index--) arr.push({id: index, name: index})
        return arr
    })

    const [day, setDay] = useState(0)
    const [month, setMonth] = useState(0)
    const [year, setYear] = useState(0)
    
    const [dayModalVisible, setDayModalVisible] = useState(false)
    const [monthModalVisible, setMonthModalVisible] = useState(false)
    const [yearModalVisible, setYearModalVisible] = useState(false)

    useEffect(() => {
        onChangeDate(`${years[year].name}-${(months[month].id < 10 ? '0' : '') + months[month].id.toString()}-${days[day].name}`)
    }, [])
    
    const onSelectDay = (day) =>
    {
        setDay(day)
        setDayModalVisible(false)
        onChangeDate(`${years[year].name}-${(months[month].id < 10 ? '0' : '') + months[month].id.toString()}-${days[day].name}`)
    }

    const onSelectMonth = (month) =>
    {
        setMonth(month)
        setMonthModalVisible(false)
        onChangeDate(`${years[year].name}-${(months[month].id < 10 ? '0' : '') + months[month].id.toString()}-${days[day].name}`)
    }

    const onSelectYear = (year) =>
    {
        setYear(year)
        setYearModalVisible(false)
        onChangeDate(`${years[year].name}-${(months[month].id < 10 ? '0' : '') + months[month].id.toString()}-${days[day].name}`)
    }

    return (
        <View style = {{width: '100%', flexDirection: 'row', alignItems: 'center' }}>

            {/* Day */}
            <TouchableOpacity style={{ width: '20%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}
            onPress={() => setDayModalVisible(true)}>

                <Text style={styles.dateText}>
                    {days[day].name}
                </Text>
                <Image style={styles.dateImage} source={require('../../../assets/icons/dropdown_arrow.png')} resizeMode='contain' />

            </TouchableOpacity> 

            {/* Day modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={dayModalVisible}
                onRequestClose={() => { }}
            >
                <CustomDropdown hideFirstElement={false} title='Día' selectedElement={day} data={days} itemFormat='none' onSelectElement={onSelectDay.bind(this)} />
            </Modal>


            {/* Month */}
            <TouchableOpacity style={{ width: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}
            onPress={() => setMonthModalVisible(true)}>

                <Text style={styles.dateText}>
                    {months[month].name}
                </Text>
                <Image style={styles.dateImage} source={require('../../../assets/icons/dropdown_arrow.png')} resizeMode='contain' />

            </TouchableOpacity> 

            {/* Month modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={monthModalVisible}
                onRequestClose={() => { }}
            >
                <CustomDropdown hideFirstElement={false} title='Mes' selectedElement={month} data={months} itemFormat='none' onSelectElement={onSelectMonth.bind(this)} />
            </Modal>

            {/* Year */}
            <TouchableOpacity style={{ width: '40%', flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 10}}
            onPress={() => setYearModalVisible(true)}>

                <Text style={styles.dateText}>
                    {years[year].name}
                </Text>
                <Image style={styles.dateImage} source={require('../../../assets/icons/dropdown_arrow.png')} resizeMode='contain' />

            </TouchableOpacity> 

            {/* Year modal */}
            <Modal
                animationType="slide"
                transparent={false}
                visible={yearModalVisible}
                onRequestClose={() => { }}
            >
                <CustomDropdown hideFirstElement={false} title='Año' selectedElement={year} data={years} itemFormat='none' onSelectElement={onSelectYear.bind(this)} />
            </Modal>


        </View>
    )
}

const styles = StyleSheet.create({
    dateText: { color: COLORS._A5A5A5, backgroundColor: COLORS._FFFFFF, fontSize: 18, fontFamily: FONTS.REGULAR },
    dateImage: {width: 10, height: 10}
})