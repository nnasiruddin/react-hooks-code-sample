import React from 'react';
import axios from 'axios';
import get from 'lodash.get';

const headers = (accessToken, suppliers) => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'CAI-Data-Platform-Key':  get(process.env, 'SECRET_KEY_VALUE', ''),
        'Suppliers': JSON.stringify(suppliers),
    };
};

const useFetch = (url, accessToken, suppliers) => {
    const [response, setResponse] = React.useState(null);
    const [error, setError] = React.useState(null);
    const options = {
        headers: headers(accessToken, suppliers),
    };
    React.useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(url, options);
                const json = await res.data;
                setResponse(json);
            } catch (error) {
                setError(error);
            }
        };
        fetchData();
    }, [accessToken]);
    return { response, error };
};

export default useFetch;
