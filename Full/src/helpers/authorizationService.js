export const setCookie = (name, value, days, hours) => {
    let now = new Date();
    let expirationDate = now.getTime();
    if (days === 0) {
        expirationDate += hours * 60 * 60 * 1000;
    } else {
        expirationDate += days * 24 * 60 * 60 * 1000;
    }
    now.setTime(expirationDate);

    document.cookie =
        encodeURIComponent(name) +
        '=' +
        encodeURIComponent(value) +
        '; path=/' +
        '; expires=' +
        now.toUTCString();
};

export const getCookie = (cookieName) => {
    const name = cookieName + '=';
    const decodedCookie = decodeURIComponent(document.cookie);
    const cookies = decodedCookie.split(';');

    for (var i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        while (cookie.charAt(0) === ' ') {
            cookie = cookie.substring(1);
        }
        if (cookie.indexOf(name) === 0) {
            return cookie.substring(name.length, cookie.length);
        }
    }
    return '';
};

export const deleteCookie = (cookieName) => {
    let cookies = document.cookie.split(';');
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i];
        let eqPos = cookie.indexOf('=');
        let name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
        if (name.trim() === cookieName) {
            document.cookie =
                cookieName +
                '=""' +
                ';path=/;expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }
    }
};
