import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { navigate } from 'gatsby'
import { Layout, Button, Icon, Modal } from 'antd'
import { Side } from './Side'
import { Focus } from './Focus'
import Timer from './Timer'
import { saveToStorage, getFromStorage } from '../utils/storage'
import { getCurrentParam, shuffleArray } from '../utils/common'
import { KEY_CODES } from './util'
import Config from '../../configs'

class TestPage extends Component {
    timeLimit = 0

    state = {
        mode: 'test',
        userAnswers: {},
        timeLimit: 0,
        testLength: 0,
        allQuestionList: [],
        questionList: [],
        currentQuestion: {},
        currentQuestionNum: '0',
        isError: false,
        hasNext: false,
        hasPrev: false,
        showAnswer: false
    }

    componentDidMount = () => {
        const params = getCurrentParam()
        const { url, timeLimit, testLength, practice } = params
        const isValidHttps = url.search(/^http[s]?:\/\//) !== -1
        const hasHttp = url.search(/^http:\//) !== -1
        const hasHttps = url.search(/^https:\//) !== -1
        // for some reason the query is https:/ ...
        var hackyUrl = hasHttps || hasHttp ? url : 'http://' + url
        if (!isValidHttps) {
            if (hasHttp) {
                hackyUrl = hackyUrl.replace(/^http:\//, 'http://')
            } else if (hasHttps) {
                hackyUrl = hackyUrl.replace(/^https:\//, 'https://')
            }
        }

        axios.get(hackyUrl).then(resp => {
            const allQuestionList = resp.data
            const qList = shuffleArray(allQuestionList)
            const questionList = qList.slice(0, testLength)
            const currentQuestion = questionList[0]
            const currentQuestionNum = '0'
            const hasPrev = false
            const hasNext = testLength > 1

            this.timeLimit = timeLimit
            this.setState({
                questionList,
                allQuestionList,
                currentQuestion,
                currentQuestionNum,
                testLength,
                hasPrev,
                hasNext,
                mode: practice === "true" ? "practice" : "test"
            })

            const newHistory = getFromStorage({ key: Config.previousLinks, defaultValue: [] }).filter(val => val !== hackyUrl)
            saveToStorage({ key: Config.previousLinks, value: [hackyUrl, ...newHistory] })
            document.addEventListener('keydown', this._handleKeyPress);

        }).catch(err => {
            console.log({ err })
            navigate('/404/')
        })
    }

    _handleKeyPress = (e) => {
        const { keyCode } = e
        const { hasNext, hasPrev } = this.state
        const goNext = (keyCode === KEY_CODES.DOWN_ARROW || keyCode === KEY_CODES.RIGHT_ARROW) && hasNext
        const goPrev = (keyCode === KEY_CODES.UP_ARROW || keyCode === KEY_CODES.LEFT_ARROW) && hasPrev

        if (goNext) {
            this.onNextPress()
        } else if (goPrev) {
            this.onPrevPress()
        }
    }

    onNextPress = () => {
        const { currentQuestionNum, questionList, testLength } = this.state
        const nextNum = parseInt(currentQuestionNum) + 1
        const nextQuestion = questionList[nextNum]
        const hasNext = nextNum < testLength - 1
        const hasPrev = true

        this.setState({
            currentQuestionNum: `${nextNum}`,
            currentQuestion: nextQuestion,
            showAnswer: false,
            hasNext,
            hasPrev
        })
    }

    onPrevPress = () => {
        const { currentQuestionNum, questionList, testLength } = this.state
        const nextNum = parseInt(currentQuestionNum) - 1
        const nextQuestion = questionList[nextNum]
        const hasNext = nextNum < testLength - 1
        const hasPrev = nextNum > 0

        this.setState({
            currentQuestionNum: `${nextNum}`,
            currentQuestion: nextQuestion,
            hasNext,
            hasPrev
        })
    }

    displayAnswer = () => {
        this.setState({
            showAnswer: true
        })
    }

    onSelectAnswer = ({ isCheckbox, answer }) => {
        const { questionList, currentQuestion, currentQuestionNum, userAnswers } = this.state
        const testAnswer = currentQuestion.answer
        const userAnswer = isCheckbox ? answer.map(val => val.match(/\[ [A-Z] \] /, '')[0].replace('[ ', '').replace(' ] ', '')) : [answer]
        const correctAnswers = testAnswer.filter(answer => userAnswer.includes(answer))
        const isCorrect = correctAnswers.length === testAnswer.length
        userAnswers[parseInt(currentQuestionNum)] = { testAnswer, userAnswer, isCorrect }
        questionList[parseInt(currentQuestionNum)] = { ...currentQuestion, hasAnswer: userAnswer.length > 0, isCorrect }
        const allAnswered = Object.keys(userAnswers).length === questionList.length
        this.setState({ userAnswers, allAnswered, questionList })
    }

    onSelectSideQuestion = ({ key }) => this.setState({
        currentQuestion: this.state.questionList[parseInt(key)],
        currentQuestionNum: key,
        hasNext: parseInt(key) < this.state.testLength - 1,
        hasPrev: parseInt(key) > 0
    })

    onSubmit = () => Modal.confirm({
        title: 'Are you sure?',
        onOk: () => this.onScoreTest().then(this.onEndTest)
    })

    onTimerEnded = () => this.onScoreTest().then(this.onEndTest)

    onScoreTest = () => new Promise((resolve, reject) => {{
        let correct = 0

        Object.keys(this.state.userAnswers).forEach(questionNum => {
            const result = this.state.userAnswers[questionNum]
            if (result.isCorrect) {
                correct += 1
            }
        })

        const testScore = (correct/this.state.questionList.length) * 100
        resolve(Math.round(testScore).toFixed(0))
    }})

    onEndTest = (testScore) => Modal.confirm({
        title: 'Test Result',
        content: `You score is ${testScore}%`,
        onOk: () => {
            const key = Config.storageKey
            const previousScores = getFromStorage({ key, defaultValue: []})
            const testDate = moment().format('MMMM Do YYYY, h:mm:ss a')
            const testLength = this.state.testLength
            const currentTestScore = { testScore, testDate , testLength }

            saveToStorage({ key , value: [currentTestScore, ...previousScores]})
            this.setState({ mode : 'review' })
        }
    })



    render = () => (
        <Layout className={'full'}>
            <Layout.Sider collapsed={true} >
                <Side
                    isReviewMode={this.state.mode === 'review'}
                    options={this.state.questionList}
                    active={this.state.currentQuestionNum}
                    onSelectQuestion={this.onSelectSideQuestion}
                />
            </Layout.Sider>
            <Layout.Content>
                <Layout className={'focus-layout'}>
                    <Layout.Header id={'focus-header'}>
                        <h2 id={'question-number'}>Q: {parseInt(this.state.currentQuestionNum) + 1}</h2>
                        { this.timeLimit > 0 && this.state.mode === 'test' && <Timer onTimeInSec={this.timeLimit} onTimerEnded={this.onTimerEnded} />}
                    </Layout.Header>
                    <Layout.Content>
                        <Focus
                            {...this.state.currentQuestion}
                            onSelectAnswer={this.onSelectAnswer}
                            showAnswer={this.state.mode === 'review' || this.state.showAnswer}
                            userAnswer={this.state.userAnswers[parseInt(this.state.currentQuestionNum)]}
                        />
                    </Layout.Content>
                    <Layout.Footer>
                        { this.state.allAnswered && this.state.mode !== 'review' &&
                            <Button id={'submit-test-btn'} size={'large'} type={'danger'} onClick={this.onSubmit} ghost>Submit</Button>
                        }
                        { this.state.mode === 'review' &&
                            <Button id={'home-btn'} size={'large'} type={'danger'} onClick={() => navigate('')} ghost>Go Home</Button>
                        }
                        <Button.Group size={'large'} className={'test-nav-buttons'}>
                            { this.state.hasPrev && <Button onClick={this.onPrevPress}><Icon type={'left'} />Back</Button> }
                            { this.state.hasNext && (this.state.mode !== 'practice' || this.state.showAnswer) && <Button onClick={this.onNextPress}>Next<Icon type={'right'}/></Button> }
                            { this.state.mode === 'practice' && !this.state.showAnswer && <Button onClick={this.displayAnswer}>ShowAnswer<Icon type={'right'}/></Button> }
                        </Button.Group>
                    </Layout.Footer>
                </Layout>
            </Layout.Content>
        </Layout>
    )
}

export default TestPage
