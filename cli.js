#!/usr/bin/env node

import fetch from 'node-fetch';
import moment from 'moment-timezone';
import minimist from 'minimist';

const args = minimist(process.argv.slice(2));

const helpMessage = `
Usage: galosh.js [options] -[n|s] LATITUDE -[e|w] LONGITUDE -z TIME_ZONE
    -h            Show this help message and exit.
    -n, -s        Latitude: N positive; S negative.
    -e, -w        Longitude: E positive; W negative.
    -z            Time zone: uses tz.guess() from moment-timezone by default.
    -d 0-6        Day to retrieve weather: 0 is today; defaults to 1.
    -j            Echo pretty JSON from open-meteo API and exit.
`

if(args.h){
    console.log(helpMessage);
    process.exit(0);
}

const latitude = args.n || -args.s;
const longitude = args.e || -args.w;
const days = args.d != null ? args.d : 1;
const timezone = args.z || moment.tz.guess();

let url = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&timezone=${timezone}&daily=precipitation_hours`;
const response = await fetch(url);
const data = await response.json();

if(args.j) {
    console.log(data);
    process.exit(0);
}

let day_phrase;
if(days === 0) {
    day_phrase = `today`;
} else if(days > 1) {
    day_phrase = `in ${days} days`;
} else {
    day_phrase = `tomorrow`;
}

const precipitation_hours = data.daily.precipitation_hours[days];

if(precipitation_hours > 0) {
    console.log(`You might need your galoshes ${day_phrase}.\n`);
} else {
    console.log(`You probably won't need your galoshes ${day_phrase}.\n`);
}