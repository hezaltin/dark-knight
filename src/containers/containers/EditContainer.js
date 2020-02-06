import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import EditView from '../../components/EditView/EditView';

import { bindSelectors } from '../utils/redux-utils';
import {
  actions as entryActions,
  selectors as entrySelectors
} from '../../redux/entry';
import {
  actions as crudActions,
  selectors as crudSelectors
} from '../../redux/crud';
import {
  actions as modelActions} from '../../redux/models';
// import {setSchemaName, setSchemaURI, isSelection, getSchemaList} from '../../redux/entry/actions'

const boundEntrySelectors = bindSelectors(entrySelectors, 'entry');
const boundCrudSelectors = bindSelectors(crudSelectors, 'documents');

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
    document: boundCrudSelectors.documentView(state, ownProps.uri, 'default'),
    documentView: boundCrudSelectors.documentView(
      state,
      ownProps.uri,
      ownProps.view
    ),
    uri: ownProps.uri
  };
};

const mapDispatchToProps = dispatch =>
  bindActionCreators(
    {
      getSchemaList: entryActions.getSchemaList,
      selectSchema: entryActions.selectSchema,
      deselectSchema: entryActions.deselectSchema,
      checkDuplicate: entryActions.checkDuplicate,
      createDataEntry: entryActions.createDataEntry,
      fetchDoc: crudActions.fetchDoc,
      loadModel: modelActions.loadModel,
      loadSchema: modelActions.loadSchema
    },
    dispatch
  );

const EditContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(EditView);

export default EditContainer;
