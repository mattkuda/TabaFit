import React, { useState, useCallback, ReactNode } from 'react';
import { ScrollView, RefreshControl } from 'react-native';

interface RefreshableScrollViewProps {
    onRefresh: () => Promise<void>;
    children: ReactNode;
}

export const RefreshableScrollView: React.FC<RefreshableScrollViewProps> = ({ onRefresh, children }) => {
    const [refreshing, setRefreshing] = useState<boolean>(false);

    const handleRefresh = useCallback(async () => {
        setRefreshing(true);
        await onRefresh();
        setRefreshing(false);
    }, [onRefresh]);

    return (
        <ScrollView
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />}
        >
            {children}
        </ScrollView>
    );
};
