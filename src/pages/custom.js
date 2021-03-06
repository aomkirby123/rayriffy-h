import React from 'react'
import Helmet from 'react-helmet'
import PropTypes from 'prop-types'
import {graphql} from 'gatsby'
import axios from 'axios'

import {AppContextConsumer} from '../context/AppContext'

import {Row, Col, Card, Typography, Icon, Input, Skeleton} from 'antd'

import {App} from '../components/app'
import {Post} from '../components/post'

const {Title, Text} = Typography

class CustomPage extends React.Component {
  state = {state: 0, subtitle: 'custom', inputValue: 0, raw: {}}

  find = async id => {
    this.setState({
      state: 1,
      subtitle: 'processing',
    })

    try {
      const out = await axios.get(`https://nh-express-git-master.rayriffy.now.sh/api/gallery/${id}`)
      this.setState({raw: out.data, state: 4, subtitle: 'viewing'})
    } catch (err) {
      console.log(err)
      this.setState({state: 3, subtitle: 'error'})
    }
  }

  updateInputValue = val => {
    this.setState({
      inputValue: val.target.value,
    })
  }

  componentDidMount() {
    const getParams = location => {
      const searchParams = new URLSearchParams(location.search)
      return searchParams.get('query') || null
    }

    const {location} = this.props

    if (getParams(location) !== null) {
      this.find(getParams(location))
    }
  }

  render() {
    const siteTitle = this.props.data.site.siteMetadata.title

    const {state, subtitle, inputValue, raw} = this.state

    return (
      <App title={siteTitle} subtitle={subtitle}>
        <Helmet htmlAttributes={{lang: 'en'}} title={`${subtitle} · ${siteTitle}`} />
        {state === 4 ? (
          <Post raw={raw} />
        ) : (
          <AppContextConsumer>
            {({dark}) => {
              return (
                <Row>
                  <Col
                    xs={{span: 20, offset: 2}}
                    sm={{span: 16, offset: 4}}
                    md={{span: 12, offset: 6}}
                    lg={{span: 8, offset: 8}}>
                    {state === 0 || state === 3 ? (
                      <Card
                        style={{backgroundColor: dark ? '#3c3c3d' : '#fff'}}
                        actions={[
                          <a href="/" key="button-close">
                            <Icon type="close-circle" />
                          </a>,
                          <a key="button-go" onClick={() => this.find(inputValue)}>
                            <Icon type="check-circle" />
                          </a>,
                        ]}>
                        <Row>
                          <Title level={2} style={{color: dark ? '#e1e1e1' : 'rgba(0, 0, 0, 0.85)'}}>
                            Custom
                          </Title>
                          {state === 0 ? (
                            <p style={{color: dark ? '#fff' : 'rgba(0, 0, 0, 0.65)'}}>
                              Input your code here{' '}
                              <Text code style={{color: dark ? '#fff' : 'rgba(0, 0, 0, 0.65)'}}>
                                https://nhentai.net/g/:id
                              </Text>
                            </p>
                          ) : (
                            <p style={{color: dark ? '#fff' : 'rgba(0, 0, 0, 0.65)'}}>Your request ID is not found</p>
                          )}
                        </Row>
                        <Row>
                          <Input placeholder="000000" size="large" onChange={this.updateInputValue} />
                        </Row>
                      </Card>
                    ) : state === 1 ? (
                      <Card style={{backgroundColor: dark ? '#3c3c3d' : '#fff'}}>
                        <Row>
                          <Title level={2} style={{color: dark ? '#e1e1e1' : 'rgba(0, 0, 0, 0.85)'}}>
                            Custom
                          </Title>
                          <Skeleton active />
                        </Row>
                      </Card>
                    ) : (
                      <div>any</div>
                    )}
                  </Col>
                </Row>
              )
            }}
          </AppContextConsumer>
        )}
      </App>
    )
  }
}

export default CustomPage

export const indexQuery = graphql`
  query {
    site {
      siteMetadata {
        title
      }
    }
  }
`

CustomPage.propTypes = {
  location: PropTypes.object,
  data: PropTypes.shape({
    site: PropTypes.shape({
      siteMetadata: PropTypes.shape({
        title: PropTypes.string,
      }),
    }),
  }),
}
