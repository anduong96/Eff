import React from 'react'
import { Radio, Checkbox } from 'antd'


const formatCheckboxChoices = ({ choices = {} }) => Object.keys(choices).sort().map(key => `[ ${key} ] ${choices[key]}`)

const formatRadioChoices = ({ choices = {} }) => Object.keys(choices).sort().map(key => {
    return {
        label: `[ ${key} ] ${choices[key]}`,
        value: key
    }
})

const RadioChoices = ({ choices, onSelect }) => (
    <Radio.Group
        className={'answers-group'}
        options={formatRadioChoices({ choices })}
        onChange={e => onSelect({ answer: e.target.value, isCheckbox: false})}
    />
)

const CheckboxChoices = ({ choices, onSelect }) => (
    <Checkbox.Group
        options={formatCheckboxChoices({ choices })}
        onChange={value => onSelect({ answer: value, isCheckbox: true }) }
    />
)

export const Choices = ({ data = {}, isCheckbox , onSelect }) => (
    <div className={'focus-choices-container'}>
        { isCheckbox ?
            <CheckboxChoices choices={data} onSelect={onSelect} />
            : <RadioChoices choices={data} onSelect={onSelect} />
        }
    </div>
)
