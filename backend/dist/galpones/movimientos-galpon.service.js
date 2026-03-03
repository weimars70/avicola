"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
var MovimientosGalponService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.MovimientosGalponService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const detalle_galpon_entity_1 = require("./entities/detalle-galpon.entity");
const galpon_entity_1 = require("./entities/galpon.entity");
let MovimientosGalponService = MovimientosGalponService_1 = class MovimientosGalponService {
    constructor(detallesRepository, galponesRepository) {
        this.detallesRepository = detallesRepository;
        this.galponesRepository = galponesRepository;
        this.logger = new common_1.Logger(MovimientosGalponService_1.name);
    }
    async create(createDto, id_empresa, id_usuario) {
        const galpon = await this.galponesRepository.findOne({
            where: { id: createDto.id_galpon, id_empresa, activo: true }
        });
        if (!galpon) {
            throw new common_1.NotFoundException(`Galpón con ID ${createDto.id_galpon} no encontrado`);
        }
        const detalle = this.detallesRepository.create(Object.assign(Object.assign({}, createDto), { id_empresa, id_usuario_inserta: id_usuario }));
        return await this.detallesRepository.save(detalle);
    }
    async findByGalpon(id_galpon, id_empresa) {
        return await this.detallesRepository.find({
            where: { id_galpon, id_empresa },
            order: { fecha: 'DESC', createdAt: 'DESC' },
            relations: ['usuarioInserta', 'usuarioActualiza']
        });
    }
    async findOne(id, id_empresa) {
        const detalle = await this.detallesRepository.findOne({
            where: { id, id_empresa },
            relations: ['usuarioInserta']
        });
        if (!detalle) {
            throw new common_1.NotFoundException(`Detalle con ID ${id} no encontrado`);
        }
        return detalle;
    }
    async update(id, updateDto, id_empresa, id_usuario) {
        const detalle = await this.findOne(id, id_empresa);
        Object.assign(detalle, updateDto);
        detalle.id_usuario_actualiza = id_usuario;
        detalle.updatedAt = new Date();
        return await this.detallesRepository.save(detalle);
    }
    async remove(id, id_empresa) {
        const detalle = await this.findOne(id, id_empresa);
        await this.detallesRepository.remove(detalle);
    }
    async getPoblacionActual(id_galpon, id_empresa) {
        const detalles = await this.detallesRepository.find({
            where: { id_galpon, id_empresa }
        });
        return detalles.reduce((total, det) => {
            return det.tipo === detalle_galpon_entity_1.TipoMovimiento.SUMA ? total + det.cantidad : total - det.cantidad;
        }, 0);
    }
};
exports.MovimientosGalponService = MovimientosGalponService;
exports.MovimientosGalponService = MovimientosGalponService = MovimientosGalponService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(detalle_galpon_entity_1.DetalleGalpon)),
    __param(1, (0, typeorm_1.InjectRepository)(galpon_entity_1.Galpon)),
    __metadata("design:paramtypes", [typeorm_2.Repository,
        typeorm_2.Repository])
], MovimientosGalponService);
//# sourceMappingURL=movimientos-galpon.service.js.map