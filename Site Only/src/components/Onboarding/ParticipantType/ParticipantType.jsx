import React from 'react';
import './ParticipantType.scss';
import { ReactComponent as DirectIcon } from './../../../assets/images/Direct-Icon.svg';
import { ReactComponent as SponsorIcon } from './../../../assets/images/Sponsor-Icon.svg';
import DirectInfo from './TypeInfo/DirectInfo';
import SponsorInfo from './TypeInfo/SponsorInfo';
import { connect } from 'react-redux';
import * as actionTypes from '../../../store/actions';

class ParticipantType extends React.Component {
    constructor(props) {
        super();
        this.state = {
            participantTypes: ['DIRECT', 'SPONSOR'],
            selectedType: '',
            isSelected: false,
        };
    }

    handleChange(e) {
        this.setState({ selectedType: e.target.value, isSelected: true });
    }

    handleClick() {
        this.state.selectedType === this.state.participantTypes[0]
            ? this.props.onConfirmParticipantType(this.state.selectedType)
            : this.props.onSelectParticipantType();
    }

    render() {
        const options = this.state.participantTypes.map((type, key) => {
            const isCurrent = this.state.selectedType === type;
            return (
                <div key={key} className="type box--flex--column center--y">
                    <label
                        className={
                            isCurrent ? 'type-wrapper selected' : 'type-wrapper'
                        }>
                        <input
                            className="radio"
                            type="radio"
                            name="participantTypes"
                            id={type}
                            value={type}
                            onChange={this.handleChange.bind(this)}
                        />
                        {type === this.state.participantTypes[0] ? (
                            <DirectIcon />
                        ) : (
                            <SponsorIcon />
                        )}
                        <span className="standard-label pt-16">
                            {'Select ' + type}
                        </span>
                    </label>
                </div>
            );
        });

        let typeInfo;
        if (this.state.selectedType === '') {
            typeInfo = null;
        } else if (this.state.selectedType === this.state.participantTypes[0]) {
            typeInfo = <DirectInfo />;
        } else {
            typeInfo = <SponsorInfo />;
        }

        return (
            <div className="participant-type-container">
                <div className="card">
                    <div className="card-body text-center">
                        <h1 className="h3">Create Account</h1>
                        <p className="subtitle">Select Participant Type</p>
                        <div className="h-splitter"></div>
                        <p className="encourage-msg">
                            Please, select one of the two participant types
                            below.
                        </p>
                        <div className="participant-types box--flex center--XxX">
                            {options}
                        </div>

                        {typeInfo}

                        <div className="box--flex center--xxX mt-40">
                            <button
                                type="button"
                                value="text"
                                className="btn btn-primary m-0"
                                onClick={this.handleClick.bind(this)}
                                disabled={!this.state.isSelected}>
                                Next
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        ler: state.ler.legalEntity,
        loader: state.loader,
        csr: state.csr,
        ptr: state.ptr,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        onSelectParticipantType: () =>
            dispatch({
                type: actionTypes.CURRENT_STEP_CONFIRM_PARTICIPANT_TYPE,
            }),
        onConfirmParticipantType: (participantType) =>
            dispatch(
                {
                    type: actionTypes.CURRENT_STEP_SELECT_LEGAL_ENTITY,
                },
                dispatch({
                    type: actionTypes.SET_PARTICIPANT_TYPE,
                    participantType: participantType,
                })
            ),
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(ParticipantType);
