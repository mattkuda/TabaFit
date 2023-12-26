export interface PagingParams {
    offset: number;
    limit: number;
}

export const defaultTilePagingParams: PagingParams = {
    offset: 0,
    limit: 5,
};
