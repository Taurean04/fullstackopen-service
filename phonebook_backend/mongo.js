/* eslint-disable no-undef */
const mongoose = require('mongoose');

// eslint-disable-next-line no-undef
if(process.argv.length < 3){
	console.log('Please provide the password as an argument: node mongo.js <password>');
	// eslint-disable-next-line no-undef
	process.exit(1);
}

// eslint-disable-next-line no-undef
const password = process.argv[2];
let name, number;

const url = `mongodb+srv://root:${password}@cluster0.1ud5r.mongodb.net/phonebook-app?retryWrites=true&w=majority`;

mongoose.connect(url).catch(e => console.log(e));

const personSchema = new mongoose.Schema({
	name: String,
	number: String
});

const Person = mongoose.model('Person', personSchema);

if(process.argv.length > 3) {
	name = process.argv[3];
	number = process.argv[4];

	const person = new Person({ name, number });

	person.save().then(() => {
		console.log(`Added ${name} number ${number} to  phonebook`);
		mongoose.connection.close();
	});
}else {
	Person.find({}).then(res => {
		console.log('phonebook:');
		res.forEach(person => {
			console.log(person);
		});
		mongoose.connection.close();
	});
}