import React, { Component } from 'react';
import {
  StyleSheet,
  Text,
  View,
  Image,
  TextInput,
  TouchableOpacity,
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


// const places = [
//   { placeName: "Hanoi", coord: { latitude: 21.022736, longitude: 105.801944 }, caption: "Hà Nội (chữ Hán: 河內) là thủ đô của nước Cộng hòa Xã hội chủ nghĩa Việt Nam, cũng là kinh đô của hầu hết các vương triều phong kiến tại Việt Nam trước đây." },
//   { placeName: "Ho Chi Minh", coord: { latitude: 10.734408, longitude: 106.705446 }, caption: "Thành phố Hồ Chí Minh (còn gọi là Sài Gòn) là thành phố lớn nhất tại Việt Nam về dân số và quy mô đô thị hóa. Đây còn là trung tâm kinh tế, chính trị, văn hóa và giáo dục tại Việt Nam. Thành phố Hồ Chí Minh là thành phố trực thuộc trung ương thuộc loại đô thị đặc biệt của Việt Nam cùng với thủ đô Hà Nội." },
//   { placeName: "America", coord: { latitude: 46.492142, longitude: -120.552266 }, caption: "Hợp chủng quốc Hoa Kỳ (tiếng Anh: United States of America; viết tắt U.S.A. hay USA), thường được gọi là Hoa Kỳ (tiếng Anh: United States; viết tắt U.S. hay US) hoặc Mỹ (tiếng Anh: America), là một quốc gia nằm chủ yếu ở Bắc Mỹ, bao gồm 50 tiểu bang, một đặc khu liên bang, năm vùng lãnh thổ chưa hợp nhất, 326 biệt khu thổ dân châu Mỹ và một số thuộc địa nhỏ." },
//   { placeName: "Australia", coord: { latitude: -23.039819, longitude: 144.504289 }, caption: "Úc hay Australia , tên gọi chính thức là Thịnh vượng chung Úc (tiếng Anh: Commonwealth of Australia ), là một quốc gia có chủ quyền bao gồm đại lục châu Úc, đảo Tasmania và các đảo khác nhỏ hơn. Đây là quốc gia lớn thứ 6 trên thế giới về diện tích." },
//   { placeName: "Mumbai", coord: { latitude: 19.07376175450274,  longitude: 72.87705774156781 }, caption: "Mumbai (tiếng Marathi: मुंबई Muṃbaī), trước đây được gọi là Bombay, là thủ phủ của bang Maharashtra, là thành phố đông dân nhất Ấn Độ, và theo một số cách tính toán là thành phố đông dân nhất thế giới với một dân số ước tính khoảng 22 triệu người (thời điểm năm 2019). Mumbai tọa lạc trên đảo Salsette, ngoài bờ tây của Maharashtra. Cùng với các ngoại ô xung quanh, nó tạo thành một vùng đô thị đông dân thứ 6 thế giới với dân số khoảng 20 triệu người." },
// ]

const places = [
	{ placeName: "Hanoi", coord: { latitude: 21.022736, longitude: 105.801944 } },
	{ placeName: "Ho Chi Minh", coord: { latitude: 10.734408, longitude: 106.705446 } },
	{ placeName: "America", coord: { latitude: 46.492142, longitude: -120.552266 } },
	{ placeName: "Australia", coord: { latitude: -23.039819, longitude: 144.504289 } },
	{ placeName: "Mumbai", coord: { latitude: 19.07376175450274,  longitude: 72.87705774156781 } }
  ]

const dangerAreas = [
	{latitude: 16.067270, longitude:  108.208891, caseNumber: 100 },
	{latitude: 16.046729, longitude:  108.227164, caseNumber: 150 },
	{latitude: 16.039201759805714, longitude:  108.21151865300047, caseNumber: 180 },
	{latitude: 16.08271714986332,  longitude:  108.2210043131769, caseNumber: 500 },
	{latitude: 16.02031502351, longitude:  108.20362607172, caseNumber: 200 },
	{latitude: 16.105374, longitude:  108.225410, caseNumber: 10 },
	{latitude: 16.063999,  longitude:  108.233972, caseNumber: 700 },
	{latitude: 16.056429880793218,  longitude:  108.23957908142329, caseNumber: 1000 },
]

const MAP_STYLE = MapStyle
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

	handleSearch = () => {
		console.log(this.state.text)
		PLACE_DATA.map(place => {
			if (place.placename === this.state.text && place.tag === "danger") alert(place.warning)
			if (place.placename === this.state.text && place.tag === "safe") this.handleShowDirection(place.coord.latitude, place.coord.longitude)
		})
	}

	render() {
		return (
		<View style={styles.container}>

			<View style={{ position: 'absolute', zIndex: 1, bottom: 30, alignItems: 'center' }}>
				{this.state.coord ? <Text style={styles.textstyle}>{this.state.placeName}</Text> : <Text style={styles.textstyle}>TALK TO TRAVEL</Text>}
				<TouchableHighlight
					style={{ width: 90, height: 90, borderRadius: 50, backgroundColor: "#FFC2C2", alignItems: 'center', justifyContent: 'center', marginTop: 10 }}
					onPress={this._startRecognizing}>
					<Image style={styles.button} source={require('./microphone.png')} resizeMode="center" />
				</TouchableHighlight>
			</View>

			<View style={{ width: "100%", position: "absolute", zIndex: 3, top: 25, alignItems: 'center' }}>
				<View style={{ flexDirection: "row", height: 60, width: "89%", justifyContent: 'space-between' }}>
					<TextInput
						style={styles.textInput}
						placeholder="Where you want to go?"
						placeholderTextColor="lightgray"
						onChangeText={(text) => this.setState({text})}
						value={this.state.text}
					/>
					<TouchableOpacity
						style={{ width: 60, height: 60, backgroundColor: "#FFEFA1", alignItems: "center", justifyContent: 'center', borderRadius: 10 }}
						onPress={this.handleSearch}	
					>
						<Image source={require('./search.png')} style={{ width: 25, height: 25 }} resizeMode="center" />
					</TouchableOpacity>
				</View>
			</View>
			
			<MapView
				provider={PROVIDER_GOOGLE}
				style={{ width: '100%', height: "100%" }}
				region={{
					latitude: this.state.coord ? this.state.coord.latitude : 15.6684863,
					longitude: this.state.coord ? this.state.coord.longitude : 108.2583681,
					latitudeDelta: 0.04,
					longitudeDelta: 0.0121,
				}}
				customMapStyle={MAP_STYLE}
			>
			<Marker
				coordinate={{
					latitude: this.state.coord ? this.state.coord.latitude : 15.6684863,
					longitude: this.state.coord ? this.state.coord.longitude : 108.2583681
				}}
				icon={require('./human.png')}
				>
				<Callout>
					<View style={{}}>
						<Text style={{fontSize: 16, fontFamily: "Efra" }}>Saway</Text>
						<Text style={{fontSize: 12, fontFamily: "Efra" }}>Saway xin chào!</Text>
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
							<Text style={{ fontSize: 16, fontFamily: "Efra" }}>{user.username}</Text>
							<Text style={{ fontSize: 12, fontFamily: "Efra", color: "gray" }}>{user.caption}</Text>
						</View>
						</Callout>
				</Marker>
			))}


			{dangerAreas.map((area, index) => (
				<View key={index} >
					{area.caseNumber <= 190 ? (
						<Circle
							key={index}
							center={{
								latitude: area.latitude,
								longitude: area.longitude,
							}}
							radius={area.caseNumber}
							strokeWidth={2}
							strokeColor="rgba(225, 243, 0, 1)"
							fillColor="rgba(225, 243, 0, 0.52)"

						/>	
					) : null}	

					{area.caseNumber >= 191 && area.caseNumber <= 500 ? ( 
						<Circle
							key={index}
							center={{
								latitude: area.latitude,
								longitude: area.longitude,
							}}
							radius={area.caseNumber}
							strokeWidth={2}
							strokeColor="rgba(255, 157, 0, 1)"
							fillColor="rgba(255, 157, 0, 0.51)"
						/>	
					) : null}

					{area.caseNumber > 500 ? (
						<Circle
							key={index}
							center={{
								latitude: area.latitude,
								longitude: area.longitude,
							}}
							radius={area.caseNumber}
							strokeWidth={2}
							strokeColor="rgba(250, 0, 0, 1)"
							fillColor="rgba(255, 0, 0, 0.5)"
						/>	
					) : null}
				</View>
			))}

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

		 	/>) : null	
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
	textInput: {
		width: "80%",
		paddingLeft: 25,
		fontSize: 18,
		paddingRight: 25,
		height: "100%",
		backgroundColor: "white",
		borderRadius: 10,
		fontFamily: "Efra",
		color: "black"
	},
	  textstyle: {
		fontFamily: "Efra",
		fontSize: 16,
		
	}
});

export default App;
