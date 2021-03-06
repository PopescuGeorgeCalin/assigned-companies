import React, { Component } from 'react'
import axios from 'axios'
import moment from 'moment'
import { FormattedMessage } from 'react-intl'
import { Table } from 'vtex.styleguide'
import {
  // @ts-ignore
  ContentWrapper,
} from 'vtex.my-account-commons'

const formatCompanyValue = (properties, companyValue) => {
  if (!companyValue) {
    return <span></span>
  }

  let content = companyValue
  switch (properties.type) {
    case 'string': {
      switch (properties.format) {
        case 'date-time': {
          //TODO: determine proper format
          content = moment(companyValue).format()
          break
        }
        default: {
          content = companyValue
          break
        }
      }
      break
    }
    case 'number': {
      content = companyValue.toFixed(2)
      break
    }
    case 'boolean': {
      content = companyValue ? (
        <FormattedMessage id="store/assignedCompanies.yesLabel" />
      ) : (
        <FormattedMessage id="store/assignedCompanies.noLabel" />
      )
      break
    }
    case 'url': {
      content = <a href={companyValue}>Link</a>
      break
    }
    default: {
      content = companyValue
    }
  }

  return <span className="dib oo-table-content tb-1">{content}</span>
}

const getJsonSchema = schema => {
  const schemaProperties = Object.keys(schema)
  return {
    properties: schemaProperties.reduce((oldSchema, schemaKey) => {
      return {
        ...oldSchema,
        [schemaKey]: {
          title: schema[schemaKey].title,
          cellRenderer: ({ cellData, rowData }) => {
            return formatCompanyValue(schema[schemaKey], cellData)
          },
        },
      }
    }, {}),
  }
}

const tableLength = 5
const initialState = {
  companies: [],
  schema: {},
  tableLength: tableLength,
  currentPage: 1,
  slicedData: [],
  currentItemFrom: 1,
  currentItemTo: tableLength,
}

class AssignedCompanies extends Component {
  constructor(props) {
    super(props)

    this.state = initialState

    this.handleNextClick = this.handleNextClick.bind(this)
    this.handlePrevClick = this.handlePrevClick.bind(this)
    this.goToPage = this.goToPage.bind(this)
    this.handleRowsChange = this.handleRowsChange.bind(this)
  }

  componentDidMount() {
    axios({
      url: '/_v/getAssignedCompanies',
      method: 'get',
    })
      .then(response => {
        const companies = response.data?.companies || []
        this.setState({
          companies,
          slicedData: companies.slice(0, this.state.tableLength),
          schema: response.data?.schema || {},
        })
      })
      .catch(console.error)
  }

  handleNextClick() {
    const newPage = this.state.currentPage + 1
    const itemFrom = this.state.currentItemTo + 1
    const itemTo = this.state.tableLength * newPage
    const data = this.state.companies.slice(itemFrom - 1, itemTo)
    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  handlePrevClick() {
    if (this.state.currentPage === 0) return
    const newPage = this.state.currentPage - 1
    const itemFrom = this.state.currentItemFrom - this.state.tableLength
    const itemTo = this.state.currentItemFrom - 1
    const data = this.state.companies.slice(itemFrom - 1, itemTo)
    this.goToPage(newPage, itemFrom, itemTo, data)
  }

  goToPage(currentPage, currentItemFrom, currentItemTo, slicedData) {
    this.setState({
      currentPage,
      currentItemFrom,
      currentItemTo,
      slicedData,
    })
  }

  handleRowsChange(e, value) {
    const currentItemTo = parseInt(value)
    const slicedData = this.state.companies.slice(
      this.state.currentItemFrom,
      currentItemTo
    )
    this.setState({
      tableLength: parseInt(value),
      currentItemTo,
      slicedData,
    })
  }

  render() {
    const { headerConfig } = this.props
    return (
      <ContentWrapper {...headerConfig}>
        {() => (
          <Table
            schema={getJsonSchema(this.state.schema)}
            items={this.state.slicedData}
            emptyStateLabel={
              <FormattedMessage id="store/assignedCompanies.emptyStateLabel" />
            }
            pagination={{
              onNextClick: this.handleNextClick,
              onPrevClick: this.handlePrevClick,
              currentItemFrom: this.state.currentItemFrom,
              currentItemTo: this.state.currentItemTo,
              onRowsChange: this.handleRowsChange,
              textShowRows: (
                <FormattedMessage id="store/assignedCompanies.showRows" />
              ),
              textOf: <FormattedMessage id="store/assignedCompanies.of" />,
              totalItems: this.state.companies.length,
              rowsOptions: [5, 10, 15, 25],
            }}
            fullWidth={true}
          />
        )}
      </ContentWrapper>
    )
  }
}

export default AssignedCompanies
