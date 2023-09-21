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

    // Temperature precision option
    const [precision, setPrecision] = useState('precise');
    let selectedTemperature;

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

        

        if (precision === 'less-precise') {
            // Use a different range for "Less Precise" set range between 0.6 - 1
            selectedTemperature = (0.6 + Math.random() * 0.4).toFixed(1);
        } else if (precision === 'precise') {
            // Use a random temperature for "Precise" set range between 0 - 0.5
            selectedTemperature = (Math.random() * 0.5).toFixed(1);
            console.log(selectedTemperature)
        }

        try {
            const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                //POST request
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${configuration.apiKey}`, //Authorization API
                },
                //stringify the body of the request
                body: JSON.stringify({
                    model: "gpt-3.5-turbo",
                    messages: [
                    {
                    "role": "system",
                    "content": `Given the "${skill}", 
                                Generate a list of general skills related to "${skill}" and sort them by alphabetical order without adding number listing and bullet points,
                                Do not accept any input that are not related to "${skill}",`,
                    },
                    ],
                    temperature: parseFloat(selectedTemperature),
                    max_tokens: 256,
                }),
            }
        );
        console.log(response)
        const data = await response.json();
        console.log('API Response:', data);
        // Check if choices array exists and has items
        if (data && data.choices && data.choices.length > 0) {
            const generatedTechList = data.choices[0].message.content; // Get the first item in the choices array
            const techListAsArray = generatedTechList
            .split('\n') // split by new line
            .map((skill) => skill.trim()) // remove whitespace
            .filter((skill) => skill !== '') // remove empty lines
            .map((skill, index) => <div className="tech-list" key={index} onClick={() => handleItemClick(skill)}>{skill}</div>);

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
                    <input type="submit" value="Submit" />
                <div className="input-container">
                    <label htmlFor="precision">Precision:</label>
                    <div className="select-container">
                        <select
                            id="precision"
                            value={precision}
                            onChange={(e) => setPrecision(e.target.value)}
                        >
                            <option value="precise">Precise</option>
                            <option value="less-precise">Less Precise</option>
                        </select>
                    </div>
                </div>
            </form>
            {techList && (
                <section className="tech-list-container">
                    <div className="tech-list-box">
                        {techList}    
                    </div>
                </section>
            )}
        </div>
    );
};

export default Home;