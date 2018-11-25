import React, { Component } from 'react'
import { navigate } from 'gatsby'
import axios from 'axios'
import moment from 'moment'
import { Layout, Form, AutoComplete, Button } from 'antd'
import { Configuration } from './Configure'
import { getFromStorage } from '../utils/storage'
import { converTimeToSecs, objToQueryParam } from '../utils/common'
import * as app from '../../../package.json'
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

        navigate(`/take/?${objToQueryParam(query)}`)
    }

    onValidateGist = (url) => {
        const link = document.getElementsByClassName('ant-input')[0].value
        const targetUrl = url || link
        this.setState({ isButtonLoading: true , takeButtonValue: 'Checking Template'})
        axios.get(targetUrl).then(resp => {
            var rawUrl = null
            var questions = null
            if (targetUrl.endsWith('.json')) {
                questions = resp.data
                rawUrl = url
            } else {
                const { files } = resp.data
                const target = files[Object.keys(files)[0]]
                rawUrl = target.raw_url
                questions = JSON.parse(target.content)
            }

            this.setState({
                maxQuestionsLength: questions.length,
                takeButtonValue: 'Take!',
                isButtonLoading: false,
                isInputError: false,
                isConfigure: true,
                testLink: rawUrl,
            })
        }).catch(err => {
            console.log(err)
            this.setState({
                takeButtonValue: 'Retry!',
                isInputError: true,
                isButtonLoading: false
            })
        })
    }

    onChangeTestTime = (testTime) => this.setState({ testTime })

    onChangeQuestionLength = (selectedQuestionsLength) => this.setState({ selectedQuestionsLength })

    render = () => (
        <Layout className={'full'} >
            <Layout.Header><small>Version {app.version}</small></Layout.Header>
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
                            placeholder={'Test Template URL'}
                            onSelect={(val, opt) => this.onValidateGist(opt.props.children)}
                        >
                            {this.state.historicalLinks.map((link, index) => <AutoComplete.Option key={`${index}`}>{link}</AutoComplete.Option>)}
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
                        onClick={() => this.state.isConfigure ? this.onLinkEnter() : this.onValidateGist()}
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
