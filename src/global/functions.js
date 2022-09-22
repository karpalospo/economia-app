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

    console.log(fileurl)

    //formData.append('filetoupload', { uri: fileurl, name, type: getMimeType(re.exec(name)[1]) });
    //const res = await API.POST.upload(formData)
    //console.log(res)

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