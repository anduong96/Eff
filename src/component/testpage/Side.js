import React from 'react'
import { Menu, Icon } from 'antd'

//wow... antd
const generateNumbers = (max) => {
    let out = {}
    while (max > 0) {
        const numSvg = (
            <svg className={'sider-num'} viewBox="0 0 44 44">
                <text fontSize="36"
                    fill="black"
                    fontFamily="Verdana"
                    textAnchor="middle"
                    alignmentBaseline="baseline"
                    x="22"
                    y="34.4"
                >{`${max}`}
                </text>
            </svg>
        )

        out[max] = () => numSvg
        max -= 1
    }

    return out
}



export const Side = ({ options = [], active, onSelectQuestion }) => {
    const max = options.length
    const Numbers = generateNumbers(max)
    return (
        <Menu className={'side-menu'} mode={'inline'} selectedKeys={[`${active}`] || []} >
            { options.map((opt, index) => (
                <Menu.Item onClick={onSelectQuestion} key={`${index}`} className={opt.hasAnswer ? 'answered' : 'unanswered'}>
                    <Icon component={Numbers[index + 1]} onClick={() => console.log({ opt })}/>
                    <span>{opt.question}</span>
                </Menu.Item>)
            )}
        </Menu>
    )
}
