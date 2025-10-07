import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between } from 'typeorm';
import { Rendimiento } from './entities/rendimiento.entity';
import { CreateRendimientoDto } from './dto/create-rendimiento.dto';
import { UpdateRendimientoDto } from './dto/update-rendimiento.dto';
import { GastosService } from './gastos.service';
import { IngresosService } from './ingresos.service';

@Injectable()
export class RendimientoService {
  constructor(
    @InjectRepository(Rendimiento)
    private rendimientoRepository: Repository<Rendimiento>,
    private gastosService: GastosService,
    private ingresosService: IngresosService,
  ) {}

  async create(createRendimientoDto: CreateRendimientoDto): Promise<Rendimiento> {
    const rendimiento = this.rendimientoRepository.create(createRendimientoDto);
    return await this.rendimientoRepository.save(rendimiento);
  }

  async findAll(): Promise<Rendimiento[]> {
    return await this.rendimientoRepository.find({
      where: { activo: true },
      order: { fecha: 'DESC' },
    });
  }

  async findOne(id: string): Promise<Rendimiento> {
    const rendimiento = await this.rendimientoRepository.findOne({
      where: { id, activo: true },
    });
    if (!rendimiento) {
      throw new NotFoundException(`Rendimiento con ID ${id} no encontrado`);
    }
    return rendimiento;
  }

  async update(id: string, updateRendimientoDto: UpdateRendimientoDto): Promise<Rendimiento> {
    const rendimiento = await this.findOne(id);
    Object.assign(rendimiento, updateRendimientoDto);
    return await this.rendimientoRepository.save(rendimiento);
  }

  async remove(id: string): Promise<void> {
    const rendimiento = await this.findOne(id);
    rendimiento.activo = false;
    await this.rendimientoRepository.save(rendimiento);
  }

  async findByDateRange(fechaInicio: string, fechaFin: string): Promise<Rendimiento[]> {
    return await this.rendimientoRepository.find({
      where: {
        fecha: Between(new Date(fechaInicio), new Date(fechaFin)),
        activo: true,
      },
      order: { fecha: 'DESC' },
    });
  }

  async findByPeriodo(periodo: string): Promise<Rendimiento[]> {
    return await this.rendimientoRepository.find({
      where: { periodo, activo: true },
      order: { fecha: 'DESC' },
    });
  }

  async calcularRendimientoDiario(fecha: string, id_empresa: number = 1): Promise<Rendimiento> {
    const fechaInicio = fecha;
    const fechaFin = fecha;

    const totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
    const totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
    
    const utilidadNeta = totalIngresos - totalGastos;
    const margenUtilidad = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;
    const roi = totalGastos > 0 ? (utilidadNeta / totalGastos) * 100 : 0;

    const rendimientoData: CreateRendimientoDto = {
      fecha,
      totalIngresos,
      totalGastos,
      utilidadNeta,
      margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      periodo: 'diario',
      observaciones: `Rendimiento calculado automáticamente para ${fecha}`,
    };

    return await this.create(rendimientoData);
  }

  async calcularRendimientoMensual(año: number, mes: number, id_empresa: number = 1): Promise<Rendimiento> {
    const fechaInicio = new Date(año, mes - 1, 1).toISOString().split('T')[0];
    const fechaFin = new Date(año, mes, 0).toISOString().split('T')[0];

    const totalIngresos = await this.ingresosService.getTotalIngresosByDateRange(fechaInicio, fechaFin, id_empresa);
    const totalGastos = await this.gastosService.getTotalGastosByDateRange(fechaInicio, fechaFin, id_empresa);
    
    const utilidadNeta = totalIngresos - totalGastos;
    const margenUtilidad = totalIngresos > 0 ? (utilidadNeta / totalIngresos) * 100 : 0;
    const roi = totalGastos > 0 ? (utilidadNeta / totalGastos) * 100 : 0;

    const rendimientoData: CreateRendimientoDto = {
      fecha: fechaFin,
      totalIngresos,
      totalGastos,
      utilidadNeta,
      margenUtilidad: parseFloat(margenUtilidad.toFixed(2)),
      roi: parseFloat(roi.toFixed(2)),
      periodo: 'mensual',
      observaciones: `Rendimiento mensual para ${mes}/${año}`,
    };

    return await this.create(rendimientoData);
  }

  async getMetricasRendimiento(): Promise<any> {
    const rendimientos = await this.findAll();
    
    if (rendimientos.length === 0) {
      return {
        promedioMargenUtilidad: 0,
        promedioROI: 0,
        mejorMes: null,
        peorMes: null,
        tendencia: 'sin_datos',
      };
    }

    const promedioMargenUtilidad = rendimientos.reduce((sum, r) => sum + r.margenUtilidad, 0) / rendimientos.length;
    const promedioROI = rendimientos.reduce((sum, r) => sum + r.roi, 0) / rendimientos.length;
    
    const mejorMes = rendimientos.reduce((mejor, actual) => 
      actual.utilidadNeta > mejor.utilidadNeta ? actual : mejor
    );
    
    const peorMes = rendimientos.reduce((peor, actual) => 
      actual.utilidadNeta < peor.utilidadNeta ? actual : peor
    );

    // Calcular tendencia (últimos 3 meses)
    const ultimos3 = rendimientos.slice(0, 3);
    let tendencia = 'estable';
    if (ultimos3.length >= 2) {
      const diferencia = ultimos3[0].utilidadNeta - ultimos3[ultimos3.length - 1].utilidadNeta;
      if (diferencia > 0) tendencia = 'creciente';
      else if (diferencia < 0) tendencia = 'decreciente';
    }

    return {
      promedioMargenUtilidad: parseFloat(promedioMargenUtilidad.toFixed(2)),
      promedioROI: parseFloat(promedioROI.toFixed(2)),
      mejorMes: {
        fecha: mejorMes.fecha,
        utilidadNeta: mejorMes.utilidadNeta,
        margenUtilidad: mejorMes.margenUtilidad,
      },
      peorMes: {
        fecha: peorMes.fecha,
        utilidadNeta: peorMes.utilidadNeta,
        margenUtilidad: peorMes.margenUtilidad,
      },
      tendencia,
      totalRendimientos: rendimientos.length,
    };
  }
}