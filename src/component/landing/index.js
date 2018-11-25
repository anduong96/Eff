import React, { Component } from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'
import moment from 'moment'
import { Layout, Form, AutoComplete, Button, notification } from 'antd'
import { Configuration } from './Configure'
import { getFromStorage, saveToStorage } from '../utils/storage'
import { converTimeToSecs, objToQueryParam } from '../utils/common'
import Config from '../../configs'

export default class Landing extends Component {
    state = {
        hasHistory: getFromStorage({ key: Config.storageKey, defaultValue: [] }).length > 0,
        historicalLinks: getFromStorage({ key: Config.previousLinks, defaultValue: [] }),
        bodyClicks: 0,
        testLink: '',
        maxQuestionsLength: 0,
        selectedQuestionsLength: null,
        testTime: moment('02:00:00', 'HH:mm:ss'),
        linkInputPlaceholder: 'Template Gist',
        takeButtonValue: 'Check Link!',
        isInputError: false,
        isConfigure: false,
        isButtonLoading: false,
        invalidForm: {
            validateStatus: 'error',
            help: 'Invalid Link or format'
        }
    }

    onLinkEnter = () => {
        const { testLink, testTime, selectedQuestionsLength, maxQuestionsLength } = this.state
        const query = {
            url: testLink,
            timeLimit: converTimeToSecs(testTime),
            testLength: selectedQuestionsLength || maxQuestionsLength
        }

        saveToStorage({ key: Config.previousLinks, value: [testLink, ...this.state.historicalLinks] })
        navigate(`/take/?${objToQueryParam(query)}`)
    }

    onValidateGist = () => {
        const link = document.getElementsByClassName('ant-input')[0].value
        this.setState({ isButtonLoading: true , takeButtonValue: 'Checking Template'})
        axios.get(link).then(resp => {
            const { files } = resp.data
            const target = files[Object.keys(files)[0]]
            const { raw_url, content } = target
            const questions = JSON.parse(content)
            this.setState({
                maxQuestionsLength: questions.length,
                takeButtonValue: 'Take!',
                isButtonLoading: false,
                isInputError: false,
                isConfigure: true,
                testLink: raw_url,
            })
        }).catch(err => {
            this.setState({
                takeButtonValue: 'Retry!',
                isInputError: true,
                isButtonLoading: false
            })
        })
    }

    onEasterEgg = () => this.setState({ bodyClicks: this.state.bodyClicks + 1 }, () => {
        const { bodyClicks } = this.state
        if (bodyClicks === 20) {
            document.getElementsByClassName('ant-input')[0].value = 'LOL'
            this.setState({ bodyClicks: 0 })
        } else if (bodyClicks > 10 && bodyClicks < 20) {
            notification.open({ message: `Click ${20 - bodyClicks} times` })
        }
    })

    onChangeTestTime = (testTime) => this.setState({ testTime })

    onChangeQuestionLength = (selectedQuestionsLength) => this.setState({ selectedQuestionsLength })

    render = () => (
        <Layout className={'full'} onClick={this.onEasterEgg}>
            <Layout.Header></Layout.Header>
            <Layout.Content className={'dead-center'}>
                <div className={'welcome'}>
                    <h1>Welcome to Eff</h1>
                    <br />
                    <hr />
                </div>
                <div className={'link-input-container'}>
                    <Form.Item {...this.state.isInputError ? {...this.state.invalidForm} : {}} >
                        <AutoComplete
                            id={'link-input'}
                            size={'large'}
                            placeholder={'this.state.linkInputPlaceholder'}
                            {...this.state.historicalLinks.length > 0 && { defaultValue: this.state.historicalLinks[0] }}
                        >
                            {this.state.historicalLinks.map(link => <AutoComplete.Option key={`${link}`}>{link}</AutoComplete.Option>)}
                        </AutoComplete>
                    </Form.Item>
                    { this.state.isConfigure &&
                        <Configuration
                            defaultTestTime={this.state.testTime}
                            onChangeTime={this.onChangeTestTime}
                            onChangeQuestionsLength={this.onChangeQuestionLength}
                            maxQuestions={this.state.maxQuestionsLength}
                        />
                    }
                    <Button
                        loading={this.state.isButtonLoading}
                        onClick={this.state.isConfigure ? this.onLinkEnter : this.onValidateGist}
                        id={'take-button'}
                        type={'primary'}
                        size={'large'}
                    >{this.state.takeButtonValue}</Button>
                    { this.state.hasHistory &&
                        <Button
                            id={'historical-button'}
                            type={'primary'}
                            size={'large'}
                            ghost
                            onClick={() => navigate('/historical/')}
                        >Test History
                        </Button>
                    }
                </div>
            </Layout.Content>
            <Layout.Footer></Layout.Footer>
        </Layout>
    )
}
