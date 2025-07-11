export type httpResponse = {
    status: string;
    exception: string | null;
    message: string | null;
    tag: string | null;
    data: any;
};
