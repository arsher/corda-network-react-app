import React from 'react';
import './ParticipantTypesSection.scss';
import Markdown from 'markdown-to-jsx';
import { connect } from 'react-redux';
import { MARKDOWN_SOURCE_BASE_URL } from '../../../../utils/constant.js';

class ParticipantTypesSection extends React.Component {
    constructor(props) {
        super(props);

        this.state = {
            pageText: '',
            loading: true,
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);

        fetch(
            `${MARKDOWN_SOURCE_BASE_URL}/home/participant-types-section/participant-types-section.md`
        )
            .then((response) => response.text())
            .then((text) => {
                this.setState({
                    pageText: text.replace(/\(\//g, '(/#/'),
                    loading: false,
                });
            })
            .then(() => {
                const lists = document.getElementsByClassName('pt-ul');
                lists[2].className += ' hidden';
            });
    }

    UNSAFE_componentWillReceiveProps(newProps) {
        if (newProps.uar.isUserAuthorized !== this.props.uar.isUserAuthorized) {
            // if (newProps.uar.isUserAuthorized) {
            const lists = document.getElementsByClassName('pt-ul');
            lists[2].className += ' hidden';
            // }
        }
    }

    render() {
        return (
            <div className="row participant-types-section">
                <div className="col-lg-10 offset-lg-1 col-md-10 offset-md-1 col-sm-12 participant-types-content">
                    <Markdown
                        children={this.state.pageText}
                        options={{
                            overrides: {
                                ul: {
                                    props: {
                                        className: 'pt-ul',
                                    },
                                },
                            },
                        }}
                    />
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
    };
};

const mapDispatchToProps = (dispatch) => {
    return {};
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(ParticipantTypesSection);
