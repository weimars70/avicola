import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Venta, CreateVentaDto, UpdateVentaDto, VentasEstadisticas } from 'src/types/ventas-terceros';

interface VentasState {
    ventas: Venta[];
    estadisticas: VentasEstadisticas | null;
    loading: boolean;
    error: string | null;
}

export const useVentasTercerosStore = defineStore('ventas-terceros', {
    state: (): VentasState => ({
        ventas: [],
        estadisticas: null,
        loading: false,
        error: null,
    }),

    getters: {
        ventasPendientes: (state) => state.ventas.filter(v => v.estado === 'PENDIENTE'),
        ventasPagadas: (state) => state.ventas.filter(v => v.estado === 'PAGADO'),
        totalVentas: (state) => state.ventas.length,
    },

    actions: {
        async fetchVentas() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<Venta[]>('/ventas-terceros');
                this.ventas = response.data;
            } catch (error) {
                this.error = 'Error al cargar ventas';
                console.error('Error fetching ventas:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchEstadisticas() {
            try {
                const response = await api.get<VentasEstadisticas>('/ventas-terceros/estadisticas');
                this.estadisticas = response.data;
            } catch (error) {
                console.error('Error fetching estadísticas:', error);
                throw error;
            }
        },

        async createVenta(ventaDto: CreateVentaDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Venta>('/ventas-terceros', ventaDto);
                this.ventas.unshift(response.data);
                await this.fetchEstadisticas();
                return response.data;
            } catch (error) {
                this.error = 'Error al crear venta';
                console.error('Error creating venta:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateVenta(id: string, ventaDto: UpdateVentaDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.patch<Venta>(`/ventas-terceros/${id}`, ventaDto);
                const index = this.ventas.findIndex(v => v.id === id);
                if (index !== -1) {
                    this.ventas[index] = response.data;
                }
                await this.fetchEstadisticas();
                return response.data;
            } catch (error) {
                this.error = 'Error al actualizar venta';
                console.error('Error updating venta:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteVenta(id: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/ventas-terceros/${id}`);
                this.ventas = this.ventas.filter(v => v.id !== id);
                await this.fetchEstadisticas();
            } catch (error) {
                this.error = 'Error al eliminar venta';
                console.error('Error deleting venta:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
