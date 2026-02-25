import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { DetalleGalpon, CreateDetalleGalponDto, UpdateDetalleGalponDto } from 'src/types/movimientos-galpon';

interface MovimientosGalponState {
    movimientos: DetalleGalpon[];
    poblacionActual: number;
    loading: boolean;
    error: string | null;
}

export const useMovimientosGalponStore = defineStore('movimientos-galpon', {
    state: (): MovimientosGalponState => ({
        movimientos: [],
        poblacionActual: 0,
        loading: false,
        error: null,
    }),

    actions: {
        async fetchMovimientos(id_galpon: string) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<DetalleGalpon[]>(`/movimientos-galpon/galpon/${id_galpon}`);
                this.movimientos = response.data;
            } catch (error) {
                this.error = 'Error al cargar historial';
                console.error('Error fetching movimientos:', error);
            } finally {
                this.loading = false;
            }
        },

        async fetchPoblacion(id_galpon: string) {
            try {
                const response = await api.get<{ poblacion: number }>(`/movimientos-galpon/galpon/${id_galpon}/poblacion`);
                this.poblacionActual = response.data.poblacion;
            } catch (error) {
                console.error('Error fetching población:', error);
            }
        },

        async registrarMovimiento(createDto: CreateDetalleGalponDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<DetalleGalpon>('/movimientos-galpon', createDto);
                this.movimientos.unshift(response.data);
                await this.fetchPoblacion(createDto.id_galpon);
                return response.data;
            } catch (error) {
                this.error = 'Error al registrar actividad';
                console.error('Error creating detalle:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateMovimiento(id: string, updateDto: UpdateDetalleGalponDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.patch<DetalleGalpon>(`/movimientos-galpon/${id}`, updateDto);
                const index = this.movimientos.findIndex(m => m.id === id);
                if (index !== -1) {
                    this.movimientos[index] = response.data;
                }
                if (updateDto.id_galpon) {
                    await this.fetchPoblacion(updateDto.id_galpon);
                }
                return response.data;
            } catch (error) {
                this.error = 'Error al actualizar actividad';
                console.error('Error updating detalle:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteMovimiento(id: string, id_galpon: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/movimientos-galpon/${id}`);
                this.movimientos = this.movimientos.filter(m => m.id !== id);
                await this.fetchPoblacion(id_galpon);
            } catch (error) {
                this.error = 'Error al eliminar actividad';
                console.error('Error deleting detalle:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        }
    }
});
