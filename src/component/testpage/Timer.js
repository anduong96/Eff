import React, { Component } from 'react'

export default class Time extends Component {
    constructor(props) {
        super(props);
        this.state = {
            maxTime: this.props.setTimeInSeconds,
            time: {
                hours: 0,
                minutes: 0,
                seconds: 0
            },
        }

        this.timer = setInterval(this.countDown, 1000)
    }

    secondsToTime = (secs) => {
        const hours = Math.floor(secs / (60 * 60))
        const divisor_for_minutes = secs % (60 * 60)
        const minutes = Math.floor(divisor_for_minutes / 60)
        const divisor_for_seconds = divisor_for_minutes % 60
        const seconds = Math.ceil(divisor_for_seconds)
        return { hours, minutes, seconds }
    }

    countDown = () => {
        const seconds = this.state.maxTime - 1
        const time = this.secondsToTime(seconds)
        this.setState({ time, seconds })
        if (seconds === 0) {
            this.props.onTimerEnded()
            clearInterval(this.timer)
        }
    }

    render = () => {
        const { hours, minutes, seconds } = this.state.time
        return (
            <div className={'timer-container'}>
                <span>{ hours }:{ minutes }:{ seconds } Remaining</span>
            </div>
        )
    }
}
