import { NestFactory } from '@nestjs/core';
import { AppModule } from '../app.module';
import { getDataSourceToken } from '@nestjs/typeorm';
import { DataSource } from 'typeorm';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const dataSource = app.get<DataSource>(getDataSourceToken());
  
  console.log('Actualizando valores nulos en la tabla gastos...');
  
  try {
    // Actualizar id_usuario_inserta donde sea NULL
    const updateUserResult = await dataSource.query(
      `UPDATE gastos SET id_usuario_inserta = 1 WHERE id_usuario_inserta IS NULL`
    );
    console.log(`Registros actualizados (id_usuario_inserta): ${updateUserResult[1]}`);
    
    // Actualizar id_empresa donde sea NULL
    const updateEmpresaResult = await dataSource.query(
      `UPDATE gastos SET id_empresa = 1 WHERE id_empresa IS NULL`
    );
    console.log(`Registros actualizados (id_empresa): ${updateEmpresaResult[1]}`);
    
    console.log('Actualización completada con éxito');
  } catch (error) {
    console.error('Error al actualizar valores nulos:', error);
  } finally {
    await app.close();
  }
}

bootstrap();