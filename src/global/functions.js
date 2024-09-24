import { View, Text } from 'react-native';

import moment from "moment";
import 'moment/min/moment-with-locales' 


export const format_date = (type, date) => {
    switch(type) {
        case "short": return moment(date).format("MMM DD")
        case "compact": return moment(date).format("YYYY-MM-DD")
        case "compact2": return moment(date).format("DD/MM/YYYY")
        case "compact2+time": return moment(date).format("DD/MM/YYYY [a las] h:mm a")
        case "normal": return moment(date).format("dddd, DD [de] MMMM [de] YYYY")
        case "normal+time": return moment(date).format("dddd, DD [de] MMMM [de] YYYY [a las] h:mm a")
        case "fromnow": return moment(moment(date)).fromNow(true)
    }
}

export const CapitalizeWord = (word) => 
{
    if(!word)
    {
        return ''
    }

    return word.charAt(0).toUpperCase() + word.toLowerCase().slice(1)
}

export const CapitalizeWords = (text) => 
{
    if(!text)
    {
        return ''
    }

    let words = text.trim().split(' ');
    let finalText = '';
    for (let index = 0; index < words.length; index++) {
        finalText += CapitalizeWord(words[index]) + ' ';
    }

    return finalText.trim()
}


export const f = (number, {currencyPrefix = '$', currencySuffix = '', decimalCount = 0, decimal = ",", thousands = "."} = {} ) => {

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = number < 0 ? "-" : "";
    
        let i = parseInt(number = Math.abs(Number(number) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return `${currencyPrefix}${negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(number - i).toFixed(decimalCount).slice(2) : "")}${currencySuffix}`;
    } catch (e) {
        return '0';
    }

}






export const IsExcludedCategory = (categoryId) =>
{
    return (
        categoryId === "0100101" || // Medicamentos
        categoryId === "0100104" ||
        categoryId === "0200809" // Formulas infantiles
    )
}

export const shortName = (data) => {
    let ret = data.nombres + " " + data.apellidos
    let nombres = data.nombres.split(" ")
    let apellidos = data.apellidos.split(" ")
    if(nombres.length > 0) ret = nombres[0] + data.apellidos
    if(nombres.length > 0 && apellidos.length > 0) ret = nombres[0] + " " + apellidos[0]
    return ret
}

export const FormatCurrency = (number, {currencyPrefix = '$', currencySuffix = '', decimalCount = 0, decimal = ",", thousands = "."} = {} ) => {

    try {
        decimalCount = Math.abs(decimalCount);
        decimalCount = isNaN(decimalCount) ? 2 : decimalCount;
    
        const negativeSign = number < 0 ? "-" : "";
    
        let i = parseInt(number = Math.abs(Number(number) || 0).toFixed(decimalCount)).toString();
        let j = (i.length > 3) ? i.length % 3 : 0;
    
        return `${currencyPrefix}${negativeSign + (j ? i.substr(0, j) + thousands : '') + i.substr(j).replace(/(\d{3})(?=\d)/g, "$1" + thousands) + (decimalCount ? decimal + Math.abs(number - i).toFixed(decimalCount).slice(2) : "")}${currencySuffix}`;
    } catch (e) {
        return '0';
    }

}

export const Arrayfy = (obj) => {
    let arr = []
    Object.keys(obj).forEach(key => arr.push(obj[key]))
    return arr
}


export const sortByKey = (data, key, sort) => {
    if(!data) return
    if(sort == "desc") return data.sort((a,b) => (a[key] > b[key]) ? -1 : ((b[key] > a[key]) ? 1 : 0));
    else return data.sort((a,b) => (a[key] > b[key]) ? 1 : ((b[key] > a[key]) ? -1 : 0));
}

export const sortOnDesc = function(arr, args) { 
  let dup = [...arr], props, prop;
  return dup.sort(function(a, b)
  {
      props = args.slice()
      prop = props.shift()
      while(a[prop] == b[prop] && props.length) prop = props.shift()
      return a[prop] == b[prop] ? 0 : a[prop] < b[prop] ? 1 : -1
  })
}


export const toastConfig = {
	/*
	  Overwrite 'success' type,
	  by modifying the existing `BaseToast` component
	*/
	success: (props) => (
	  <BaseToast
		{...props}
		style={{ borderLeftColor: 'pink' }}
		contentContainerStyle={{ paddingHorizontal: 15 }}
		text1Style={{
		  fontSize: 15,
		  fontWeight: '400'
		}}
	  />
	),
	/*
	  Overwrite 'error' type,
	  by modifying the existing `ErrorToast` component
	*/
	error: (props) => (
	  <ErrorToast
		{...props}
		text1Style={{
		  fontSize: 17
		}}
		text2Style={{
		  fontSize: 15
		}}
	  />
	),

	tomatoToast: ({ text1, props }) => {

    return (
      <View style={{ width: '100%', padding:20 }}>
        <View style={{backgroundColor:"yellow", padding:15, borderRadius:15}}>
          <Text>{text1}</Text>
          <Text>{props.uuid}wwe</Text>
        </View>
      </View>
    )
  }
}

export const uploadFile = async (fileurl, name, size, complete = () => {}, progress = () => {}, error = () => {}) => {

    const uploadUrl = "https://staticimperacore.net/atlantic/ttasuabywyaianuisuqisaaa.php"


    const getMimeType = (ext) => {
        // mime type mapping for few of the sample file types
        switch (ext) {
          case 'pdf': return 'application/pdf';
          case 'jpg': return 'image/jpg';
          case 'jpeg': return 'image/jpeg';
          case 'png': return 'image/png';
        }
    }

    const xhr = new XMLHttpRequest();

    xhr.open('POST', uploadUrl);
 
    xhr.onload = () => {
        complete(JSON.parse(xhr.response))
    };

    xhr.onerror = e => {
        error(e, 'upload failed');
    };

    xhr.ontimeout = e => {
        error(e, 'timeout');
    };

    const formData = new FormData();

    let re = /(?:\.([^.]+))?$/, ext = re.exec(name)[1];

    //formData.append('filetoupload', { uri: fileurl, name, type: getMimeType(re.exec(name)[1]) });
    //const res = await API.POST.upload(formData)

    formData.append('subir_archivo', {
        uri: fileurl,
        type: "image/jpg",
        name: "upload.jpg",
    });

    xhr.send(formData)

    if (xhr.upload) {
        xhr.upload.onprogress = ({ total, loaded }) => {
            progress(loaded / total)
        };
    }

}