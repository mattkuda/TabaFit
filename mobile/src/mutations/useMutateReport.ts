import { useMutation, UseMutationResult } from 'react-query';
import axios, { AxiosError } from 'axios';
import { Report } from '../types/reports';

const apiUrl = process.env.EXPO_PUBLIC_EAS_API_BASE_URL || 'http://localhost:3000';

interface ReportVariables {
    report: Report;
}

export const useMutateReport = (): UseMutationResult<void, AxiosError, ReportVariables> => useMutation<void, AxiosError, ReportVariables>(
    ({
        report,
    }) => axios.post(`${apiUrl}/reports`, {
        report,
    }),
);
