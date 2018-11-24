import React from 'react'
import { Question } from './Question'
import { Choices } from './Choice'


export const Focus = ({ question, choices, explain, answer, showAnswer = false, onSelectAnswer }) => (
    <div className={'focus-container'}>
        <Question data={question} />
        <Choices data={choices} onSelect={onSelectAnswer} />
        { showAnswer && <div>{answer}</div> }
        { showAnswer && <div>{explain}</div> }
    </div>
)
