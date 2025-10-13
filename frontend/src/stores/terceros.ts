import { defineStore } from 'pinia';
import { api } from 'src/boot/axios';
import type { Tercero, Ciudad, Estrato, TipoRegimen, TipoIdent, TipoImpuesto, TercerosState } from 'src/types/terceros';

export const useTercerosStore = defineStore('terceros', {
  state: (): TercerosState => ({
    terceros: [],
    loading: false,
    error: null,
    ciudades: [],
    estratos: [],
    regimenes: [],
    tiposIdentificacion: [],
    tiposImpuesto: []
  }),
  
  getters: {
    getTerceros: (state) => state.terceros,
    getProveedores: (state) => state.terceros.filter(t => t.proveedor),
    getClientes: (state) => state.terceros.filter(t => t.cliente),
    isLoading: (state) => state.loading,
    getError: (state) => state.error,
    getCiudades: (state) => state.ciudades,
    getEstratos: (state) => state.estratos,
    getRegimenes: (state) => state.regimenes,
    getTiposIdentificacion: (state) => state.tiposIdentificacion,
    getTiposImpuesto: (state) => state.tiposImpuesto
  },
  
  actions: {
    async fetchTerceros() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/terceros');
        this.terceros = response.data;
      } catch (error: unknown) {
      const err = error as Error;
        this.error = err.message || 'Error al cargar terceros';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProveedores() {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get('/terceros/proveedores');
        this.terceros = response.data;
      } catch (error: unknown) {
        const err = error as Error;
        this.error = err.message || 'Error al cargar proveedores';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async getTerceroById(id: number) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.get(`/terceros/${id}`);
        return response.data;
      } catch (error: unknown) {
        const err = error as Error;
        this.error = err.message || 'Error al cargar terceros';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createTercero(tercero: Tercero): Promise<Tercero> {
      console.log('🚀 FRONTEND: Iniciando createTercero...');
      console.log('📦 FRONTEND: Datos a enviar:', tercero);
      
      try {
        this.loading = true;
        
        console.log('📤 Enviando al backend:', tercero);
        const response = await api.post('/terceros', tercero);
        console.log('✅ Respuesta del backend:', response.data);
        
        // Actualizar la lista local
        this.terceros.push(response.data);
        
        return response.data;
      } catch (error: unknown) {
        console.error('❌ Error al crear tercero:', error);
        
        // Type guard para verificar si es un error de axios
        if (error && typeof error === 'object' && 'response' in error) {
          const axiosError = error as { response?: { data?: { message?: string }; status?: number } };
          console.error('📊 FRONTEND: Error response:', axiosError.response?.data);
          console.error('🔢 FRONTEND: Error status:', axiosError.response?.status);
          console.error('🔍 FRONTEND: Error completo:', axiosError);
          
          this.error = axiosError.response?.data?.message || 'Error al crear tercero';
        } else {
          console.error('🔍 FRONTEND: Error completo:', error);
          this.error = 'Error al crear tercero';
        }
        throw error;
      } finally {
        this.loading = false;
        console.log('🏁 FRONTEND: createTercero finalizado');
      }
    },
    
    async updateTercero(tercero: Tercero) {
      this.loading = true;
      this.error = null;
      try {
        const response = await api.put(`/terceros/${tercero.id}`, tercero);
        const index = this.terceros.findIndex(t => t.id === tercero.id);
        if (index !== -1) {
          this.terceros[index] = response.data;
        }
        return response.data;
      } catch (error: unknown) {
        const err = error as Error;
        this.error = err.message || 'Error al actualizar tercero';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteTercero(id: number) {
      this.loading = true;
      this.error = null;
      try {
        await api.delete(`/terceros/${id}`);
        this.terceros = this.terceros.filter(t => t.id !== id);
      } catch (error: unknown) {
        const err = error as Error;
        this.error = err.message || 'Error al eliminar tercero';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchMaestros() {
      this.loading = true;
      this.error = null;
      try {
        const [ciudadesRes, estratosRes, regimenesRes, tiposIdentRes, tiposImpuestoRes] = await Promise.all([
          api.get<Ciudad[]>('/maestros-terceros/ciudades'),
          api.get<Estrato[]>('/maestros-terceros/estratos'),
          api.get<TipoRegimen[]>('/maestros-terceros/tipos-regimen'),
          api.get<TipoIdent[]>('/maestros-terceros/tipos-identificacion'),
          api.get<TipoImpuesto[]>('/maestros-terceros/tipos-impuesto')
        ]);
        
        this.ciudades = ciudadesRes.data;
        this.estratos = estratosRes.data;
        this.regimenes = regimenesRes.data;
        this.tiposIdentificacion = tiposIdentRes.data;
        this.tiposImpuesto = tiposImpuestoRes.data;
      } catch (error: unknown) {
        const err = error as Error;
        this.error = err.message || 'Error al cargar datos maestros';
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async loadMaestros(): Promise<void> { 
      this.loading = true; 
      this.error = null; 
      try { 
        const [ciudadesRes, estratosRes, regimenesRes, tiposIdentRes, tiposImpuestoRes] = 
          await Promise.all([ 
            api.get('/maestros-terceros/ciudades'), 
            api.get('/maestros-terceros/estratos'), 
            api.get('/maestros-terceros/tipos-regimen'), 
            api.get('/maestros-terceros/tipos-identificacion'), 
            api.get('/maestros-terceros/tipos-impuesto') 
          ]); 
    
        this.ciudades = ciudadesRes.data; 
        this.estratos = estratosRes.data; 
        this.regimenes = regimenesRes.data; 
        this.tiposIdentificacion = tiposIdentRes.data; 
        this.tiposImpuesto = tiposImpuestoRes.data; 
    
        console.log('Datos maestros cargados:', { 
          ciudades: this.ciudades.length, 
          estratos: this.estratos.length, 
          regimenes: this.regimenes.length, 
          tiposIdent: this.tiposIdentificacion.length, 
          tiposImpuesto: this.tiposImpuesto.length 
        }); 
      } catch (error: unknown) { 
        const err = error as Error; 
        this.error = err.message || 'Error al cargar datos maestros'; 
        console.error('Error cargando maestros:', err); 
        throw error; 
      } finally { 
        this.loading = false; 
      } 
    }
  }
});