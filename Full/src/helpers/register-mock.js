const users = [
    {
        email: 'john@abc.com',
        firstName: 'John',
        lastName: 'Doe',
        captchaResponse: 'string',
    },
    {
        email: 'jane@abc.com',
        firstName: 'Jane',
        lastName: 'Doe',
        captchaResponse: 'string',
    },
];

export const registerMock = (url, payload) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const parsedPayload = JSON.parse(payload);
            const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
            if (
                url.endsWith('/account/register') &&
                parsedPayload.method === 'POST'
            ) {
                let newUser = parsedPayload.body;
                let duplicateUser = users.filter((user) => {
                    return user.email === newUser.email;
                }).length;

                if (duplicateUser) {
                    reject('Email "' + newUser.email + '" is already taken');
                    return;
                } else if (!emailValidator.test(newUser.email)) {
                    reject(
                        'Email "' +
                            newUser.email +
                            '" is not a correct email format'
                    );
                    return;
                } else if (
                    newUser.firstName === '' ||
                    newUser.laseName === ''
                ) {
                    reject('Usernames are not correct');
                    return;
                }

                resolve({ ok: true, text: () => Promise.resolve('Success') });
                return;
            }
        }, 2000);
    });
};
