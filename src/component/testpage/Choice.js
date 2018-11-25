import React from 'react'
import { Radio, Checkbox } from 'antd'

const getCheckboxDefault = ({ choices, defaultValue }) => {
    var out = []
    Object.keys(choices).forEach(key => {
        if (defaultValue.includes(key)) {
            out.push(`[ ${key} ] ${choices[key]}`)
        }
    })

    return out
}

const formatCheckboxChoices = ({ choices = {} }) => Object.keys(choices).sort().map(key => `[ ${key} ] ${choices[key]}`)

const formatRadioChoices = ({ choices = {} }) => Object.keys(choices).sort().map(key => {
    return {
        label: `[ ${key} ] ${choices[key]}`,
        value: key
    }
})

const RadioChoices = ({ choices = {}, onSelect, defaultValue = [] }) => (
    <Radio.Group
        className={'answers-group'}
        options={formatRadioChoices({ choices })}
        value={defaultValue.length > 0 ? defaultValue[0] : null}
        onChange={e => { onSelect({ answer: e.target.value, isCheckbox: false})}}
    />
)

const CheckboxChoices = ({ choices = {}, onSelect, defaultValue = [] }) => (
    <Checkbox.Group
        value={getCheckboxDefault({ choices, defaultValue })}
        options={formatCheckboxChoices({ choices })}
        onChange={value => onSelect({ answer: value, isCheckbox: true }) }
    />
)

export const Choices = ({ data = {}, answers, isCheckbox , onSelect }) => (
    <div className={'focus-choices-container'}>
        { isCheckbox ?
            <CheckboxChoices choices={data} onSelect={onSelect} defaultValue={answers.userAnswer} />
            : <RadioChoices choices={data} onSelect={onSelect} defaultValue={answers.userAnswer} />
        }
    </div>
)
