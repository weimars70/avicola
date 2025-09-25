"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateSalidaDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_salida_dto_1 = require("./create-salida.dto");
class UpdateSalidaDto extends (0, mapped_types_1.PartialType)(create_salida_dto_1.CreateSalidaDto) {
}
exports.UpdateSalidaDto = UpdateSalidaDto;
//# sourceMappingURL=update-salida.dto.js.map