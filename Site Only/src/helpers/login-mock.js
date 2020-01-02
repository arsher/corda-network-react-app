const blackList = ['blackhat@abc.com', '123@abc.com', 'abc@abc.com'];
const existingList = ['john@abc.com', 'jane@abc.com'];

export const loginMock = (url, payload) => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            const parsedPayload = JSON.parse(payload);
            const emailValidator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;

            if (
                url.endsWith('/account/login') &&
                parsedPayload.method === 'POST'
            ) {
                let loginUser = parsedPayload.body;
                let isBlackListUser = blackList.filter((user) => {
                    return user === loginUser.email;
                }).length;
                let isNotExistingUser = existingList.filter((user) => {
                    return user === loginUser.email;
                }).length;

                if (!emailValidator.test(loginUser.email)) {
                    reject(
                        'Email "' +
                            loginUser.email +
                            '" is not a correct email format'
                    );
                    return;
                } else if (isBlackListUser) {
                    reject(
                        'Your user with registered mail ' +
                            loginUser.email +
                            ' is in our blacklist'
                    );
                    return;
                } else if (!isNotExistingUser) {
                    reject(
                        'Your user with registered mail ' +
                            loginUser.email +
                            ' is not a registered user in our system'
                    );
                    return;
                }

                resolve({ ok: true, text: () => Promise.resolve('Success') });
                return;
            }
        }, 2000);
    });
};
