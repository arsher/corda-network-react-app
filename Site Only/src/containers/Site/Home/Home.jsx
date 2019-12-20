import React from 'react';
import LoadingOverlay from 'react-loading-overlay';
import HeroSection from './HeroSection/HeroSection';
import AboutSection from './AboutSection/AboutSection';
import KeyServicesSection from './KeyServices/KeyServicesSection';
import ParticipantTypesSection from './ParticipantTypesSection/ParticipantTypesSection';
import Footer from '../../../components/Footer/Footer';

export default class Home extends React.Component {
    render() {
        return (
            <LoadingOverlay spinner text="Loading...">
                <div className="container-fluid">
                    <HeroSection />
                    <AboutSection />
                    <KeyServicesSection />
                    <ParticipantTypesSection />
                    <Footer />
                </div>
            </LoadingOverlay>
        );
    }
}
