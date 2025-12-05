this travel guide is a Scriptable code for an iOS widget that uses information from the equalndex API to inform about the legal status in queer matters in different countries

### Prerequisites:
* an iOS device
* iCloud turned on

## Installation Guide
1. Download the free [Scriptable](https://scriptable.app) to your iPhone or iPad
2. Download the file equalndex.js and all eqx-files to the Scriptable folder in the Files (there should be already some sample files)
3. Edit your widget area and add the Scriptable widget to the screen (mid size)
4. Edit the widget and choose "equalndex"

## Usage
* the widget uses geo location and asks for it the first time it is used
* the widget uses the country code given as parameter in the widget properties, otherwise the current location
* when geo location is turned off or can't be provided and no parameter is given the widget uses the fall back location Germany
* for country codes see Country-Codes.json for reference
* when the widget is tapped the browser opens with more information about the country on [https://www.equaldex.com]
