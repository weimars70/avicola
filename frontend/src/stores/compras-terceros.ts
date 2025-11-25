import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Compra, CreateCompraDto, UpdateCompraDto, ComprasEstadisticas } from 'src/types/compras-terceros';

interface ComprasState {
    compras: Compra[];
    estadisticas: ComprasEstadisticas | null;
    loading: boolean;
    error: string | null;
}

export const useComprasTercerosStore = defineStore('compras-terceros', {
    state: (): ComprasState => ({
        compras: [],
        estadisticas: null,
        loading: false,
        error: null,
    }),

    getters: {
        comprasPendientes: (state) => state.compras.filter(c => c.estado === 'PENDIENTE'),
        comprasPagadas: (state) => state.compras.filter(c => c.estado === 'PAGADO'),
        totalCompras: (state) => state.compras.length,
    },

    actions: {
        async fetchCompras() {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.get<Compra[]>('/compras-terceros');
                this.compras = response.data;
            } catch (error) {
                this.error = 'Error al cargar compras';
                console.error('Error fetching compras:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async fetchEstadisticas() {
            try {
                const response = await api.get<ComprasEstadisticas>('/compras-terceros/estadisticas');
                this.estadisticas = response.data;
            } catch (error) {
                console.error('Error fetching estadísticas:', error);
                throw error;
            }
        },

        async createCompra(compraDto: CreateCompraDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.post<Compra>('/compras-terceros', compraDto);
                this.compras.unshift(response.data);
                await this.fetchEstadisticas();
                return response.data;
            } catch (error) {
                this.error = 'Error al crear compra';
                console.error('Error creating compra:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async updateCompra(id: string, compraDto: UpdateCompraDto) {
            this.loading = true;
            this.error = null;
            try {
                const response = await api.patch<Compra>(`/compras-terceros/${id}`, compraDto);
                const index = this.compras.findIndex(c => c.id === id);
                if (index !== -1) {
                    this.compras[index] = response.data;
                }
                await this.fetchEstadisticas();
                return response.data;
            } catch (error) {
                this.error = 'Error al actualizar compra';
                console.error('Error updating compra:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },

        async deleteCompra(id: string) {
            this.loading = true;
            this.error = null;
            try {
                await api.delete(`/compras-terceros/${id}`);
                this.compras = this.compras.filter(c => c.id !== id);
                await this.fetchEstadisticas();
            } catch (error) {
                this.error = 'Error al eliminar compra';
                console.error('Error deleting compra:', error);
                throw error;
            } finally {
                this.loading = false;
            }
        },
    },
});
