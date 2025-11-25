"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.UpdateCompraDto = void 0;
const mapped_types_1 = require("@nestjs/mapped-types");
const create_compra_dto_1 = require("./create-compra.dto");
class UpdateCompraDto extends (0, mapped_types_1.PartialType)(create_compra_dto_1.CreateCompraDto) {
}
exports.UpdateCompraDto = UpdateCompraDto;
//# sourceMappingURL=update-compra.dto.js.map