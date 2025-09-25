import { CreateIngresoDto } from './create-ingreso.dto';
declare const UpdateIngresoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateIngresoDto>>;
export declare class UpdateIngresoDto extends UpdateIngresoDto_base {
    activo?: boolean;
}
export {};
