import React from 'react'
import { TimePicker, InputNumber } from 'antd'
import moment from 'moment'

export const Configuration = ({
    onChangeTime,
    onChangeQuestionsLength,
    defaultTestTime = moment('01:00:00', 'HH:mm:ss'),
    maxQuestions = 1
}) => (
    <div id={'configure-container'}>
        <TimePicker
            defaultValue={defaultTestTime}
            onChange={onChangeTime}
            placeholder={'Time limit'}
            size={'large'}
        />
        <InputNumber
            defaultValue={maxQuestions}
            onChange={onChangeQuestionsLength}
            placeholder={'Test Length'}
            max={maxQuestions}
            size={'large'}
        />
    </div>
)
