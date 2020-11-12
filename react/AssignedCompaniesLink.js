/* eslint-disable no-unused-vars */
import React from 'react'
import { injectIntl } from 'react-intl'

const AssignedCompaniesLink = ({ render, intl }) => {
  return render([
    {
      name: intl.formatMessage({ id: 'store/assignedCompanies.link' }),
      path: '/assigned-companies',
    },
  ])
}

export default injectIntl(AssignedCompaniesLink)
