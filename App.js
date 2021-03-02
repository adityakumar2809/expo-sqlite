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

const db = SQLite.openDatabase('db.db');

function Items({ done: doneHeading, onPressItem }) {
	const [items, setItems] = useState(null);

	useEffect(() => {
		db.transaction(tx => {
			tx.executeSql(
				`select * from items where done = ?;`,
				[doneHeading ? 1 : 0],
				(_, { rows: { _array } }) => setItems(_array)
			);
		});
	}, []);

	const heading = doneHeading ? 'Completed' : 'Todo';

	if (items === null || items.length === 0) {
		return null;
	}

	return (
		<View style={styles.sectionContainer}>
			<Text style={styles.sectionHeading}>{heading}</Text>
			{items.map(({ id, done, value }) => (
				<TouchableOpacity
					key={id}
					onPress={() => onPressItem && onPressItem(id)}
					style={{
						backgroundColor: done ? '#1c9963' : '#fff',
						borderColor: '#000',
						borderWidth: 1,
						padding: 8
					}}
				>
					<Text style={{ color: done ? '#fff' : '#000' }}>
						{value}
					</Text>
				</TouchableOpacity>
			))}
		</View>
	);
}


export default function App() {

	const [text, setText] = useState('');
	const [forceUpdate, forceUpdateId] = useForceUpdate();

	const addData = (text) => {
		if (text === null || text === '') {
			return false;
		}

		db.transaction(
			tx => {
				tx.executeSql(
					'insert into items (done, value) values (0, ?)',
					[text]
				);
				tx.executeSql('select * from items', [], (_, { rows }) =>
					console.log(JSON.stringify(rows))
				);
			},
			null,
			forceUpdate
		);
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

			<ScrollView style={styles.listArea}>
				<Items
					key={`forceupdate-todo-${forceUpdateId}`}
					done={false}
					onPressItem={id =>
						db.transaction(
							tx => {
								tx.executeSql(`update items set done = 1 where id = ?;`, [
									id
								]);
							},
							null,
							forceUpdate
						)
					}
				/>
				<Items
					done
					key={`forceupdate-done-${forceUpdateId}`}
					onPressItem={id =>
						db.transaction(
							tx => {
								tx.executeSql(`delete from items where id = ?;`, [id]);
							},
							null,
							forceUpdate
						)
					}
				/>
			</ScrollView>

		</View>
	);
}

function useForceUpdate() {
	const [value, setValue] = useState(0);
	return [() => setValue(value + 1), value];
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
