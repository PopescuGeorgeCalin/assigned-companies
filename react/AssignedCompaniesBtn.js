import {Route} from "react-router-dom";
import React, {Fragment} from "react";
import {Button} from 'vtex.styleguide';
import {FormattedMessage} from "react-intl";

const AssignedCompaniesBtn = (props) => {

  return <Button href="/account#/assigned-companies">
    <FormattedMessage id="store/assignedCompanies.assignedCompaniesBtn"/>
  </Button>
}

const AssignedCompaniesBtnWithRoute = () => (
  <Fragment>
    <Route exact path="/profile" component={AssignedCompaniesBtn}/>
  </Fragment>
);

export default AssignedCompaniesBtnWithRoute
