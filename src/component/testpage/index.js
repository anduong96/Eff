import React, { Component } from 'react'
import axios from 'axios'
import { navigate } from 'gatsby'
import { Layout, Button, Icon } from 'antd'
import { Side } from './Side'
import { Focus } from './Focus'
import Timer from './Timer'

class TestPage extends Component {

    state = {
        allQuestionList: [],
        questionList: [],
        currentQuestion: {},
        isError: false,
        hasNext: false,
        hasPrev: false
    }

    componentDidMount = () => {
        const url = window.location.search.match(/url=([^&]+)/) || ''
        axios.get(url[1])
            .then(resp => {
                const qList = resp.data
                qList.sort(() => 0.5 * Math.random())
                const allQuestionList = resp.data
                const questionList = resp.data.slice(0, 75)
                const currentQuestion = questionList[0]
                this.setState({ questionList, allQuestionList, currentQuestion })

            }).catch(err => navigate('/404/'))
    }

    onNextPress = () => {
        console.log(this.state)
    }

    onPrevPress = () => {

    }

    onSelectAnswer = (answer) => {
        console.log({ answer })
    }


    render = () => (
        <Layout className={'full'}>
            <Layout.Sider collapsed={true} >
                <Side options={this.state.questionList}/>
            </Layout.Sider>
            <Layout.Content>
                <Layout className={'focus-layout'}>
                    <Layout.Header id={'focus-header'}>
                        <Timer setTimeInSeconds={60 * 60 * 2} />
                    </Layout.Header>
                    <Layout.Content>
                        <Focus {...this.state.currentQuestion} onSelectAnswer={this.onSelectAnswer} />
                    </Layout.Content>
                    <Layout.Footer>
                        <Button.Group size={'large'} className={'test-nav-buttons'}>
                            <Button onClick={this.onPrevPress}><Icon type={'left'} />Backward</Button>
                            <Button onClick={this.onNextPress}>Forward<Icon type={'right'}/></Button>
                        </Button.Group>
                    </Layout.Footer>
                </Layout>
            </Layout.Content>
        </Layout>
    )
}

export default TestPage;
