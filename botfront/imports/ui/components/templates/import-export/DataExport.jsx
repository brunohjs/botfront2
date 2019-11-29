import { Button } from 'semantic-ui-react';
import { Meteor } from 'meteor/meteor';
import { connect } from 'react-redux';
import { saveAs } from 'file-saver';
import PropTypes from 'prop-types';
import moment from 'moment';
import React from 'react';
import { useLazyQuery } from '@apollo/react-hooks';
import { GET_BOT_RESPONSES } from '../templates-list/queries'

function DataExport({ projectId }) {

    const [getBotResonses] = useLazyQuery(GET_BOT_RESPONSES, {
        onCompleted: (data) => {
            const blob = new Blob([JSON.stringify((data.botResponses, null, 2))], { type: 'text/plain;charset=utf-8' });
            const filename = `responses_${projectId}-${moment().toISOString()}.json`;
            saveAs(blob, filename);
        }
    });

    downloadData = () => {
        getBotResonses({ variables: { projectId } })
    };

    return (
        <div>
            <br />
            <br />
            <Button type='submit' onClick={this.downloadData} content='Export bot responses' />
        </div>
    );
}

DataExport.propTypes = {
    projectId: PropTypes.string.isRequired,
};

const mapStateToProps = state => ({
    projectId: state.settings.get('projectId'),
});


export default connect(
    mapStateToProps,
)(DataExport);
