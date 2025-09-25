"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateInventarioDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_inventario_dto_1 = require("./create-inventario.dto");
class UpdateInventarioDto extends (0, mapped_types_1.PartialType)(create_inventario_dto_1.CreateInventarioDto) {
}
exports.UpdateInventarioDto = UpdateInventarioDto;
//# sourceMappingURL=update-inventario.dto.js.map