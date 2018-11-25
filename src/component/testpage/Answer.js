import React from 'react'

export const Answer = ({ answers = [], userAnswer= [], explain }) => (
    <div class={'test-answer'}>
        <h2>You Selected: {userAnswer.join(', ')}</h2>
        <h2>Correct Answer: {answers.join(', ')}</h2>
        <h3>{explain}</h3>
    </div>
)
