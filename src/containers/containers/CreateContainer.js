import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import CreateView from '../../components/CreateView/CreateView'

import { bindSelectors } from '../utils/redux-utils'
import { actions, selectors } from '../../redux/entry'
import {
  actions as modelActions,
  selectors as modelSelectors
} from '../../redux/models'

import {setSchemaName, setSchemaURI, isSelection, getSchemaList} from '../../redux/entry/actions'

const boundEntrySelectors = bindSelectors(selectors, 'entry')
const boundModelSelectors = bindSelectors(modelSelectors, 'models') 

const mapStateToProps = (state, ownProps) => {
  return {
    entity: boundEntrySelectors.entity(state),
    query: boundEntrySelectors.query(state),
    schemaList: boundEntrySelectors.schemaList(state),
    schemaListPending: boundEntrySelectors.schemaListPending(state),
    schemaListError: boundEntrySelectors.schemaListError(state),
    selectedSchema: boundEntrySelectors.selectedSchema(state),
    schema: boundEntrySelectors.schema(state),
    schemaPending: boundEntrySelectors.schemaPending(state),
    schemaError: boundEntrySelectors.schemaError(state),
    uri: boundEntrySelectors.uri(state),
    duplicate: boundEntrySelectors.duplicate(state),
    checkPending: boundEntrySelectors.checkPending(state),
    checkError: boundEntrySelectors.checkError(state),
    createEntrySchema: boundModelSelectors.getSchema(state, ownProps.scope, 'new-entry')
  }
}

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchemaList: actions.getSchemaList,
      selectSchema: actions.selectSchema,
      deselectSchema: actions.deselectSchema,
      checkDuplicate: actions.checkDuplicate,
      createDataEntry: actions.createDataEntry
    },
    dispatch
  )

const CreateContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateView)

export default CreateContainer
