import React from 'react';
import { NavLink } from 'react-router-dom';
import './Navigation.scss';
import { connect } from 'react-redux';
import * as actionTypes from '../../store/actions';

class Navigation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            isMenuOpen: false,
            currentlyOpenSubmenu: null,
        };
        this.handleClick = this.handleClick.bind(this);
        this.handleOutsideClick = this.handleOutsideClick.bind(this);
        this.toggleSubmenu = this.toggleSubmenu.bind(this);
        this.toggleActiveClass = this.toggleActiveClass.bind(this);
        this.closeMenu = this.closeMenu.bind(this);
    }

    handleClick(e) {
        e.stopPropagation();
        if (!this.state.isMenuOpen) {
            document.addEventListener('click', this.handleOutsideClick);
        } else {
            document.removeEventListener('click', this.handleOutsideClick);
        }

        if (!this.state.isMenuOpen) {
            const activeLink = Array.from(
                document.getElementsByClassName('nav-link active')
            )[0];
            if (activeLink) {
                const activeSubmenu =
                    activeLink.parentNode.parentNode.previousSibling;

                if (activeSubmenu) {
                    this.setState({
                        currentlyOpenSubmenu: activeSubmenu.id,
                    });
                }
            }
        }

        this.setState((prevState) => ({
            isMenuOpen: !prevState.isMenuOpen,
            currentlyOpenSubmenu: prevState.currentlyOpenSubmenu,
        }));
    }

    handleOutsideClick(e) {
        if (!this.node.contains(e.target)) {
            this.setState({
                isMenuOpen: false,
            });
        }
    }

    toggleSubmenu(e) {
        const id = e.target.id;
        if (id === this.state.currentlyOpenSubmenu) {
            this.setState({
                currentlyOpenSubmenu: null,
            });
        } else {
            this.setState({
                currentlyOpenSubmenu: id,
            });
        }
    }

    closeMenu(e) {
        this.setState({
            isMenuOpen: false,
            currentlyOpenSubmenu: null,
        });
    }

    toggleActiveClass(linkId) {
        let defaultClasses = 'nav-item has-sub';
        if (this.state.currentlyOpenSubmenu === linkId) {
            defaultClasses += ' active';
        }
        return defaultClasses;
    }

    render() {
        const isMenuOpen = this.state.isMenuOpen ? 'open' : '';
        return (
            <div className={`navigation ${isMenuOpen}`}>
                <div
                    className="navigation-wrapper"
                    ref={(node) => {
                        this.node = node;
                    }}>
                    <div className="navbar">
                        <NavLink
                            to="/"
                            className="logo box--flex center-Xxx"
                            onClick={this.closeMenu}>
                            corda network foundation
                        </NavLink>
                        <div
                            className="hamburger-menu"
                            onClick={this.handleClick}>
                            <span className="line top" />
                            <span className="line middle" />
                            <span className="line bottom" />
                        </div>
                    </div>
                    <div className="inner-nav">
                        <div className="container-fluid">
                            <div className="searchfield row">
                                <div className="col-11 p-0 box--flex center--y">
                                    <div className="col-11 offset-1">
                                        <form
                                            className="search-form w-100"
                                            action="/#/search">
                                            <div className="form-group w-100">
                                                <input
                                                    type="text"
                                                    autoComplete="off"
                                                    name="q"
                                                    id="search-term"
                                                    className="form-control"
                                                    placeholder="Search"
                                                />
                                                <button
                                                    className="btn btn-search"
                                                    type="submit"></button>
                                            </div>
                                        </form>
                                    </div>
                                </div>
                            </div>
                            <div className="nav-main row">
                                {!this.props.uar.isUserAuthorized && (
                                    <div className="menu-not-authenticated">
                                        <ul className="col-10 offset-1 box--flex center--y center--xxX h-100">
                                            <li className="nav-item">
                                                <NavLink
                                                    className="nav-link"
                                                    to="/login"
                                                    onClick={this.handleClick}>
                                                    Log in
                                                </NavLink>
                                            </li>
                                            <li className="nav-item ml-40">
                                                <NavLink
                                                    className="nav-link"
                                                    to="/register"
                                                    onClick={this.handleClick}>
                                                    Register
                                                </NavLink>
                                            </li>
                                        </ul>
                                    </div>
                                )}
                                <div
                                    className={
                                        this.props.uar.isUserAuthorized
                                            ? 'menu user-authorized col-lg-12 col-md-12 col-sm-12 p-0'
                                            : 'menu col-lg-12 col-md-12 col-sm-12 p-0'
                                    }>
                                    <nav className="main-menu">
                                        <ul className="col-11 offset-1">
                                            {this.props.uar.isUserAuthorized &&
                                                (this.props.upr.role ===
                                                    'user' ||
                                                    this.props.upr.role ===
                                                        'signer') && (
                                                    <li
                                                        className={this.toggleActiveClass(
                                                            'account-link'
                                                        )}
                                                        onClick={
                                                            this.toggleSubmenu
                                                        }>
                                                        <div
                                                            id="account-link"
                                                            className="nav-link">
                                                            Account
                                                        </div>
                                                        {this.props.csr
                                                            .currentStep ===
                                                            actionTypes.CURRENT_STEP_IDENTITY_COMPLETED ||
                                                        this.props.upr.role ===
                                                            'signer' ? (
                                                            <ul className="submenu">
                                                                {this.props.upr
                                                                    .role ===
                                                                    'user' && (
                                                                    <li className="nav-item sub">
                                                                        <NavLink
                                                                            className="nav-link"
                                                                            to="/dashboard/networks"
                                                                            onClick={
                                                                                this
                                                                                    .handleClick
                                                                            }>
                                                                            Networks
                                                                        </NavLink>
                                                                    </li>
                                                                )}
                                                                {(this.props.ptr
                                                                    .participantType ===
                                                                    'SPONSOR' ||
                                                                    this.props
                                                                        .sponsoredLegalEntityReducer
                                                                        .type ===
                                                                        'SPONSOR') &&
                                                                    this.props
                                                                        .upr
                                                                        .role !==
                                                                        'signer' && (
                                                                        <li className="nav-item sub">
                                                                            <NavLink
                                                                                className="nav-link"
                                                                                to="/dashboard/participants"
                                                                                onClick={
                                                                                    this
                                                                                        .handleClick
                                                                                }>
                                                                                Sponsored
                                                                                participants
                                                                            </NavLink>
                                                                        </li>
                                                                    )}
                                                                <li className="nav-item sub">
                                                                    <NavLink
                                                                        className="nav-link"
                                                                        to="/dashboard/account"
                                                                        onClick={
                                                                            this
                                                                                .handleClick
                                                                        }>
                                                                        Account
                                                                    </NavLink>
                                                                </li>

                                                                {this.props.upr
                                                                    .role ===
                                                                    'user' && (
                                                                    <li className="nav-item sub">
                                                                        <NavLink
                                                                            className="nav-link"
                                                                            to="/dashboard/billing"
                                                                            onClick={
                                                                                this
                                                                                    .handleClick
                                                                            }>
                                                                            Billing
                                                                        </NavLink>
                                                                    </li>
                                                                )}
                                                            </ul>
                                                        ) : (
                                                            <ul className="submenu">
                                                                <li className="nav-item sub onboarding-item">
                                                                    <span>
                                                                        Network
                                                                        onboarding
                                                                        is in
                                                                        progress.
                                                                        Once
                                                                        completed,
                                                                        you will
                                                                        find all
                                                                        account
                                                                        links in
                                                                        this
                                                                        menu.
                                                                    </span>
                                                                    <NavLink
                                                                        className="nav-link"
                                                                        to="/onboarding"
                                                                        onClick={
                                                                            this
                                                                                .handleClick
                                                                        }>
                                                                        continue
                                                                        onboarding
                                                                    </NavLink>
                                                                </li>
                                                            </ul>
                                                        )}
                                                    </li>
                                                )}
                                            {this.props.uar.isUserAuthorized &&
                                                this.props.upr.role ===
                                                    'admin' && (
                                                    <li
                                                        className={this.toggleActiveClass(
                                                            'users-link'
                                                        )}
                                                        onClick={
                                                            this.toggleSubmenu
                                                        }>
                                                        <div
                                                            id="users-link"
                                                            className="nav-link">
                                                            Users
                                                        </div>
                                                        <ul className="submenu">
                                                            <li className="nav-item sub">
                                                                <NavLink
                                                                    to="/admin/direct"
                                                                    className="nav-link"
                                                                    onClick={
                                                                        this
                                                                            .handleClick
                                                                    }>
                                                                    Direct
                                                                </NavLink>
                                                            </li>
                                                            <li className="nav-item sub">
                                                                <NavLink
                                                                    to="/admin/sponsor"
                                                                    className="nav-link"
                                                                    onClick={
                                                                        this
                                                                            .handleClick
                                                                    }>
                                                                    Sponsor
                                                                </NavLink>
                                                            </li>
                                                        </ul>
                                                    </li>
                                                )}
                                            <li
                                                className={this.toggleActiveClass(
                                                    'about-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="about-link"
                                                    className="nav-link">
                                                    About
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/concepts"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Corda Network
                                                            Services
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/business-networks"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Business Networks
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/businessnetworkstoolkit"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Business Networks
                                                            Toolkit
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/contact"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Contact
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/news"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            News
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/about/faq"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Faq
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'minutes-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="minutes-link"
                                                    className="nav-link">
                                                    Minutes
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/minutes/index"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Minutes and
                                                            Governance Events of
                                                            Board Meetings
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/minutes/20191206"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Minutes of the Board
                                                            Meeting of 6
                                                            December 2019
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/minutes/event-0001"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Advisory Governance
                                                            Event 0001
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/minutes/event-0007"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Mandatory Governance
                                                            Event 0007
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/minutes/event-0008"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Mandatory Governance
                                                            Event 0008
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'governance-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="governance-link"
                                                    className="nav-link">
                                                    Governance
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/index"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Corda Network
                                                            Foundation
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/governance-guidelines"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Governance
                                                            Guidelines
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/articles"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Articles of
                                                            Association
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/bylaws"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            By-Laws
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/board-election"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Transition Board
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/governance/events"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Governance Events
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'prepearing-to-join-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="prepearing-to-join-link"
                                                    className="nav-link">
                                                    Preparing to join
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/pre-joining"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Pre-requisites to
                                                            join
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/join-directly-or-as-sponsor"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Join Directly or as
                                                            a Sponsor
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/network-choice"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Deciding on the
                                                            right Network
                                                            choice 
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/membership-tiers"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Pricing for Corda
                                                            Network
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/notary-considerations"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Notary
                                                            Considerations
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/networkparamsschedule"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Network Parameters
                                                            Schedule
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/preprod"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Test Networks
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'joining-step-by-step-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="joining-step-by-step-link"
                                                    className="nav-link">
                                                    Joining process
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/index"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Process to join
                                                            Corda Network
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/distinguishedname"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Choosing your node's
                                                            Distinguished Name
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/participation/legalentity"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Selecting your Legal
                                                            Entity name
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'business-policy-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="business-policy-link"
                                                    className="nav-link">
                                                    Business Policy
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/admission-criteria"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Admission Criteria
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/anti-trust"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Anti-Trust
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/code-conduct"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Code of Conduct
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/conflict-interest"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Conflict of Interest
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/dispute-resolution"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Dispute Resolution
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/information-classification"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Information
                                                            Classification
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/network-services"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Network Services
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/notary-services"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Notary Services
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/gdpr"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Privacy Policy
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/security"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Security
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/supplier-management"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Supplier Management
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'operator-policy-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="operator-policy-link"
                                                    className="nav-link">
                                                    Operator Policy
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/acceptable-use"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Acceptable Use
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/access-control"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Access Control
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/backup-restore"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Backup / Restore
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/change-management"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Change Management
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/configuration-management"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Configuration
                                                            Management
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/cryptographic-material"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Cryptographic
                                                            Material
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/deployment"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Deployment
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/emergency-access"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Emergency Access
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/environments"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Environments
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/incident-response"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Incident Response
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/inventory-management"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Inventory Management
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/organisation-info-security"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Organisation of Info
                                                            Security
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/physical-security"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Physical Security
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/production-sla"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Production Sla
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/updates-patching"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Updates / Patching
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'technical-policy-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="technical-policy-link"
                                                    className="nav-link">
                                                    Technical Policy
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/allowable-names"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Allowable Names
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/clock-synchronisation"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Clock
                                                            Synchronisation
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/event-horizon"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Event Horizon
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/ip-addresses"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            IP Addresses
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/namespace-ownership"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Namespace Ownership
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/network-params-update"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Network Parameter
                                                            Updates
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/port-ranges"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Port Ranges
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/policy/protocol-definition"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Protocol Definition
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                            <li
                                                className={this.toggleActiveClass(
                                                    'trust-link'
                                                )}
                                                onClick={this.toggleSubmenu}>
                                                <div
                                                    id="trust-link"
                                                    className="nav-link">
                                                    Trust root
                                                </div>
                                                <ul className="submenu">
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/trust-root/index"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Introduction
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/trust-root/certificate-policy"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Certificate Policy
                                                        </NavLink>
                                                    </li>
                                                    <li className="nav-item sub">
                                                        <NavLink
                                                            className="nav-link"
                                                            to="/trust-root/certificate-practices"
                                                            onClick={
                                                                this.handleClick
                                                            }>
                                                            Certificate
                                                            Practices
                                                        </NavLink>
                                                    </li>
                                                </ul>
                                            </li>
                                        </ul>
                                    </nav>
                                </div>
                                <div className="social-networks col-lg-1 col-md-1 col-sm-12 box--flex center--y center--x">
                                    <ul>
                                        <li>
                                            <NavLink className="nav-link" to="">
                                                <i className="mdi mdi-medium"></i>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="nav-link" to="">
                                                <i className="mdi mdi-twitter"></i>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="nav-link" to="">
                                                <i className="mdi mdi-linkedin"></i>
                                            </NavLink>
                                        </li>
                                        <li>
                                            <NavLink className="nav-link" to="">
                                                <i className="mdi mdi-rss"></i>
                                            </NavLink>
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        uar: state.uar,
        upr: state.upr,
        csr: state.csr,
        ptr: state.ptr,
        sponsoredLegalEntityReducer:
            state.sponsoredLegalEntityReducer.legalEntity,
    };
};

export default connect(mapStateToProps, null)(Navigation);
