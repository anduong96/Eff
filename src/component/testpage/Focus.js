import React from 'react'
import { Question } from './Question'
import { Choices } from './Choice'
import { Answer } from './Answer'


export const Focus = ({
    question,
    choices,
    explain,
    onSelectAnswer,
    userAnswer = {},
    answer = [] ,
    showAnswer = false,
}) => (
    <div className={'focus-container'}>
        <Question data={question} />
        <Choices data={choices} onSelect={onSelectAnswer} isCheckbox={answer.length > 1} answers={userAnswer} disabled={showAnswer}/>
        { showAnswer && <Answer answers={answer} explain={explain} userAnswer={userAnswer.userAnswer} isCorrect={userAnswer.userAnswer ? userAnswer.userAnswer.sort().join(',') === answer.sort().join(',') : false} /> }
    </div>
)
