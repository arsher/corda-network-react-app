import axios from 'axios';
import { getCookie } from '../helpers/authorizationService';

const API_URL = 'https://cnf.staging.r3tests.com/api/v1';
const API_URL_V2 = 'https://cnf.staging.r3tests.com/api/v2';
// const API_URL = 'https://cordanetwork.prod.ws.r3.com';
const API_REGISTER = '/account/register';
const API_LOGIN = '/account/login';
const API_PARTICIPANT_PRIMARY = '/participant/primary';
const API_COMPANY_SEARCH = '/company/search';
const API_TERMS_PRODUCTION_DIRECT = '/agreement/CORDANETWORK/tou/latest';
const API_TERMS_PRODUCTION_SPONSOR =
    '/agreement/CORDANETWORK/tou_sponsor/latest';
const API_TERMS_PREPRODUCTION_DIRECT = '/agreement/UAT/tou/latest';
const API_TERMS_PREPRODUCTION_SPONSOR = '/agreement/UAT/tou_sponsor/latest';
const API_SIGNING_TOKEN = '/participant/primary/signing-token';
const API_BILLING_DETAILS = '/participant/primary/billing-info';
const API_COUNTRY_LIST = '/company/countries';
const API_ACCOUNTS = '/participant';
const API_CURRENT_ACCOUNT = '/account/current';
const API_PARTICIPANT_IDENTITY_CHECK = '/participant/primary/identity-check';
const API_PARTICIPANT_RETRIEVAL_TOKEN = '/participant/primary/retrieval-token';
const API_PARTICIPANT_SIGNED_TERMS = '/agreement/company-signature';

axios.defaults.headers.post['Content-Type'] = 'application/json';
axios.defaults.headers.put['Content-Type'] = 'application/json';

if (getCookie('authorizationKey') !== '') {
    axios.defaults.headers.common = {
        Authorization: `bearer ${getCookie('authorizationKey')}`,
    };
}

export const axiosRegister = (payload) => {
    return axios.post(`${API_URL}${API_REGISTER}`, {
        email: payload.email,
        captchaResponse: payload.captchaResponse,
        firstName: payload.firstName,
        lastName: payload.lastName,
    });
};

export const axiosLogin = (payload) => {
    return axios.post(`${API_URL}${API_LOGIN}`, {
        email: payload.email,
        captchaResponse: payload.captchaResponse,
    });
};

export const axiosSearchCompanies = (payload) => {
    if (payload.state.value === '') {
        return axios.post(`${API_URL}${API_COMPANY_SEARCH}`, {
            name: payload.name,
            countryISOAlpha2Code: payload.countryISOAlpha2Code,
            addressLocality: payload.addressLocality,
            pageNumber: payload.pageNumber,
            pageSize: 10,
        });
    } else {
        return axios.post(`${API_URL}${API_COMPANY_SEARCH}`, {
            name: payload.name,
            countryISOAlpha2Code: payload.countryISOAlpha2Code,
            addressLocality: payload.addressLocality,
            state: payload.state.value,
            pageNumber: payload.pageNumber,
            pageSize: 10,
        });
    }
};

// PARTICIPANT PRIMARY
export const axiosParticipantPrimaryPUT = (payload) => {
    return axios.put(`${API_URL}${API_PARTICIPANT_PRIMARY}`, {
        name: payload.name,
        signature: payload.signature,
        address: {
            addressCountry: {
                name: payload.country,
                isoAlpha2Code: payload.isoAlpha2Code,
            },
            addressLocality: {
                name: payload.addressLocality,
            },
            addressRegion: payload.addressRegion,
            postalCode: payload.postalCode,
            streetAddress: payload.streetAddress,
        },
        type: payload.type.toUpperCase(),
        externalId: payload.externalId,
    });
};

export const axiosParticipantPrimaryGET = () => {
    return axios.get(`${API_URL}${API_PARTICIPANT_PRIMARY}`);
};

export const axiosParticipantPrimaryPOST = (payload) => {
    return axios.post(`${API_URL}${API_PARTICIPANT_PRIMARY}`, {
        name: payload.name,
        signature: payload.signature,
        address: {
            addressCountry: {
                name: payload.country,
                isoAlpha2Code: payload.isoAlpha2Code,
            },
            addressLocality: {
                name: payload.addressLocality,
            },
            addressRegion: payload.addressRegion,
            postalCode: payload.postalCode,
            streetAddress: payload.streetAddress,
        },
        type: payload.type.toUpperCase(),
        externalId: payload.externalId,
    });
};

// SIGNIN ONBOARDIN TERMS
export const axiosOnboardingTermsGET = (productionType, participantType) => {
    let termsEdnpoint = '';
    participantType = participantType.toLowerCase();
    if (productionType === 'production' && participantType === 'direct') {
        termsEdnpoint = API_TERMS_PRODUCTION_DIRECT;
    } else if (
        productionType === 'production' &&
        participantType === 'sponsor'
    ) {
        termsEdnpoint = API_TERMS_PRODUCTION_SPONSOR;
    } else if (
        productionType === 'preproduction' &&
        participantType === 'direct'
    ) {
        termsEdnpoint = API_TERMS_PREPRODUCTION_DIRECT;
    } else if (
        productionType === 'preproduction' &&
        participantType === 'sponsor'
    ) {
        termsEdnpoint = API_TERMS_PREPRODUCTION_SPONSOR;
    }

    return axios.get(`${API_URL}${termsEdnpoint}`);
};

export const axiosOnboardingTermsPOST = (agreementId, token) => {
    return axios.post(`${API_URL}/agreement/company-signature`, {
        token: token,
    });
};

export const axiosSigningTokenPOST = (payload) => {
    return axios.post(`${API_URL}${API_SIGNING_TOKEN}`, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: 'phoneNumber',
        workTitle: payload.workTitle,
        agreementId: payload.termsId,
    });
};

export const axiosSigningTokenPOST_V2 = (payload) => {
    return axios.post(`${API_URL_V2}${API_SIGNING_TOKEN}`, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        email: payload.email,
        phoneNumber: 'phoneNumber',
        workTitle: payload.workTitle,
        agreementId: payload.termsId,
        signatureRequestId: payload.signatureRequestId,
    });
};

// BILLING DETAILS
export const axiosBillingDetailsPUT = (payload) => {
    return axios.put(`${API_URL}${API_BILLING_DETAILS}`, {
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        address: payload.address,
    });
};

export const axiosBillingDetailsPOST = (payload) => {
    return axios.post(`${API_URL}${API_BILLING_DETAILS}`, {
        contactName: payload.contactName,
        contactEmail: payload.contactEmail,
        contactPhone: payload.contactPhone,
        address: payload.address,
    });
};

export const axiosBillingDetailsGET = () => {
    return axios.get(`${API_URL}${API_BILLING_DETAILS}`, {});
};

export const axiosCountriesListGET = () => {
    return axios.get(`${API_URL}${API_COUNTRY_LIST}`);
};

export const axiosAccountsGET = () => {
    return axios.get(`${API_URL}${API_ACCOUNTS}`);
};

export const axiosParticipantPUT = (payload) => {
    return axios.put(`${API_URL}${API_ACCOUNTS}`, {
        name: payload.name,
        signature: payload.signature,
        address: {
            addressCountry: {
                name: payload.country,
                isoAlpha2Code: payload.isoAlpha2Code,
            },
            addressLocality: {
                name: payload.addressLocality,
            },
            addressRegion: payload.addressRegion,
            postalCode: payload.postalCode,
            streetAddress: payload.streetAddress,
        },
        type: payload.type.toUpperCase(),
        externalId: payload.externalId,
    });
};

export const axiosCurrentAccountGET = () => {
    return axios.get(`${API_URL}${API_CURRENT_ACCOUNT}`);
};

export const axiosCurrentAccountPOST = (payload) => {
    return axios.post(`${API_URL}${API_CURRENT_ACCOUNT}`, {
        firstName: payload.firstName,
        lastName: payload.lastName,
        workTitle: payload.workTitle,
        phoneNumber: payload.phoneNumber,
    });
};

export const axiosIdentityCheckGET = () => {
    return axios.get(`${API_URL}${API_PARTICIPANT_IDENTITY_CHECK}`);
};

export const axiosIdentityCheckPOST = (id) => {
    return axios.post(`${API_URL}/participant/${id}/identity-check`, {
        success: true,
        failReason: 'no fail reason',
    });
};

export const axiosApproveSponsorPOST = (id) => {
    return axios.post(`${API_URL}/participant/${id}/approve-sponsor`);
};

export const axiosParticipantRetrievalTokenGET = () => {
    return axios.get(`${API_URL}${API_PARTICIPANT_RETRIEVAL_TOKEN}`);
};

export const axiosParticipantSignedTermsGET = (retrievalToken) => {
    return axios.get(`${API_URL}${API_PARTICIPANT_SIGNED_TERMS}`, {
        headers: {
            'X-Agreement-Authorization': retrievalToken,
        },
    });
};

export const axiosTermsOfUsePdfDownload = (retrievalToken, context, name) => {
    return axios.get(
        `${API_URL}/agreement/company-signature/${context}/${name}/content`,
        {
            headers: {
                Accept: 'application/pdf',
                'X-Agreement-Authorization': retrievalToken,
            },
            responseType: 'blob',
        }
    );
};

export const axiosParticipantSignedTermsByIdGET = (id) => {
    return axios.get(`${API_URL}/agreement/company-signature/${id}`, {});
};

export const axiosAccountByIdGET = (id) => {
    return axios.get(`${API_URL}/account/${id}`);
};

// for both direct and sponsor own companies
export const createNodeConfigPUT = (networkType, payload) => {
    return axios.put(`${API_URL}/participant/primary/identity/${networkType}`, {
        email: payload.email,
        backupEmail: payload.backupEmail,
        state: payload.state,
        organizationalUnit: payload.organizationalUnit,
        commonName: payload.commonName,
    });
};

export const nodeConfigGET = (networkType) => {
    return axios.get(`${API_URL}/participant/primary/identity/${networkType}`);
};

export const nodeConfigDownload = (networkType) => {
    return axios.get(`${API_URL}/participant/primary/node/${networkType}`);
};

// for sponsored by sponsor participants
export const createSponsееNodePUT = (participantId, networkType, payload) => {
    return axios.put(
        `${API_URL}/participant/${participantId}/identity/${networkType}`,
        {
            email: payload.email,
            backupEmail: payload.backupEmail,
            state: payload.state,
            organizationalUnit: payload.organizationalUnit,
            commonName: payload.commonName,
        }
    );
};

export const sponseeNodeConfigGET = (participantId, networkType) => {
    return axios.get(
        `${API_URL}/participant/${participantId}/node/${networkType}`
    );
};

export const editSanctionPOST = (participantId, id) => {
    return axios.post(
        `${API_URL}/participant/${id}/eligibility-check/${participantId}`,
        {
            success: true,
            failReason: 'no fail reason',
        }
    );
};

export const axiosInviteSignerPOST = (agreementId, email) => {
    return axios.post(`${API_URL_V2}/participant/primary/invite-signer`, {
        agreementId: agreementId,
        email: email,
    });
};

export const axiosSignerFirebaseCodeGET = (token) => {
    return axios.post(`${API_URL_V2}/account/exchange-token`, {
        token: token,
    });
};

export const axiosSignatureRequestsGET = () => {
    return axios.get(`${API_URL_V2}/participant/primary/signature-requests`);
};
