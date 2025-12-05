// Variables used by Scriptable.
// These must be at the very top of the file. Do not edit.
// icon-color: orange; icon-glyph: transgender-alt;
let isoCountryCode = args.widgetParameter
if (isoCountryCode == null ||isoCountryCode.length != 2){
    isoCountryCode = await getLocation();
    if (!isoCountryCode){
        isoCountryCode = "DE"
    }    
} 

let apiResponse = await loadItems(isoCountryCode);
const displayDataHomosexuality = 
convertData("homosexuality",apiResponse.issues.homosexuality.current_status.value)
const displayDataHateCrime = 
convertData("hate_crime_protection",apiResponse.issues["hate-crime-protections"].current_status.value)
const displayDataDiscrimination =
convertData("discrimination",apiResponse.issues.discrimination.current_status.value)
const displayDataCensorship =
convertData("censorship",apiResponse.issues.censorship.current_status.value)


let widget = new ListWidget()
let padding = 20
widget.setPadding(padding, padding, padding, padding)
widget.url = "https://www.equaldex.com/region/"+apiResponse.name.toLocaleLowerCase();

let header = widget.addText("🏳️‍🌈 equalndex 🏳️‍⚧️");
header.font = Font.mediumSystemFont(12);
let subheader = widget.addText(apiResponse.name+" - Equality Index: "+apiResponse.ei.toString());
subheader.font = Font.mediumSystemFont(10);
widget.addSpacer(5)

let mainStack = widget.addStack()

let leftStack = mainStack.addStack()
leftStack.layoutVertically();
addDataView(
    leftStack, 
    "Homosexuality",
    displayDataHomosexuality.displayName , 
    apiResponse.issues.homosexuality.current_status.start_date_formatted,
    displayDataHomosexuality.colorCode);
leftStack.addSpacer(5)

addDataView(
    leftStack, 
    "Censorship",
    displayDataCensorship.displayName,
    apiResponse.issues.censorship.current_status.start_date_formatted,
    displayDataCensorship.colorCode);
mainStack.addSpacer()
mainStack.addSpacer(10)

let rightStack = mainStack.addStack()
rightStack.layoutVertically()

addDataView(
    rightStack, 
    "Discrimination",
    displayDataDiscrimination.displayName,
    apiResponse.issues.discrimination.current_status.start_date_formatted,
    displayDataDiscrimination.colorCode);
rightStack.addSpacer(5)

addDataView(
    rightStack, 
    "Hate Crime Protection",
    displayDataHateCrime.displayName,
    apiResponse.issues["hate-crime-protections"].current_status.start_date_formatted,
    displayDataHateCrime.colorCode);
widget.addSpacer(10)

// // 
// let sub = widget.addText("Equality Index: "+apiResponse.ei.toString())// 
// sub.font = Font.systemFont(10)

if (!config.runsInWidget) widget.presentMedium()

Script.setWidget(widget)
Script.complete()

function addDataView(stack, header, body, footer, colorCode) {
  let viewStack = stack.addStack();
  viewStack.layoutVertically();

  let label = viewStack.addText(header);
  label.font = Font.mediumSystemFont(12);
  
  let value = viewStack.addText(body);
  value.font = Font.mediumSystemFont(16);
  value.textColor = colorForString(colorCode);
  
  if (footer != undefined) {
    let footnote = viewStack.addText("since "+footer);
    footnote.font = Font.mediumSystemFont(10);
  } 
}

async function loadItems(isoCountryCode) {
  let url =
    "https://www.equaldex.com/api/region?regionid="+isoCountryCode+"&formatted=true&apiKey=fc156c9da04ec9f557bc17b8460c6d9133f8a5bf";
  let req = new Request(url);
  req.allowInsecureRequest = true;
  let res = await req.loadString();
  res = res.replace("<pre>", "");
  res = res.replace("</pre>", "");
  let json = JSON.parse(res)
  console.log(res);
  return json.regions.region;
}


async function getLocation(){
    var today = new Date();
    // Set up the file manager local or iCloud.
    const files = FileManager.iCloud()

    // Set up the location logic.
    const locationPath = files.joinPath(files.documentsDirectory(), "eqx_current_location")

    //Define Location
    const LocationCacheExists = files.fileExists(locationPath)
    const LocationCacheDate = LocationCacheExists ? files.modificationDate(locationPath) : 0
    try {
        // If cache exists and it’s been less than 1 day since last request, use cached data.
        let isoCountryCode;
        if (LocationCacheExists && (today.getTime() - LocationCacheDate.getTime()) < (60 * 1440 * 1000)){
            console.log("Get your location from the cache")
            isoCountryCode = files.readString(locationPath);
            return isoCountryCode;
        } else {
            Location.setAccuracyToHundredMeters()
            console.log("Get your location and write to cache")
            const currentLoc = await Location.current()
            const locString = await Location.reverseGeocode(currentLoc.latitude, currentLoc.longitude, "en-us");
            isoCountryCode = locString[0].isoCountryCode;
            files.writeString(locationPath, isoCountryCode)
            return isoCountryCode;
        }
    } catch (e) {
        console.log(e)
    }
}

function readFile(fileName){
 	const files = FileManager.iCloud();
  	const path = files.joinPath(files.documentsDirectory(), "eqx_"+fileName+".json");
  	const result = files.readString(path);
	const json = JSON.parse(result)
	return json;
}

function convertData(issue,value){
    let fileData = readFile(issue)
    var filteredData = fileData.filter(obj => {
  		return obj.name === value
	})
    console.log(filteredData[0]);
    return filteredData[0];
}

function colorForString(colorCode) {
    if (colorCode == 1){
        return Color.green();   
    }
    if (colorCode == 2||colorCode == 3||colorCode == 4){
        return Color.yellow();   
    }
    if (colorCode == 5||colorCode == 6||colorCode == 7){
        return Color.red();   
    }
    if (colorCode == 99){
        return Color.lightGray();   
    }
    if (colorCode == 0){
        return Color.white();   
    }  
}