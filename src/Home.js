// Home.js

import React, { useState } from 'react';
import { Configuration } from "openai";
import './App.js';
import './home.css';

//OpenAI API configuration
const configuration = new Configuration({
    organization: process.env.REACT_APP_OPENAI_ORG_ID, // Organization ID
    apiKey: process.env.REACT_APP_OPENAI_API_KEY, // API key test
});

console.log(configuration.organization)
console.log(configuration.apiKey)

const Home = () => {
    const [skill, setSkill] = useState('');
    const [techList, setTechList] = useState('');
    // const [selectedSkills, setSelectedSkills] = useState([]);

    // Array for temperature options
    const temperatureOptions = [0, 0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1, 1.1, 1.2, 1.3, 1.4, 1.5, 1.6, 1.7, 1.8, 1.9, 2];
    const [selectedTemperature, setSelectedTemperature] = useState(temperatureOptions[0]);

    function handleTemperatureChange(event) {
        const selectedTemperatureValue = parseFloat(event.target.value);
        setSelectedTemperature(selectedTemperatureValue);
    }

    // Test function to handle item selection
    function handleItemClick(skill) {
        console.log('Selected skill:', skill);
    }

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Check for empty input
        if (!skill.trim()) {
            alert('Please enter a skill.');
            return;
        }

        // Check for numeric values
        if (!isNaN(skill)) {
            alert('Please enter a valid skill (text, not a number).');
            return;
        }

        try {
            const response = await fetch(
            // 'https://api.openai.com/v1/completions',
            'https://api.openai.com/v1/chat/completions',
            {
                //POST request
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${configuration.apiKey}`, //Authorization API key
                },
                //stringify the body of the request
                body: JSON.stringify({
                    // prompt: `Given the skill "${skill}", 
                    // Generate a list of general skills:,
                    // Do not accept any "${skill}" skills that are not related or null values,
                    // Sort the list of skills by relevance to "${skill} in alphabetical order`,
                    // temperature: selectedTemperature,
                    // n: 50,
                    // max_tokens: 4000,
                    model: "gpt-3.5-turbo",
                    messages: [
                        {
                            "role": "system",
                            "content": `Given the skill "${skill}", 
                                        Generate a list of general skills and sort them by alphabetical order,
                                        Do not accept any "${skill}" skills that are not related or null values,`,
                        },
                    ],
                    temperature: selectedTemperature,
                    max_tokens: 256,
                }),
            }
        );
        console.log(response)
        const data = await response.json();
        console.log('API Response:', data);
        // Check if choices array exists and has items
        if (data && data.choices && data.choices.length > 0) {
            const generatedTechList = data.choices[0].message.content;
            const techListAsArray = generatedTechList
            .split('\n') // split by new line
            .map((skill) => skill.trim()) // remove whitespace
            .filter((skill) => skill !== '') // remove empty lines
            .map((skill, index) => <li className="tech-list" key={index} onClick={() => handleItemClick(skill)}>{skill}</li>);

            setTechList(techListAsArray);
        } else {
            console.error('Error: Invalid API response data.');
        }

        } catch (error) {
            console.error('Error: Please use the correct input', error);
        }
    };
    return (
        <div className='Home'>
            {/* <Image src={logo} className="App-logo" alt="logo" /> */}
            <h1 className='home-heading'>Welcome to EdChat!</h1>
            <section className='intro-container'>
                <p className="intro-text">
                Welcome to our innovative web application, where you take the reins of your learning journey! Imagine having the power to effortlessly create a personalized list of soft skills that perfectly complement your unique set of technical abilities. Our platform puts you at the heart of the process, giving you full control over the skills that matter most.
                Here's how it works: You simply enter your technical skill, and watch as our cutting-edge technology, powered by OpenAI's GPT-3, works its magic. A meticulously crafted list of soft skills will be generated exclusively for you, carefully tailored to your skill level and relevance. Say goodbye to sifting through irrelevant information – our intelligent system filters out any extraneous details, ensuring that every skill suggested is meaningful to your development.
                For instance, let's say you're skilled in "Programming." With our application, you won't just receive any generic list – you'll receive a selection of soft skills that align perfectly with your expertise. It's like having a personal guide, always there to provide you with the most pertinent skills to enhance your professional journey.
                </p>
            </section>
            <form className="chat-input" onSubmit={handleSubmit}>
                <div className='input-text-container'>
                    <input
                    placeholder='Please enter skill'
                    value={skill}
                    onChange={(e) => setSkill(e.target.value)}
                    ></input>
                </div>
                    <input type="submit" value="Generate" />
                <div className="input-container">
                    <label htmlFor="temperature">Accuracy Score:</label>
                    <div className="select-container">
                        <select
                        id="temperature"
                        value={selectedTemperature}
                        onChange={handleTemperatureChange}
                        >
                        {temperatureOptions.map((option) => (
                            <option key={option} value={option}>
                            {option}
                            </option>
                        ))}
                        </select>
                    </div>
                </div>
            </form>
            {techList && (
                <section className="tech-list-container">
                    <ul className="tech-list-box">
                    {techList}    
                    </ul>
                </section>
            )}
        </div>
    );
};

export default Home;