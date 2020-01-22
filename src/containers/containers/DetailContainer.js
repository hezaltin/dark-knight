import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import DetailView from '../../components/DetailView/DetailView'

import { bindSelectors } from '../utils/redux-utils'
import { actions, selectors } from '../../redux/crud'
import { actions as userActions, selectors as userSelectors } from '../../redux/user'
import { actions as srvActions, selectors as serviceSelectors } from '../../redux/service'

const boundDocumentSelectors = bindSelectors(selectors, 'documents');
const boundserviceSelectors = bindSelectors(serviceSelectors, 'service')
const boundUserSelectors = bindSelectors(userSelectors, 'user');

const mapStateToProps = (state, ownProps) => {
  const detail = boundDocumentSelectors.documentByUri(state, ownProps.uri)
  return {
    // TODO: move this label implementation to a samplePerson branch
    // because it is not generic, but it is useful for a quick Grove demo
    label: detail && detail.name,
    detail: detail,
    error: boundDocumentSelectors.errorByUri(state, ownProps.uri),
    contentType: boundDocumentSelectors.contentTypeByUri(state, ownProps.uri),
    profile: boundUserSelectors.profile(state),
    requestPending: boundserviceSelectors.isRequestPending(state)
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      fetchDoc: actions.fetchDoc,
      requestDoc: srvActions.submitDocRequest,
    },
    dispatch
  )

const DetailContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(DetailView)

export default DetailContainer
