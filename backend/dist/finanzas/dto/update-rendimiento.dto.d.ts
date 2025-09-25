import { CreateRendimientoDto } from './create-rendimiento.dto';
declare const UpdateRendimientoDto_base: import("@nestjs/mapped-types").MappedType<Partial<CreateRendimientoDto>>;
export declare class UpdateRendimientoDto extends UpdateRendimientoDto_base {
    activo?: boolean;
}
export {};
