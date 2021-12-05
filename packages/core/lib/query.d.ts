export declare function sanitizeText(string: string): string;
export declare function getQueryParam(query: any, param: string, splitBy?: string): any;
export declare function resolveMatch(query: any): any;
export declare function resolvePick(query: any): any;
export declare function resolveOmit(query: any): any;
export declare function parseOp(op: string): any;
export declare function resolveCompare(query: any): any;
export declare function resolvePagination(query: any): {
    skip: number;
    limit: number;
} | undefined;
export declare function defaultQueryParser(element: string): any;
export declare function parseQueryMethod(query: any, prop: string, parser?: Function): any;
export declare function getToPopulate(query: any): any;
export declare function getToSort(query: any): any;
export declare function applyMethods(query: any, mongoQuery: any): any;
export declare function resolveProjection(query: any): any;
export declare function resolveArguments(query: any): any;
//# sourceMappingURL=query.d.ts.map