import React from 'react'

const formatExplain = (value) => value instanceof Array ? value.map(v => joinStr(v)).join('<br />') : joinStr(value)

const joinStr = (value) => value ? value.split('\n').join('<br />') : null

export const Answer = ({ answers = [], explain }) => (
    <div className={'test-answer'}>
        <h2>Correct Answer: {answers.join(', ')}</h2>
        <div className='test-explain' dangerouslySetInnerHTML={{ __html: formatExplain(explain) }} />
    </div>
)
