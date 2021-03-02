import React, { useState, useEffect } from 'react';
import {
	StyleSheet,
	Text,
	View,
	ScrollView,
	TextInput,
	TouchableOpacity
} from 'react-native';
import Constants from 'expo-constants';
import * as SQLite from 'expo-sqlite';

export default function App() {

	const [text, setText] = useState('');

	const addData = (text) => {
		if (text === null || text === '') {
			return false;
		}

		console.log(text);
	}

	return (
		<View style={styles.container}>

			<Text style={styles.heading}>
				Example Code of SQLite
      		</Text>

			<View style={styles.flexRow}>
				<TextInput
					onChangeText={(text) => {
						setText(text);
					}}
					onSubmitEditing={() => {
						addData(text);
						setText('');
					}}
					placeholder="Enter Command"
					style={styles.input}
					value={text}
				/>
			</View>

		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		backgroundColor: '#fff',
		flex: 1,
		paddingTop: Constants.statusBarHeight
	},
	heading: {
		fontSize: 20,
		fontWeight: 'bold',
		textAlign: 'center'
	},
	flexRow: {
		flexDirection: 'row'
	},
	input: {
		borderColor: '#4630eb',
		borderRadius: 4,
		borderWidth: 1,
		flex: 1,
		height: 48,
		margin: 16,
		padding: 8
	},
	listArea: {
		backgroundColor: '#f0f0f0',
		flex: 1,
		paddingTop: 16
	},
	sectionContainer: {
		marginBottom: 16,
		marginHorizontal: 16
	},
	sectionHeading: {
		fontSize: 18,
		marginBottom: 8
	}
});
