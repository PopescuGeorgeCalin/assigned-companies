import React from 'react'
import { Route } from 'react-router-dom'
import { FormattedMessage } from 'react-intl'
// import { Button } from 'vtex.styleguide'

import AssignedCompanies from './AssignedCompanies'

const headerConfig = {
  namespace: 'vtex-account__assigned-companies-page',
  title: <FormattedMessage id="store/assignedCompanies.link" />,
}

const AssignedCompaniesPage = () => {
  return (
    <Route
      path="/assigned-companies"
      exact
      render={props => (
        <AssignedCompanies {...props} headerConfig={headerConfig} />
      )}
    />
  )
}

export default AssignedCompaniesPage
