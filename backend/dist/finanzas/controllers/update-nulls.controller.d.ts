import { DataSource } from 'typeorm';
export declare class UpdateNullsController {
    private dataSource;
    constructor(dataSource: DataSource);
    updateNullValues(): Promise<{
        success: boolean;
        message: string;
        updatedUserRecords: any;
        updatedEmpresaRecords: any;
        error?: undefined;
    } | {
        success: boolean;
        message: string;
        error: any;
        updatedUserRecords?: undefined;
        updatedEmpresaRecords?: undefined;
    }>;
}
