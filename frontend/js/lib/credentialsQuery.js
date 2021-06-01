async function getQuery(URL, method, bodyParams, headers) {
    headers = headers || {
        'Content-type': 'application/json',
    };

    let response;

    if (!bodyParams) {
        response = await fetch(URL, {
            method,
            headers,
        });
    } else {
        response = await fetch(URL, {
            method,
            body: JSON.stringify(bodyParams),
            headers,
        });
    }

    const data = await response.json();

    if (data.status === 'error') {
        throw new Error(data.message);
    }

    return data;
}

export { getQuery };
