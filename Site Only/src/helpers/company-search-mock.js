import { COMPANIES_DATABASE } from './companies-list.js';

export const companySearchMock = (filters) => {
    const { name, signature, city, country, state } = filters;
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve({
                companiesList: filterCompanies(
                    COMPANIES_DATABASE,
                    name,
                    country,
                    signature
                ),
            });
            return;
        }, 2000);
    });
};

const filterCompanies = (companies, name, country, signature) => {
    signature = +signature;
    if (signature === 0) {
        return companies.filter((company) => {
            if (
                company.name.toLowerCase().includes(name.toLowerCase()) &&
                company.country.toLowerCase() === country.toLowerCase()
            ) {
                return company;
            }
        });
    } else if (signature !== 0) {
        return companies.filter((company) => {
            if (
                company.name.toLowerCase().includes(name.toLowerCase()) &&
                company.country.toLowerCase() === country.toLowerCase() &&
                company.number === signature
            ) {
                return company;
            }
        });
    }
};
