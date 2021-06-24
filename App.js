import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  Button,
  TouchableHighlight,
} from 'react-native';

import Voice from '@react-native-voice/voice';
import MapView, { Marker, PROVIDER_GOOGLE, Callout, Circle } from 'react-native-maps';
import GetLocation from 'react-native-get-location'
import { mapStyle, MapStyle } from './MapStyle';
import MapViewDirections from 'react-native-maps-directions';
import { userData } from './UserData';
import { placeData } from './PlaceData';

const GOOGLE_MAPS_KEY = 'AIzaSyC7yu-Mc7G5V5V3pWF8vdg_lNWDgrRGj24';
const origin = {latitude:  16.020315023511138, longitude:  108.20362607172203};
const destination = {latitude:  16.015330623479212, longitude:  108.21743038031865};


const places = [
  { placeName: "Hanoi", coord: { latitude: 21.022736, longitude: 105.801944 } },
  { placeName: "Ho Chi Minh", coord: { latitude: 10.734408, longitude: 106.705446 } },
  { placeName: "America", coord: { latitude: 46.492142, longitude: -120.552266 } },
  { placeName: "Australia", coord: { latitude: -23.039819, longitude: 144.504289 } }
]

const dangerAreas = [
	{latitude: 16.02031502351113, longitude:  108.20362607172, caseNumber: 100 },
	{latitude: 16.08271714986332,  longitude:  108.2210043131769, caseNumber: 500 },
	{latitude: 16.02031502351, longitude:  108.20362607172, caseNumber: 200 },
	{latitude: 16.105374, longitude:  108.225410, caseNumber: 10 },
	{latitude: 16.020315023511138, longitude:  108.20, caseNumber: 1000 },
]

const MAP_STYLE = mapStyle
const USER_DATA = userData
const PLACE_DATA = placeData

class App extends Component {
	state = {
		results: [],
		partialResults: [],
		coord: null,
		placeName: 'Home',
		text: '',
		isShowDirection: false,
		desLat: 15.9684863,
		desLong: 108.2583681
		
	};

	constructor(props) {
		super(props);
		Voice.onSpeechResults = this.onSpeechResults;
		Voice.onSpeechPartialResults = this.onSpeechPartialResults
		this.searchPlace.bind(this)

	}

	componentDidMount() {
		GetLocation.getCurrentPosition({
		enableHighAccuracy: true,
		timeout: 15000,
		})
		.then(location => {
			this.setState({ coord: location })
		})
		.catch(error => {
			alert('Bat dinh vi len')
		})
	}

	componentWillUnmount() {
		Voice.destroy().then(Voice.removeAllListeners);
	}

	onSpeechResults = (e) => {
		console.log('onSpeechResults: ', e);
		this.setState({
		results: e.value,
		}, () => {
		this.searchPlace(this.state.results)
		});
	};

	onSpeechPartialResults = (e) => {
		console.log('onSpeechPartialResults: ', e);
		this.setState({
		partialResults: e.value,
		});
	};

	_startRecognizing = async () => {
		this.setState({
		results: [],
		partialResults: [],
		});

		try {
		await Voice.start('en-US');
		} catch (e) {
		console.error(e);
		}
	};

	_destroyRecognizer = async () => {
		try {
		await Voice.destroy();
		} catch (e) {
		console.error(e);
		}
		this.setState({
		results: [],
		partialResults: [],
		});
	};

	searchPlace = (results) => {
		let coordi;
		let placeName
		results.map(result => {
		places.map(place => {
			if (result.includes(place.placeName)) {
			coordi = place.coord
			placeName = place.placeName
			}
		})
		})
		this.setState({ coord: coordi, placeName: placeName })
	}

	handleShowDirection = (latitude, longitude) => {
		this.setState({isShowDirection: true, desLat: latitude, desLong: longitude})
		
	}

	render() {
		return (
		<View style={styles.container}>
			<View style={{ position: 'absolute', zIndex: 1, bottom: 20, alignItems: 'center' }}>
			{this.state.coord ? <Text>{this.state.placeName}</Text> : <Text>CANT FIND</Text>}
			<TouchableHighlight onPress={this._startRecognizing}>
				<Image style={styles.button} source={require('./microphone.png')} />
			</TouchableHighlight>
			</View>

			<View style={{
				position: 'absolute',
				top: 20,
				zIndex: 1,
				width: "100%"
			}}>
				<TextInput
					style={styles.textinput}
					onChangeText={(text) => this.setState({text})}
					value={this.state.text}
					placeholder="Where you want to go?"
					
				/>
				<Button 
					title="search" 
					onPress={
						()=> PLACE_DATA.map(place => {
							if (place.placename === this.state.text && place.tag === "danger") alert(place.warning)
							if (place.placename === this.state.text && place.tag === "safe") this.handleShowDirection(place.coord.latitude, place.coord.longitude)
						}) 
					}
				/>
			</View>
			
			{/* {console.log(this.state.desLat, this.state.desLong)} */}

			<MapView
			provider={PROVIDER_GOOGLE}
			style={{ width: '100%', height: "100%" }}
			region={{
				latitude: this.state.coord ? this.state.coord.latitude : 15.9684863,
				longitude: this.state.coord ? this.state.coord.longitude : 108.2583681,
				latitudeDelta: 0.04,
				longitudeDelta: 0.0121,
			}}
			customMapStyle={MAP_STYLE}
			>
			<Marker
				coordinate={{
					latitude: this.state.coord ? this.state.coord.latitude : 15.9684863,
					longitude: this.state.coord ? this.state.coord.longitude : 108.2583681
				}}
				icon={require('./boy.png')}
				>
				<Callout>
				<View style={{}}>
					<Text style={{ color: "red", fontSize: 18 }}>Saway</Text>
					<Text><Image source={require('./microphone.png')} style={{ width: 50, height: 50 }} /></Text>
				</View>
				</Callout>
			</Marker>

			{USER_DATA.map((user, index) => (
				<Marker
					key={index}
					coordinate={{
						latitude: user.coordinate.latitude,
						longitude: user.coordinate.longitude
					}}
					icon={user.avatar}>
					<Callout>
						<View style={{}}>
							<Text style={{ color: "red", fontSize: 18 }}>{user.username}</Text>
							<Text>{user.caption}</Text>
						</View>
						</Callout>
				
				
				</Marker>
				// console.log(user.coordinate.longitude)
			))}


			{dangerAreas.map((area, index) => (
				<Circle
					key={index}
					center={{
						latitude: area.latitude,
						longitude: area.longitude,
					}}
					radius={area.caseNumber}
					strokeWidth={2}
					strokeColor={area.caseNumber < 200 ?" rgba(255, 255, 0, 0.55)" : "rgba(234, 42, 24, 0.83)"}
					fillColor={area.caseNumber < 200 ?" rgba(255, 255, 0, 0.15)" :  "rgba(234, 42, 42, 0.35)"}
					style={{ opacity: .5 }}
				/>
			))}
{/* 
			<MapViewDirections
				origin={{ 
					latitude:  15.9684863,
					longitude: 108.2583681
				}}
				destination={{
					latitude: 16.0744166,
            		longitude: 108.2218719,
				}}
				strokeWidth={3}
				strokeColor="red"
				apikey={GOOGLE_MAPS_KEY}
			/> */}

			{this.state.isShowDirection ? 
			(	<MapViewDirections
				origin={{ 
					latitude: this.state.coord ? this.state.coord.latitude : 15.9684863,
					longitude: this.state.coord ? this.state.coord.longitude : 108.2583681 }}
				destination={{
					latitude: this.state.desLat,
					longitude: this.state.desLong
				}}
				strokeWidth={3}
				strokeColor="red"
				apikey={GOOGLE_MAPS_KEY}

		 />)

		// console.log("abc: " +this.state.desLat, this.state.desLong)
			
			  : null	
		}

			</MapView>

		</View >
		);
	}
}

const styles = StyleSheet.create({
  button: {
    width: 50,
    height: 50,
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5FCFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  action: {
    textAlign: 'center',
    color: '#0000FF',
    marginVertical: 5,
    fontWeight: 'bold',
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
  stat: {
    textAlign: 'center',
    color: '#B0171F',
    marginBottom: 1,
  },
  textinput: {
	height: 40, 
	borderColor: 'gray',
	borderWidth: 1, 
	width: 200, 
	backgroundColor: "white",
	color: "black"
}
});

export default App;
