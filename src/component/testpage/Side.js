import React from 'react'
import { Menu } from 'antd'

export const Side = ({ options=[], active, onClick }) => (
    <Menu className={'side-menu'} mode={'inline'} defaultSelectedKeys={['1']} >
        { options.map((opt, index) => <Menu.Item key={`${index + 1}`}>{`${index + 1}`}</Menu.Item>) }
    </Menu>
)
