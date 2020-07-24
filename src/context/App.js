import React, {useEffect, useCallback, useMemo, useState} from 'react';
import {useOktaAuth} from '@okta/okta-react';
import axios from 'axios';
import get from 'lodash.get';

// Local Imports Start Here
import * as ApiConstants from '../constants/api';
import rolesModalDefaultGroups from '../iniital/rolesModalGroups';

const defaultValue = {
    name: '',
};
const Context = React.createContext(defaultValue);
const headers = (accessToken, suppliers) => {
    return {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${accessToken}`,
        'CAI-Data-Platform-Key':  get(process.env, 'SECRET_KEY_VALUE', ''),
        'Suppliers': JSON.stringify(suppliers),
    };
};

export const AppContextProvider = props => {
    const {authState, authService} = useOktaAuth();
    const [userInfo, setUserInfo] = useState(null);
    const [suppliers, setSuppliers] = useState([]);
    const [sortedSuppliers, setSortedSuppliers] = useState([]);
    const [rolesModalGroups, setRolesModalGroups] = useState(rolesModalDefaultGroups);

    const getGroups = useCallback((groups) => {
        if (groups.indexOf('EDP_DEV_OPS_DELETE') > -1) {
            groups = rolesModalGroups.reduce((agg, group) => {
                if (group.checked) {
                    agg.push(group.name);
                }
                return agg;
            }, []);

            groups.push('EDP_DEV_OPS_DELETE');
        }

        return groups;
    }, [rolesModalGroups]);

    const getSuppliers = useCallback((groups) => {
        // These roles identify a certain type of user not a supplier 'code'.
        // Bad naming convention :)
        const nonSupplierGroups = [
            'EDP_SUPPLIER_READ',
            'EDP_SUPPLIER_WRITE',
            'EDP_SUPPLIER_DELETE',
            'EDP_DEV_OPS_DELETE',
        ];

        const nonFilteredGroups = getGroups(groups);

        const filteredGroups = nonFilteredGroups.filter((group) => {
            return group.includes('EDP_SUPPLIER_') && nonSupplierGroups.indexOf(group) === -1;
        });

        return filteredGroups.map((group) => {
            return group.split('EDP_SUPPLIER_')[1];
        });
    }, [getGroups]);

    const handleLogout = useCallback(async () => {
        await authService.logout();
        setUserInfo(null);
    }, [authService, setUserInfo]);

    useEffect(() => {
        if (!authState.isAuthenticated) {
            // When user isn't authenticated, forget any user info
            setUserInfo(null);
        } else {
            authService.getUser().then((info) => {
                setUserInfo(info);
            });
        }
    }, [authState, authService]); // Update if authState changes

    useEffect(() => {
        if(userInfo && suppliers.length > 0) {
            const userSuppliers = getSuppliers(get(userInfo, 'groups', []));
            const filteredSuppliers = suppliers.reduce((agg, item) => {
                if (userSuppliers.indexOf(item.code) > -1) {
                    agg.push(item);
                }
                return agg;
            }, []);
            const sortedFilteredSuppliers = filteredSuppliers.sort((a,b) => { return ('' + a.name).localeCompare(b.name) });
            setSortedSuppliers(sortedFilteredSuppliers);
        }
    }, [userInfo, suppliers, getSuppliers]);

    useEffect(() => {
        if(authState.isAuthenticated) {
            const { accessToken } = authState;
            axios.get(ApiConstants.SUPPLIER_BASE_URL, { headers: headers(accessToken, [])})
                .then(response => setSuppliers(get(response, 'data.items', [])))
                .catch(e => console.log(e))
        }
    }, [authState]);

    const providerValue = useMemo(
        () => ({
            userInfo,
            sortedSuppliers,
            rolesModalGroups,
            actions: {
              handleLogout
            },
        }),
        [
            userInfo,
            sortedSuppliers,
            rolesModalGroups,
            handleLogout
        ]
    );

    return (
        <Context.Provider value={providerValue}>
            {
                props.children
            }
        </Context.Provider>
    )
};

export default Context;
