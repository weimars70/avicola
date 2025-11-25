"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const core_1 = require("@nestjs/core");
const app_module_1 = require("../app.module");
const typeorm_1 = require("@nestjs/typeorm");
async function bootstrap() {
    const app = await core_1.NestFactory.create(app_module_1.AppModule);
    const dataSource = app.get((0, typeorm_1.getDataSourceToken)());
    console.log('Actualizando valores nulos en la tabla gastos...');
    try {
        const updateUserResult = await dataSource.query(`UPDATE gastos SET id_usuario_inserta = 1 WHERE id_usuario_inserta IS NULL`);
        console.log(`Registros actualizados (id_usuario_inserta): ${updateUserResult[1]}`);
        const updateEmpresaResult = await dataSource.query(`UPDATE gastos SET id_empresa = 1 WHERE id_empresa IS NULL`);
        console.log(`Registros actualizados (id_empresa): ${updateEmpresaResult[1]}`);
        console.log('Actualización completada con éxito');
    }
    catch (error) {
        console.error('Error al actualizar valores nulos:', error);
    }
    finally {
        await app.close();
    }
}
bootstrap();
//# sourceMappingURL=update-null-values.js.map