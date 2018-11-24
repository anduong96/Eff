import React from 'react'
import {
    compileQuestion,
    compileImg
} from './util'

export const Question = ({ data }) => {
    data = compileQuestion(data)
    data = compileImg(data)
    const questionHtml = data

    return (
        <div className={'test-question'} dangerouslySetInnerHTML={{ __html: questionHtml }} />
    )
}
