import React, { Component } from 'react'
import { navigate } from 'gatsby'
import { Tag, Table, Layout, Button } from 'antd'
import { getFromStorage } from '../utils/storage'
import Config from '../../configs'

class Historical extends Component {
    state = {
        testHistory: getFromStorage({ key: Config.storageKey, defaultValue: [] }),
        columns: [
            {
                title: 'Result',
                dataIndex: 'testScore',
                key: 'testScore',
                render: (score) => <Tag color={score > 70 ? 'green' : 'red'}>{score}%</Tag>
            },
            { title: 'Date', dataIndex: 'testDate', key: 'testDate' },
            { title: 'Length', dataIndex: 'testLength', key: 'testLength' }
        ]
    }

    render = () => (
        <Layout className={'full'}>
            <Layout.Header>
                <h1>Historical Test Scores</h1>
            </Layout.Header>
            <Layout.Content>
                <Table
                    id={'historical-score-table'}
                    columns={this.state.columns}
                    dataSource={this.state.testHistory}
                    size={'middle'}
                />
            </Layout.Content>
            <Layout.Footer>
                <Button
                    id={'historical-home-btn'}
                    size={'large'}
                    type={'primary'}
                    onClick={() => navigate('')}
                >Go Home
                </Button>
            </Layout.Footer>
        </Layout>
    )
}

export default Historical;
