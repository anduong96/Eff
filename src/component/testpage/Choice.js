import React from 'react'
import { Radio } from 'antd'


const formatChoices = ({ data = {} }) => Object.keys(data).map(key => {
    return {
        label: data[key],
        value: key
    }
})

export const Choices = (data = {}, onSelect = () => console.log(1)) => (
    <div>
        <Radio.Group className={'answers-group'} options={formatChoices(data)} onChange={onSelect} />
    </div>
)
