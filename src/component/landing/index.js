import React, { Component } from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'
import { Layout, Form, Input, Button } from 'antd'

export default class Landing extends Component {
    state = {
        linkInputPlaceholder: 'Template Gist',
        takeButtonValue: 'Take!',
        isInputError: false,
        isButtonLoading: false,
        invalidForm: {
            validateStatus: 'fail',
            help: 'Invalid Link or format'
        }
    }

    onLinkEnter = () => {
        this.setState({ isButtonLoading: true , takeButtonValue: 'Checking Template'})
        const testLink = document.getElementById('link-input').value
        try {
            axios.get(testLink).then(resp => {
                const { files } = resp.data
                const target = files[Object.keys(files)[0]]
                const { raw_url, content } = target
                JSON.parse(content)
                navigate(`/take/?url=${raw_url}`)
            })
        } catch(err) {
            this.setState({ isButtonLoading: false , takeButtonValue: 'Retry', isInputError: true })
        }
    }

    _handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            this.onLinkEnter()
        }
    }

    render = () => (
        <Layout className={'full'}>
            <Layout.Header></Layout.Header>
            <Layout.Content className={'dead-center'}>
                <div className={'welcome'}>
                    <h1>Welcome to Eff</h1>
                    <br />
                    <hr />
                </div>
                <div className={'link-input-container'}>
                    <Form.Item {...this.state.isInputError ? {} : this.state.invalidForm} >
                        <Input
                            id={'link-input'}
                            placeholder={this.state.linkInputPlaceholder}
                            onKeyPress={this._handleKeyPress}
                            value={'https://api.github.com/gists/d64f1bbbef594c463b7f903dc978aa6d'}
                            size={'large'}
                        />
                    </Form.Item>
                    <Button
                        loading={this.state.isButtonLoading}
                        onClick={this.onLinkEnter}
                        id={'take-button'}
                        type={'primary'}
                        size={'large'}
                    >{this.state.takeButtonValue}</Button>
                </div>
            </Layout.Content>
            <Layout.Footer></Layout.Footer>
        </Layout>
    )
}
