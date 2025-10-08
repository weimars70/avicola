import { Controller, Post, Inject } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Controller('finanzas/update-nulls')
export class UpdateNullsController {
  constructor(
    @Inject('DATA_SOURCE')
    private dataSource: DataSource,
  ) {}

  @Post()
  async updateNullValues() {
    try {
      // Actualizar id_usuario_inserta donde sea NULL
      const updateUserResult = await this.dataSource.query(
        `UPDATE gastos SET id_usuario_inserta = 1 WHERE id_usuario_inserta IS NULL`
      );
      
      // Actualizar id_empresa donde sea NULL
      const updateEmpresaResult = await this.dataSource.query(
        `UPDATE gastos SET id_empresa = 1 WHERE id_empresa IS NULL`
      );
      
      return {
        success: true,
        message: 'Valores nulos actualizados correctamente',
        updatedUserRecords: updateUserResult[1],
        updatedEmpresaRecords: updateEmpresaResult[1]
      };
    } catch (error) {
      return {
        success: false,
        message: 'Error al actualizar valores nulos',
        error: error.message
      };
    }
  }
}